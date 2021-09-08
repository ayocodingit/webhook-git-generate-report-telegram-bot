
import puppeteer from 'puppeteer'

export default async ({ url, width = 1024, height = 768 }) => {
  const filePath = `tmp/${Date.now()}${Math.random()}.png`
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height })
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.screenshot({ path: filePath })
  browser.close()
  return filePath
}