//
// Name:    meta.js
// Purpose: Controller and routing for metadata
// Creator: Tom Söderlund
//

'use strict'

const { includes, merge } = require('lodash')
const htmlMetadata = require('html-metadata')

const scrapeMetaData = async function (req, res) {
  try {
    const pageUrl = decodeURIComponent(req.query.url)
    const protocol = includes(pageUrl, 'https:') ? 'https' : 'http'

    console.log(`Scrape metadata: "${pageUrl}"`)
    let metadata
    try {
      metadata = await htmlMetadata(pageUrl)
    } catch (getErr) {
      if (getErr.status === 504 && protocol === 'https') {
        const pageUrlWithHttp = pageUrl.replace('https:', 'http:')
        metadata = await htmlMetadata(pageUrlWithHttp)
      }
    }
    const metadataAndUrl = merge({}, { url: pageUrl }, metadata)
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(metadataAndUrl))
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ code: res.statusCode, message: err.message }))
    console.error(err.message)
  }
}

// Routes

module.exports = scrapeMetaData
