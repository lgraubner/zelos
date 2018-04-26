// @flow
const fs = require('fs-extra')
const pluralize = require('pluralize')
const groupBy = require('lodash/groupBy')
const pick = require('lodash/pick')
const orderBy = require('lodash/orderBy')

const compileContent = require('../utils/compileContent')

const createPages = async (
  pages: Array<Object>,
  manifest: Object,
  ctx: Object
) => {
  const { config } = ctx

  // sort by date and group by type
  const groupedPages = groupBy(orderBy(pages, [p => p.date], ['desc']), p =>
    pluralize(p.type)
  )

  const siteData = {
    ...pick(config, ['author', 'siteName', 'description', 'params']),
    rssLink: config.rss ? `/${config.rssFilename}` : null,
    serviceWorkerLink: config.serviceWorker ? '/sw.js' : null,
    manifest
  }

  return Promise.all(
    pages.map(async page => {
      const data = {
        page,
        site: {
          ...siteData,
          allPages: pages,
          ...groupedPages
        }
      }

      const html = await compileContent(data, ctx)
      return fs.outputFile(page.file, html)
    })
  )
}

module.exports = createPages
