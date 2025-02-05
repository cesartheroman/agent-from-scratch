// import { runLLM } from './src/llm'
// import { addMessages, getMessages } from './src/memory'
import 'dotenv/config'
import { runAgent } from './src/agent'
import { z } from 'zod'

const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

// NOTE: instead of this old way:
// const response = await runLLM({
//   messages: [...messages, { role: 'user', content: userMessage }],
// })
// let's add the latest message
// await addMessages([{ role: 'user', content: userMessage }])
// const messages = await getMessages()
// const response = await runLLM({
//   // now sending all messages at once, streamlines
//   messages,
// })
// await addMessages([{ role: 'assistant', content: response }])

const weatherTool = {
  name: 'get_weather',
  parameters: z.object({
    reasoning: z.string().describe('why did you pick this tool?'),
  }),
}

await runAgent({ userMessage, tools: [weatherTool] })
