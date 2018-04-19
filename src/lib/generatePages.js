// @flow
const fs = require('fs-extra')
const groupBy = require('lodash/groupBy')
const pluralize = require('pluralize')
const { dirname, extname } = require('path')
const pick = require('lodash/pick')
const { resolve } = require('url')
const spinner = require('ora')

const renderContent = require('../utils/renderContent')
const logError = require('../utils/logError')

const generatePages = async (pages: Array<Object>, ctx: Object) => {
  const { config, paths } = ctx

  const output = spinner('building static html').start()

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

  try {
    await Promise.all(
      pages.map(async page => {
        await fs.ensureDir(dirname(page.file))

        const data = {
          page,
          site: siteData,
          ...groupedPages
        }
        const ext = extname(page.srcFile).replace('.', '')

        const renderedContent = await renderContent(
          page.content,
          ext,
          data,
          paths.layouts,
          config.minifyContent
        )

        await fs.writeFile(page.file, renderedContent)
      })
    )

    output.succeed()
  } catch (err) {
    output.fail()
    logError(err)
  }
}

module.exports = generatePages
