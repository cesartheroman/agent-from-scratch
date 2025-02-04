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
