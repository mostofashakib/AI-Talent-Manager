import requests
from bs4 import BeautifulSoup
import os
import asyncio
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi
from TikTokApi import TikTokApi
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langdetect.lang_detect_exception import LangDetectException
from langdetect import detect
from googletrans import Translator
from dotenv import load_dotenv
load_dotenv()

TIKTOK_TRANSCRIPTION_ENDPOINT = os.getenv("TINY_URL_ENDPOINT")

recommendations = [            {
                "name": "Brand A",
                "description": "Description for Brand A.",
                "category": "Test",
                "website_url": "contact@branda.com",
                "affiliate_link": "https://branda.com",
},]

llm = ChatOpenAI(temperature=0.7, model="gpt-4o-mini", api_key=os.getenv('OPEN_AI_API_KEY'))
translator = Translator()

def getChannelDetails(channel_url):
    RAPID_API_KEY = os.getenv('RAPID_API_KEY')
    url = os.getenv("RAPID_API_YOUTUBE_CHANNEL_DETAILS_ENDPOINT")
    querystring = {'UrlOrUsername': channel_url}

    headers = {
        'x-rapidapi-host': 'the-better-youtube-channel-details.p.rapidapi.com',
        'x-rapidapi-key': RAPID_API_KEY,
    }

    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        channel_details = response.json()
        return channel_details
    else:
        print(f"Error getting channel details: {response.status_code} - {response.text}")
        raise Exception(f"Error getting channel details: {response.status_code} - {response.text}")
    
def generate_response(channel_description, channel_subscriber_count):
    template = """
    You are an an expert in YouTube channel analysis and brand recommendations. Based on the following YouTube channel information, suggest 5 relevant brands that could potentially collaborate or sponsor this channel.

    Channel Description: {channel_description}
    Subscriber Count: {channel_subscriber_count}

    For each brand, provide:
    1. Name
    2. A brief description
    3. Category
    4. Website URL
    5. A hypothetical affiliate link

    Format your response as a list of JSON objects.
    """

    prompt = ChatPromptTemplate.from_template(template)
    result = llm.invoke(prompt.format(
        channel_description=channel_description,
        channel_subscriber_count=channel_subscriber_count
    ))
    
    # Assuming the model returns a properly formatted JSON string
    import json
    return json.loads(result.content)
    
def analyze_youtube_channel(channel_url):
    global recommendations  # Declare recommendations as global to modify it

    try:
        channel_details = getChannelDetails(channel_url)
        channel_description = channel_details['data']['description']
        channel_subscriber_count = channel_details['data']['channel_subscriber_count']

        recommendations = generate_response(channel_description, channel_subscriber_count)
        
        return {
            "recommendations": recommendations,
        }
    except Exception as e:
        print(f"Error analyzing channel: {str(e)}")
        raise Exception(f"Error analyzing channel: {str(e)}")
    
def getChannelRecommendations():
    return recommendations

def get_video_id(url):
    parsed_url = urlparse(url)
    if parsed_url.hostname in ('youtu.be', 'www.youtube.com', 'youtube.com'):
        if parsed_url.hostname == 'youtu.be':
            return parsed_url.path[1:], 'youtube'
        if parsed_url.path == '/watch':
            return parse_qs(parsed_url.query)['v'][0], 'youtube'
        if parsed_url.path[:7] == '/embed/':
            return parsed_url.path.split('/')[2], 'youtube'
        if parsed_url.path[:3] == '/v/':
            return parsed_url.path.split('/')[2], 'youtube'
    elif parsed_url.hostname in ('www.tiktok.com', 'tiktok.com'):
        path_parts = parsed_url.path.split('/')
        if len(path_parts) >= 4 and path_parts[2] == 'video':
            username = path_parts[1].lstrip('@')
            video_id = path_parts[3]
            return f"{username}:{video_id}", 'tiktok'
    return None, None

def get_youtube_transcript(video_id):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([entry['text'] for entry in transcript])

        if not transcript_text.strip():
            raise Exception("Transcript is empty or unavailable.")
        
        return transcript_text
    
    except Exception as e:
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            first_transcript = next(iter(transcript_list))
            transcript = first_transcript.fetch()
            transcript_text = " ".join([entry['text'] for entry in transcript])

            if not transcript_text.strip():
                raise Exception("Transcript is empty or unavailable.")
            
            return transcript_text
        except Exception as inner_e:
            raise Exception(f"Error retrieving YouTube transcript: {str(inner_e)}")
        
def get_tiktok_transcript(video_url):
    url = TIKTOK_TRANSCRIPTION_ENDPOINT
    payload = {
        "url": video_url
    }
    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        english_transcript = data.get('transcripts', {}).get('eng-US')

        if english_transcript:
            return english_transcript
        else:
            return "English transcript not found."
    else:
        return f"Request failed with status code {response.status_code}"

def get_video_transcript(url):
    video_id, platform = get_video_id(url)
    if not video_id:
        raise ValueError("Invalid URL")
    
    if platform == 'youtube':
        transcript_text = get_youtube_transcript(video_id)
    elif platform == 'tiktok':
        transcript_text = get_tiktok_transcript(url)
    else:
        raise ValueError("Unsupported platform")
    
    try:
        detected_language = detect(transcript_text)
    except LangDetectException:
        detected_language = 'unknown'
    
    return transcript_text, detected_language

def translate_text(text, source_lang, target_lang='en'):
    if source_lang != 'en' and source_lang != 'unknown':
        try:
            translated = translator.translate(text, src=source_lang, dest=target_lang)
            
            if translated and hasattr(translated, 'text'):
                return translated.text
            else:
                return text
        
        except Exception:
            return text
    return text

def refine_transcript(raw_transcript, source_lang):
    """Refine the transcript using OpenAI's language model."""
    # Translate to English if necessary
    english_transcript = translate_text(raw_transcript, source_lang)

    template = """
    You are an expert in refining and improving video transcripts. Your task is to take the following raw transcript and make it more readable and coherent. Correct any obvious errors, improve the flow, and ensure it makes sense. Here's the raw transcript:

    {english_transcript}

    Please provide the refined version of this transcript in English, that is more readable and has smooth transitions from one paragraph to another
    """

    prompt = ChatPromptTemplate.from_template(template)
    result = llm.invoke(prompt.format(english_transcript=english_transcript))
    
    if source_lang != 'en':
        return translate_text(result.content, 'en', source_lang)
    return result.content

def transcript_service(video_url):
    try:
        raw_transcript, source_lang = get_video_transcript(video_url)
        
        if not raw_transcript.strip():
            raise Exception("Failed to retrieve the transcript.")
        
        refined_transcript = refine_transcript(raw_transcript, source_lang)
        
        return refined_transcript
    
    except Exception as e:
        return f"Error processing transcript: {str(e)}"

if __name__ == "__main__":
    # print(analyze_youtube_channel("https://www.youtube.com/@TED"))
    url = "https://www.tiktok.com/@nickkvideos1/video/7424178492738227487"
    result = transcript_service(url)
    print(result)