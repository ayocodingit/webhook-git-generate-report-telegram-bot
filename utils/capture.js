
import puppeteer from 'puppeteer'
import dotEnv from 'dotenv'
dotEnv.config()

const account = process.env.ACCOUNT
const password = Buffer.from(process.env.PASSWORD, 'base64').toString()

const options = {
  github: {
    tagUsername: 'input[name=login]',
    tagPassword: 'input[name=password]',
    tagSubmit: 'input[type=submit]'
  },
  gitlab: {
    tagUsername: '#user_login',
    tagPassword: '#user_password',
    tagSubmit: 'input[type=submit]'
  }
}

export default async (url, git) => {
  const property = options[git]
  const filePath = `tmp/${Date.now()}${Math.random()}.png`
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-web-security'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 768 })
  await page.goto(url, { waitUntil: 'load' })
  if (await page.$(property.tagUsername) !== null) {
    await page.type(property.tagUsername, account)
    await page.type(property.tagPassword, password)
    await Promise.all([
      page.click(property.tagSubmit),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ])
  }
  await page.screenshot({ path: filePath })
  await browser.close()
  return filePath
}
