// @flow
const mri = require('mri')
// $FlowFixMe
const { bold } = require('chalk')

const pkg = require('../../package')

const cleanPublicDir = require('../lib/cleanPublicDir')
const copyStaticFiles = require('../lib/copyStaticFiles')
const scanPages = require('../lib/scanPages')
const generatePages = require('../lib/generatePages')
const generateSitemap = require('../lib/generateSitemap')
const generateServiceWorker = require('../lib/generateServiceWorker')
const generateRSSFeed = require('../lib/generateRSSFeed')
const createContext = require('../lib/createContext')
const optimizeImages = require('../lib/optimizeImages')
const processStyles = require('../lib/processStyles')
const transformScripts = require('../lib/transformScripts')

const formatExecutionTime = require('../utils/formatExecutionTime')
const plain = require('../utils/output/plain')
const info = require('../utils/output/info')
const exit = require('../utils/exit')

const help = () => {
  plain(`
  ${bold(pkg.name)} ${bold('build')} [options]

  Options:

    -h, --help            Display help
    -d, --drafts          Include drafts
    -c, --config [path]   Path to config
`)
}

const main = async (argv_: string[]): Promise<any> => {
  const startTime = process.hrtime()

  const argv = mri(argv_, {
    boolean: ['help', 'drafts'],
    string: ['config'],
    alias: {
      help: 'h',
      drafts: 'd',
      config: 'c'
    },
    default: {
      config: 'config.json',
      drafts: false
    }
  })

  if (argv.help) {
    help()
    exit(0)
  }

  const ctx = await createContext(argv)
  const { config } = ctx

  await cleanPublicDir(ctx)

  await copyStaticFiles(ctx)

  const scriptManifest = await transformScripts(ctx)

  const styleManifest = await processStyles(ctx)

  const pages = await scanPages(ctx)
  await generatePages(
    pages,
    {
      ...scriptManifest,
      ...styleManifest
    },
    ctx
  )

  await optimizeImages(ctx)

  if (config.rss) {
    await generateRSSFeed(pages, ctx)
  }

  if (config.sitemap) {
    await generateSitemap(pages, ctx)
  }

  if (config.serviceWorker) {
    await generateServiceWorker(ctx)
  }

  const endTime = process.hrtime(startTime)
  const executionTime = formatExecutionTime(startTime, endTime)
  info(`Done building in ${executionTime}.`)
}

module.exports = main
