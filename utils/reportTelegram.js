import fs from 'fs'
import request from 'request'
import dotEnv from 'dotenv'
import { Api, TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'
import random from 'random-bigint'
const randomId = random(128)

dotEnv.config()

const apiId = process.env.API_ID
const apiHash = process.env.API_HASH
const apiSession = process.env.API_SESSION
const stringSession = new StringSession(apiSession)

const TELEGRAM_KEY = process.env.TELEGRAM_KEY
const CHART_ID = process.env.CHART_ID
const apiTelegram = `https://api.telegram.org/${TELEGRAM_KEY}`

const message = (payload) => {
  return `
/lapor@Digiteam_bot ${payload.project} | ${payload.title}

Peserta: ${payload.participants}
Lampiran: ${payload.link}
`
}

const client = new TelegramClient(stringSession, Number(apiId), apiHash, {})

const replyChat = async (replyToMsgId, payload) => {
  if (!client.connected) await client.connect()
  await client.invoke(
    new Api.messages.SendMessage({
      peer: Number(CHART_ID),
      message: message(payload),
      randomId: randomId,
      noWebpage: true,
      replyToMsgId: Number(replyToMsgId),
      silent: true
    })
  )
}

export default (payload) => {
  request.post(
    {
      url: apiTelegram + '/sendPhoto',
      formData: {
        chat_id: CHART_ID,
        photo: {
          value: fs.createReadStream(payload.picture),
          options: {
            filename: payload.picture,
            contentType: 'image/png'
          }
        },
        disable_notification: 'true'
      }
    },
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
}
