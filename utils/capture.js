
import puppeteer from 'puppeteer'
import dotEnv from 'dotenv'
dotEnv.config()

const account = process.env.ACCOUNT
const password = Buffer.from(process.env.PASSWORD, 'base64').toString();

const options = {
  github: {
    url: 'https://github.com/login',
    tagUsername: '#login_field',
    tagPassword: '#password',
    tagSubmit: '.js-sign-in-button',
  }
}

export default async (url, git) => {
  const property = options[git]
  const filePath = `tmp/${Date.now()}${Math.random()}.png`
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 768 })
  await page.goto(property.url, { waitUntil: 'networkidle2' })
  await page.type(property.tagUsername, account)
  await page.type(property.tagPassword, password)
  await Promise.all([
    page.click(property.tagSubmit),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ])
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.screenshot({ path: filePath })
  await browser.close()
  return filePath
}
