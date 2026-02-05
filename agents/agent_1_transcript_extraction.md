---
name: Agent 1 - Transcript Extraction Agent
type: data_processor
version: 1.0.0
parent: mother_agent
outputs_to: [agent_2_pm_skills, agent_3_english_analysis]
---

# Agent 1: Transcript Extraction Agent

## Role
**Data Processor** - Retrieves and preprocesses YouTube video transcripts for downstream analysis agents.

## Position in Hierarchy
- **Parent**: Mother Agent (Orchestrator)
- **Children**: None (leaf agent)
- **Outputs to**: Agent 2 (PM Skills), Agent 3 (English Analysis)

## Responsibilities

1. **URL Processing**
   - Validate YouTube URL format
   - Extract video ID from multiple URL formats
   - Handle edge cases (shortened URLs, embed URLs, etc.)

2. **Transcript Retrieval**
   - Fetch English transcripts (manual or auto-generated)
   - Preserve timestamp information
   - Handle missing or disabled transcripts

3. **Data Formatting**
   - Structure transcript with timestamps
   - Generate full text version for Agent 2
   - Maintain timestamp array for Agent 3

4. **Error Handling**
   - Report clear errors to Mother Agent
   - Distinguish between different failure types
   - Provide actionable error messages

## Input from Mother Agent

```json
{
  "youtube_url": "https://youtube.com/watch?v=VIDEO_ID",
  "options": {
    "max_transcript_length": 200,
    "prefer_manual_transcript": true
  }
}
```

## Output to Agents 2 & 3

```json
{
  "success": true,
  "video": {
    "id": "VIDEO_ID",
    "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
    "url": "https://www.youtube.com/watch?v=VIDEO_ID"
  },
  "transcript": [
    {
      "text": "Welcome to this video about product management",
      "start": 0.0,
      "duration": 3.5
    },
    {
      "text": "Today we'll discuss prioritization frameworks",
      "start": 3.5,
      "duration": 2.8
    }
  ],
  "full_text": "Welcome to this video about product management. Today we'll discuss prioritization frameworks...",
  "language": "en",
  "metadata": {
    "total_segments": 450,
    "total_duration_seconds": 1200,
    "transcript_type": "manual"
  }
}
```

## Data Flow

```
Mother Agent
     │
     │ (YouTube URL)
     ▼
┌────────────────────────┐
│   Agent 1: Transcript  │
│   Extraction           │
│                        │
│  1. Validate URL       │
│  2. Extract video ID   │
│  3. Fetch transcript   │
│  4. Format data        │
└────────────────────────┘
     │
     │ (Structured Transcript)
     │
     ├──────────────┬──────────────┐
     │              │              │
     ▼              ▼              ▼
  Agent 2       Agent 3       Agent 4
(PM Skills)   (English)    (Synthesis)
```

## Implementation

```python
class TranscriptExtractionAgent:
    """Agent 1: Transcript Extraction"""
    
    def __init__(self):
        self.youtube_service = YouTubeService()
    
    def execute(self, youtube_url, options=None):
        """
        Execute transcript extraction.
        
        Args:
            youtube_url: YouTube video URL
            options: Optional configuration
            
        Returns:
            Structured transcript data
        """
        options = options or {}
        
        # Step 1: Validate URL
        if not self.youtube_service.validate_url(youtube_url):
            raise ValueError("Invalid YouTube URL format")
        
        # Step 2: Extract video ID
        video_id = self.youtube_service.extract_video_id(youtube_url)
        if not video_id:
            raise ValueError("Could not extract video ID from URL")
        
        # Step 3: Get video metadata
        metadata = self.youtube_service.get_video_metadata(video_id)
        
        # Step 4: Fetch transcript
        try:
            transcript_result = self.youtube_service.get_transcript(video_id)
        except ValueError as e:
            raise ValueError(f"Transcript extraction failed: {str(e)}")
        
        # Step 5: Apply options (e.g., limit length)
        max_length = options.get('max_transcript_length')
        if max_length and len(transcript_result['transcript']) > max_length:
            transcript_result['transcript'] = transcript_result['transcript'][:max_length]
            transcript_result['full_text'] = ' '.join([
                t['text'] for t in transcript_result['transcript']
            ])
        
        # Step 6: Return structured data
        return {
            "success": True,
            "video": metadata,
            "transcript": transcript_result['transcript'],
            "full_text": transcript_result['full_text'],
            "language": transcript_result['language'],
            "metadata": {
                "total_segments": len(transcript_result['transcript']),
                "transcript_type": "manual" if transcript_result.get('is_manual') else "auto-generated"
            }
        }
```

## Error Types

| Error | Cause | Mother Agent Action |
|-------|-------|---------------------|
| `InvalidURLError` | Malformed URL | Return 400 to user |
| `NoTranscriptError` | Transcripts disabled | Return 400 with message |
| `PrivateVideoError` | Video is private | Return 400 with message |
| `NetworkError` | Connection issues | Retry once, then fail |
| `UnknownError` | Unexpected failure | Log and return 500 |

## Performance Metrics

- **Average execution time**: 2-5 seconds
- **Success rate**: ~95% (depends on video availability)
- **Token usage**: N/A (no AI involved)
- **Cost**: Free (uses public YouTube API)

## Dependencies

```python
# Required libraries
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable
)
import re
```

## Testing

```python
def test_agent_1():
    agent = TranscriptExtractionAgent()
    
    # Test valid URL
    result = agent.execute("https://youtube.com/watch?v=dQw4w9WgXcQ")
    assert result['success'] == True
    assert 'transcript' in result
    assert 'full_text' in result
    
    # Test invalid URL
    try:
        agent.execute("https://invalid-url.com")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass
```

## Implementation Reference

**File**: `backend/services/youtube_service.py`

## Future Enhancements

1. **Multi-language support**: Fetch transcripts in other languages
2. **Transcript caching**: Cache results to avoid re-fetching
3. **Video metadata enrichment**: Fetch title, description, view count
4. **Subtitle formatting**: Preserve formatting (bold, italics)
5. **Speaker diarization**: Identify different speakers
