import Queue from 'bull'
import dotEnv from 'dotenv'
dotEnv.config()

const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT

export default new Queue('myJob', { redis: { host: redisHost, port: redisPort } })
