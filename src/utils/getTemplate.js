// @flow
const fs = require('fs-extra')
const handlebars = require('handlebars')
const TemplateCache = require('./TemplateCache')
const { basename } = require('path')

const logError = require('./logError')
const info = require('./output/info')
const error = require('./output/error')
const exit = require('./exit')

const getTemplate = async (filePath: string) => {
  if (TemplateCache.has(filePath)) {
    return TemplateCache.get(filePath)
  }

  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    const template = handlebars.compile(fileContent)
    TemplateCache.set(filePath, template)
    return template
  } catch (err) {
    if (err.code === 'ENOENT') {
      const layoutName = basename(filePath, 'html')
      error(`Layout "${layoutName}" could not be found.`)
      info(filePath)
      exit(1)
    }

    logError(err)
  }
}

module.exports = getTemplate
