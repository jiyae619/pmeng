---
name: Mother Agent - YouTube Analysis Orchestrator
type: orchestrator
version: 1.0.0
dependencies: [agent_1_transcript_extraction]
outputs_to: [agent_2_pm_skills, agent_3_english_analysis]
---

# Mother Agent: YouTube Analysis Orchestrator

## Role
The Mother Agent is the **primary orchestrator** of the YouTube analysis pipeline. It coordinates all downstream agents, manages the workflow, handles errors, and ensures data flows correctly through the system.

## Responsibilities

### 1. Request Validation
- Validate incoming YouTube URL
- Check request format and parameters
- Authenticate API requests (if applicable)
- Rate limit enforcement

### 2. Workflow Orchestration
- Initialize Agent 1 (Transcript Extraction)
- Wait for Agent 1 completion
- Validate Agent 1 output
- Trigger parallel execution of Agent 2 and Agent 3
- Monitor subagent progress
- Handle timeouts and retries

### 3. Error Management
- Catch and handle errors from all child agents
- Provide user-friendly error messages
- Implement retry logic with exponential backoff
- Log errors for debugging

### 4. Data Flow Management
- Receive user request
- Pass YouTube URL to Agent 1
- Distribute Agent 1 output to Agents 2 & 3
- Collect results from Agents 2 & 3
- Pass combined results to Agent 4 (Synthesis)
- Return final output to user

## Input Schema

```json
{
  "youtube_url": "https://youtube.com/watch?v=VIDEO_ID",
  "options": {
    "include_pm_insights": true,
    "include_english_analysis": true,
    "max_transcript_length": 200
  }
}
```

## Output Schema

```json
{
  "success": true,
  "request_id": "uuid-v4",
  "processing_time_ms": 25000,
  "video": {
    "id": "VIDEO_ID",
    "thumbnail": "https://...",
    "url": "https://..."
  },
  "analysis": {
    "pm_insights": [...],
    "english_expressions": [...],
    "synthesis": {...}
  },
  "metadata": {
    "transcript_length": 5000,
    "language": "en",
    "agents_used": ["agent_1", "agent_2", "agent_3", "agent_4"]
  }
}
```

## Workflow Logic

```python
def orchestrate_analysis(youtube_url, options):
    """
    Mother Agent orchestration logic.
    """
    # Step 1: Validate request
    if not validate_youtube_url(youtube_url):
        return error_response("Invalid YouTube URL")
    
    # Step 2: Execute Agent 1 (Transcript Extraction)
    try:
        agent_1_result = execute_agent_1(youtube_url)
    except Exception as e:
        return error_response(f"Transcript extraction failed: {e}")
    
    # Step 3: Validate Agent 1 output
    if not agent_1_result.get('transcript'):
        return error_response("No transcript available")
    
    # Step 4: Execute Agents 2 & 3 in parallel
    results = {}
    
    if options.get('include_pm_insights', True):
        try:
            results['pm_insights'] = execute_agent_2(
                agent_1_result['full_text'],
                agent_1_result.get('video_title')
            )
        except Exception as e:
            results['pm_insights_error'] = str(e)
    
    if options.get('include_english_analysis', True):
        try:
            results['english_expressions'] = execute_agent_3(
                agent_1_result['transcript'],
                agent_1_result['video_id']
            )
        except Exception as e:
            results['english_expressions_error'] = str(e)
    
    # Step 5: Execute Agent 4 (Synthesis)
    try:
        synthesis = execute_agent_4(
            results.get('pm_insights'),
            results.get('english_expressions'),
            agent_1_result
        )
        results['synthesis'] = synthesis
    except Exception as e:
        results['synthesis_error'] = str(e)
    
    # Step 6: Return aggregated results
    return {
        "success": True,
        "video": agent_1_result['video'],
        "analysis": results,
        "metadata": {
            "transcript_length": len(agent_1_result['full_text']),
            "language": agent_1_result.get('language', 'en'),
            "agents_used": ["agent_1", "agent_2", "agent_3", "agent_4"]
        }
    }
```

## Error Handling Strategy

| Error Type | Handling Strategy | User Message |
|------------|------------------|--------------|
| Invalid URL | Return 400 immediately | "Please provide a valid YouTube URL" |
| No transcript | Return 400 after Agent 1 | "This video doesn't have English transcripts" |
| Private video | Return 400 after Agent 1 | "This video is private or unavailable" |
| Agent 2/3 failure | Continue with partial results | "Analysis partially completed" |
| Agent 4 failure | Return results without synthesis | "Synthesis unavailable" |
| Timeout | Retry once, then fail | "Analysis timed out, please try again" |

## Performance Monitoring

The Mother Agent tracks:
- Total processing time
- Individual agent execution times
- Success/failure rates
- Error types and frequencies
- Token usage (for AI agents)

## State Management

```python
class MotherAgentState:
    def __init__(self, request_id):
        self.request_id = request_id
        self.status = "initialized"
        self.start_time = time.time()
        self.agent_results = {}
        self.errors = []
    
    def update_status(self, status):
        self.status = status
        self.last_updated = time.time()
    
    def add_agent_result(self, agent_name, result):
        self.agent_results[agent_name] = result
    
    def add_error(self, agent_name, error):
        self.errors.append({
            "agent": agent_name,
            "error": str(error),
            "timestamp": time.time()
        })
```

## Integration Points

### With Agent 1 (Transcript Extraction)
```python
# Mother Agent calls Agent 1
from agents.agent_1_transcript_extraction import TranscriptExtractionAgent

agent_1 = TranscriptExtractionAgent()
result = agent_1.execute(youtube_url)
```

### With Agents 2 & 3 (Subagents)
```python
# Mother Agent calls Agents 2 & 3 in parallel
from concurrent.futures import ThreadPoolExecutor
from agents.agent_2_pm_skills import PMSkillsAgent
from agents.agent_3_english_analysis import EnglishAnalysisAgent

with ThreadPoolExecutor(max_workers=2) as executor:
    future_pm = executor.submit(agent_2.execute, transcript_text)
    future_english = executor.submit(agent_3.execute, transcript_data, video_id)
    
    pm_insights = future_pm.result(timeout=30)
    english_expressions = future_english.result(timeout=30)
```

### With Agent 4 (Synthesis)
```python
# Mother Agent calls Agent 4
from agents.agent_4_synthesis import SynthesisAgent

agent_4 = SynthesisAgent()
synthesis = agent_4.execute(pm_insights, english_expressions, metadata)
```

## Configuration

```python
MOTHER_AGENT_CONFIG = {
    "max_retries": 1,
    "timeout_seconds": 60,
    "parallel_execution": True,
    "enable_synthesis": True,
    "log_level": "INFO"
}
```

## Logging

```python
import logging

logger = logging.getLogger("MotherAgent")

# Log workflow progression
logger.info(f"Starting analysis for video: {video_id}")
logger.info(f"Agent 1 completed in {duration}s")
logger.info(f"Agents 2 & 3 running in parallel")
logger.info(f"Agent 4 synthesis complete")
logger.info(f"Total processing time: {total_time}s")
```

## Implementation Reference

**File**: `backend/app.py` → `analyze_video()` endpoint

The Mother Agent logic is currently implemented in the Flask API endpoint. For a more modular architecture, consider extracting into:

```
backend/agents/
├── mother_agent.py          # This agent
├── agent_1_transcript.py    # Transcript extraction
├── agent_2_pm_skills.py     # PM skills subagent
├── agent_3_english.py       # English analysis subagent
└── agent_4_synthesis.py     # Synthesis agent
```

## Future Enhancements

1. **Async/Await**: Use asyncio for better concurrency
2. **Queue System**: Implement job queue for long-running analyses
3. **Caching**: Cache Agent 1 results to avoid re-fetching transcripts
4. **Webhooks**: Support webhook callbacks for async processing
5. **Batch Processing**: Analyze multiple videos in one request
6. **Priority Queue**: Prioritize requests based on user tier
7. **Circuit Breaker**: Prevent cascading failures

## Dependencies

- Python 3.9+
- `concurrent.futures` for parallel execution
- `logging` for monitoring
- `time` for performance tracking
- All child agents (1, 2, 3, 4)
