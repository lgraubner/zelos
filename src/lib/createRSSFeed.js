// @flow
const RSS = require('rss')
const fs = require('fs-extra')
const { join } = require('path')
const { resolve } = require('url')

const createRSSFeed = async (pages: Object[], ctx: Object): Promise<any> => {
  const { paths, config } = ctx

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
        url: page.permalink,
        title: page.title,
        description: page.description,
        date: page.date
      })
    }
  })

  const xml = feed.xml({ indent: true })

  const rssPath = join(paths.public, 'feed.xml')

  return fs.writeFile(rssPath, xml)
}

module.exports = createRSSFeed
