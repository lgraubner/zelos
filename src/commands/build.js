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
const exit = require('../utils/exit')

const help = () => {
  plain(`
  ${bold(pkg.name)} ${bold('build')} [options]

  Options:

    -h, --help      Display help
    -d, --drafts    Include drafts
`)
}

const main = async (ctx: Object): Promise<any> => {
  const startTime = process.hrtime()

  const { config } = ctx

  const argv = mri(ctx.argv.slice(1), {
    boolean: ['help', 'drafts'],
    alias: {
      help: 'h',
      drafts: 'd'
    }
  })

  const childCtx = {
    ...ctx,
    argv
  }

  if (argv.help) {
    help()
    exit(0)
  }

  await cleanPublicDir(childCtx)

  await copyStaticFiles(childCtx)

  const pages = await scanPages(childCtx)
  await generatePages(pages, childCtx)

  if (config.rss) {
    await generateRSSFeed(pages, childCtx)
  }

  if (config.sitemap) {
    await generateSitemap(pages, childCtx)
  }

  if (config.serviceWorker) {
    await generateServiceWorker(childCtx)
  }

  const endTime = process.hrtime(startTime)
  const executionTime = formatExecutionTime(startTime, endTime)
  info(`Done building in ${executionTime}.`)
}

module.exports = main
