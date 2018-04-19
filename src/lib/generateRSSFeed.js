// @flow
const RSS = require('rss')
const fs = require('fs-extra')
const { join } = require('path')

const generateRSSFeed = async (pages: Object[], ctx: Object): Promise<any> => {
  const { paths } = ctx
  const feed = new RSS()

  pages.map(page =>
    feed.item({
      url: page.url
    })
  )

  const xml = feed.xml({ indent: true })

  const rssPath = join(paths.public, 'feed.xml')
  return fs.writeFile(rssPath, xml)
}

module.exports = generateRSSFeed
