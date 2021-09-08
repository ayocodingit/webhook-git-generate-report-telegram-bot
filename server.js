'use strict'

import { Octokit } from "@octokit/core";
import dotEnv from 'dotenv'
import capture from './utils/capture.js'
import bodyParser from 'body-parser'
import express from 'express'
import verifySecretKey from './utils/verifySecretKey.js'
import getParticipant from './utils/participants.js'
import reportTelegram from './utils/reportTelegram.js'

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

dotEnv.config()
const PORT = process.env.PORT
const ACCESS_TOKENS = process.env.ACCESS_TOKENS
const octokit = new Octokit({ auth: ACCESS_TOKENS });
const path = '/repos/{owner}/{repo}/pulls/{number}'

app.get('/', (req, res) => {
  res.sendStatus(404);
});

app.post('/webhook/:secret', async (req, res) => {
  try {
    const { html_url, title, user, number, head, merged } = req.body.pull_request;
    const ownerRepo = head.repo.full_name.split('/')
    await verifySecretKey(req.params.secret)
    // if (!merged) return res.send('waiting merge ...')
    const picture = await capture({url: html_url});
    const config = { owner: ownerRepo[0], repo: ownerRepo[1],  number: number }
    const participant = await getParticipant(user, config, path, octokit)
    const payload = {
      picture: picture,
      participant: participant,
      title: title,
      project: title.split(' | ')[0],
      html_url: html_url
    }
    await reportTelegram(payload)
    return res.send('success');
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: error.message })
  }
})

app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
})