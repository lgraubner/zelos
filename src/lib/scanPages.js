// @flow
const glob = require('globby')
const debug = require('debug')('zelos:scanPages')
const path = require('path')
const { resolve } = require('url')

const getUrlPath = require('../utils/getUrlPath')
const parseFile = require('../utils/parseFile')
const filterDrafts = require('../utils/filterDrafts')

const scanPages = async (ctx: Object): Promise<any> => {
  const { paths, config } = ctx

  const files = await glob(`${paths.pages}/**/*.{md,html}`)

  const pages = await Promise.all(
    files.map(async (filePath: string) => {
      debug('found file %s', filePath)

      const { frontmatter, content } = await parseFile(filePath)

      // get target path and create dir
      const relativePath = path.relative(paths.pages, filePath)
      const urlPath = getUrlPath(relativePath, frontmatter)
      const file = path.join(paths.public, urlPath, 'index.html')
      const contentType = path.extname(filePath).replace('.', '')

      return {
        isHome: urlPath === '/',
        layout: config.defaultLayout,
        type: config.defaultPageType,
        srcFile: filePath,
        file,
        ...frontmatter,
        link: urlPath,
        permalink: config.siteUrl ? resolve(config.siteUrl, urlPath) : urlPath,
        content,
        contentType
      }
    })
  )

  if (!config.drafts) {
    return filterDrafts(pages)
  }

  return pages
}

module.exports = scanPages
