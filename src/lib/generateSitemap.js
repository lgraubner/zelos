// @flow
const fs = require('fs-extra')
const { join } = require('path')
const spinner = require('ora')

const error = require('../utils/output/error')
const exit = require('../utils/exit')

const generateSitemap = (pages: Object[], ctx: Object) => {
  const output = spinner('generating sitemap').start()
  let sitemap =
    '<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  pages.map(page => {
    if (!page.noindex) {
      sitemap += `\n  <url>\n    <loc>${page.url}</loc>\n  </url>`
    }
  })

  sitemap += '\n</urlset>'

  const sitemapPath = join(ctx.paths.public, 'sitemap.xml')

  try {
    fs.writeFile(sitemapPath, sitemap)
    output.succeed()
  } catch (err) {
    output.fail()
    error(
      'An unexpected error occured while generating the sitemap.',
      err.message
    )
    exit(1)
  }
}

module.exports = generateSitemap
