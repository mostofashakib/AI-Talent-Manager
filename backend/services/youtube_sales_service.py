import os
import time
from urllib.parse import urlparse, parse_qs
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

def authenticate_youtube():
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
    return build("youtube", "v3", credentials=creds)

youtube = authenticate_youtube()
openai_api_key = os.getenv('OPEN_AI_API_KEY')
llm = ChatOpenAI(temperature=0.7, model="gpt-4-0125-preview", api_key=openai_api_key)

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

def main(video_url, reply_text):
    video_id = extract_video_id(video_url)
    if not video_id:
        print("Invalid YouTube URL. Please provide a valid YouTube video URL.")
        return

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

    while True:
        if is_livestream:
            messages, live_chat_page_token = get_live_chat_messages(live_chat_id, live_chat_page_token)
            for message in messages:
                comment_text = message['snippet']['displayMessage']
                comment_id = message['id']
                process_comment(comment_text, comment_id, reply_text)
        else:
            comments, video_comments_page_token = get_video_comments(video_id, video_comments_page_token)
            for comment in comments:
                comment_text = comment['snippet']['topLevelComment']['snippet']['textDisplay']
                comment_id = comment['id']
                process_comment(comment_text, comment_id, reply_text)

        if not is_livestream and not video_comments_page_token:
            print("No more comments to process. Waiting for new comments...")
            time.sleep(28800)  # Wait for 1 hour before checking for new comments

        time.sleep(6000)  # Avoid hitting API rate limits

def process_comment(comment_text, comment_id, reply_text):
    intent_score = analyze_sales_intent(comment_text)
    
    if intent_score >= 90:
        print(f"High sales intent detected ({intent_score}%): {comment_text}")
        reply_to_comment(comment_id, reply_text)
        print(f"Replied to comment: {comment_id}")

if __name__ == "__main__":
    video_url = input("Enter the YouTube video URL: ")
    reply_text = "Thank you for your interest! Check out our product at https://example.com/affiliate-link"
    
    main(video_url, reply_text)