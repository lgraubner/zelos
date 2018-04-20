// @flow
const error = require('../utils/output/error')
const exit = require('../utils/exit')

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
  staticDir: 'static',
  language: 'en'
}

const createConfig = async (): Object => {
  try {
    const localConfig = await readConfigFile()

    return {
      ...defaultConfig,
      ...localConfig
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      error(
        'The current working directory does not contain a config.json file.'
      )
    } else {
      error(
        'An unexpected error occured while reading the config file.',
        err.message
      )
    }

    exit(1)
  }
}

module.exports = createConfig
