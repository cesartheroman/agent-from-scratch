import type OpenAI from 'openai'
import {
  generateImage,
  generateImageToolDefinition,
} from './tools/generateImages'
import { reddit, redditToolDefinition } from './tools/reddit'
import { dadJoke, dadJokeToolDefiniton } from './tools/dadjoke'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string,
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  }

  switch (toolCall.function.name) {
    case generateImageToolDefinition.name:
      return generateImage(input)

    case redditToolDefinition.name:
      return reddit(input)

    case dadJokeToolDefiniton.name:
      return dadJoke(input)

    default:
      return `Never run this tool: ${toolCall.function.name} again, or else!`
  }
}
