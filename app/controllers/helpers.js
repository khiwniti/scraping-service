//
// Name:    helpers.js
// Purpose: Library for helper functions
// Creator: Tom Söderlund
//

'use strict'

const chrome = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

const fetchPageWithPuppeteer = async function (pageUrl, { loadExtraTime, bodyOnly }) {
  console.log(`Fetch page with Puppeteer: "${pageUrl}"`, { loadExtraTime, bodyOnly })

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  })

  const page = await browser.newPage()

  if (['networkidle0'].includes(loadExtraTime)) {
    await page.goto(pageUrl, { waitUntil: loadExtraTime })
  } else {
    await page.goto(pageUrl)
    await page.waitFor(loadExtraTime)
  }

  // await page.content(), document.body.innerHTML, document.documentElement.outerHTML
  const documentHTML = bodyOnly
    ? await page.evaluate(() => document.body.outerHTML)
    : await page.evaluate(() => document.documentElement.outerHTML)

  await browser.close()
  return documentHTML
}

const fetchImageWithPuppeteer = async function (pageUrl, { loadExtraTime, format = 'jpeg', width = 800, height = 600, dpr = 1.0 }) {
  height = height || width
  dpr = parseFloat(dpr)

  console.log(`Fetch image with Puppeteer: "${pageUrl}"`, { loadExtraTime, format, width, height, dpr })

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  })
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: dpr, isMobile: false })
  if (['networkidle0'].includes(loadExtraTime)) {
    await page.goto(pageUrl, { waitUntil: loadExtraTime })
  } else {
    await page.goto(pageUrl)
    await page.waitFor(loadExtraTime)
  }
  const screenshot = await page.screenshot({ type: format, fullPage: false })
  await browser.close()

  return screenshot
}

// async function getScreenshot (url, type, quality, fullPage) {
//   const browser = await puppeteer.launch({
//     args: chrome.args,
//     executablePath: await chrome.executablePath,
//     headless: chrome.headless
//   })

//   const page = await browser.newPage()
//   await page.goto(url)
//   const file = await page.screenshot({ type, quality, fullPage })
//   await browser.close()
//   return file
// }

// Public API

module.exports = {

  fetchPageWithPuppeteer,
  fetchImageWithPuppeteer

}
