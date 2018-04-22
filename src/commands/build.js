// @flow
const mri = require('mri')
// $FlowFixMe
const { bold } = require('chalk')
const spinner = require('ora')

const pkg = require('../../package')

const cleanPublicDir = require('../lib/cleanPublicDir')
const copyStaticFiles = require('../lib/copyStaticFiles')
const scanPages = require('../lib/scanPages')
const createPages = require('../lib/createPages')
const createSitemap = require('../lib/createSitemap')
const createServiceWorker = require('../lib/createServiceWorker')
const createRSSFeed = require('../lib/createRSSFeed')
const createContext = require('../lib/createContext')
// const optimizeImages = require('../lib/optimizeImages')
const processStyles = require('../lib/processStyles')
const transformScripts = require('../lib/transformScripts')

const formatExecutionTime = require('../utils/formatExecutionTime')
const plain = require('../utils/output/plain')
const info = require('../utils/output/info')
const exit = require('../utils/exit')
const error = require('../utils/output/error')

const help = () => {
  plain(`
  ${bold(pkg.name)} ${bold('build')} [options]

  Options:

    -h, --help            Display help
    -d, --drafts          Include drafts
`)
}

const main = async (argv_: string[]): Promise<any> => {
  const startTime = process.hrtime()

  const argv = mri(argv_, {
    boolean: ['help', 'drafts'],
    alias: {
      help: 'h',
      drafts: 'd'
    },
    default: {
      drafts: false
    }
  })

  if (argv.help) {
    help()
    exit(0)
  }

  let output = spinner()

  const ctx = await createContext(argv)
  const { config } = ctx

  output.start('Collecting page data')
  const pages = await scanPages(ctx)
  output.succeed()

  await cleanPublicDir(ctx)
  output.succeed('Cleaning public dir')

  await copyStaticFiles(ctx)
  output.succeed('Copying static file')

  let styleManifest
  try {
    output.start('Building CSS')
    styleManifest = await processStyles(ctx)
    output.succeed()
  } catch (err) {
    output.fail()
  }

  let scriptManifest
  try {
    output.start('Building JavaScript bundles')
    scriptManifest = await transformScripts(ctx)
    output.succeed()
  } catch (err) {
    output.fail()
    if (err instanceof Error) {
      error('An error occured while transforming js.', err.message)
      exit(1)
    }
  }

  try {
    output.start('Creating static pages')
    await createPages(
      pages,
      {
        js: scriptManifest,
        css: styleManifest
      },
      ctx
    )
    output.succeed()
  } catch (err) {
    output.fail()
  }

  // await optimizeImages(ctx).then(() => output.succeed())

  if (config.rss) {
    try {
      output.start('Creating RSS feed')
      await createRSSFeed(pages, ctx)
    } catch (err) {
      output.fail()
      error(err)
    }
  }

  if (config.sitemap) {
    output.start('Creating sitemap')
    await createSitemap(pages, ctx)
    output.succeed()
  }

  if (config.serviceWorker) {
    output.start('Creating service worker')
    await createServiceWorker(ctx)
    output.succeed()
  }

  const endTime = process.hrtime(startTime)
  const executionTime = formatExecutionTime(startTime, endTime)
  info(`Done building in ${executionTime}.`)
}

module.exports = main
