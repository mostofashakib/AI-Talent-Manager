import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Content, TrackingSettings
from dotenv import load_dotenv
import requests

load_dotenv()

TINY_URL_ENDPOINT = os.getenv("TINY_URL_ENDPOINT")

def shorten_url(long_url):
    try:
        headers = {
            "Authorization": f"Bearer {os.getenv('TINY_URL_KEY')}",
            "Content-Type": "application/json"
        }
        data = {
            "url": long_url
        }
        response = requests.post(TINY_URL_ENDPOINT, headers=headers, json=data)
        if response.status_code == 200:
            return response.json().get("data", {}).get("tiny_url", long_url)
        else:
            print(f"Failed to shorten URL: {response.status_code}, {response.text}")
        return long_url
    except Exception as e:
        print(f"Error occurred while shortening URL: {e}")
        return long_url

def send_email(recommendations, recipient_email):
    email_content = "Here are your top brand deal recommendations:\n\n"

    for index, rec in enumerate(recommendations, start=1):
        email_content += f"{index}. Brand: {rec['name']}\n"
        email_content += f"  - Description: {rec['description']}\n"
        email_content += f"  - Category: {rec['category']}\n"
        email_content += f"  - Website: {shorten_url(rec['website_url'])}\n"
        email_content += f"  - Affiliate Link: {shorten_url(rec['affiliate_link'])}\n\n"

    message = Mail(
        from_email=os.getenv("FROM_EMAIL"),
        to_emails=recipient_email,
        subject="Your Brand Deal Recommendations",
        plain_text_content=email_content
    )

    # Disable click tracking
    tracking_settings = TrackingSettings()
    tracking_settings.click_tracking = False
    message.tracking_settings = tracking_settings

    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)
        if response.status_code == 202:
            print("Email sent successfully!")
        else:
            print("Failed to send email.")
    except Exception as e:
        print(f"Error occurred: {e}")