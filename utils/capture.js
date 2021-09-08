
import puppeteer from 'puppeteer'

export default async (url) => {
  const filePath = `tmp/${Date.now()}${Math.random()}.png`
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.screenshot({ path: filePath, fullPage: true })
  await browser.close()
  return filePath
}