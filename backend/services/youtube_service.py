import requests
from bs4 import BeautifulSoup
import os
from services.llm_service import generate_response

recommendations = [            {
                "name": "Brand A",
                "description": "Description for Brand A.",
                "category": "Test",
                "website_url": "contact@branda.com",
                "affiliate_link": "https://branda.com",
},]


def getChannelDetails(channel_url):
    # get RAPID_API_KEY from
    # https://rapidapi.com/dataocean/api/the-better-youtube-channel-details
    RAPID_API_KEY = os.getenv('RAPID_API_KEY')
    url = 'https://the-better-youtube-channel-details.p.rapidapi.com/GetChannelDetails'
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


if __name__ == "__main__":
    print(analyze_youtube_channel("https://www.youtube.com/@TED"))