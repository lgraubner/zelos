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

const formatExecutionTime = require('../utils/formatExecutionTime')
const plain = require('../utils/output/plain')
const info = require('../utils/output/info')

const help = () => {
  plain(`
  ${bold(pkg.name)} ${bold('build')} [options]

  Options:

    -h, --help      Display help
`)
}

const main = async (ctx: Object): Promise<any> => {
  const startTime = process.hrtime()

  const { config, argv } = ctx

  const argv_ = mri(argv.slice(1), {
    boolean: ['help'],
    alias: {
      help: 'h'
    }
  })

  // @TODO: extend config

  if (argv_.help) {
    help()
    return 0
  }

  await cleanPublicDir(ctx)

  await copyStaticFiles(ctx)

  const pages = await scanPages(ctx)
  await generatePages(pages, ctx)

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
