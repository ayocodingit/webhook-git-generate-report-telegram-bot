import fs from 'fs'
import request from 'request'
import dotEnv from 'dotenv'
import { Api, TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'

dotEnv.config()

const apiId = process.env.API_ID
const apiHash = process.env.API_HASH
const apiSession = process.env.API_SESSION
const stringSession = new StringSession(apiSession.toString())

const TELEGRAM_KEY = process.env.TELEGRAM_KEY
const CHART_ID = process.env.CHART_ID
const apiTelegram = `https://api.telegram.org/${TELEGRAM_KEY}`

const message = (payload) => {
  return `
/lapor ${payload.title.replace(/['"]+/g, '')}
Peserta: ${payload.participants.join(' ')}
Lampiran: ${payload.html_url}
`
}

const client = new TelegramClient(stringSession, Number(apiId), apiHash, {})

const replyChat = async (replyToMsgId, payload) => {
  await client.connect()
  await client.invoke(
    new Api.messages.SendMessage({
      peer: Number(CHART_ID),
      message: message(payload),
      randomId: Math.ceil(Math.random() * 0xffffff) + Date.now(),
      noWebpage: true,
      replyToMsgId: Number(replyToMsgId)
    })
  )
}

export default async (payload) => {
  try {
    const formData = {
      chat_id: CHART_ID,
      photo: {
        value: fs.createReadStream(payload.picture),
        options: {
          filename: payload.picture,
          contentType: 'image/png'
        }
      }
    }
    request.post({ url: apiTelegram + '/sendPhoto', formData: formData },
      function cb (err, response) {
        fs.unlinkSync(payload.picture)
        if (err) {
          return console.error('upload failed:', err)
        }
        const body = JSON.parse(response.body)
        const { message_id: messageId } = body.result
        replyChat(messageId, payload)
      }
    )
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
