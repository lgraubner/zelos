// @flow
const handlebars = require('handlebars')
const path = require('path')
const fs = require('fs-extra')
const marked = require('marked')
const minify = require('html-minifier').minify

const logError = require('./utils/logError')
const info = require('./utils/output/info')
const error = require('./utils/output/error')
const exit = require('./utils/exit')

const renderContent = async (
  content: string,
  page: Object,
  groupedPages: Object,
  config: Object
): Promise<string | void> => {
  const layoutName = page.frontmatter.layout || 'default'

  const layoutPath = path.join(config.layoutPath, `${layoutName}.html`)

  try {
    const layout = await fs.readFile(layoutPath)

    const template = handlebars.compile(layout.toString())
    const contentHtml = marked(content, {
      highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value
      }
    })

    const html = template({
      content: contentHtml,
      ...page,
      ...groupedPages
    })

    if (config.minifyContent) {
      return minify(html, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        includeAutoGeneratedTags: false,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeEmptyElements: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        trimCustomFragments: true,
        useShortDoctype: true
      })
    }

    return html
  } catch (err) {
    if (err.code === 'ENOENT') {
      error(`Layout "${layoutName}" could not be found.`)
      info(page.srcFile)
      exit(1)
    }

    logError(err)
  }
}

module.exports = renderContent
