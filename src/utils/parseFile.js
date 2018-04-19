// @flow
const frontmatter = require('frontmatter')
const fs = require('fs-extra')

const logError = require('../utils/logError')

const parseFile = async (filePath: string) => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    const parsed = frontmatter(fileContent)

    return {
      frontmatter: parsed.data || {},
      content: parsed.content || ''
    }
  } catch (err) {
    logError(err)
  }
}

module.exports = parseFile
