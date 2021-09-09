import fs from "fs";
import request from 'request'
import dotEnv from 'dotenv'
dotEnv.config()

const TELEGRAM_KEY = process.env.TELEGRAM_KEY
const CHART_ID = process.env.CHART_ID
const apiTelegram = `https://api.telegram.org/${TELEGRAM_KEY}`

const message = (payload) => {
  return `
/lapor@Digiteam_bot ${payload.title.replace(/['"]+/g, '')}
Peserta: ${payload.participants.join(', ')}
Lampiran: ${payload.html_url}
`
}

const replyChat = (reply_to_message_id, payload) => {
  const formData = {
    chat_id: CHART_ID,
    text: message(payload),
    reply_to_message_id: reply_to_message_id
  };

  request.get({url: apiTelegram + '/sendMessage', qs: formData},
    function cb(err) {
      if (err) {
        return console.error('upload failed:', err);
      }
    }
  );
}

export default async (payload) => {
    try {
        const formData = {
          chat_id: CHART_ID,
          photo: {
            value:  fs.createReadStream(payload.picture),
            options: {
              filename: payload.picture,
              contentType: 'image/png'
            }
          }
        };
        request.post({url: apiTelegram + '/sendPhoto', formData: formData},
          function cb(err, response) {
            fs.unlinkSync(payload.picture)
            if (err) {
              return console.error('upload failed:', err);
            }
            const body = JSON.parse(response.body)
            const { message_id } = body.result
            replyChat(message_id, payload)
          }
        );
      } catch (error) {
        console.log(error.message);
        throw error;
      }
}