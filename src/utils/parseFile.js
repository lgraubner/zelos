// @flow
const frontmatter = require('frontmatter')
const fs = require('fs-extra')

const parseFile = async (filePath: string) => {
  const fileContent = await fs.readFile(filePath, 'utf8')
  const parsed = frontmatter(fileContent)

  return {
    frontmatter: parsed.data || {},
    content: parsed.content || ''
  }
}

module.exports = parseFile
