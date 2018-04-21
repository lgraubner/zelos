// @flow
const { resolve } = require('path')

const error = require('../utils/output/error')
const exit = require('../utils/exit')

const readConfigFile = require('../utils/readConfigFile')
const readPackageConfig = require('../utils/readPackageConfig')
const transformCliConfig = require('../utils/transformCliConfig')

const defaultConfig = {
  assetDir: 'assets',
  pagesDir: 'pages',
  defaultLayout: 'default',
  defaultPageType: 'page',
  drafts: false,
  layoutDir: 'layouts',
  minify: true,
  publicDir: 'public',
  rss: true,
  rssFilename: 'feed.xml',
  rssRegex: /\.md$/,
  serviceWorker: true,
  sitemap: true,
  staticDir: 'static',
  language: 'en'
}

const createContext = async (argv: Object): Object => {
  const cwd = process.cwd()

  let config = {}

  try {
    const pkgPath = resolve(process.cwd(), 'package.json')
    const [pkgConfig, localConfig] = await Promise.all([
      readPackageConfig(pkgPath),
      readConfigFile(argv.config)
    ])
    const cliConfig = transformCliConfig(argv)

    config = {
      ...defaultConfig,
      ...pkgConfig,
      ...localConfig,
      ...cliConfig
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      error(
        'The current working directory does not contain a package.json file.'
      )
    } else {
      error(
        'An unexpected error occured while reading the config files.',
        err.message
      )
    }

    exit(1)
  }

  if (!config.siteUrl) {
    error(
      'Could not find "siteUrl" in config. This is required to build the site.'
    )
    exit(1)
  }

  return {
    argv,
    config,
    paths: {
      cwd,
      public: resolve(cwd, config.publicDir),
      static: resolve(cwd, config.staticDir),
      pages: resolve(cwd, config.pagesDir),
      layouts: resolve(cwd, config.layoutDir),
      assets: resolve(cwd, config.assetDir)
    }
  }
}

module.exports = createContext
