import dotEnv from 'dotenv'
dotEnv.config()
import bodyParser from 'body-parser'
import express from 'express'
import verifySecretKey from './utils/verifySecretKey.js'
import Queue from './utils/queue.js';

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendStatus(404);
});

app.post('/webhook/:secret', async (req, res) => {
  try {
    await verifySecretKey(req.params.secret)
    if (!req.body.pull_request.merged) return res.send('waiting merge ...')
    Queue.add({ pull_request:req.body.pull_request });
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