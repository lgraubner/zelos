// @flow
const path = require('path')

/**
 * Removes leading slash, ensures trailing slash
 */
const normalizeUrl = (url: string): string =>
  `/${url.replace(/(^\/)|(\/$)/g, '')}/`

const getUrlPath = (filePath: string, frontmatter?: Object = {}): string => {
  const { url } = frontmatter

  if (url) {
    return normalizeUrl(url)
  }

  const basename = path.basename(filePath)
  const dir = path.dirname(filePath)

  if (basename.startsWith('index')) {
    return '/'
  }

  const ext = path.extname(filePath)

  return normalizeUrl(path.join(dir, path.basename(filePath, ext)))
}

module.exports = getUrlPath
