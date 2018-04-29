// @flow
const TemplateCache = require('../lib/TemplateCache')

const wrapWithLayout = async (content: string, filePath: string) => {
  const layout = await TemplateCache.get(filePath)
  return layout.replace('{{content}}', content)
}

module.exports = wrapWithLayout
