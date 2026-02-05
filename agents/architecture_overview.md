---
name: Multi-Agent Architecture Overview
version: 1.0.0
created: 2026-02-04
---

# YouTube PM Analysis - Multi-Agent Architecture

## System Overview

A hierarchical multi-agent system for analyzing YouTube videos to extract Product Management insights and advanced English expressions.

## Architecture Diagram

```
                        ┌─────────────────────────────────┐
                        │       USER REQUEST              │
                        │   (YouTube URL + Options)       │
                        └────────────┬────────────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────────────┐
                        │     MOTHER AGENT                │
                        │   (Orchestrator)                │
                        │                                 │
                        │  • Validate request             │
                        │  • Coordinate workflow          │
                        │  • Handle errors                │
                        │  • Aggregate results            │
                        └────────────┬────────────────────┘
                                     │
                                     │ (YouTube URL)
                                     ▼
                        ┌─────────────────────────────────┐
                        │     AGENT 1                     │
                        │   Transcript Extraction         │
                        │   (Data Processor)              │
                        │                                 │
                        │  • Validate YouTube URL         │
                        │  • Extract video ID             │
                        │  • Fetch transcript             │
                        │  • Format with timestamps       │
                        └────────────┬────────────────────┘
                                     │
                                     │ (Structured Transcript)
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
        ┌──────────────────────┐        ┌──────────────────────┐
        │   AGENT 2            │        │   AGENT 3            │
        │   PM Skills Summary  │        │   English Analysis   │
        │   (AI Subagent)      │        │   (AI Subagent)      │
        │                      │        │                      │
        │  • Analyze content   │        │  • Identify phrases  │
        │  • Extract insights  │        │  • Preserve context  │
        │  • Format as JSON    │        │  • Generate URLs     │
        └──────────┬───────────┘        └──────────┬───────────┘
                   │                               │
                   │ (PM Insights)                 │ (English Expressions)
                   │                               │
                   └────────────┬──────────────────┘
                                │
                                ▼
                   ┌─────────────────────────────────┐
                   │     AGENT 4                     │
                   │   Synthesis Agent               │
                   │   (Synthesizer)                 │
                   │                                 │
                   │  • Combine results              │
                   │  • Find connections             │
                   │  • Generate summary             │
                   │  • Create action items          │
                   └────────────┬────────────────────┘
                                │
                                │ (Enriched Analysis)
                                ▼
                   ┌─────────────────────────────────┐
                   │     MOTHER AGENT                │
                   │   (Final Response)              │
                   └────────────┬────────────────────┘
                                │
                                ▼
                   ┌─────────────────────────────────┐
                   │       USER RESPONSE             │
                   │   (Complete Analysis)           │
                   └─────────────────────────────────┘
```

## Agent Hierarchy

### Mother Agent (Orchestrator)
- **Type**: Orchestrator
- **Role**: Coordinates all agents, manages workflow, handles errors
- **Dependencies**: All child agents (1, 2, 3, 4)
- **Documentation**: `agents/mother_agent.md`

### Agent 1 (Transcript Extraction)
- **Type**: Data Processor
- **Role**: Retrieves and preprocesses YouTube transcripts
- **Parent**: Mother Agent
- **Outputs to**: Agents 2, 3
- **Documentation**: `agents/agent_1_transcript_extraction.md`

### Agent 2 (PM Skills Subagent)
- **Type**: AI Analyzer (Subagent)
- **Role**: Extracts PM insights from transcripts
- **Parent**: Mother Agent
- **Inputs from**: Agent 1
- **Outputs to**: Agent 4
- **Documentation**: `agents/agent_2_pm_skills_subagent.md`

### Agent 3 (English Analysis Subagent)
- **Type**: AI Analyzer (Subagent)
- **Role**: Identifies advanced English expressions
- **Parent**: Mother Agent
- **Inputs from**: Agent 1
- **Outputs to**: Agent 4
- **Documentation**: `agents/agent_3_english_analysis_subagent.md`

### Agent 4 (Synthesis Agent)
- **Type**: Synthesizer
- **Role**: Combines and enriches all analysis results
- **Parent**: Mother Agent
- **Inputs from**: Agents 2, 3, 1 (metadata)
- **Outputs to**: Mother Agent
- **Documentation**: `agents/agent_4_synthesis.md`

## Data Flow

### Phase 1: Request Validation
```
User → Mother Agent
  ↓
Validate YouTube URL
  ↓
Initialize workflow state
```

### Phase 2: Transcript Extraction
```
Mother Agent → Agent 1
  ↓
Extract video ID
  ↓
Fetch transcript with timestamps
  ↓
Format structured data
  ↓
Return to Mother Agent
```

### Phase 3: Parallel Analysis
```
Mother Agent
  ├─→ Agent 2 (PM Skills)
  │     ↓
  │   Analyze transcript
  │     ↓
  │   Extract 5 insights
  │
  └─→ Agent 3 (English)
        ↓
      Analyze transcript
        ↓
      Extract 7 expressions
```

### Phase 4: Synthesis
```
Agent 2 + Agent 3 → Agent 4
  ↓
Combine results
  ↓
Find connections
  ↓
Generate summary
  ↓
Create action items
  ↓
Return to Mother Agent
```

### Phase 5: Response
```
Mother Agent
  ↓
Aggregate all results
  ↓
Add metadata
  ↓
Return to User
```

## Communication Protocol

### Request Format
```json
{
  "youtube_url": "https://youtube.com/watch?v=VIDEO_ID",
  "options": {
    "include_pm_insights": true,
    "include_english_analysis": true,
    "enable_synthesis": true,
    "max_transcript_length": 200
  }
}
```

### Response Format
```json
{
  "success": true,
  "request_id": "uuid",
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

## Performance Characteristics

| Agent | Execution Time | Token Usage | Cost | Parallelizable |
|-------|---------------|-------------|------|----------------|
| Mother Agent | ~100ms | 0 | Free | N/A |
| Agent 1 | 2-5s | 0 | Free | No |
| Agent 2 | 10-15s | ~1500 | ~$0.0001 | Yes |
| Agent 3 | 10-15s | ~1600 | ~$0.0001 | Yes |
| Agent 4 | 200-500ms | 0 | Free | No |
| **Total** | **20-30s** | **~3100** | **~$0.0002** | **Partial** |

## Error Handling Strategy

### Cascading Failures
- **Agent 1 fails** → Entire pipeline stops, return 400 error
- **Agent 2 fails** → Continue with Agent 3, partial results
- **Agent 3 fails** → Continue with Agent 2, partial results
- **Agent 4 fails** → Return results without synthesis

### Retry Logic
- **Network errors**: Retry once with exponential backoff
- **AI timeouts**: Retry once, then fail gracefully
- **Rate limits**: Queue request or return 429 error

## Technology Stack

### Mother Agent & Agent 1
- Python 3.9+
- `youtube-transcript-api` for transcript extraction
- `concurrent.futures` for parallel execution

### Agents 2 & 3 (AI Subagents)
- Google Gemini Flash (gemini-2.0-flash-exp)
- `google-generativeai` SDK
- Structured prompt engineering

### Agent 4 (Synthesis)
- Pure Python logic (no AI)
- Pattern matching and text analysis

## Implementation Status

| Component | Status | File Location |
|-----------|--------|---------------|
| Mother Agent | ⚠️ Partially implemented | `backend/app.py` |
| Agent 1 | ✅ Implemented | `backend/services/youtube_service.py` |
| Agent 2 | ✅ Implemented | `backend/services/ai_service.py` |
| Agent 3 | ✅ Implemented | `backend/services/ai_service.py` |
| Agent 4 | ❌ Not implemented | To be created |

## Recommended Refactoring

### Current Structure
```
backend/
├── app.py                    # Contains Mother Agent logic
├── services/
│   ├── youtube_service.py    # Agent 1
│   └── ai_service.py         # Agents 2 & 3
```

### Proposed Structure
```
backend/
├── app.py                    # Flask API routes
├── agents/
│   ├── mother_agent.py       # Orchestrator
│   ├── agent_1_transcript.py # Transcript extraction
│   ├── agent_2_pm_skills.py  # PM skills subagent
│   ├── agent_3_english.py    # English analysis subagent
│   └── agent_4_synthesis.py  # Synthesis agent
├── services/
│   ├── youtube_service.py    # YouTube API wrapper
│   └── ai_service.py         # Google Gemini wrapper
```

## Benefits of Multi-Agent Architecture

### 1. Modularity
- Each agent has a single, well-defined responsibility
- Easy to test agents independently
- Simple to add new agents or modify existing ones

### 2. Scalability
- Agents 2 & 3 can run in parallel
- Easy to distribute across multiple servers
- Can add more analysis agents without changing core logic

### 3. Maintainability
- Clear separation of concerns
- Easy to debug specific agent failures
- Simple to update individual agents

### 4. Flexibility
- Can enable/disable specific agents based on user preferences
- Easy to add new analysis types (e.g., sentiment analysis)
- Simple to swap AI models or providers

### 5. Resilience
- Partial failures don't break entire system
- Graceful degradation when agents fail
- Clear error boundaries

## Future Enhancements

### Additional Agents
1. **Agent 5: Sentiment Analysis** - Analyze emotional tone
2. **Agent 6: Speaker Diarization** - Identify different speakers
3. **Agent 7: Summary Generator** - Create executive summaries
4. **Agent 8: Resource Linker** - Find related articles/videos

### Orchestration Improvements
1. **Async/Await**: Use asyncio for better concurrency
2. **Queue System**: Implement job queue for long-running tasks
3. **Caching Layer**: Cache Agent 1 results to avoid re-fetching
4. **Circuit Breaker**: Prevent cascading failures
5. **Health Checks**: Monitor agent availability

### Synthesis Enhancements
1. **AI-Powered Synthesis**: Use LLM for richer connections
2. **Personalization**: Customize based on user profile
3. **Progress Tracking**: Track user's learning progress
4. **Spaced Repetition**: Schedule review reminders

## Testing Strategy

### Unit Tests
- Test each agent independently
- Mock dependencies (YouTube API, Google API)
- Verify input/output schemas

### Integration Tests
- Test agent communication
- Verify data flow between agents
- Test error propagation

### End-to-End Tests
- Test complete workflow
- Verify final output format
- Test with real YouTube videos

## Monitoring & Observability

### Metrics to Track
- Agent execution times
- Success/failure rates
- Token usage and costs
- Error types and frequencies
- User satisfaction scores

### Logging Strategy
```python
logger.info(f"Mother Agent: Starting analysis for {video_id}")
logger.info(f"Agent 1: Transcript extracted in {duration}s")
logger.info(f"Agents 2 & 3: Running in parallel")
logger.info(f"Agent 4: Synthesis complete")
logger.info(f"Mother Agent: Total time {total_time}s")
```

## Documentation Index

1. **Mother Agent**: `agents/mother_agent.md`
2. **Agent 1 (Transcript)**: `agents/agent_1_transcript_extraction.md`
3. **Agent 2 (PM Skills)**: `agents/agent_2_pm_skills_subagent.md`
4. **Agent 3 (English)**: `agents/agent_3_english_analysis_subagent.md`
5. **Agent 4 (Synthesis)**: `agents/agent_4_synthesis.md`
6. **Architecture Overview**: `agents/architecture_overview.md` (this file)

## Quick Start

### Running the System
```bash
# Start backend (Mother Agent + all child agents)
cd backend
python3 app.py

# Make request
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"youtube_url": "https://youtube.com/watch?v=VIDEO_ID"}'
```

### Response Time Breakdown
- Request validation: ~10ms
- Agent 1 (Transcript): 2-5s
- Agents 2 & 3 (Parallel): 10-15s
- Agent 4 (Synthesis): 200-500ms
- Response formatting: ~10ms
- **Total**: 20-30s

## License

MIT License - See project LICENSE file for details.
