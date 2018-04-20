// @flow
const handlebars = require('handlebars')
const marked = require('marked')

const compileContent = (data: Object) => {
  const { page } = data
  // compile content
  if (page.contentType === 'md') {
    return marked(page.content, {
      highlight: function(code) {
        return require('highlight.js').highlightAuto(code).value
      }
    })
  }

  const contentTemplate = handlebars.compile(page.content)
  return contentTemplate(data)
}

module.exports = compileContent
