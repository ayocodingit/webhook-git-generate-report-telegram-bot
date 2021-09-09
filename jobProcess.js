import capture from './utils/capture.js'
import getParticipant from './utils/participants.js'
import reportTelegram from './utils/reportTelegram.js'
import Queue from './utils/queue.js'

Queue.process(async function (job, done) {
  const { html_url: htmlUrl, title, user, number, head } = job.data.pull_request
  const ownerRepo = head.repo.full_name.split('/')
  const picture = await capture(htmlUrl)
  const config = { owner: ownerRepo[0], repo: ownerRepo[1], number: number }
  const participants = await getParticipant(user, config)
  await reportTelegram({
    picture: picture,
    participants: participants,
    title: title,
    html_url: htmlUrl
  })
  done()
})
