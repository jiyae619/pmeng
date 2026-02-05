import os
import json
import google.generativeai as genai


class AIService:
    """Service for AI-powered analysis using Google Gemini."""
    
    def __init__(self):
        """Initialize Google Gemini client with API key from environment."""
        api_key = os.getenv('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-3-flash-preview')
    
    def analyze_pm_insights(self, transcript_text, video_title=None):
        """
        Analyze transcript for PM insights.
        
        Args:
            transcript_text: Full transcript text
            video_title: Optional video title for context
            
        Returns:
            List of PM insights (max 5 points)
        """
        prompt = f"""Analyze this YouTube video transcript and extract the most valuable insights for Product Managers.

Video Title: {video_title or 'Not provided'}

Transcript:
{transcript_text}

Instructions:
1. Identify the TOP 5 most practical and actionable insights for Product Manager career development
2. Focus on insights that are:
   - Directly applicable to PM work
   - Backed by specific examples or frameworks from the video
   - Strategic or tactical (not generic advice)
3. For each insight:
   - Provide a clear, concise title (5-8 words)
   - Write a description of 2-4 sentences explaining the insight and how to apply it
4. Prioritize insights about: product strategy, stakeholder management, decision-making, user research, metrics, or leadership

Return ONLY a JSON array with this exact structure:
[
  {{
    "title": "Insight title here",
    "description": "2-4 sentence description explaining the insight and how PMs can apply it."
  }}
]

Return exactly 5 insights. Ensure the JSON is valid and properly formatted."""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2000,
                )
            )
            
            # Extract JSON from response
            content = response.text
            print(f"DEBUG - PM Insights raw response: {content[:500]}...")  # Log first 500 chars
            
            # Try to extract JSON from markdown code blocks if present
            if '```json' in content:
                content = content.split('```json')[1].split('```')[0].strip()
            elif '```' in content:
                content = content.split('```')[1].split('```')[0].strip()
            
            # Remove any leading/trailing whitespace
            content = content.strip()
            
            # Try to find JSON array using regex if direct parsing fails
            import re
            if not content.startswith('['):
                match = re.search(r'\[[\s\S]*\]', content)
                if match:
                    content = match.group(0)
            
            print(f"DEBUG - PM Insights extracted JSON: {content[:500]}...")  # Log extracted JSON
            
            # Parse JSON response
            insights = json.loads(content)
            
            # Validate we have exactly 5 insights
            if len(insights) > 5:
                insights = insights[:5]
            
            return insights
            
        except json.JSONDecodeError as e:
            print(f"ERROR - PM Insights JSON decode error: {str(e)}")
            print(f"ERROR - Content that failed to parse: {content}")
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except Exception as e:
            print(f"ERROR - PM Insights general error: {str(e)}")
            raise ValueError(f"AI analysis failed: {str(e)}")
    
    def analyze_english_expressions(self, transcript_data, video_id):
        """
        Analyze transcript for advanced English expressions.
        
        Args:
            transcript_data: Transcript with timestamps
            video_id: YouTube video ID for timestamp URLs
            
        Returns:
            List of English expressions (max 7)
        """
        # Format transcript with timestamps for context
        formatted_transcript = []
        for entry in transcript_data[:200]:  # Limit to first 200 entries to avoid token limits
            timestamp = int(entry['start'])
            formatted_transcript.append(f"[{timestamp}s] {entry['text']}")
        
        transcript_text = "\n".join(formatted_transcript)
        
        prompt = f"""Analyze this YouTube video transcript and identify advanced English expressions suitable for business and professional settings.

Transcript (with timestamps in seconds):
{transcript_text}

Instructions:
1. Identify 7 advanced English expressions or phrases that are:
   - Professional/business-oriented (not casual or common phrases)
   - Used by executives, thought leaders, or in formal business contexts
   - Useful for Product Managers in presentations, meetings, or stakeholder communication
2. For each expression:
   - Extract the exact phrase used
   - Provide the context/example of how it was used in the video
   - Include the timestamp (in seconds) where it appears
3. Focus on expressions like:
   - Executive communication patterns
   - Persuasive language techniques
   - Strategic framing phrases
   - Professional idioms or sophisticated vocabulary

Return ONLY a JSON array with this exact structure:
[
  {{
    "phrase": "The exact expression or phrase",
    "example": "How it was used in the video with context",
    "timestamp": 123
  }}
]

Return exactly 7 expressions. Ensure the JSON is valid and properly formatted."""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=2000,
                    response_mime_type="application/json",  # Force JSON output
                )
            )
            
            # Extract JSON from response - should be clean JSON with JSON mode enabled
            content = response.text.strip()
            print(f"DEBUG - English Expressions response: {content[:500]}...")
            
            # Parse JSON response
            expressions = json.loads(content)
            
            # Add timestamp URLs
            for expr in expressions:
                timestamp = expr.get('timestamp', 0)
                expr['timestamp_url'] = f"https://www.youtube.com/watch?v={video_id}&t={timestamp}s"
            
            # Validate we have exactly 7 expressions
            if len(expressions) > 7:
                expressions = expressions[:7]
            
            return expressions
            
        except json.JSONDecodeError as e:
            print(f"ERROR - English Expressions JSON decode error: {str(e)}")
            print(f"ERROR - Content that failed to parse: {content}")
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except Exception as e:
            print(f"ERROR - English Expressions general error: {str(e)}")
            raise ValueError(f"AI analysis failed: {str(e)}")
