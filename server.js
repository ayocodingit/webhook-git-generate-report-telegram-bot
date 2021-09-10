import dotEnv from 'dotenv'
import bodyParser from 'body-parser'
import express from 'express'
import verifySecretKey from './utils/verifySecretKey.js'
import redis from './utils/redis.js'
dotEnv.config()

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendStatus(404)
})

const PULL_REQUEST_MERGED = {
  github: {
    locations: ['pull_request', 'merged'],
    condition: true
  },
  gitlab: {
    locations: ['object_attributes', 'action'],
    condition: 'merge'
  }
}

const isMerged = (git, body) => {
  const locations = PULL_REQUEST_MERGED[git].locations
  let state = body
  for (const location of locations) {
    state = state[location]
  }
  return state === PULL_REQUEST_MERGED[git].condition
}

app.post('/webhook/:secret/:git', async (req, res) => {
  try {
    await verifySecretKey(req.params.secret)
    const git = req.params.git
    if (!isMerged(git, req.body)) return res.send('pending ...')
    const queue = redis(git)
    queue.add({ git: git, body: req.body })
    return res.send('success')
  } catch (error) {
    console.log(error.message)
    return res.status(403).json({ error: error.message })
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App listening at http://0.0.0.0:${PORT}`)
})
