// @flow
const glob = require('glob')
const debug = require('debug')('zelos:scanPages')
const path = require('path')
const url = require('url')

const getUrlPath = require('../utils/getUrlPath')
const parseFile = require('../utils/parseFile')
const error = require('../utils/output/error')
const exit = require('../utils/exit')

const scanPages = async (ctx: Object): Promise<any> => {
  const { paths, config } = ctx

  const files = glob.sync(`${paths.pages}/**/*.{md,html}`)

  return Promise.all(
    files.map(async filePath => {
      debug('found file %s', filePath)
      try {
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
          url: url.resolve(config.siteUrl, urlPath),
          content,
          contentType
        }
      } catch (err) {
        error(
          'An unexpected error occured while scanning the pages.',
          err.message
        )
        exit(1)
      }
    })
  )
}

module.exports = scanPages
