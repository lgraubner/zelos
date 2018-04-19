// @flow
const fs = require('fs-extra')
const groupBy = require('lodash/groupBy')
const pluralize = require('pluralize')
const { dirname, extname } = require('path')
const pick = require('lodash/pick')
const { resolve } = require('url')

const renderContent = require('../utils/renderContent')
const parseFile = require('../utils/parseFile')

const generatePages = async (pages: Array<Object>, ctx: Object) => {
  const { config, paths } = ctx

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
    rssLink: resolve(config.siteUrl, config.rssFilename),
    serviceWorkerLink: resolve(config.siteUrl, 'sw.js'),
    sitemapLink: resolve(config.siteUrl, 'sitemap.xml')
  }

  return Promise.all(
    pages.map(async page => {
      const { content } = await parseFile(page.srcFile)

      await fs.ensureDir(dirname(page.file))

      const data = {
        page,
        site: siteData,
        ...groupedPages
      }
      const ext = extname(page.srcFile).replace('.', '')

      const renderedContent = await renderContent(
        content,
        ext,
        data,
        paths.layouts,
        config.minifyContent
      )

      await fs.writeFile(page.file, renderedContent)
    })
  )
}

module.exports = generatePages
