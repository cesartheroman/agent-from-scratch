import { z } from 'zod'
import type { ToolFn } from '../../types'
import fetch from "node-fetch"

export const dadJokeToolDefiniton = {
  name: 'dad_joke',
  parameters: z.object({}),
  description: 'get a dad joke',
}

// args from params to type check ToolFn
type Args = z.infer<typeof dadJokeToolDefiniton.parameters>

export const dadJoke: ToolFn<Args, string> = async ({ toolArgs }) => {
  const res = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  })

  return (await res.json()).joke
}
