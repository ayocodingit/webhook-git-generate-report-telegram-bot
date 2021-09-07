'use strict'

import { Octokit } from "@octokit/core";
import captureWebsite from 'capture-website';
import dotEnv from 'dotenv'
dotEnv.config()

const PORT = process.env.PORT
const ACCESS_TOKENS = process.env.ACCESS_TOKENS
const octokit = new Octokit({ auth: ACCESS_TOKENS });

import express from 'express'
const app = express()

const path = '/repos/{owner}/{repo}/pulls/{pull_number}'

const getParticipant = async (user, config) => {
  const participant = []
  participant.push(user.login)
  const reviews = await octokit.request(`GET ${path}/reviews`, config);
  for(const item of reviews.data) {
    if (!participant.includes(item.user.login)) {
        participant.push(item.user.login)
    }
  }

  return participant
}

const configPicture = {
  type: 'jpeg',
  fullPage: true,
  quality: 0.1
}

app.get('/', async (req, res) => {
  try {
    const { owner, repo, pull_number } = req.query
    
    const config = { owner: owner, repo: repo, pull_number: Number(pull_number) }

    const response = await octokit.request(`GET ${path}`, config);
    const { html_url, title, user } = response.data

    const picture = await captureWebsite.base64(html_url, title.strtoLower().replace(' ', '_') + '.jpeg', configPicture);

    const participant = await getParticipant(user, config)

    const payload = { picture: picture, participant: participant, title: title, project: title.split(' | ')[0] }

    return res.json(payload)
  } catch (error) {
    console.log(error.message);
    throw error
  }
})
 
app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
})
