
import puppeteer from 'puppeteer'
import dotEnv from 'dotenv'
dotEnv.config()

const account = process.env.ACCOUNT
const password = Buffer.from(process.env.PASSWORD, 'base64').toString()

const options = {
  github: {
    tagUsername: '.js-login-field',
    tagPassword: '.js-password-field',
    tagSubmit: '.js-sign-in-button'
  },
  gitlab: {
    url: 'https://gitlab.com/users/sign_in',
    tagUsername: '#user_login',
    tagPassword: '#user_password',
    tagSubmit: '.btn-confirm'
  }
}

export default async (url, git) => {
  const property = options[git]
  const filePath = `tmp/${Date.now()}${Math.random()}.png`
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 768 })
  await page.goto(url, { waitUntil: 'networkidle2' })
  let max = 0
  while (await page.$(property.tagUsername) !== null && max < 2) {
    await page.type(property.tagUsername, account)
    await page.type(property.tagPassword, password)
    await Promise.all([
      page.click(property.tagSubmit, { delay: 2 }),
      page.waitForNavigation({ waitUntil: 'networkidle0' })
    ])
    max++
  }
  await page.screenshot({ path: filePath })
  await browser.close()
  return filePath
}
