// @flow
const glob = require('globby')
const debug = require('debug')('zelos:scanPages')
const path = require('path')
const { resolve } = require('url')
const marked = require('marked')

const getUrlPath = require('../utils/getUrlPath')
const parseFile = require('../utils/parseFile')
const filterDrafts = require('../utils/filterDrafts')
const extractExcerpt = require('../utils/extractExcerpt')

const scanPages = async (ctx: Object): Promise<any> => {
  const { paths, config } = ctx

  const files = await glob(`${paths.pages}/**/*.{md,html}`)

  const pages = await Promise.all(
    files.map(async (filePath: string) => {
      debug('found file %s', filePath)

      const { frontmatter, content } = await parseFile(filePath)

      const relativePath = path.relative(paths.pages, filePath)
      const urlPath = getUrlPath(relativePath, frontmatter)
      const file = path.join(paths.public, urlPath, 'index.html')
      const contentType = path.extname(filePath).replace('.', '')

      let excerpt = null
      if (frontmatter.type === 'post') {
        let fullContent = content
        if (contentType === 'md') {
          fullContent = marked(content)
        }
        excerpt = extractExcerpt(fullContent)
      }

      return {
        isHome: urlPath === '/',
        layout: config.defaultLayout,
        type: config.defaultPageType,
        srcFile: filePath,
        file,
        ...frontmatter,
        url: urlPath,
        permalink: config.siteUrl ? resolve(config.siteUrl, urlPath) : urlPath,
        content: content,
        contentType,
        excerpt
      }
    })
  )

  if (!config.drafts) {
    return filterDrafts(pages)
  }

  return pages
}

module.exports = scanPages
