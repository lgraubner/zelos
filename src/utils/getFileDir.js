const path = require('path')
const get = require('lodash/get')

const getFileDir = (filePath, frontmatter) => {
  const url = get(frontmatter, 'data.url')

  if (url) {
    return path.join(global.publicPath, url)
  }

  const relativePath = path.relative(global.pagesPath, filePath)
  const basename = path.basename(relativePath)

  const dir = relativePath.replace(basename, '')

  if (basename.startsWith('index')) {
    return path.join(global.publicPath, dir)
  }

  const ext = path.extname(relativePath)

  return path.join(global.publicPath, dir, path.basename(relativePath, ext))
}

module.exports = getFileDir
