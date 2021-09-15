import moment from 'moment'
import connectQueue from './connectQueue.js'

const sendBodyIsValid = (payload) => {
  const queue = connectQueue('elastic')
  const participants = payload.participants.trimEnd().split(' ')
  for (const participant of participants) {
    queue.add({
      index: `${process.env.APP_NAME}-${moment().format('YYYY.MM.DD')}`,
      body: {
        project: payload.project.trimEnd(),
        title: payload.title.trimEnd(),
        participant: participant,
        ...payload.addition,
        isBodyValid: true
      }
    }, {
      delay: 30000,
      attempts: 2
    })
  }
}

const sendBodyIsNotValid = (payload) => {
  const queue = connectQueue('elastic')
  queue.add({
    index: `${process.env.APP_NAME}-${moment().format('YYYY.MM.DD')}`,
    body: {
      ...payload,
      isBodyValid: false
    }
  }, {
    delay: 30000,
    attempts: 2
  })
}

export {
  sendBodyIsValid,
  sendBodyIsNotValid
}
