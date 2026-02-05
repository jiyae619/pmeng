from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from services.youtube_service import YouTubeService
from services.ai_service import AIService

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize services
youtube_service = YouTubeService()
ai_service = AIService()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "message": "PM-ENG API is running"})


@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    """
    Analyze a YouTube video for PM insights and English expressions.
    
    Expected JSON body:
    {
        "youtube_url": "https://youtube.com/watch?v=..."
    }
    
    Returns:
    {
        "success": true,
        "video": {...},
        "pm_insights": [...],
        "english_expressions": [...]
    }
    """
    try:
        # Get YouTube URL from request
        data = request.get_json()
        youtube_url = data.get('youtube_url')
        
        if not youtube_url:
            return jsonify({
                "success": False,
                "error": "YouTube URL is required"
            }), 400
        
        # Validate YouTube URL
        if not youtube_service.validate_url(youtube_url):
            return jsonify({
                "success": False,
                "error": "Invalid YouTube URL"
            }), 400
        
        # Extract video ID
        video_id = youtube_service.extract_video_id(youtube_url)
        
        # Get video metadata
        video_metadata = youtube_service.get_video_metadata(video_id)
        
        # Get transcript
        try:
            transcript_result = youtube_service.get_transcript(video_id)
        except ValueError as e:
            return jsonify({
                "success": False,
                "error": str(e)
            }), 400
        
        # Analyze for PM insights
        try:
            pm_insights = ai_service.analyze_pm_insights(
                transcript_result['full_text'],
                video_title=None  # Could fetch from YouTube API if needed
            )
        except ValueError as e:
            return jsonify({
                "success": False,
                "error": f"PM insights analysis failed: {str(e)}"
            }), 500
        
        # Analyze for English expressions
        try:
            english_expressions = ai_service.analyze_english_expressions(
                transcript_result['transcript'],
                video_id
            )
        except ValueError as e:
            return jsonify({
                "success": False,
                "error": f"English expression analysis failed: {str(e)}"
            }), 500
        
        # Return successful response
        return jsonify({
            "success": True,
            "video": video_metadata,
            "pm_insights": pm_insights,
            "english_expressions": english_expressions
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }), 500


if __name__ == '__main__':
    # Check if API key is set
    if not os.getenv('GOOGLE_API_KEY'):
        print("WARNING: GOOGLE_API_KEY not found in environment variables")
        print("Please create a .env file with your API key")
    
    print("Starting PM-ENG API server...")
    print("API will be available at http://localhost:5001")
    app.run(debug=True, port=5001)
