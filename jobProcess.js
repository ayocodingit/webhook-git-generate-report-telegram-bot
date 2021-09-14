import sendTelegram from './utils/sendTelegram.js'
import connectQueue from './utils/connectQueue.js'
import templateDescription from './utils/templateDescription.js'

const github = connectQueue('github')
const gitlab = connectQueue('gitlab')

github.process(async function (job, done) {
  const { html_url: htmlUrl, body } = job.data.body.pull_request
  const addition = {
    repository_name: job.data.body.repo.name,
    repository_url: job.data.body.repo.html_url,
    platform: job.data.git
  }
  await execJob(job, htmlUrl, body, done, addition)
})

gitlab.process(async function (job, done) {
  const { url, description } = job.data.body.object_attributes
  const addition = {
    repository_name: job.data.body.repository.name,
    repository_url: job.data.body.repository.homepage,
    platform: job.data.git
  }
  await execJob(job, url, description, done, addition)
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
