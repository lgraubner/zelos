// @flow
const fs = require('fs-extra')
const parseAuthor = require('parse-author')

const readPackageConfig = async (pkgPath: string): Object => {
  const pkg = await fs.readJson(pkgPath)
  const { author, description, homepage, name, zelosConfig } = pkg
  const authorInfo = typeof author === 'string' ? parseAuthor(author) : author

  return {
    siteUrl: homepage,
    author: authorInfo,
    description,
    siteName: name,
    ...zelosConfig
  }
}

module.exports = readPackageConfig
