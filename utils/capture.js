
import puppeteer from 'puppeteer'
import dotEnv from 'dotenv'
dotEnv.config()

const account = process.env.ACCOUNT
const password = process.env.PASSWORD
const urlLogin = process.env.URL_LOGIN
const tagUsername = process.env.TAG_USERNAME
const tagPassword = process.env.TAG_PASSWORD
const tagSubmit = process.env.TAG_SUBMIT

export default async (url) => {
  const filePath = `tmp/${Date.now()}${Math.random()}.png`
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 768 })
  await page.goto(urlLogin, { waitUntil: 'networkidle2' })
  await page.type(tagUsername, account)
  await page.type(tagPassword, password)
  await page.click(tagSubmit)
  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.screenshot({ path: filePath })
  await browser.close()
  return filePath
}
