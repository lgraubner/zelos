// @flow
const fs = require('fs-extra')
// $FlowFixMe
const parseAuthor = require('parse-author')

const readPackageConfig = async (pkgPath: string): Object => {
  try {
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
  } catch (err) {
    return {}
  }
}

module.exports = readPackageConfig
