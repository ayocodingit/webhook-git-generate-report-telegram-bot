import capture from './utils/capture.js'
import reportTelegram from './utils/reportTelegram.js'
import redis from './utils/redis.js'

const github = redis('github')
const gitlab = redis('gitlab')

github.process(async function (job, done) {
  const { html_url: htmlUrl, body } = job.data.body.pull_request
  try {
    await execJob(job, htmlUrl, body)
    done()
  } catch (error) {
    done()
    console.log(error.message)
    throw error
  }
})

gitlab.process(async function (job, done) {
  const { url, description } = job.data.body.object_attributes
  try {
    await execJob(job, url, description)
    done()
  } catch (error) {
    done()
    console.log(error.message)
    throw error
  }
})

const execJob = async (job, url, body) => {
  try {
    const payload = await templateBody(body, url)
    await sendTelegram(job.data.git, payload)
  } catch (error) {
    console.log(error.message)
    throw error
  }
}

const sendTelegram = async (git, payload) => {
  try {
    reportTelegram({
      picture: await capture(payload.url, git),
      participants: payload.participants,
      title: payload.title,
      project: payload.project,
      link: payload.url
    })
  } catch (error) {
    console.log(error.message)
    throw error
  }
}

const templateBody = async (body, url) => {
  const payload = {
    project: payloadRegex.project.exec(body),
    title: payloadRegex.title.exec(body),
    participants: payloadRegex.participants.exec(body)
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
  participants: regex('participants: (.+)')
}
