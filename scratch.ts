// @ts-nocheck
// Common Patterns:

// One-off Pattern: call complete and do one thing
const generateDescription = async (topic: string) => {
  return await llm.complete(`Write a description about ${topic}`)
}

// Chat Pattern: pass in array of message, however we prefix previous messages to new messages, new messages are at end of array
// we do this since we need to pass in all older messages for llm to have context
const chatHandler = async (
  message: string,
  context: ChatMessage[],
): Promise<ChatMessage[]> => {
  // context is passing in chat history, turns out this is most important, managing history and tokens
  const response = await llm.chat([
    ...context,
    {
      role: 'user',
      content: message,
    },
  ])

  return [
    ...context,
    { role: 'user', content: message },
    { role: 'assistant', content: response },
  ]
}
