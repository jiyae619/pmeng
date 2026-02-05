---
name: Agent 4 - Synthesis Agent
type: synthesizer
version: 1.0.0
parent: mother_agent
inputs_from: [agent_2_pm_skills, agent_3_english_analysis]
outputs_to: [mother_agent]
---

# Agent 4: Synthesis Agent

## Role
**Synthesizer** - Combines and enriches outputs from Agent 2 (PM Skills) and Agent 3 (English Analysis) to create a cohesive, actionable summary for the user.

## Position in Hierarchy
- **Parent**: Mother Agent (Orchestrator)
- **Inputs from**: Agent 2 (PM Skills), Agent 3 (English Analysis), Agent 1 (Metadata)
- **Outputs to**: Mother Agent (final response to user)

## Responsibilities

1. **Data Aggregation**
   - Combine PM insights, questions and English expressions
   - Merge metadata from all agents
   - Preserve all structured data

2. **Cross-Analysis Synthesis**
   - Identify connections between PM insights, questions and English expressions
   - Generate executive summary
   - Highlight key themes and patterns

3. **Actionable Recommendations**
   - Create prioritized action items
   - Suggest learning paths
   - Recommend next steps for the user

4. **Quality Enhancement**
   - Add context and explanations
   - Provide usage examples
   - Enrich with additional resources

## Input from Agents 2 & 3

```json
{
  "pm_insights": [
    {
      "title": "Data-Driven Prioritization Framework",
      "description": "Use the RICE scoring model..."
    }
  ],
  "questions": [
    "How can I apply the RICE framework to my current product roadmap?",
    "What metrics should I track to measure stakeholder alignment?"
  ],
  "english_expressions": [
    {
      "phrase": "Move the needle",
      "example": "We need to move the needle on metrics...",
      "timestamp": 125,
      "timestamp_url": "https://..."
    }
  ],
  "video_metadata": {
    "id": "VIDEO_ID",
    "thumbnail": "https://...",
    "url": "https://...",
    "language": "en",
    "total_segments": 450
  }
}
```

## Output to Mother Agent

```json
{
  "success": true,
  "synthesis": {
    "executive_summary": "This video provides 5 actionable PM insights focused on prioritization, stakeholder management, and metrics, along with 2 thought-provoking questions to apply these concepts. It also demonstrates 10 advanced business expressions commonly used in executive communication.",
    "key_themes": [
      "Data-driven decision making",
      "Stakeholder alignment",
      "Executive communication"
    ],
    "connections": [
      {
        "pm_insight": "Data-Driven Prioritization Framework",
        "related_expression": "Move the needle",
        "connection": "The RICE framework helps identify which initiatives will 'move the needle' on key business metrics."
      }
    ],
    "action_items": [
      {
        "priority": "high",
        "action": "Implement RICE framework for next sprint planning",
        "related_insight": "Data-Driven Prioritization Framework"
      },
      {
        "priority": "medium",
        "action": "Practice using 'move the needle' in next stakeholder presentation",
        "related_expression": "Move the needle"
      }
    ],
    "learning_path": {
      "immediate": ["Review RICE framework", "Practice executive phrases"],
      "short_term": ["Apply frameworks to current projects", "Record yourself using new expressions"],
      "long_term": ["Build personal PM framework library", "Develop executive communication style"]
    }
  },
  "metadata": {
    "total_insights": 5,
    "total_questions": 2,
    "total_expressions": 10,
    "synthesis_time_ms": 500,
    "quality_score": 0.92
  }
}
```

## Data Flow

```
Agent 2 (PM Skills)    Agent 3 (English)    Agent 1 (Metadata)
       │                      │                      │
       │ (pm_insights)        │ (expressions)        │ (video info)
       │                      │                      │
       └──────────┬───────────┴──────────────────────┘
                  │
                  ▼
         ┌────────────────────────┐
         │   Agent 4: Synthesis   │
         │                        │
         │  1. Aggregate data     │
         │  2. Find connections   │
         │  3. Generate summary   │
         │  4. Create action items│
         │  5. Build learning path│
         └────────────────────────┘
                  │
                  │ (enriched synthesis)
                  ▼
            Mother Agent
                  │
                  ▼
               User
```

## Synthesis Strategies

### 1. Executive Summary Generation

```python
def generate_executive_summary(pm_insights, questions, english_expressions, video_metadata):
    """Generate concise executive summary."""
    
    insights_count = len(pm_insights)
    questions_count = len(questions)
    expressions_count = len(english_expressions)
    
    # Extract key themes from insights
    themes = extract_themes(pm_insights)
    
    summary = f"This video provides {insights_count} actionable PM insights "
    summary += f"focused on {', '.join(themes[:3])}, "
    summary += f"along with {questions_count} thought-provoking questions to apply these concepts. "
    summary += f"It also demonstrates {expressions_count} advanced business expressions "
    summary += "commonly used in executive communication."
    
    return summary
```

### 2. Connection Identification

```python
def find_connections(pm_insights, english_expressions):
    """Identify connections between insights and expressions."""
    
    connections = []
    
    for insight in pm_insights:
        for expression in english_expressions:
            # Check if expression appears in insight description
            if expression['phrase'].lower() in insight['description'].lower():
                connections.append({
                    "pm_insight": insight['title'],
                    "related_expression": expression['phrase'],
                    "connection": f"The {insight['title']} concept uses the phrase '{expression['phrase']}' to emphasize {extract_key_point(insight)}."
                })
    
    return connections
```

### 3. Action Item Generation

```python
def generate_action_items(pm_insights, english_expressions):
    """Create prioritized action items."""
    
    action_items = []
    
    # High priority: Apply PM frameworks
    for insight in pm_insights[:2]:  # Top 2 insights
        action_items.append({
            "priority": "high",
            "action": f"Implement {insight['title']} in your next project",
            "related_insight": insight['title'],
            "estimated_time": "1-2 hours"
        })
    
    # Medium priority: Practice expressions
    for expression in english_expressions[:3]:  # Top 3 expressions
        action_items.append({
            "priority": "medium",
            "action": f"Practice using '{expression['phrase']}' in conversation",
            "related_expression": expression['phrase'],
            "estimated_time": "15-30 minutes"
        })
    
    return action_items
```

### 4. Learning Path Creation

```python
def create_learning_path(pm_insights, english_expressions):
    """Build structured learning path."""
    
    return {
        "immediate": [
            f"Review {pm_insights[0]['title']}",
            f"Practice using '{english_expressions[0]['phrase']}'"
        ],
        "short_term": [
            "Apply frameworks to current projects",
            "Record yourself using new expressions",
            "Get feedback from peers"
        ],
        "long_term": [
            "Build personal PM framework library",
            "Develop executive communication style",
            "Mentor others on PM best practices"
        ]
    }
```

## Implementation

```python
class SynthesisAgent:
    """Agent 4: Synthesis Agent"""
    
    def execute(self, pm_insights, questions, english_expressions, video_metadata):
        """
        Execute synthesis of all analysis results.
        
        Args:
            pm_insights: Results from Agent 2
            questions: Questions from Agent 2
            english_expressions: Results from Agent 3
            video_metadata: Metadata from Agent 1
            
        Returns:
            Enriched synthesis with connections and recommendations
        """
        start_time = time.time()
        
        try:
            # Generate executive summary
            executive_summary = self.generate_executive_summary(
                pm_insights,
                questions,
                english_expressions,
                video_metadata
            )
            
            # Extract key themes
            key_themes = self.extract_themes(pm_insights)
            
            # Find connections
            connections = self.find_connections(
                pm_insights,
                english_expressions
            )
            
            # Generate action items
            action_items = self.generate_action_items(
                pm_insights,
                english_expressions
            )
            
            # Create learning path
            learning_path = self.create_learning_path(
                pm_insights,
                english_expressions
            )
            
            # Calculate quality score
            quality_score = self.calculate_quality_score(
                pm_insights,
                english_expressions,
                connections
            )
            
            # Calculate processing time
            processing_time = (time.time() - start_time) * 1000
            
            return {
                "success": True,
                "synthesis": {
                    "executive_summary": executive_summary,
                    "key_themes": key_themes,
                    "connections": connections,
                    "action_items": action_items,
                    "learning_path": learning_path
                },
                "metadata": {
                    "total_insights": len(pm_insights),
                    "total_questions": len(questions),
                    "total_expressions": len(english_expressions),
                    "synthesis_time_ms": processing_time,
                    "quality_score": quality_score
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "synthesis": None
            }
    
    def calculate_quality_score(self, pm_insights, questions, english_expressions, connections):
        """Calculate overall quality score (0-1)."""
        
        score = 0.0
        
        # Factor 1: Number of insights (max 0.25)
        if len(pm_insights) == 5:
            score += 0.25
        
        # Factor 2: Number of questions (max 0.15)
        if 1 <= len(questions) <= 2:
            score += 0.15
        
        # Factor 3: Number of expressions (max 0.25)
        if len(english_expressions) == 10:
            score += 0.25
        
        # Factor 4: Connections found (max 0.15)
        score += min(len(connections) * 0.05, 0.15)
        
        # Factor 5: Content quality (max 0.2)
        avg_description_length = sum(len(i['description']) for i in pm_insights) / len(pm_insights)
        if avg_description_length > 150:
            score += 0.2
        
        return round(score, 2)
```

## Synthesis Quality Metrics

| Metric | Target | Weight |
|--------|--------|--------|
| Insights count | 5 | 25% |
| Questions count | 1-2 | 15% |
| Expressions count | 10 | 25% |
| Connections found | 3+ | 15% |
| Content quality | High | 20% |

## Performance Metrics

- **Average execution time**: 200-500ms (fast, no AI calls)
- **Success rate**: ~99.5%
- **Token usage**: 0 (pure logic, no AI)
- **Cost**: Free

## Error Handling

| Error Type | Cause | Action |
|------------|-------|--------|
| `MissingDataError` | Agent 2 or 3 failed | Return partial synthesis |
| `ValidationError` | Invalid input format | Log and skip synthesis |
| `ProcessingError` | Synthesis logic failed | Return basic aggregation |

## Output Examples

### Executive Summary
> "This video provides 5 actionable PM insights focused on prioritization frameworks, stakeholder alignment, and data-driven decision making, along with 2 thought-provoking questions to help apply these concepts. It also demonstrates 10 advanced business expressions commonly used in executive communication, including 'move the needle,' 'table stakes,' and 'de-risk the initiative.'"

### Key Themes
- Data-driven decision making
- Stakeholder management
- Product strategy
- Executive communication
- Metrics and measurement

### Connections
> "The 'Data-Driven Prioritization Framework' insight emphasizes using RICE scoring to 'move the needle' on key business metrics, demonstrating how quantitative frameworks help identify high-impact initiatives."

## Implementation Reference

**File**: To be created at `backend/agents/synthesis_agent.py`

## Configuration

```python
AGENT_4_CONFIG = {
    "min_connections": 2,
    "max_action_items": 8,
    "quality_threshold": 0.7,
    "enable_learning_path": True,
    "enable_connections": True
}
```

## Future Enhancements

1. **AI-Powered Synthesis**: Use LLM to generate richer connections
2. **Personalization**: Customize based on user's PM experience level
3. **Resource Linking**: Add links to related articles, books, courses
4. **Difficulty Scoring**: Rate complexity of insights and expressions
5. **Progress Tracking**: Track which action items user has completed
6. **Spaced Repetition**: Schedule reminders for practicing expressions
7. **Peer Comparison**: Show how insights compare to industry benchmarks
