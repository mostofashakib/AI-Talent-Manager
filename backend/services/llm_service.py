import os
from dotenv import load_dotenv
from openai import OpenAI
import json
from pydantic import BaseModel
from typing import List 
from bs4 import BeautifulSoup
import requests
from googlesearch import search

load_dotenv()

SYSTEM_PROMPT = (
    "You are an expert talent manager for content creators. "
    "Your job is to recommend brand deals by analyzing their channel "
    "descriptions and content. "
    "You should output a JSON object with the following structure: "
    "{ "
        "\"brand_name\": \"\", "
        "\"brand_description\": \"\", "
        "\"recommendation_reason\": \"\", "
        "\"brand_category\": \"\", "
        "\"brand_affiliate_program_link\": \"\", "
        "\"brand_website\": \"\", "
    "}"
)

openai_api_key = os.getenv('OPEN_AI_API_KEY')

def is_valid_url(url: str) -> bool:
    return url.startswith("http://") or url.startswith("https://")

def get_brand_logo(brand_name: str, website_url: str) -> str:
    try:
        response = requests.get(website_url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        logo_selectors = ['.logo', '#logo', '[alt*="logo"]', '[src*="logo"]']
        for selector in logo_selectors:
            logo = soup.select_one(selector)
            if logo and logo.name == 'img':
                logo_src = logo.get('src')
                if is_valid_url(logo_src):
                    return logo_src
        
        search_query = f"{brand_name} logo"
        for url in search(search_query, num_results=5):
            try:
                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')
                logo = soup.find('img')
                if logo and logo.get('src'):
                    logo_src = logo.get('src')
                    if is_valid_url(logo_src):
                        return logo_src
            except:
                continue
        
        return f"https://via.placeholder.com/150?text={brand_name}"
    except:
        return f"https://via.placeholder.com/150?text={brand_name}"

class BrandRecommendation(BaseModel):
    brand_name: str
    brand_description: str
    recommendation_reason: str
    brand_category: str
    brand_affiliate_program_link: str
    brand_website: str

    def to_dict(self):
        logo_url = get_brand_logo(self.brand_name, self.brand_website)

        return {
            "name": self.brand_name,
            "description": self.brand_description,
            "reason": self.recommendation_reason,
            "category": self.brand_category,
            "affiliate_link": self.brand_affiliate_program_link,
            "website_url": self.brand_website,
            "logo_url": logo_url
        }

class BrandRecommendations(BaseModel):
    recommendations: List[BrandRecommendation]

def generate_response(channel_description, subscriber_count):
    client = OpenAI(api_key=openai_api_key)

    USER_PROMPT_FORMAT = f"Here is the information about the content creator:\n" \
                     f"Channel Description: {channel_description}\n" \
                     f"Subscriber Count: {subscriber_count}\n"

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": USER_PROMPT_FORMAT,
            }
        ],
        response_format=BrandRecommendations
    )

    recommendations = completion.choices[0].message.parsed
    return [r.to_dict() for r in recommendations.recommendations]


if __name__ == "__main__":
    TED_description = """The TED Talks channel features the best talks and performances from the TED Conference, where the world's leading thinkers and doers give the talk of their lives in 18 minutes (or less). Look for talks on Technology, Entertainment and Design -- plus science, business, global issues, the arts and more. You're welcome to link to or embed these videos, forward them to others and share these ideas with people you know.

TED's videos may be used for non-commercial purposes under a Creative Commons License, Attribution–Non Commercial–No Derivatives (or the CC BY – NC – ND 4.0 International) and in accordance with our TED Talks Usage Policy: https://www.ted.com/about/our-organization/our-policies-terms/ted-talks-usage-policy. For more information on using TED for commercial purposes (e.g. employee learning, in a film or online course), please submit a Media Request at https://media-requests.ted.com"""

    print(generate_response(TED_description, "2.1M"))