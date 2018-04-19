// @flow
const mri = require('mri')

const cleanPublicDir = require('../lib/cleanPublicDir')
const copyStaticFiles = require('../lib/copyStaticFiles')
const scanFiles = require('../lib/scanFiles')
const createPages = require('../lib/createPages')
const createSitemap = require('../lib/createSitemap')
const generateServiceWorker = require('../lib/generateServiceWorker')
const generateRSSFeed = require('../lib/generateRSSFeed')

const info = require('../utils/output/info')
const formatExecutionTime = require('../utils/formatExecutionTime')

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

  if (argv_.help) {
    help()
    return 0
  }

  // clear destination folder
  info('cleaning public folder')
  await cleanPublicDir(ctx)

  info('copying static files')
  await copyStaticFiles(ctx)

  info('building static html for pages')
  const pages = await scanFiles(ctx)
  await createPages(pages, ctx)

  if (config.rss) {
    info('generating RSS feed')
    await generateRSSFeed(pages, ctx)
  }

  if (config.sitemap) {
    info('creating sitemap')
    await createSitemap(pages, ctx)
  }

  if (config.serviceWorker) {
    info('generating service worker\n')
    await generateServiceWorker(ctx)
  }

  const endTime = process.hrtime(startTime)
  const executionTime = formatExecutionTime(startTime, endTime)
  console.log(`Built ${pages.length} pages in ${executionTime}.`)
}

module.exports = main
