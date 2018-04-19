// @flow
const RSS = require('rss')
const fs = require('fs-extra')
const { join } = require('path')
const spinner = require('ora')
const { resolve } = require('url')

const logError = require('../utils/logError')

const generateRSSFeed = async (pages: Object[], ctx: Object): Promise<any> => {
  const { paths, config } = ctx

  const output = spinner('generating RSS feed').start()
  const feed = new RSS({
    title: config.siteName,
    description: config.description,
    generator: null,
    feed_url: resolve(config.siteUrl, config.rssFilename),
    site_url: config.siteUrl,
    language: config.language,
    managingEditor: config.author.name
  })

  pages.map(page => {
    if (config.rssRegex.test(page.srcFile) && !page.excludeFromRSS) {
      feed.item({
        url: page.url,
        title: page.title,
        description: page.description,
        date: page.date
      })
    }
  })

  const xml = feed.xml({ indent: true })

  const rssPath = join(paths.public, 'feed.xml')

  try {
    await fs.writeFile(rssPath, xml)
    output.succeed()
  } catch (err) {
    output.fail()
    logError(err)
  }
}

module.exports = generateRSSFeed
