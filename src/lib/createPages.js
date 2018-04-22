// @flow
const groupBy = require('lodash/groupBy')
const fs = require('fs-extra')
const pluralize = require('pluralize')
const pick = require('lodash/pick')

const compileContent = require('../utils/compileContent')

const createPages = async (
  pages: Array<Object>,
  manifest: Object,
  ctx: Object
) => {
  const { config } = ctx

  const groupedPages = groupBy(pages, page => pluralize(page.type))

  const siteData = {
    ...pick(config, [
      'rss',
      'serviceWorker',
      'sitemap',
      'siteUrl',
      'author',
      'siteName',
      'description',
      'params'
    ]),
    rssLink: `/${config.rssFilename}`,
    serviceWorkerLink: '/sw.js',
    sitemapLink: '/sitemap.xml',
    manifest
  }

  return Promise.all(
    pages.map(async page => {
      const data = {
        page,
        site: siteData,
        ...groupedPages
      }

      const html = await compileContent(data, ctx)
      return fs.outputFile(page.file, html)
    })
  )
}

module.exports = createPages
