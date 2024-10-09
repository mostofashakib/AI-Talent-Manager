from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from services.youtube_service import analyze_youtube_channel, getChannelRecommendations
from services.email_service import send_email
from services.youtube_sales_service import start_automation_service, stop_automation_service, get_active_automations

app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ["https://www.mostofatech.com", "https://ai-talent-manager.vercel.app"]:
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response

@app.route('/api/analyze', methods=['POST'])
def analyze_channel():
    data = request.json
    channel_url = data.get('channelUrl')

    if not channel_url:
        return jsonify({"error": "Channel URL is required"}), 400

    try:
        result = analyze_youtube_channel(channel_url)
        print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/fetchAutomations', methods=['GET'])
def fetch_automations():
    try:
        result = get_active_automations()
        print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/automate', methods=['POST'])
def automate_video():
    data = request.json
    video_url = data.get('videoUrl')
    affiliate_url = data.get('affiliateUrl')

    reply_text = f"Thank you for your interest! Check out our product at {affiliate_url}"

    if not video_url:
        return jsonify({"error": "Video URL is required"}), 400
    
    if not affiliate_url:
        return jsonify({"error": "Affiliate URL is required"}), 400

    try:
        result = start_automation_service(video_url, reply_text)
        print(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stop', methods=['POST'])
def stop_automation():
    data = request.json
    video_url = data.get('videoUrl')

    try:
        result = stop_automation_service(video_url)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/send-email', methods=['POST'])
def send_email_route():
    recipient_email = request.json.get('email')
    recommendations = getChannelRecommendations()

    if not recommendations:
        return jsonify({"error": "No recommendations are available"}), 400

    try:
        send_email(recommendations, recipient_email)
        return jsonify({"success": "Email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    debug = os.environ.get('FLASK_ENV') != 'production'
    
    app.run(host='0.0.0.0', port=port, debug=debug)
