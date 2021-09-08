'use strict'

import { Octokit } from "@octokit/core";
import dotEnv from 'dotenv'
import capture from './capture.js'
dotEnv.config()

const PORT = process.env.PORT
const ACCESS_TOKENS = process.env.ACCESS_TOKENS
const octokit = new Octokit({ auth: ACCESS_TOKENS });

import express from 'express'
const app = express()

const path = '/repos/{ownerRepo}/pulls/{number}'

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

const verifySecretKey = async (secret) => {
  if (secret !== process.env.SECRET_KEY) throw Error('Credential is invalid' )
}

app.get('/', (req, res) => {
  res.sendStatus(404);
});

app.post('/webhook', async (req, res) => {
  try {
    console.info('Webhook Payload', JSON.stringify(req.body));

    const { html_url, title, user, number } = req.body.pull_request;
    const ownerRepo = req.body.head.repo.fullname

    await verifySecretKey(req.body.read)

    const picture = await capture({url: html_url});
  
    const config = { ownerRepo: ownerRepo, number: (number) }

    const participant = await getParticipant(user, config)

    const payload = { picture: picture, participant: participant, title: title, project: title.split(' | ')[0] }

    console.info(payload);

    return res.json(payload);
  } catch (error) {
    return res.status(403).json({ error: error.message })
  }
})
 
app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
})