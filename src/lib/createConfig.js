// @flow
const readConfigFile = require('../utils/readConfigFile')

const defaultConfig = {
  contentDir: 'content',
  defaultLayout: 'default',
  defaultPageType: 'page',
  drafts: false,
  layoutDir: 'layouts',
  minifyContent: true,
  publicDir: 'public',
  rss: true,
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
