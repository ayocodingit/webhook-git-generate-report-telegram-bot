import fs from "fs";
import request from 'request'
import dotEnv from 'dotenv'
dotEnv.config()

const TELEGRAM_KEY = process.env.TELEGRAM_KEY
const CHART_ID = process.env.CHART_ID
const apiTelegram = `https://api.telegram.org/${TELEGRAM_KEY}`

const caption = (payload) => {
  return `
/lapor ${payload.title}
peserta: ${payload.participant.join(', ')}
lampiran: ${payload.html_url}
`
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
          },
          caption: caption(payload)
        };
        request.post({url: apiTelegram + '/sendPhoto', formData: formData},
          function cb(err) {
            fs.unlinkSync(payload.picture)
            if (err) {
              return console.error('upload failed:', err);
            }
          }
        );
      } catch (error) {
        console.log(error.message);
        throw error;
      }
}