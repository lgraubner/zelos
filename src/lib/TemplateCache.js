// @flow
const fs = require('fs-extra')
const handlebars = require('handlebars')

const TemplateCache = (): Object => {
  const cache = new Map()

  return {
    get: async (filePath: string) => {
      if (cache.has(filePath)) {
        return cache.get(filePath)
      }
      const fileContent = await fs.readFile(filePath, 'utf8')
      const template = handlebars.compile(fileContent)
      cache.set(filePath, template)
      return template
    }
  }
}

module.exports = TemplateCache()
