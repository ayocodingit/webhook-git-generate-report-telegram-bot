import sendTelegram from './utils/sendTelegram.js'
import connectQueue from './utils/connectQueue.js'
import templateDescription from './utils/templateDescription.js'
import addition from './utils/addition.js'

const github = connectQueue('github')
const gitlab = connectQueue('gitlab')

github.process(async function (job, done) {
  const { html_url: htmlUrl, body } = job.data.body.pull_request
  await execJob(job, htmlUrl, body, done, addition(job.data))
})

gitlab.process(async function (job, done) {
  const { url, description } = job.data.body.object_attributes
  await execJob(job, url, description, done, addition(job.data))
})

const execJob = async (job, url, body, done, addition) => {
  try {
    await sendTelegram(job.data.git, await templateDescription(body, url, done, addition))
    done()
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
