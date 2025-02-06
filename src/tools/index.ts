import { generateImageToolDefinition } from './generateImages'
import { redditToolDefinition } from './reddit'
import { dadJokeToolDefiniton } from './dadjoke'

export const tools = [
  generateImageToolDefinition,
  redditToolDefinition,
  dadJokeToolDefiniton,
]
