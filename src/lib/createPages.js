// @flow
const fs = require('fs-extra')
const groupBy = require('lodash/groupBy')
const pluralize = require('pluralize')
const { dirname } = require('path')

const renderContent = require('../utils/renderContent')
const parseFile = require('../utils/parseFile')

const createPages = async (pages: Array<Object>, ctx: Object) => {
  const { config, paths } = ctx

  const groupedPages = groupBy(pages, page => pluralize(page.type))

  return Promise.all(
    pages.map(async page => {
      const { content } = await parseFile(page.srcFile)

      await fs.ensureDir(dirname(page.file))

      const data = {
        page,
        site: config,
        ...groupedPages
      }
      const renderedContent = await renderContent(
        content,
        data,
        paths.layouts,
        config.minifyContent
      )

      await fs.writeFile(page.file, renderedContent)
    })
  )
}

module.exports = createPages
