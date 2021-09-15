import { sendBodyIsNotValid } from './sendElastic.js'

const templateDescription = async (body, url, done, addition) => {
  const payload = getPayloadValid({
    project: payloadRegex.project.exec(body),
    title: payloadRegex.title.exec(body),
    participants: payloadRegex.participants.exec(body)
  })

  if (!payload.isValidPayload) {
    done()
    sendBodyIsNotValid(addition)
    throw Error('payload not valid')
  }

  payload.addition = addition
  payload.url = url
  return payload
}

const getPayloadValid = (payload) => {
  let isValidPayload = true
  for (const item in payload) {
    if (payload[item] === null) {
      isValidPayload = false
      continue
    }
    payload[item] = payload[item][1]
  }

  payload.isValidPayload = isValidPayload

  return payload
}

const regex = (string) => {
  return new RegExp(string)
}

const payloadRegex = {
  project: regex('project: (.+)'),
  title: regex('title: (.+)'),
  participants: regex('participants: (.+)')
}

export default templateDescription
