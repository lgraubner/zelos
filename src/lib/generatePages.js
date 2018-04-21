// @flow
const fs = require('fs-extra')
const groupBy = require('lodash/groupBy')
const pluralize = require('pluralize')
const { dirname } = require('path')
const pick = require('lodash/pick')
const { resolve } = require('url')
const spinner = require('ora')
const { basename } = require('path')

const buildPageHTML = require('../utils/buildPageHTML')
const error = require('../utils/output/error')
const exit = require('../utils/exit')

const generatePages = async (pages: Array<Object>, ctx: Object) => {
  const { config } = ctx

  const output = spinner('building pages').start()

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

        const pageHtml = await buildPageHTML(data, ctx)

        await fs.writeFile(page.file, pageHtml)
      })
    )

    output.succeed()
  } catch (err) {
    output.fail()

    if (err.code === 'ENOENT') {
      const layoutName = basename(err.path, '.html')
      error(`Layout "${layoutName}" could not be found.`)
    } else {
      error(
        'An unexpected error occured while generating the pages.',
        err.message
      )
    }

    exit(1)
  }
}

module.exports = generatePages
