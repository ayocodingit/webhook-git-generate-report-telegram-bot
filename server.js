import dotEnv from 'dotenv'
dotEnv.config()
import capture from './utils/capture.js'
import bodyParser from 'body-parser'
import express from 'express'
import verifySecretKey from './utils/verifySecretKey.js'
import getParticipant from './utils/participants.js'
import reportTelegram from './utils/reportTelegram.js'

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendStatus(404);
});

app.post('/webhook/:secret', async (req, res) => {
  try {
    const { html_url, title, user, number, head, merged } = req.body.pull_request;
    const ownerRepo = head.repo.full_name.split('/')
    await verifySecretKey(req.params.secret)
    // if (!merged) return res.send('waiting merge ...')
    const picture = await capture(html_url);
    const config = { owner: ownerRepo[0], repo: ownerRepo[1],  number: number }
    const participants = await getParticipant(user, config)
    await reportTelegram({
      picture: picture,
      participants: participants,
      title: title,
      html_url: html_url
    })
    return res.send('success');
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: error.message })
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App listening at http://0.0.0.0:${PORT}`)
})