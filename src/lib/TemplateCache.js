// @flow
const fs = require('fs-extra')

const TemplateCache = (): Object => {
  const cache = new Map()

  return {
    get: async filePath => {
      if (cache.has(filePath)) {
        return cache.get(filePath) || ''
      }

      const layout = await fs.readFile(filePath, 'utf8')
      cache.set(filePath, layout)
      return layout
    }
  }
}

module.exports = TemplateCache()
