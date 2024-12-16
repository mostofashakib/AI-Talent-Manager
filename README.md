# ViralVisionAI

**ViralVisionAI** is an AI-driven platform designed to empower content creators by automating brand partnerships, providing performance insights, and enhancing engagement through automated responses.

## Features

- **Brand Discovery**: Identify brand partnerships tailored to your content and audience.
- **Performance Tracking**: Monitor the effectiveness of partnerships and optimize strategies.
- **Automated Engagement**: Automate responses to comments and messages with personalized affiliate links and product information.

## How It Works

1. **User Input**: The user provides a YouTube channel or video URL and (optionally) an affiliate link.
2. **Analysis**:
   - Channels are analyzed to recommend potential brand partnerships.
   - Video links trigger automation processes for responses.
3. **Automation**:
   - Using AI, the platform identifies suitable opportunities and automates engagement workflows.

## Development Setup

### Run Backend (Flask)

1.  bashCopy codepython3 -m venv venvsource venv/bin/activate
2.  bashCopy codepip install -r requirements.txt
3.  makefileCopy codeFLASK_ENV=developmentPORT=8080NEXT_PUBLIC_PRODUCTION_BACKEND_URL_LINK=
4.  bashCopy codeflask run

### Environment Configuration

Add the following API keys to your .env file:

```
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
NEXT_PUBLIC_FORM_CONTACT_API=YOUR_FORM_API_KEY
```

## Usage

### Analyze a YouTube Channel

1.  Navigate to the homepage.
2.  Enter the YouTube channel URL in the input field.
3.  Click **Analyze** to view recommended brand deals.

### Automate Engagement for a Video

1.  Enter the YouTube video URL and an affiliate link in the respective fields.
2.  Click **Set Up Automation**.
3.  View and manage automation in the **Dashboard**.

## Deployment

### Deploy the Project

To deploy both the frontend and backend, run the deploy script located in the backend directory:

```
./deploy.sh`
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
