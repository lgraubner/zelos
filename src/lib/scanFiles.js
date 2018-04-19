// @flow
const glob = require('glob')
const debug = require('debug')('zelos:scanFiles')
const path = require('path')
const url = require('url')

const getUrlPath = require('../utils/getUrlPath')
const parseFile = require('../utils/parseFile')

const scanFiles = async (ctx: Object): Promise<any> => {
  const { paths, config } = ctx

  const files = glob.sync(`${paths.content}/**/*.md`)

  return Promise.all(
    files.map(async filePath => {
      debug('found file %s', filePath)
      const { frontmatter } = await parseFile(filePath)

      // get target path and create dir
      const relativePath = path.relative(paths.content, filePath)
      const urlPath = getUrlPath(relativePath, frontmatter)
      const file = path.join(paths.public, urlPath, 'index.html')

      return {
        layout: config.defaultLayout,
        type: config.defaultPageType,
        srcFile: filePath,
        file,
        ...frontmatter,
        url: url.resolve(config.siteUrl, urlPath)
      }
    })
  )
}

module.exports = scanFiles
