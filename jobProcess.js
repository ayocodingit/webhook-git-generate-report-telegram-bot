import connectQueue from './utils/connectQueue.js'
import addition from './utils/addition.js'
import clientElastic from './utils/connectElastic.js'
import execJob from './utils/execJob.js'

const github = connectQueue('github')
const gitlab = connectQueue('gitlab')
const elastic = connectQueue('elastic')

github.process(async function (job, done) {
  const { html_url: htmlUrl, body } = job.data.body.pull_request
  await execJob(job, htmlUrl, body, done, addition(job.data))
})

gitlab.process(async function (job, done) {
  const { url, description } = job.data.body.object_attributes
  await execJob(job, url, description, done, addition(job.data))
})

elastic.process(async function (job, done) {
  await clientElastic.index(job.data)
  done()
})
