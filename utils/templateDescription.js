const templateDescription = async (body, url, done) => {
  const payload = getPayloadValid({
    project: payloadRegex.project.exec(body),
    title: payloadRegex.title.exec(body),
    participants: payloadRegex.participants.exec(body)
  }, done)
  payload.url = url
  return payload
}

const getPayloadValid = (payload, done) => {
  for (const item in payload) {
    if (payload[item] === null) {
      done()
      throw Error('payload not valid')
    }
    payload[item] = payload[item][1]
  }

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
