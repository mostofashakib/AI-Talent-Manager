import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from dotenv import load_dotenv

load_dotenv()

def send_email(recommendations, recipient_email):
    # Format recommendations into a string
    email_content = "<h3>Here are your top brand deal recommendations:</h3><br>"

    for index, rec in enumerate(recommendations, start=1):
        email_content += f"<h4>{index}. Brand: {rec['name']}</h4>"
        email_content += f"<ul>"
        email_content += f"<li><b>Description:</b> {rec['description']}</li>"
        email_content += f"<li><b>Earnings:</b> {rec['earnings']}</li>"
        email_content += f"<li><b>Contact Info:</b> {rec['contactInfo']}</li>"
        email_content += f'<li><b>Affiliate Link:</b> <a href="{rec["affiliateLink"]}">Click Here</a></li>'
        email_content += f"</ul><br>"

    # Create a Mail object with the formatted content
    message = Mail(
        from_email=os.getenv("FROM_EMAIL"),
        to_emails=recipient_email,
        subject="Your Brand Deal Recommendations",
        plain_text_content=email_content
    )

    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)
        if response.status_code == 202:
            print("Email sent successfully!")
        else:
            print("Failed to send email.")
    except Exception as e:
        print(f"Error occurred: {e}")