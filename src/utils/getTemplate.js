// @flow
const fs = require('fs-extra')
const handlebars = require('handlebars')
const TemplateCache = require('./TemplateCache')

const getTemplate = async (filePath: string) => {
  if (TemplateCache.has(filePath)) {
    return TemplateCache.get(filePath)
  }

  const fileContent = await fs.readFile(filePath, 'utf8')
  const template = handlebars.compile(fileContent)
  TemplateCache.set(filePath, template)
  return template
}

module.exports = getTemplate
