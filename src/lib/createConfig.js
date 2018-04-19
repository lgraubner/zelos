// @flow
const readConfigFile = require('../utils/readConfigFile')

const defaultConfig = {
  pagesDir: 'pages',
  defaultLayout: 'default',
  defaultPageType: 'page',
  drafts: false,
  layoutDir: 'layouts',
  minifyContent: true,
  publicDir: 'public',
  rss: true,
  rssFilename: 'feed.xml',
  rssRegex: /\.md$/,
  serviceWorker: true,
  sitemap: true,
  staticDir: 'static'
}

const createConfig = async (): Object => {
  const localConfig = await readConfigFile()

  return {
    ...defaultConfig,
    ...localConfig
  }
}

module.exports = createConfig
