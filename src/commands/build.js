// @flow
const mri = require('mri')

const cleanPublicDir = require('../lib/cleanPublicDir')
const copyStaticFiles = require('../lib/copyStaticFiles')
const scanPages = require('../lib/scanPages')
const generatePages = require('../lib/generatePages')
const generateSitemap = require('../lib/generateSitemap')
const generateServiceWorker = require('../lib/generateServiceWorker')
const generateRSSFeed = require('../lib/generateRSSFeed')

const formatExecutionTime = require('../utils/formatExecutionTime')
const plain = require('../utils/output/plain')
const spinner = require('../utils/output/spinner')

const help = () => {
  console.log(`
  build help
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

  // clear destination folder
  // info('cleaning public folder')
  let line = spinner('cleaning public folder')
  await cleanPublicDir(ctx)
  line.succeed()

  line = spinner('copying static files')
  await copyStaticFiles(ctx)
  line.succeed()

  line = spinner('building static html')
  const pages = await scanPages(ctx)
  await generatePages(pages, ctx)
  line.succeed()

  if (config.rss) {
    line = spinner('generating RSS feed')
    await generateRSSFeed(pages, ctx)
    line.succeed()
  }

  if (config.sitemap) {
    line = spinner('generating sitemap')
    await generateSitemap(pages, ctx)
    line.succeed()
  }

  if (config.serviceWorker) {
    line = spinner('generating service worker')
    await generateServiceWorker(ctx)
    line.succeed()
  }

  const endTime = process.hrtime(startTime)
  const executionTime = formatExecutionTime(startTime, endTime)
  plain(`\n📦  Built ${pages.length} pages in ${executionTime}.`)
}

module.exports = main
