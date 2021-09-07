import { Octokit } from "@octokit/core";
import captureWebsite from 'capture-website';

const octokit = new Octokit({ auth: process.env.ACCESS_TOKENS });

import express from 'express'
const app = express()

const path = '/repos/{owner}/{repo}/pulls/{pull_number}'

app.get('/', async function (req, res) {
    try {
        const { owner, repo, pull_number } = req.query
        const config = {
            owner: owner,
            repo: repo,
            pull_number: pull_number
        }
        const response = await octokit.request(`GET ${path}`, config);
        const { html_url, title, user } = response.data

        const picture = await captureWebsite.base64(html_url, title.strtoLower().replace(' ', '_') + '.jpeg', {
            type: 'jpeg',
            fullPage: true,
            quality: 0.1
        });

        const participant = []
        participant.push(user.login)
        const reviews = await octokit.request(`GET ${path}/reviews`, config);
        for(const item of reviews.data) {
            if (!participant.includes(item.user.login)) {
                participant.push(item.user.login)
            }
        }

        const project = title.split(' | ')[0]

        const payload = {
            picture: picture,
            participant: participant,
            title: title,
            project: project
        }

        console.log(payload.participant);
        
        return res.json('success')
    } catch (error) {
        console.log(error.message);
        throw error
    }
})
 
app.listen(3000)
