// @flow
const handlebars = require('handlebars')
const path = require('path')
const fs = require('fs-extra')
const marked = require('marked')
const minify = require('html-minifier').minify

const logError = require('./logError')
const info = require('./output/info')
const error = require('./output/error')
const exit = require('./exit')

const renderContent = async (
  content: string,
  data: Object,
  layoutFolderPath: string,
  minifyContent: boolean = true
): Promise<string | void> => {
  const layoutPath = path.join(layoutFolderPath, `${data.page.layout}.html`)
  const baseLayoutPath = path.join(layoutFolderPath, '_base.html')

  try {
    const layout = await fs.readFile(layoutPath, 'utf8')

    const template = handlebars.compile(layout)

    // compile content
    // @TODO: handle html
    const contentHtml = marked(content, {
      highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value
      }
    })

    // compile layout
    // @TODO: check if layout provided
    const layoutHtml = template({
      content: contentHtml,
      ...data
    })

    // compile base html
    const base = await fs.readFile(baseLayoutPath, 'utf8')
    const baseTemplate = handlebars.compile(base)

    const html = baseTemplate({
      content: layoutHtml,
      ...data
    })

    if (minifyContent) {
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
      error(`Layout "${data.page.layout}" could not be found.`)
      info(data.page.srcFile)
      exit(1)
    }

    logError(err)
  }
}

module.exports = renderContent
