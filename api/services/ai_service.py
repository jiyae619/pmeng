import os
import json
import re
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
    
    @staticmethod
    def sanitize_json_response(content):
        """
        Clean and extract JSON from AI response.
        Handles markdown code blocks, extra text, and malformed JSON.
        
        Args:
            content: Raw AI response text
            
        Returns:
            Cleaned JSON string ready for parsing
        """
        # Remove markdown code blocks
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0]
        elif '```' in content:
            content = content.split('```')[1].split('```')[0]
        
        # Remove leading/trailing whitespace
        content = content.strip()
        
        # Extract JSON array or object using regex
        if not content.startswith('[') and not content.startswith('{'):
            match = re.search(r'[\[{][\s\S]*[\]}]', content)
            if match:
                content = match.group(0)
        
        return content
    
    @staticmethod
    def parse_json_with_retry(content, context=""):
        """
        Try multiple strategies to parse JSON from AI response.
        
        Args:
            content: JSON string to parse
            context: Context string for error messages
            
        Returns:
            Parsed JSON object
            
        Raises:
            ValueError: If all parsing strategies fail
        """
        strategies = [
            # Strategy 1: Direct parse
            lambda x: json.loads(x),
            
            # Strategy 2: Fix common issues with regex
            lambda x: json.loads(re.sub(r'(?<!\\)\n', ' ', x)),  # Replace unescaped newlines
            
            # Strategy 3: Try to complete unterminated strings
            lambda x: json.loads(x + '"]}'),  # Add closing quote, bracket, brace
            
            # Strategy 4: Remove trailing incomplete objects
            lambda x: json.loads(re.sub(r',\s*\{[^}]*$', ']', x)),
        ]
        
        last_error = None
        for i, strategy in enumerate(strategies):
            try:
                result = strategy(content)
                if i > 0:
                    print(f"DEBUG - {context} parsed successfully with strategy {i+1}")
                return result
            except (json.JSONDecodeError, ValueError) as e:
                last_error = e
                continue
        
        # All strategies failed
        error_context = content[:1000] if len(content) > 1000 else content
        print(f"ERROR - {context} all parsing strategies failed")
        print(f"ERROR - Last error: {str(last_error)}")
        print(f"ERROR - Content: {error_context}")
        raise ValueError(f"Failed to parse AI response as JSON after {len(strategies)} attempts: {str(last_error)}")
    
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
                    response_mime_type="application/json",  # Force JSON output
                )
            )
            
            # Extract and sanitize JSON from response
            content = response.text
            print(f"DEBUG - PM Insights raw response: {content[:500]}...")  # Log first 500 chars
            
            # Clean the response
            content = self.sanitize_json_response(content)
            print(f"DEBUG - PM Insights sanitized JSON: {content[:500]}...")  # Log sanitized JSON
            
            # Parse JSON response with retry logic
            insights = self.parse_json_with_retry(content, "PM Insights")
            
            # Validate we have exactly 5 insights
            if len(insights) > 5:
                insights = insights[:5]
            
            return insights
            
        except json.JSONDecodeError as e:
            error_context = content[:1000] if len(content) > 1000 else content
            print(f"ERROR - PM Insights JSON decode error: {str(e)}")
            print(f"ERROR - Content that failed to parse: {error_context}")
            print(f"ERROR - Error location: line {e.lineno}, column {e.colno}, char {e.pos}")
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except ValueError as e:
            # Re-raise ValueError from parse_json_with_retry
            raise
        except Exception as e:
            print(f"ERROR - PM Insights general error: {str(e)}")
            raise ValueError(f"AI analysis failed: {str(e)}")
    
    def analyze_english_expressions(self, transcript_text=None, video_id=None, video_url=None):
        """
        Analyze transcript for advanced English expressions.
        
        Args:
            transcript_text: Timestamped transcript text
            video_id: YouTube video ID for timestamp URLs
            video_url: YouTube URL to analyze natively (not used in this SDK fallback, but kept for parity)
            
        Returns:
            List of English expressions (max 7)
        """
        prompt = f"""Analyze this YouTube video transcript and identify advanced English expressions suitable for business and professional settings.

Transcript (with timestamps):
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
            
            # Extract and sanitize JSON from response
            content = response.text
            print(f"DEBUG - English Expressions raw response: {content[:500]}...")
            
            # Clean the response
            content = self.sanitize_json_response(content)
            print(f"DEBUG - English Expressions sanitized JSON: {content[:500]}...")
            
            # Parse JSON response with retry logic
            expressions = self.parse_json_with_retry(content, "English Expressions")
            
            # Add timestamp URLs
            for expr in expressions:
                timestamp = expr.get('timestamp', 0)
                expr['timestamp_url'] = f"https://www.youtube.com/watch?v={video_id}&t={timestamp}s"
            
            # Validate we have exactly 7 expressions
            if len(expressions) > 7:
                expressions = expressions[:7]
            
            return expressions
            
        except json.JSONDecodeError as e:
            error_context = content[:1000] if len(content) > 1000 else content
            print(f"ERROR - English Expressions JSON decode error: {str(e)}")
            print(f"ERROR - Content that failed to parse: {error_context}")
            print(f"ERROR - Error location: line {e.lineno}, column {e.colno}, char {e.pos}")
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except ValueError as e:
            # Re-raise ValueError from parse_json_with_retry
            raise
        except Exception as e:
            print(f"ERROR - English Expressions general error: {str(e)}")
            raise ValueError(f"AI analysis failed: {str(e)}")
