import os
import time
from urllib.parse import urlparse, parse_qs
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from google.auth.transport.requests import Request
from threading import Thread
from dotenv import load_dotenv

load_dotenv()

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl", "https://www.googleapis.com/auth/spreadsheets"]
RANGE_NAME = "Sheet1!A:F"

def authenticate_google():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "client_secrets.json", SCOPES)
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return creds

def authenticate_services():
    creds = authenticate_google()
    youtube_service = build("youtube", "v3", credentials=creds)
    return youtube_service

youtube = authenticate_services()
openai_api_key = os.getenv('OPEN_AI_API_KEY')
llm = ChatOpenAI(temperature=0.7, model="gpt-4-0125-preview", api_key=openai_api_key)

active_automations = {}

def extract_video_id(url):
    parsed_url = urlparse(url)
    if parsed_url.hostname == 'youtu.be':
        return parsed_url.path[1:]
    if parsed_url.hostname in ('www.youtube.com', 'youtube.com'):
        if parsed_url.path == '/watch':
            return parse_qs(parsed_url.query)['v'][0]
        if parsed_url.path[:7] == '/embed/':
            return parsed_url.path.split('/')[2]
        if parsed_url.path[:3] == '/v/':
            return parsed_url.path.split('/')[2]
    return None

def get_channel_id(video_id):
    request = youtube.videos().list(
        part='snippet',
        id=video_id
    )
    response = request.execute()
    return response['items'][0]['snippet']['channelId']

def get_channel_info(channel_id):
    request = youtube.channels().list(
        part='snippet,contentDetails,statistics',
        id=channel_id
    )
    response = request.execute()
    return response['items'][0]

def get_live_chat_id(video_id):
    request = youtube.videos().list(
        part='liveStreamingDetails',
        id=video_id
    )
    response = request.execute()
    return response['items'][0]['liveStreamingDetails']['activeLiveChatId']

def get_live_chat_messages(live_chat_id, page_token=None):
    request = youtube.liveChatMessages().list(
        liveChatId=live_chat_id,
        part='snippet',
        pageToken=page_token
    )
    response = request.execute()
    return response['items'], response.get('nextPageToken')

def get_video_comments(video_id, page_token=None):
    request = youtube.commentThreads().list(
        part='snippet',
        videoId=video_id,
        pageToken=page_token
    )
    response = request.execute()
    return response['items'], response.get('nextPageToken')

def analyze_sales_intent(comment):
    template = """
    Analyze the following comment for sales intent. Consider factors like:
    - Mentions of products or services
    - Inquiries about pricing
    - Expressions of interest in purchasing
    - Requests for more information about a product or service

    Comment: {comment}

    On a scale of 0 to 100, what is the probability that this comment has sales intent?
    Provide only the numerical score without any explanation.
    """
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm
    result = chain.invoke({"comment": comment})
    return float(result.content.strip())

def reply_to_comment(comment_id, reply_text):
    request = youtube.comments().insert(
        part="snippet",
        body={
            "snippet": {
                "parentId": comment_id,
                "textOriginal": reply_text
            }
        }
    )
    response = request.execute()
    return response

def add_to_crm(name, channel_id, like_count, comment_text):
    try:
        service = build('sheets', 'v4', credentials=authenticate_google())
        # Prepare the values to be added, including the header if it's the first entry
        values = [[str(name), str(channel_id), str(like_count), str(comment_text), time.strftime("%Y-%m-%d %H:%M:%S")]]
        
        # Check if the sheet is empty to add the header
        sheet_data = service.spreadsheets().values().get(
            spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
            range=RANGE_NAME
        ).execute()
        
        if not sheet_data.get('values'):
            # Add header if the sheet is empty
            header = [["Name", "Channel ID", "Like Count", "Comment Text", "Timestamp"]]
            service.spreadsheets().values().append(
                spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
                range=RANGE_NAME,
                valueInputOption='RAW',
                body={'values': header}
            ).execute()

        body = {
            'values': values
        }
        service.spreadsheets().values().append(
            spreadsheetId=os.getenv('GOOGLE_SHEET_ID'),
            range=RANGE_NAME,
            valueInputOption='RAW',
            body=body
        ).execute()
        
        print(f"Added {name} ({channel_id}) to CRM successfully.")
    except Exception as e:
        print(f"Failed to add {name} to CRM: {e}")

def process_comment(comment, comment_id, reply_text, author_name, author_channel_id, like_count):
    intent_score = analyze_sales_intent(comment)
    
    if intent_score >= 90:
        print(f"High sales intent detected ({intent_score}%): {comment}")
        reply_to_comment(comment_id, reply_text)
        print(f"Replied to comment: {comment_id}")

        add_to_crm(author_name, author_channel_id, like_count, comment)

def automation(video_url, reply_text):
    video_id = extract_video_id(video_url)
    if not video_id:
        return "Invalid YouTube URL. Please provide a valid YouTube video URL."

    channel_id = get_channel_id(video_id)
    channel_info = get_channel_info(channel_id)
    print(f"Analyzing comments for channel: {channel_info['snippet']['title']}")
    print(f"Video ID: {video_id}")
    print(f"Channel ID: {channel_id}")

    is_livestream = False
    try:
        live_chat_id = get_live_chat_id(video_id)
        is_livestream = True
        print("This is a livestream. Monitoring live chat...")
    except KeyError:
        print("This is a regular video. Monitoring video comments...")

    live_chat_page_token = None
    video_comments_page_token = None

    while active_automations.get(video_url):
        if is_livestream:
            messages, live_chat_page_token = get_live_chat_messages(live_chat_id, live_chat_page_token)
            for message in messages:
                comment_text = message['snippet']['displayMessage']
                comment_id = message['id']
                author_name = comment['snippet']['topLevelComment']['snippet']['authorDisplayName']
                author_channel_id = comment['snippet']['topLevelComment']['snippet']['authorChannelId']
                like_count = comment['snippet']['topLevelComment']['snippet']['likeCount']
                process_comment(comment_text, comment_id, reply_text, author_name, author_channel_id, like_count)
        else:
            comments, video_comments_page_token = get_video_comments(video_id, video_comments_page_token)
            for comment in comments:
                comment_text = comment['snippet']['topLevelComment']['snippet']['textDisplay']
                comment_id = comment['id']
                author_name = comment['snippet']['topLevelComment']['snippet']['authorDisplayName']
                author_channel_id = comment['snippet']['topLevelComment']['snippet']['authorChannelId']
                like_count = comment['snippet']['topLevelComment']['snippet']['likeCount']
                process_comment(comment_text, comment_id, reply_text, author_name, author_channel_id, like_count)
        if not is_livestream and not video_comments_page_token:
            print("No more comments to process. Waiting for new comments...")
            time.sleep(28800)  # Wait for 1 hour before checking for new comments

        time.sleep(6000)  # Avoid hitting API rate limits

def start_automation_service(video_url, reply_text):
    if video_url not in active_automations:
        active_automations[video_url] = True
        automation_thread = Thread(target=automation, args=(video_url, reply_text))
        automation_thread.start()
        return {"message": "Automation started for video."}
    else:
        return {"message": "Automation is already running for this video."}

def stop_automation_service(video_url):
    if video_url in active_automations:
        active_automations[video_url] = False
        return {"message": f"Automation stopped for video: {video_url}"}
    else:
        return {"message": "No active automation found for this video."}

def get_active_automations():
    return [video_url for video_url, is_active in active_automations.items() if is_active]
