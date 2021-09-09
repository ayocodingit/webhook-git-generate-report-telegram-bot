import capture from './utils/capture.js'
import reportTelegram from './utils/reportTelegram.js'
import redis from './utils/redis.js'

const github = redis('github')

github.process(async function (job, done) {
  const { html_url: htmlUrl, body } = job.data.body.pull_request
  const payload = templateBody(body, htmlUrl)
  await sendTelegram(job.data.git, done, payload)
})

const sendTelegram = async (git, done, payload) => {
  try {
    const picture = await capture(payload.url, git)
    reportTelegram({
      picture: picture,
      participant: payload.participant,
      title: payload.title,
      project: payload.project,
      link: payload.url
    })
  } catch (error) {
    done()
    console.log(error.message)
  }
}

const templateBody = (body, url) => {
  const payload = {
    project: payloadRegex.project.exec('project: desa digital 1'),
    title: payloadRegex.title.exec('title: pengembangan fitur'),
    participant: payloadRegex.participant.exec('participant: @firmanalamsyah580 @yohang88')
  }
  for (const item in payload) {
    if (payload[item] === null) {
      throw Error('payload not valid')
    }
    payload[item] = payload[item][1]
  }
  payload.url = url
  return payload
}

const regex = (string) => {
  return new RegExp(string)
}

const payloadRegex = {
  project: regex('project: (.+)'),
  title: regex('title: (.+)'),
  participant: regex('participant: (.+)')
}
