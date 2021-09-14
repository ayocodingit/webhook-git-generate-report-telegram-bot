import dotEnv from 'dotenv'
import { Client } from '@elastic/elasticsearch'
import moment from 'moment'

dotEnv.config()

const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID
  },
  auth: {
    apiKey: process.env.ELASTIC_API_KEY
  }
})

const sendBodyIsValid = async (payload) => {
  await client.index({
    index: `${process.env.APP_NAME}-${moment().format('YYYY.MM.DD')}`,
    body: {
      project: payload.project.trimEnd(),
      title: payload.title.trimEnd(),
      participants: payload.participants.trimEnd().split(' '),
      ...payload.addition,
      isBodyValid: true
    }
  })
}

const sendBodyIsNotValid = async (payload) => {
  await client.index({
    index: `${process.env.APP_NAME}-${moment().format('YYYY.MM.DD')}`,
    body: {
      ...payload,
      isBodyValid: false
    }
  })
}

export {
  sendBodyIsValid,
  sendBodyIsNotValid
}
