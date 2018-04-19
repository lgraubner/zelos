// @flow
const fs = require('fs-extra')
const { join } = require('path')

const generateSitemap = (pages: Object[], ctx: Object): Promise<any> => {
  let sitemap =
    '<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  pages.map(page => {
    if (!page.noindex) {
      sitemap += `\n  <url>\n    <loc>${page.url}</loc>\n  </url>`
    }
  })

  sitemap += '\n</urlset>'

  const sitemapPath = join(ctx.paths.public, 'sitemap.xml')
  return fs.writeFile(sitemapPath, sitemap)
}

module.exports = generateSitemap
