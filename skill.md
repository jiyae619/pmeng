---
name: YouTube PM Analysis Multi-Agent System
description: Three specialized agents for extracting YouTube transcripts and analyzing them for PM insights and advanced English expressions
version: 1.0.0
author: PM-ENG Team
tags: [youtube, product-management, english-learning, ai-analysis, multi-agent]
---

# YouTube PM Analysis Multi-Agent System

A specialized skill for analyzing YouTube videos to extract Product Management insights and advanced English expressions using a three-agent architecture.

## Overview

This skill implements a multi-agent system where each agent has a specific responsibility in the YouTube video analysis pipeline:

1. **Transcript Extraction Agent** - Handles YouTube data retrieval and preprocessing
2. **PM Skills Summary Agent** - Analyzes content for actionable PM insights
3. **PM English Analysis Agent** - Identifies advanced business English expressions

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Request                          │
│              (YouTube URL + Analysis Type)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         AGENT 1: Transcript Extraction Agent            │
│                                                          │
│  Responsibilities:                                       │
│  • Validate YouTube URL                                 │
│  • Extract video ID and metadata                        │
│  • Fetch transcript with timestamps                     │
│  • Handle errors (private videos, no transcripts)       │
│  • Format data for downstream agents                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ (Structured Transcript Data)
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│  AGENT 2:        │    │  AGENT 3:        │
│  PM Skills       │    │  PM English      │
│  Summary Agent   │    │  Analysis Agent  │
│                  │    │                  │
│  Analyzes for:   │    │  Identifies:     │
│  • Strategy      │    │  • Executive     │
│  • Leadership    │    │    phrases       │
│  • Metrics       │    │  • Business      │
│  • Frameworks    │    │    idioms        │
│  • Decisions     │    │  • Professional  │
│                  │    │    vocabulary    │
└──────────────────┘    └──────────────────┘
        │                         │
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Aggregated Analysis Results                 │
│                                                          │
│  • 5 PM Insights (title + description)                  │
│  • 7 English Expressions (phrase + example + timestamp) │
│  • Video metadata                                       │
└─────────────────────────────────────────────────────────┘
```

## Agent Specifications

### Agent 1: Transcript Extraction Agent

**Purpose**: Retrieve and preprocess YouTube video data for analysis.

**Technology Stack**:
- Python 3.9+
- `youtube-transcript-api` library
- Regular expressions for URL parsing

**Input**:
```python
{
    "youtube_url": "https://youtube.com/watch?v=VIDEO_ID"
}
```

**Responsibilities**:
1. **URL Validation**: Verify YouTube URL format and extract video ID
2. **Metadata Extraction**: Get video thumbnail, URL, and ID
3. **Transcript Retrieval**: 
   - Prioritize manual English transcripts
   - Fallback to auto-generated transcripts
   - Handle multiple URL formats (youtube.com, youtu.be, embed)
4. **Error Handling**:
   - Transcripts disabled
   - No English transcript available
   - Private/unavailable videos
   - Network errors
5. **Data Formatting**:
   - Structure transcript with timestamps
   - Generate full text version
   - Include language metadata

**Output**:
```python
{
    "video": {
        "id": "VIDEO_ID",
        "thumbnail": "https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg",
        "url": "https://www.youtube.com/watch?v=VIDEO_ID"
    },
    "transcript": [
        {
            "text": "Transcript segment",
            "start": 0.0,
            "duration": 2.5
        }
    ],
    "full_text": "Complete transcript as single string",
    "language": "en"
}
```

**Implementation Reference**: `backend/services/youtube_service.py`

**Key Methods**:
- `extract_video_id(url)` - Extract video ID from various URL formats
- `validate_url(url)` - Validate YouTube URL
- `get_video_metadata(video_id)` - Fetch video metadata
- `get_transcript(video_id)` - Retrieve transcript with timestamps

**Error Handling**:
```python
try:
    transcript = YouTubeService.get_transcript(video_id)
except ValueError as e:
    # Handle: "Transcripts are disabled for this video"
    # Handle: "No English transcript found for this video"
    # Handle: "Video is unavailable or private"
```

---

### Agent 2: PM Skills Summary Agent

**Purpose**: Analyze video content for actionable Product Management insights.

**Technology Stack**:
- Google Gemini Flash (gemini-2.0-flash-exp)
- Structured prompt engineering
- JSON response parsing

**Input**:
```python
{
    "transcript_text": "Full video transcript",
    "video_title": "Optional video title for context"
}
```

**Analysis Focus Areas**:
1. **Product Strategy** - Vision, roadmap, prioritization frameworks
2. **Stakeholder Management** - Communication, alignment, influence
3. **Decision-Making** - Data-driven decisions, trade-offs, frameworks
4. **User Research** - Discovery, validation, customer insights
5. **Metrics & KPIs** - Success metrics, analytics, measurement
6. **Leadership** - Team management, cross-functional collaboration

**Prompt Engineering Strategy**:
- **Specificity**: Request exactly 5 insights (not more, not less)
- **Actionability**: Focus on practical, applicable advice
- **Structure**: Enforce title (5-8 words) + description (2-4 sentences)
- **Context**: Prioritize insights backed by examples/frameworks
- **Format**: Strict JSON schema for consistent parsing

**Output**:
```json
[
    {
        "title": "Data-Driven Prioritization Framework",
        "description": "Use the RICE scoring model (Reach, Impact, Confidence, Effort) to objectively prioritize features. This framework helps PMs make defensible decisions when stakeholders have competing priorities. Apply it during quarterly planning to align teams on what matters most."
    }
]
```

**Configuration**:
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 2000
- **Model**: gemini-2.0-flash-exp

**Implementation Reference**: `backend/services/ai_service.py` → `analyze_pm_insights()`

**Quality Criteria**:
- ✅ Directly applicable to PM work
- ✅ Backed by specific examples or frameworks
- ✅ Strategic or tactical (not generic advice)
- ✅ Relevant to PM career development
- ❌ Avoid: Generic advice, obvious statements, non-PM-specific content

**Example Prompt Structure**:
```
Analyze this YouTube video transcript and extract the most valuable insights for Product Managers.

Video Title: {video_title}
Transcript: {transcript_text}

Instructions:
1. Identify the TOP 5 most practical and actionable insights
2. Focus on: product strategy, stakeholder management, decision-making, user research, metrics, leadership
3. For each insight:
   - Clear, concise title (5-8 words)
   - Description (2-4 sentences) explaining how to apply it

Return ONLY a JSON array with this exact structure:
[{"title": "...", "description": "..."}]
```

---

### Agent 3: PM English Analysis Agent

**Purpose**: Identify advanced business English expressions for professional development.

**Technology Stack**:
- Google Gemini Flash (gemini-2.0-flash-exp)
- Timestamp-aware analysis
- Context preservation

**Input**:
```python
{
    "transcript_data": [
        {
            "text": "Transcript segment",
            "start": 0.0,
            "duration": 2.5
        }
    ],
    "video_id": "VIDEO_ID"
}
```

**Analysis Focus Areas**:
1. **Executive Communication Patterns** - C-suite language, board presentations
2. **Persuasive Language Techniques** - Influence, negotiation, buy-in
3. **Strategic Framing Phrases** - Vision casting, narrative building
4. **Professional Idioms** - Business-appropriate expressions
5. **Sophisticated Vocabulary** - Advanced terminology, precise language

**Expression Selection Criteria**:
- ✅ Professional/business-oriented (not casual)
- ✅ Used by executives, thought leaders, formal contexts
- ✅ Useful for PM presentations, meetings, stakeholder communication
- ✅ Advanced (not common everyday phrases)
- ❌ Avoid: Slang, casual expressions, overly common phrases

**Output**:
```json
[
    {
        "phrase": "Move the needle on key metrics",
        "example": "The speaker emphasized that small optimizations won't move the needle on key metrics, so we need to focus on high-impact initiatives.",
        "timestamp": 245,
        "timestamp_url": "https://www.youtube.com/watch?v=VIDEO_ID&t=245s"
    }
]
```

**Configuration**:
- **Temperature**: 0.7 (balanced creativity and consistency)
- **Max Tokens**: 2000
- **Model**: gemini-2.0-flash-exp
- **Transcript Limit**: First 200 entries (to avoid token limits)

**Implementation Reference**: `backend/services/ai_service.py` → `analyze_english_expressions()`

**Timestamp Processing**:
1. Format transcript with timestamps: `[123s] Transcript text`
2. AI identifies expressions and their timestamps
3. Generate YouTube timestamp URLs: `https://youtube.com/watch?v=ID&t=123s`
4. Enable click-to-seek functionality in frontend

**Example Expressions**:
- "Move the needle" - Make significant impact
- "Table stakes" - Minimum requirements
- "North star metric" - Primary success indicator
- "Align stakeholders" - Build consensus
- "De-risk the initiative" - Reduce uncertainty
- "Socialize the idea" - Build awareness and support
- "Double-click on that" - Examine in detail

---

## Integration & Workflow

### Sequential Processing

```python
# Step 1: Transcript Extraction Agent
youtube_service = YouTubeService()
video_id = youtube_service.extract_video_id(youtube_url)
transcript_result = youtube_service.get_transcript(video_id)
video_metadata = youtube_service.get_video_metadata(video_id)

# Step 2 & 3: Parallel Analysis (PM Skills + English)
ai_service = AIService()

# Agent 2: PM Skills Summary
pm_insights = ai_service.analyze_pm_insights(
    transcript_result['full_text'],
    video_title=None
)

# Agent 3: PM English Analysis
english_expressions = ai_service.analyze_english_expressions(
    transcript_result['transcript'],
    video_id
)

# Aggregate Results
return {
    "success": True,
    "video": video_metadata,
    "pm_insights": pm_insights,
    "english_expressions": english_expressions
}
```

### Error Handling Strategy

**Agent 1 Errors** (Transcript Extraction):
- Invalid URL → Return 400 error with message
- No transcript → Return 400 error with helpful message
- Private video → Return 400 error with explanation

**Agent 2/3 Errors** (AI Analysis):
- JSON parsing failure → Return 500 error with details
- API timeout → Retry with exponential backoff
- Rate limit → Queue request or return 429 error

## Environment Setup

### Required Dependencies

```txt
# Transcript Extraction Agent
youtube-transcript-api==0.6.2

# AI Analysis Agents (2 & 3)
google-generativeai==0.8.3

# Supporting Libraries
python-dotenv==1.0.1
Flask==3.1.0
flask-cors==5.0.0
```

### Environment Variables

```bash
# Required for Agents 2 & 3
GOOGLE_API_KEY=your_api_key_here

# Get your key from:
# https://aistudio.google.com/app/apikey
```

## Usage Examples

### Basic Usage

```python
from services.youtube_service import YouTubeService
from services.ai_service import AIService

# Initialize agents
youtube_service = YouTubeService()
ai_service = AIService()

# Agent 1: Extract transcript
video_id = youtube_service.extract_video_id("https://youtube.com/watch?v=dQw4w9WgXcQ")
transcript = youtube_service.get_transcript(video_id)

# Agent 2: Analyze PM insights
insights = ai_service.analyze_pm_insights(transcript['full_text'])
print(f"Found {len(insights)} PM insights")

# Agent 3: Analyze English expressions
expressions = ai_service.analyze_english_expressions(transcript['transcript'], video_id)
print(f"Found {len(expressions)} advanced expressions")
```

### API Endpoint Integration

```python
@app.route('/api/analyze', methods=['POST'])
def analyze_video():
    youtube_url = request.json.get('youtube_url')
    
    # Agent 1: Transcript Extraction
    video_id = youtube_service.extract_video_id(youtube_url)
    transcript = youtube_service.get_transcript(video_id)
    metadata = youtube_service.get_video_metadata(video_id)
    
    # Agents 2 & 3: Parallel Analysis
    pm_insights = ai_service.analyze_pm_insights(transcript['full_text'])
    english_expressions = ai_service.analyze_english_expressions(
        transcript['transcript'], 
        video_id
    )
    
    return jsonify({
        "success": True,
        "video": metadata,
        "pm_insights": pm_insights,
        "english_expressions": english_expressions
    })
```

## Performance Characteristics

| Agent | Avg Time | Token Usage | Cost (per analysis) |
|-------|----------|-------------|---------------------|
| Agent 1: Transcript Extraction | 2-5s | N/A | Free |
| Agent 2: PM Skills Summary | 10-15s | ~1500 tokens | ~$0.0001 |
| Agent 3: PM English Analysis | 10-15s | ~1500 tokens | ~$0.0001 |
| **Total Pipeline** | **20-30s** | **~3000 tokens** | **~$0.0002** |

*Based on Google Gemini Flash pricing: $0.075 per 1M input tokens, $0.30 per 1M output tokens*

## Best Practices

### Agent 1: Transcript Extraction
1. **Always validate URLs** before attempting extraction
2. **Handle errors gracefully** with user-friendly messages
3. **Cache transcripts** for repeated analysis (optional)
4. **Limit transcript length** for very long videos (>2 hours)

### Agent 2: PM Skills Summary
1. **Provide video title** when available for better context
2. **Validate JSON response** before returning to frontend
3. **Limit to 5 insights** for focused, high-quality results
4. **Filter generic advice** - prioritize actionable, specific insights

### Agent 3: PM English Analysis
1. **Limit transcript to first 200 entries** to avoid token limits
2. **Preserve timestamps** for click-to-seek functionality
3. **Focus on business context** - avoid casual expressions
4. **Validate timestamp URLs** are properly formatted

## Limitations

1. **Language Support**: Currently only English transcripts
2. **Video Length**: Very long videos (>2 hours) may hit token limits
3. **Transcript Availability**: Requires videos to have English transcripts
4. **Rate Limits**: Subject to Google API rate limits
5. **Context Window**: Limited to first ~10-15 minutes for English analysis

## Future Enhancements

1. **Multi-language Support**: Extend to other languages
2. **Caching Layer**: Store analyzed videos to reduce API costs
3. **Batch Processing**: Analyze multiple videos in parallel
4. **Custom Prompts**: Allow users to customize analysis focus
5. **Sentiment Analysis**: Add emotional tone detection
6. **Speaker Diarization**: Identify different speakers in video
7. **Summary Generation**: Create executive summaries of videos

## Troubleshooting

### Agent 1 Issues

**Problem**: "No English transcript found"
- **Solution**: Video may only have auto-generated captions in other languages
- **Workaround**: Request video owner to add English captions

**Problem**: "Transcripts are disabled"
- **Solution**: Video owner has disabled captions
- **Workaround**: Use a different video

### Agent 2/3 Issues

**Problem**: JSON parsing errors
- **Solution**: AI response may not be valid JSON
- **Workaround**: Retry with same prompt or adjust temperature

**Problem**: Rate limit errors
- **Solution**: Too many requests to Google API
- **Workaround**: Implement exponential backoff or request queuing

## Related Resources

- [YouTube Transcript API Documentation](https://github.com/jdepoix/youtube-transcript-api)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [PM-ENG Application Repository](file:///Users/jiyaechoi/dev/pmeng)

## License

MIT License - See project LICENSE file for details.
