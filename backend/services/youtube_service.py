import re
from xml.etree.ElementTree import ParseError
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound, VideoUnavailable


class YouTubeService:
    """Service for extracting YouTube video data and transcripts."""
    
    @staticmethod
    def extract_video_id(url):
        """
        Extract video ID from various YouTube URL formats.
        
        Args:
            url: YouTube URL string
            
        Returns:
            Video ID string or None if invalid
        """
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)',
            r'youtube\.com\/embed\/([^&\n?#]+)',
            r'youtube\.com\/v\/([^&\n?#]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        return None
    
    @staticmethod
    def get_video_metadata(video_id):
        """
        Get video metadata including title, thumbnail, etc.
        
        Args:
            video_id: YouTube video ID
            
        Returns:
            Dictionary with video metadata
        """
        # YouTube thumbnail URL pattern
        thumbnail = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
        
        return {
            "id": video_id,
            "thumbnail": thumbnail,
            "url": f"https://www.youtube.com/watch?v={video_id}"
        }
    
    @staticmethod
    def get_transcript(video_id):
        """
        Fetch transcript with timestamps for a YouTube video.
        
        Args:
            video_id: YouTube video ID
            
        Returns:
            Dictionary with transcript data and metadata
            
        Raises:
            ValueError: If transcript is unavailable
        """
        try:
            # Create API instance
            api = YouTubeTranscriptApi()
            
            # Get list of available transcripts
            transcript_list = api.list(video_id)
            
            # Try to get manual English transcript first
            try:
                transcript = transcript_list.find_transcript(['en'])
            except:
                # Fall back to auto-generated English
                transcript = transcript_list.find_generated_transcript(['en'])
            
            # Fetch the actual transcript data
            transcript_data = api.fetch(video_id, languages=[transcript.language_code])
            
            # Format transcript with timestamps
            formatted_transcript = []
            full_text = []
            
            for entry in transcript_data:
                formatted_transcript.append({
                    "text": entry.text,
                    "start": entry.start,
                    "duration": entry.duration
                })
                full_text.append(entry.text)
            
            return {
                "transcript": formatted_transcript,
                "full_text": " ".join(full_text),
                "language": transcript.language_code
            }
            
        except TranscriptsDisabled:
            raise ValueError("Transcripts are disabled for this video")
        except NoTranscriptFound:
            raise ValueError("No English transcript found for this video")
        except VideoUnavailable:
            raise ValueError("Video is unavailable or private")
        except ParseError:
            raise ValueError("YouTube is currently blocking transcript requests. This is a temporary issue. Please try again in a few moments, or try a different video.")
        except Exception as e:
            raise ValueError(f"Error fetching transcript: {str(e)}")
    
    @staticmethod
    def validate_url(url):
        """
        Validate if URL is a valid YouTube URL.
        
        Args:
            url: URL string to validate
            
        Returns:
            Boolean indicating if URL is valid
        """
        video_id = YouTubeService.extract_video_id(url)
        return video_id is not None
