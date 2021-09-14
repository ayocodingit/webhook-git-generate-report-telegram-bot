import sendTelegram from './sendTelegram.js'
import templateDescription from './templateDescription.js'

const execJob = async (job, url, body, done, addition) => {
  try {
    await sendTelegram(job.data.git, await templateDescription(body, url, done, addition))
    done()
  } catch (error) {
    console.log(error.message)
    throw error
  }
}

export default execJob
