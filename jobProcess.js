import sendTelegram from './utils/sendTelegram.js'
import connectQueue from './utils/connectQueue.js'
import templateDescription from './utils/templateDescription.js'

const github = connectQueue('github')
const gitlab = connectQueue('gitlab')

github.process(async function (job, done) {
  const { html_url: htmlUrl, body } = job.data.body.pull_request
  await execJob(job, htmlUrl, body, done)
})

gitlab.process(async function (job, done) {
  const { url, description } = job.data.body.object_attributes
  await execJob(job, url, description, done)
})

const execJob = async (job, url, body, done) => {
  try {
    await sendTelegram(job.data.git, await templateDescription(body, url, done))
    done()
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
