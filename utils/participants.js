import { Octokit } from '@octokit/core'
import dotEnv from 'dotenv'
dotEnv.config()

const ACCESS_TOKENS = process.env.ACCESS_TOKENS
const octokit = new Octokit({ auth: ACCESS_TOKENS })
const path = '/repos/{owner}/{repo}/pulls/{number}'

export default async (user, config) => {
  const participant = []
  participant.push(`@${user.login}`)
  const reviews = await octokit.request(`GET ${path}/reviews`, config)
  for (const item of reviews.data) {
    const user = `@${item.user.login}`
    if (!participant.includes(user)) {
      participant.push(user)
    }
  }

  return participant
}
