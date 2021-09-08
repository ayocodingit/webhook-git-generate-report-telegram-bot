
import { promises } from "fs";
import tempDir from 'temp-dir'
import puppeteer from 'puppeteer'

export default async ({ url, width = 1024, height = 768, wait = 0 }) => {
  const cwd = `${tempDir}/${Date.now()}${Math.random()}`
  await promises.mkdir(cwd)
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width, height })
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.screenshot({ path: `${cwd}/screenshot.png` })
  browser.close()
  return promises.readFile(`${cwd}/screenshot.png`, {encoding: 'base64'})
}