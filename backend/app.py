from flask import Flask, request, jsonify
from flask_cors import CORS
from services.youtube_service import analyze_youtube_channel, getChannelRecommendations
from services.email_service import send_email

app = Flask(__name__)
CORS(app)

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
    

@app.route('/api/send-email', methods=['POST'])
def send_email_route():
    recipient_email = request.json.get('email')
    recommendations = getChannelRecommendations()

    if not recommendations:
        return jsonify({"error": "No recommendations are available"}), 400

    try:
        result = send_email(recommendations, recipient_email)
        return jsonify({"success": result["message"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
