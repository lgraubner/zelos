// @flow
const readConfigFile = require('../utils/readConfigFile')

const defaultConfig = {
  publicDir: 'public',
  staticDir: 'static',
  contentDir: 'content',
  layoutDir: 'layouts',
  serviceWorker: true,
  sitemap: true,
  minifyContent: true,
  defaultLayout: 'default',
  defaultPageType: 'page',
  rss: true,
  rssRegex: /\.md$/,
  drafts: false
}

const createConfig = async (): Object => {
  const localConfig = await readConfigFile()

  return {
    ...defaultConfig,
    ...localConfig
  }
}

module.exports = createConfig
