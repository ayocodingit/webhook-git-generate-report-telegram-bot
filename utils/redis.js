import Queue from 'bull'
import dotEnv from 'dotenv'
dotEnv.config()

const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT

export default (git) => {
  return new Queue(git, { redis: { host: redisHost, port: redisPort } })
}