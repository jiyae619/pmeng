from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import base64

from services.youtube_service import YouTubeService
from services.ai_service import AIService
from services.notion_service import NotionService

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize services
youtube_service = YouTubeService()
ai_service = AIService()
notion_service = NotionService()


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
                transcript_text=transcript_result.get('full_text'),
                video_title=None, # Could fetch from YouTube API if needed
                video_url=youtube_url if transcript_result.get('fallback_needed') else None
            )
        except ValueError as e:
            return jsonify({
                "success": False,
                "error": f"PM insights analysis failed: {str(e)}"
            }), 500
        
        # Analyze for English expressions
        try:
            english_expressions = ai_service.analyze_english_expressions(
                transcript_text=transcript_result.get('full_text'),
                video_id=video_id,
                video_url=youtube_url if transcript_result.get('fallback_needed') else None
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


@app.route('/api/notion/auth', methods=['POST'])
def notion_auth():
    """
    Exchange Notion OAuth code for an access token.
    """
    try:
        data = request.get_json()
        code = data.get('code')
        
        client_id = os.getenv('NOTION_CLIENT_ID')
        client_secret = os.getenv('NOTION_CLIENT_SECRET')
        redirect_uri = os.getenv('NOTION_REDIRECT_URI')

        if not all([client_id, client_secret, redirect_uri, code]):
            return jsonify({
                "success": False,
                "error": "Missing OAuth parameters (code, client_id, client_secret, or redirect_uri)"
            }), 400

        # Encode credentials for Basic Auth
        credentials = f"{client_id}:{client_secret}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        response = requests.post(
            "https://api.notion.com/v1/oauth/token",
            headers={
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/json"
            },
            json={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri
            }
        )
        
        token_data = response.json()
        
        if "error" in token_data:
            return jsonify({
                "success": False,
                "error": f"Notion API Error: {token_data.get('error_description', token_data.get('error'))}"
            }), 400

        return jsonify({
            "success": True,
            "access_token": token_data.get('access_token'),
            "workspace_name": token_data.get('workspace_name'),
            "workspace_icon": token_data.get('workspace_icon')
        })

    except Exception as e:
        print(f"Notion auth error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Failed to authenticate with Notion: {str(e)}"
        }), 500


@app.route('/api/export/notion', methods=['POST'])
def export_to_notion():
    """
    Export analysis data to a user's Notion page.
    """
    try:
        data = request.get_json()
        analysis_data = data.get('analysis_data')
        access_token = data.get('access_token')
        
        if not access_token:
            return jsonify({
                "success": False,
                "error": "Notion access token is required"
            }), 401
            
        if not analysis_data:
            return jsonify({
                "success": False,
                "error": "analysis_data is required"
            }), 400
            
        # Initialize user-specific Notion client
        user_notion_service = NotionService(auth_token=access_token)
        
        # Determine parent page. For OAuth, users have shared specific pages.
        # We will pick the first shared page we find.
        pages = user_notion_service.search_pages()
        if not pages:
            return jsonify({
                "success": False,
                "error": "No accessible pages found in Notion. Please share a page with the integration."
            }), 404
            
        parent_page_id = pages[0]['id']
            
        # Create Notion page
        result = user_notion_service.create_analysis_page(parent_page_id, analysis_data)
        
        return jsonify({
            "success": True,
            "notion_url": result.get('url')
        })
        
    except Exception as e:
        print(f"Notion export error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Failed to export to Notion: {str(e)}"
        }), 500



if __name__ == '__main__':
    # Check if API key is set
    if not os.getenv('GOOGLE_API_KEY'):
        print("WARNING: GOOGLE_API_KEY not found in environment variables")
        print("Please create a .env file with your API key")
    
    print("Starting PM-ENG API server...")
    print("API will be available at http://localhost:5001")
    app.run(debug=True, port=5001)
