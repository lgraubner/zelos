// @flow
const extractExcerpt = (content: string) => {
  const match = content.match(/<p>.+?<\/p>/)

  if (match && match.length) {
    return match[0].replace(/<[^>]+>/gi, '')
  }

  return ''
}

module.exports = extractExcerpt
