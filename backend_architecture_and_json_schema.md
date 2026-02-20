# PMENG Backend Architecture & Integration Plan

## 1. Key Script Analysis

### `backend/app.py`
The main Flask server routing frontend requests to the proper backend services.
- **`health_check()`**: `/api/health` endpoint.
- **`analyze_video()`**: `/api/analyze` endpoint. Validates YouTube URL, fetches metadata, retrieves transcripts, and dispatches to Gemini for PM and English analyses.

### `backend/services/youtube_service.py`
Interacts with YouTube Data API and captions.
- **`extract_video_id()`**: Parses raw video ID from any YouTube URL string.
- **`get_video_metadata()`**: Fetches title, channel, and thumbnail via Google API key.
- **`get_transcript()`**: CURRENTLY uses `youtube-transcript-api` to pull raw captions and blindly smashes them into one single un-timestamped paragraph (`full_text`). This causes massive AI timestamp hallucinations.
- **`validate_url()`**: Fast check for valid URL structure.

### `backend/services/ai_service.py`
Interfaces with Google's Gemini LLM.
- **`analyze_pm_insights()`**: Prompts Gemini to generate 5 Product Management insights from the transcript.
- **`analyze_english_expressions()`**: Prompts Gemini to locate 7 advanced business English phrases within the transcript.
- **`sanitize_json_response()` & `parse_json_with_retry()`**: Critical safety shields. They violently force Gemini's chaotic markdown outputs into valid JSON so the React frontend `JSON.parse()` doesn't crash.

### *New File:* `transcript-api/youtube_transcript_extractor.py`
- **`format_timestamp()`**: A brand new utility that beautifully converts raw seconds into readable timestamps (e.g., `[1:23]`).
- **`extract_transcript()`**: Iterates through caption segments and intelligently builds a *timestamped* transcript document block.

---

## 2. Integration and Migration Strategy

We will integrate the new script by merging its logic into the existing service.
1. **Delete `auth_service.py`**: It is completely unused since we use simple API keys for public video metadata and captions. Delete it to reduce technical debt.
2. **Merge `youtube_transcript_extractor.py`**: Port the excellent timestamping logic directly into `backend/services/youtube_service.py`.
3. **Upgrade `get_transcript()`**: Instead of returning a wall of raw text, it will now return the beautifully structured timestamped text.
4. **Upgrade `ai_service.py`**: When Gemini receives this new timestamped block, it will read the literal timestamps and pass 100% accurate, non-hallucinated timecodes to the frontend.

---

## 3. Frontend JSON Schema

When the React frontend calls the `/api/analyze` endpoint, it receives the following strict JSON schema.

### Main Response Payload (`/api/analyze`)
```json
{
  "success": true,
  "video": {
    "id": "dQw4w9WgXcQ",
    "title": "Video Title from YouTube",
    "thumbnail": "https://img.youtube.com/vi/...",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "channel": "Channel Name"
  },
  "pm_insights": [ ... ],
  "english_expressions": [ ... ]
}
```

### `pm_insights` Inner Schema
An array of exactly 5 JSON objects representing product management takeaways:
```json
[
  {
    "title": "Actionable Insight Title (5-8 words)",
    "description": "2-4 sentence explanation on how Product Managers can apply this."
  }
]
```

### `english_expressions` Inner Schema
An array of exactly 7 JSON objects representing advanced business English expressions:
```json
[
  {
    "phrase": "The exact expression spoken in the video",
    "example": "How it was used in context within the video",
    "timestamp": 123
  }
]
```
*(With the new integration plan, the `timestamp` field will finally be populated by real numbers read from the transcript, rather than Gemini attempting to guess the timestamp!)*
