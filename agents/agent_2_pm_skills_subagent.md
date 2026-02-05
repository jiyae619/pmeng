---
name: Agent 2 - PM Skills Summary Subagent
type: ai_analyzer
version: 1.0.0
parent: mother_agent
inputs_from: [agent_1_transcript_extraction]
outputs_to: [agent_4_synthesis]
---

# Agent 2: PM Skills Summary Subagent

## Role
**AI Analyzer (Subagent)** - Analyzes video transcripts to extract actionable Product Management insights and career development advice.

## Position in Hierarchy
- **Parent**: Mother Agent (Orchestrator)
- **Sibling**: Agent 3 (English Analysis Subagent)
- **Inputs from**: Agent 1 (Transcript Extraction)
- **Outputs to**: Agent 4 (Synthesis Agent)

## Responsibilities

1. **Content Analysis**
   - Analyze full transcript text for PM-relevant content
   - Identify actionable insights and frameworks
   - Extract strategic and tactical advice

2. **Insight Extraction**
   - Generate exactly 5 high-quality insights
   - Focus on practical, applicable knowledge
   - Prioritize career development value

3. **Structured Output**
   - Format insights with clear titles (5-8 words)
   - Provide detailed descriptions (2-4 sentences)
   - Return valid JSON for downstream processing

4. **Quality Assurance**
   - Validate insights are PM-specific (not generic)
   - Ensure insights are backed by examples/frameworks
   - Filter out obvious or trivial advice

## Input from Agent 1

```json
{
  "full_text": "Complete transcript as single string...",
  "video_title": "Optional video title for context",
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
  "pm_insights": [
    {
      "title": "Data-Driven Prioritization Framework",
      "description": "Use the RICE scoring model (Reach, Impact, Confidence, Effort) to objectively prioritize features. This framework helps PMs make defensible decisions when stakeholders have competing priorities. Apply it during quarterly planning to align teams on what matters most."
    },
    {
      "title": "Stakeholder Alignment Through Storytelling",
      "description": "Frame product decisions as narratives with clear problem statements, user impact, and business outcomes. This approach builds emotional buy-in beyond just data. Use the 'situation-complication-resolution' structure in executive presentations."
    }
  ],
  "metadata": {
    "analysis_time_ms": 12000,
    "model": "gemini-2.0-flash-exp",
    "token_usage": 1500
  }
}
```

## Data Flow

```
Agent 1 (Transcript)
     │
     │ (full_text, video_title)
     ▼
┌────────────────────────────┐
│  Agent 2: PM Skills        │
│  Summary Subagent          │
│                            │
│  1. Receive transcript     │
│  2. Analyze with AI        │
│  3. Extract 5 insights     │
│  4. Format as JSON         │
└────────────────────────────┘
     │
     │ (pm_insights array)
     ▼
Agent 4 (Synthesis)
```

## AI Analysis Strategy

### Focus Areas
1. **Product Strategy** - Vision, roadmap, prioritization
2. **Stakeholder Management** - Communication, alignment, influence
3. **Decision-Making** - Frameworks, trade-offs, data-driven choices
4. **User Research** - Discovery, validation, customer insights
5. **Metrics & KPIs** - Success metrics, analytics, measurement
6. **Leadership** - Team management, cross-functional collaboration

### Prompt Engineering

```python
def generate_pm_insights_prompt(transcript_text, video_title=None):
    """Generate optimized prompt for PM insights extraction."""
    
    return f"""Analyze this YouTube video transcript and extract the most valuable insights for Product Managers.

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
```

## Implementation

```python
class PMSkillsSubagent:
    """Agent 2: PM Skills Summary Subagent"""
    
    def __init__(self):
        self.ai_service = AIService()
    
    def execute(self, transcript_text, video_title=None):
        """
        Execute PM skills analysis.
        
        Args:
            transcript_text: Full transcript from Agent 1
            video_title: Optional video title for context
            
        Returns:
            Structured PM insights
        """
        start_time = time.time()
        
        try:
            # Call AI service for analysis
            insights = self.ai_service.analyze_pm_insights(
                transcript_text,
                video_title
            )
            
            # Validate output
            if not isinstance(insights, list) or len(insights) != 5:
                raise ValueError("Expected exactly 5 insights")
            
            # Calculate processing time
            processing_time = (time.time() - start_time) * 1000
            
            return {
                "success": True,
                "pm_insights": insights,
                "metadata": {
                    "analysis_time_ms": processing_time,
                    "model": "gemini-2.0-flash-exp",
                    "insights_count": len(insights)
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "pm_insights": []
            }
```

## Quality Criteria

### ✅ Good Insights
- "Use RICE framework for feature prioritization"
- "Build stakeholder alignment through data storytelling"
- "Implement weekly user interviews for continuous discovery"
- "Define North Star metric to align team objectives"
- "Use pre-mortems to identify project risks early"

### ❌ Poor Insights
- "Communication is important" (too generic)
- "Always listen to users" (obvious)
- "Work hard and be passionate" (not PM-specific)
- "Use agile methodology" (too vague)
- "Be a good leader" (not actionable)

## Performance Metrics

- **Average execution time**: 10-15 seconds
- **Success rate**: ~98% (depends on AI API availability)
- **Token usage**: ~1500 tokens per analysis
- **Cost per analysis**: ~$0.0001 (Google Gemini Flash)

## Error Handling

| Error Type | Cause | Action |
|------------|-------|--------|
| `JSONDecodeError` | Invalid AI response | Retry once, then fail |
| `TimeoutError` | AI API timeout | Return partial results if available |
| `RateLimitError` | API rate limit hit | Queue request or return error |
| `ValidationError` | Wrong number of insights | Trim or pad to 5 insights |

## Dependencies

```python
# Required libraries
import google.generativeai as genai
import json
import time
```

## Testing

```python
def test_agent_2():
    agent = PMSkillsSubagent()
    
    # Test with sample transcript
    transcript = "In this video, we discuss the RICE prioritization framework..."
    result = agent.execute(transcript, "PM Prioritization Frameworks")
    
    assert result['success'] == True
    assert len(result['pm_insights']) == 5
    assert all('title' in insight for insight in result['pm_insights'])
    assert all('description' in insight for insight in result['pm_insights'])
```

## Implementation Reference

**File**: `backend/services/ai_service.py` → `analyze_pm_insights()`

## Configuration

```python
AGENT_2_CONFIG = {
    "model": "gemini-2.0-flash-exp",
    "temperature": 0.7,
    "max_output_tokens": 2000,
    "insights_count": 5,
    "min_description_length": 100,
    "max_description_length": 400
}
```

## Future Enhancements

1. **Category tagging**: Tag insights by category (strategy, metrics, etc.)
2. **Difficulty levels**: Rate insights by experience level (junior, senior, etc.)
3. **Related resources**: Link to relevant articles or frameworks
4. **Confidence scores**: Rate confidence in each insight
5. **Personalization**: Customize insights based on user's PM experience level
