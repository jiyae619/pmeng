---
name: Agent 3 - PM English Analysis Subagent
type: ai_analyzer
version: 1.0.0
parent: mother_agent
inputs_from: [agent_1_transcript_extraction]
outputs_to: [agent_4_synthesis]
---

# Agent 3: PM English Analysis Subagent

## Role
**AI Analyzer (Subagent)** - Identifies advanced business English expressions from video transcripts to help PMs improve their professional communication skills.

## Position in Hierarchy
- **Parent**: Mother Agent (Orchestrator)
- **Sibling**: Agent 2 (PM Skills Subagent)
- **Inputs from**: Agent 1 (Transcript Extraction)
- **Outputs to**: Agent 4 (Synthesis Agent)

## Responsibilities

1. **Expression Identification**
   - Analyze transcript for advanced English expressions
   - Focus on business and professional contexts
   - Identify executive communication patterns

2. **Context Preservation**
   - Maintain timestamp information
   - Provide usage examples from the video
   - Generate clickable timestamp URLs

3. **Quality Filtering**
   - Select professional/business-oriented phrases
   - Avoid casual or common expressions
   - Prioritize PM-relevant language

4. **Structured Output**
   - Format expressions with phrase, example, and timestamp
   - Return valid JSON for downstream processing
   - Generate YouTube timestamp URLs

## Input from Agent 1

```json
{
  "transcript": [
    {
      "text": "We need to move the needle on our key metrics",
      "start": 125.5,
      "duration": 3.2
    },
    {
      "text": "This feature is table stakes for enterprise customers",
      "start": 245.0,
      "duration": 2.8
    }
  ],
  "video_id": "VIDEO_ID",
  "metadata": {
    "total_segments": 450,
    "language": "en"
  }
}
```

## Output to Agent 4

```json
{
  "success": true,
  "english_expressions": [
    {
      "phrase": "Move the needle",
      "example": "We need to move the needle on our key metrics by focusing on high-impact initiatives rather than incremental improvements.",
      "timestamp": 125,
      "timestamp_url": "https://www.youtube.com/watch?v=VIDEO_ID&t=125s"
    },
    {
      "phrase": "Table stakes",
      "example": "This feature is table stakes for enterprise customers - without it, we won't even be considered in their evaluation process.",
      "timestamp": 245,
      "timestamp_url": "https://www.youtube.com/watch?v=VIDEO_ID&t=245s"
    }
  ],
  "metadata": {
    "analysis_time_ms": 13000,
    "model": "gemini-2.0-flash-exp",
    "token_usage": 1600,
    "expressions_count": 10
  }
}
```

## Data Flow

```
Agent 1 (Transcript)
     │
     │ (transcript array with timestamps, video_id)
     ▼
┌────────────────────────────┐
│  Agent 3: PM English       │
│  Analysis Subagent         │
│                            │
│  1. Receive transcript     │
│  2. Format with timestamps │
│  3. Analyze with AI        │
│  4. Extract 10 expressions  │
│  5. Generate timestamp URLs│
└────────────────────────────┘
     │
     │ (english_expressions array)
     ▼
Agent 4 (Synthesis)
```

## AI Analysis Strategy

### Expression Categories
1. **Executive Communication** - C-suite language, board presentations
2. **Persuasive Language** - Influence, negotiation, buy-in
3. **Strategic Framing** - Vision casting, narrative building
4. **Professional Idioms** - Business-appropriate expressions
5. **Sophisticated Vocabulary** - Advanced terminology, precise language

### Prompt Engineering

```python
def generate_english_analysis_prompt(transcript_data):
    """Generate optimized prompt for English expression extraction."""
    
    # Format transcript with timestamps
    formatted_transcript = []
    for entry in transcript_data[:200]:  # Limit to avoid token limits
        timestamp = int(entry['start'])
        formatted_transcript.append(f"[{timestamp}s] {entry['text']}")
    
    transcript_text = "\n".join(formatted_transcript)
    
    return f"""Analyze this YouTube video transcript and identify advanced English expressions suitable for business and professional settings.

Transcript (with timestamps in seconds):
{transcript_text}

Instructions:
1. Identify 10 advanced English expressions or phrases that are:
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

Return exactly 10 expressions. Ensure the JSON is valid and properly formatted."""
```

## Implementation

```python
class EnglishAnalysisSubagent:
    """Agent 3: PM English Analysis Subagent"""
    
    def __init__(self):
        self.ai_service = AIService()
    
    def execute(self, transcript_data, video_id):
        """
        Execute English expression analysis.
        
        Args:
            transcript_data: Transcript array from Agent 1
            video_id: YouTube video ID for timestamp URLs
            
        Returns:
            Structured English expressions
        """
        start_time = time.time()
        
        try:
            # Call AI service for analysis
            expressions = self.ai_service.analyze_english_expressions(
                transcript_data,
                video_id
            )
            
            # Validate output
            if not isinstance(expressions, list) or len(expressions) != 10:
                raise ValueError("Expected exactly 10 expressions")
            
            # Verify timestamp URLs are present
            for expr in expressions:
                if 'timestamp_url' not in expr:
                    raise ValueError("Missing timestamp URL in expression")
            
            # Calculate processing time
            processing_time = (time.time() - start_time) * 1000
            
            return {
                "success": True,
                "english_expressions": expressions,
                "metadata": {
                    "analysis_time_ms": processing_time,
                    "model": "gemini-2.0-flash-exp",
                    "expressions_count": len(expressions)
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "english_expressions": []
            }
```

## Expression Quality Criteria

### ✅ Good Expressions
- "Move the needle" - Make significant impact
- "Table stakes" - Minimum requirements
- "De-risk the initiative" - Reduce uncertainty
- "Socialize the idea" - Build awareness and support
- "Double-click on that" - Examine in detail
- "Greenfield opportunity" - New, unexplored area
- "Low-hanging fruit" - Easy wins
- "Boil the ocean" - Attempt too much at once
- "Break the ice" - Make conversation
- "Break ground" - Start construction
- "Break the mold" - Deviate from tradition
- "Break the bank" - Cost too much

### ❌ Poor Expressions
- "Good job" (too casual)
- "Thank you" (too common)
- "I think" (not advanced)
- "Very important" (generic)
- "Let's do it" (casual)

## Timestamp Processing

```python
def generate_timestamp_url(video_id, timestamp_seconds):
    """Generate YouTube timestamp URL."""
    timestamp = int(timestamp_seconds)
    return f"https://www.youtube.com/watch?v={video_id}&t={timestamp}s"

# Example usage
url = generate_timestamp_url("dQw4w9WgXcQ", 125.5)
# Returns: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=125s"
```

## Performance Metrics

- **Average execution time**: 10-15 seconds
- **Success rate**: ~98% (depends on AI API availability)
- **Token usage**: ~1600 tokens per analysis
- **Cost per analysis**: ~$0.0001 (Google Gemini Flash)
- **Transcript limit**: First 200 segments (~10-15 minutes)

## Error Handling

| Error Type | Cause | Action |
|------------|-------|--------|
| `JSONDecodeError` | Invalid AI response | Retry once, then fail |
| `TimeoutError` | AI API timeout | Return partial results if available |
| `RateLimitError` | API rate limit hit | Queue request or return error |
| `ValidationError` | Wrong number of expressions | Trim or pad to 10 expressions |
| `MissingTimestampError` | Timestamp not found | Use 0 as default |

## Dependencies

```python
# Required libraries
import google.generativeai as genai
import json
import time
```

## Testing

```python
def test_agent_3():
    agent = EnglishAnalysisSubagent()
    
    # Test with sample transcript
    transcript = [
        {"text": "We need to move the needle on metrics", "start": 10.0, "duration": 2.5},
        {"text": "This is table stakes for enterprise", "start": 15.0, "duration": 2.0}
    ]
    
    result = agent.execute(transcript, "test_video_id")
    
    assert result['success'] == True
    assert len(result['english_expressions']) == 10
    assert all('phrase' in expr for expr in result['english_expressions'])
    assert all('timestamp_url' in expr for expr in result['english_expressions'])
```

## Implementation Reference

**File**: `backend/services/ai_service.py` → `analyze_english_expressions()`

## Configuration

```python
AGENT_3_CONFIG = {
    "model": "gemini-2.0-flash-exp",
    "temperature": 0.7,
    "max_output_tokens": 2000,
    "expressions_count": 10,
    "max_transcript_segments": 200,  # Limit to avoid token limits
    "min_timestamp": 0,
    "max_timestamp": 7200  # 2 hours
}
```

## Frontend Integration

The timestamp URLs enable click-to-seek functionality:

```javascript
// Frontend: Seek video on timestamp click
function handleTimestampClick(timestampUrl) {
  const urlParams = new URLSearchParams(new URL(timestampUrl).search);
  const timestamp = parseInt(urlParams.get('t'));
  
  // Seek YouTube player
  player.seekTo(timestamp);
}
```

## Future Enhancements

1. **Difficulty ratings**: Rate expressions by proficiency level
2. **Usage frequency**: Track how common each expression is
3. **Similar expressions**: Suggest synonyms or related phrases
4. **Pronunciation guides**: Add phonetic transcriptions
5. **Cultural context**: Explain cultural nuances of expressions
6. **Flashcard export**: Generate Anki flashcards for learning
