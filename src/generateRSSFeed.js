// @flow
const RSS = require('rss')
const fs = require('fs-extra')
const { join } = require('path')

const generateRSSFeed = async (
  pages: Object[],
  config: Object
): Promise<any> => {
  const feed = new RSS()

  pages.map(page =>
    feed.item({
      url: page.url
    })
  )

  const xml = feed.xml({ indent: true })

  const rssPath = join(config.publicPath, 'feed.xml')
  return fs.writeFile(rssPath, xml)
}

module.exports = generateRSSFeed
