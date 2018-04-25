// @flow
const { resolve } = require('path')

const error = require('../utils/output/error')

const readConfigFile = require('../utils/readConfigFile')
const readPackageConfig = require('../utils/readPackageConfig')
const transformCliConfig = require('../utils/transformCliConfig')

const defaultConfig = {
  assetDir: 'assets',
  contentDir: 'content',
  defaultLayout: 'default',
  defaultPageType: 'page',
  drafts: false,
  language: 'en',
  layoutDir: 'layouts',
  minify: true,
  publicDir: 'public',
  rss: true,
  rssFilename: 'feed.xml',
  rssRegex: '/blog/.+$',
  serviceWorker: true,
  sitemap: true,
  siteUrl: '',
  staticDir: 'static'
}

const createContext = async (argv: Object): Object => {
  const cwd = process.cwd()

  let config = {}

  try {
    const pkgPath = resolve(process.cwd(), 'package.json')
    const [pkgConfig, localConfig] = await Promise.all([
      readPackageConfig(pkgPath),
      readConfigFile()
    ])
    const cliConfig = transformCliConfig(argv)

    config = {
      ...defaultConfig,
      ...pkgConfig,
      ...localConfig,
      ...cliConfig
    }
  } catch (err) {
    error(
      'An unexpected error occured while reading the config files.',
      err.message
    )

    process.exit(1)
  }

  return {
    argv,
    config,
    paths: {
      cwd,
      public: resolve(cwd, config.publicDir),
      static: resolve(cwd, config.staticDir),
      pages: resolve(cwd, config.contentDir),
      layouts: resolve(cwd, config.layoutDir),
      assets: resolve(cwd, config.assetDir)
    }
  }
}

module.exports = createContext
