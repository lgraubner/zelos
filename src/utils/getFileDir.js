// @flow
const path = require('path')

const getFileDir = (
  filePath: string,
  frontmatter: Object,
  config: Object
): string => {
  const { url } = frontmatter

  if (url) {
    return path.join(config.publicPath, url)
  }

  const relativePath = path.relative(config.pagesPath, filePath)
  const basename = path.basename(relativePath)

  const dir = relativePath.replace(basename, '')

  if (basename.startsWith('index')) {
    return path.join(config.publicPath, dir)
  }

  const ext = path.extname(relativePath)

  return path.join(config.publicPath, dir, path.basename(relativePath, ext))
}

module.exports = getFileDir
