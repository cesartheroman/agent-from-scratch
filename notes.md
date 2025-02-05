# 3. Memory in Chat Applications

## What is Chat Memory?

- Collection of previous messages in the convo
- Enables context retention across interactions
- Allows for coherent back-and-forth dialogue
- Critical for multi-step tasks and references

## Message Types in Memory

```json
// System message - Sets behavior (personality, any info about user that's relevant, rules on actions, have AI write prompt)
{
    role: 'system',
    content: 'You are a helpful assistant...'
}

// User messages - Human inputs
{
    role: 'user',
    content: "What's the weather like?"
}

// Assistant messages - LLM response
{
    role: 'assistant',
    content: 'Let me check the weather for you',
    tool_calls: [...]
}

// Tool messages - Function results
{
    role: 'tool',
    content: '{"temp": 72, "conditions": "sunny"}',
    tool_call_id: 'call_123'
}
```

## Why Memory Matters

### Context Awareness

- Understand references to previous messages
- Remember user preferences
- Track progress on tasks
- Maintain conversation coherence

### Examples of Context

```
User: "What's the weather like?" 
Assistant: "It's 72 and sunny"
User: "What about tomorrow?" (Handling follow ups is very important)
//Needs memory to know we're talking about weather
```

### Task Continuity

- Remember steps completed
- Track info gathered
- Maintain state b/w function calls
- Handle multi-turn interactions

## Memory Limitations

### Token Limits

- LLMs have fixed context windows
- Older messages may need removal
- Important context can be lost
- Balancing detail vs length

### Important Considerations

- Most recent messages often most relevant
- System message always needed
- Tool responses provide key info
- Some convos need more history than others

## Message Management Strategies

### What to Keep

- System instructions
- Recent messages
- Critical info
- Current task context

### What to Remove

- Old, resolved queries
- Redundant info
- Irrelevant chat
- Completed task steps

### Priority Order

1. System message (always)
2. Current task messages
3. Recent context
4. Reference info

# 4. What is an Agent

# What is an Agent?

## Core Concepts

### Definition

- An AI agent is an LLM enhanced with:
    - Ability to make decisions
    - Capability to use tools via function calling
    - Memory of past interactions
    - Ability to operate in loops until task completion
    - Self-monitoring and correction capabilities

### Key Characteristics

- Autonomous decison making
- Task persistence
- Tool usage
- Context awareness
- Goal-oriented behavior

## Types of Agents

### 1. Chat-Based Agents
- **Description**: Maintains ongoing conversations while using tools
- **Use Cases**:
    - Customer service rep
    - Educational tutors
    - Mental health support assistants
    - Technical support agents
- **Example implementation**:
```typescript
interface ChatAgent {
  context: ConversationContext;
  memory: MessageHistory[];

  async chat(message: string): Promise<string> {
    const response = await this.llm.chat([
      ...this.memory,
      { role: 'user', content: message }
    ]);

    if (this.shouldUseTool(response)) {
      const result = await this.executeTool(response);
      return this.synthesizeResponse(result);
    }

    return response;
  }
}
```

### 2. Task-Based Agents
- **Description**: Single-response agents that execute specific tasks to completion
- **Use Cases**:
    - Code generation and review
    - Data analysis
    - Research assistance
    - Content creation
- **Example implementation**:
```typescript
interface TaskAgent {
  goal: string;
  tools: Tool[];

  async executeTask(): Promise<TaskResult> {
    let completed = false;
    const steps: TaskStep[] = [];

    while (!completed && steps.length < MAX_STEPS) {
      const nextStep = await this.planNextStep();
      const result = await this.executeStep(nextStep);
      steps.push(result);
      completed = this.isTaskComplete(result);
    }

    return this.synthesizeResults(steps);
  }
}
```

## Real World Applications

### 1. Customer Service

- **Current Usage**: 
    - Intercom's Resolution Bot
    - HubSpot's Service Hub
    - Zendesk Answer Bot
- **Capabilities**:
    - Issue classification
    - Initial problem resolution
    - Escalation to human agents
    - Documentation search
    - FAQ Handling

### 2. Development Assistants

- **Examples**:
    - GitHub Copilot
    - Amazon CodeWhisperer
    - Tabnine
- **Features**:
    - Code completion
    - Bug detection
    - Code review
    - Doc generation
    - Test case creation

### 3. Research and Analysis

- **Applications**:
    - Market research
    - Academic research helper
    - Data analysis agents
- **Capabilities**:
    - Info gathering
    - Data synthesis
    - Report generation
    - Trend analysis

### 4. Personal Assistants

- **Examples**:
    - AutoGPT
    - BabyAGI
    - Personal AI
- **Features**:
    - Task management
    - Schedule organization
    - Email drafting
    - Info lookup

## Best Practices

### Design Principles

1. Single Responsibility
    - Each agent should have a clear, specific purpose
2. Fail-safe Operation
    - Include timeout mechanisms
    - Implement retry logic
    - Set clear boundaries
3. Human Oversight
    - Important decisions require confirmation
    - Clear logging of actions
    - Audit trails

### Performance Optimization

1. Caching Strategies
2. Batching Operations
3. Parallel Processing
4. Resource Management

## Future Trends

- Multi-agent Systems
- Improved Tool Creation
- Enhanced Reasoning Capabilities
- Better Memory Management
- Specialized Domain Experts

## Common Challenges

1. Hallucination Management
2. Context Window Limitations
3. Tool Selection Accuracy
4. Cost Management
5. Privacy Concerns

# 5. Function Calling

# Function Calling Basics

## What is Function Calling?

Function calling allows LLMs to:

- Convert natural language into structure function calls
- Select appropriate functions based on user intent
- Format params according to func specs

## Basic Flow

### 1. Define Available Functions

```javascript
const functions = [
    {
        name: 'get_weather',
        description: 'Get current weather for a city',
        parameters: {
            type: 'object',
            properties: {
                location: {
                    type: 'string',
                    description: 'City name'
                }
            },
            required: ['location']
        }
    },
    {
        name: 'get_stock_price',
        description: 'Get current stock price',
        parameters: {
            type: 'object',
            properties: {
                symbol: {
                    type: 'string',
                    description: 'Stock ticker symbol'
                }
            },
            required: ['symbol']
        }
    }
]
```

### 2. Message Flow

```json
// 1. User Message
{
    role: 'user',
    content: 'Whats the weather like in London?'
}

// 2. LLM Response with Function Call
{
    role: 'assistant',
    content: null,
    tool_calls: [{
        id: 'call_abc123',
        type: 'function',
        function: {
            name: 'get_weather',
            arguments: '{"location": "London"}'
        }
    }]
}

// 3. Function Execution Result
{
    role: 'tool',
    content: '{"temperature": 18, "condition": "cloudy"}',
    tool_call_id: 'call_abc123'
}

// 4. Final LLM Response
{
    role: 'assistant',
    content: 'The weather in London is currently cloudy with a temperature of 18 C'
}
```

## How LLMs Choose Functions 

### Function Selection Process

1. **Intent Recognition**
    - LLM analyzes user message for action intent
    - Matches intent against function descriptions
    - Evals params availability

2. **Function Matching**
    - Clear matches: "What's the weather?" -> get_weather
    - Ambiguous matches: LLM chooses based on context
    - No matches: Regular response without function call

### Examples of Clear vs Ambiguous Matches

```
// Clear Match
User: "What's the stock price of Apple?"
LLM: Calls get_stock_price with {"symbol": "AAPL"}

// Ambiguous Match
User: "How's AAPL doing today?"
LLM: Could call get_stock_price or might give general info

// No Match
User: "Tell me about TypeScript"
LLM: Regular response, no function call
```

## Common Function Types

### 1. Data Retrieval

```javascript
{
    name: 'search_products',
    description: 'Search product database',
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string' },
            category: { type: 'string', optional: true }
        }
    }
}
```

### 2. Actions

```javascript
{
    name: 'create_reminder',
    description: 'Set a reminder',
    parameters: {
        type: 'object',
        properties: {
            text: { type: 'string'},
            time: { type: 'string', description: 'ISO format'}
        }
    }
}
```

### 3. Calculations

```javascript
{
    name: 'calculate_mortgage',
    description: 'Calculate monthly mortgage payment',
    parameters: {
        type: 'object',
        properties: {
            principal: { type: 'number'},
            rate: { type: 'number'},
            years: { type: 'number'}
        }
    }
}
```

## Best Practices

### Function Definition

1. Clear, specific names
2. Detailed descriptions
3. Precise params specs
4. Ex usage in description

### Parameter Design

```javascript
// Good
{
    name: 'send_email',
    description: 'Send email to specified address. Example: send_email("user@example.com", "Hello")',
    parameters: {
        type: 'object',
        properties: {
            to: {
                type: 'string',
                description: 'Email address of recipient'
            },
            subject: {
                type: 'string',
                description: 'Email subject line'
            }
        }
    }
}

// Bad - Unclear Description
{
    name: 'email',
    description: 'Emails',
    parameters: {
        type: 'object',
        properties: {
            to: { type: 'string'},
            subj: { type: 'string'}
        }
    }
}
```

## Common Use Cases

### 1. External API Calls
- Weather data
- Stock prices
- Exchange rates
- Flight info

### 2. DB Operations
- User lookups
- Product searches
- Order status checks

### 3. System Actions
- Setting reminders
- Creating calendar events
- Sending notifications

## Function Response Handling

```javascript
if (response.tool_calls?.[0]) {
    const functionCall = response.tool_calls[0]
    const result = await executeFunctionCall(functionCall)

    // Send result back to LLM
    const finalResponse = await llm.chat({
        messages: [
            ...previousMessages,
            {
                role: 'tool',
                content: JSON.stringify(result),
                tool_call_id: functionCall.id
            }
        ]
    })
}

```
