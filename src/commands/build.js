// @flow
const mri = require('mri')
// $FlowFixMe
const { bold } = require('chalk')

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
const newLine = require('../utils/output/newLine')
const spinner = require('../utils/output/spinner')
const warn = require('../utils/output/warn')
const info = require('../utils/output/info')

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
    return 0
  }

  let output = spinner()

  let ctx = {}
  try {
    ctx = await createContext(argv)
  } catch (err) {
    plain(
      '\nAn unexpected error occured while reading the config.',
      err.message
    )
    return 1
  }

  const { config } = ctx

  let pages = []
  try {
    output.start('scanning pages')
    pages = await scanPages(ctx)
    output.succeed()
  } catch (err) {
    plain('\nAn unexpected error occured while scanning pages.', err.message)
    return 1
  }

  try {
    output.start('remove previous builds')
    await cleanPublicDir(ctx)
    output.succeed()
  } catch (err) {
    output.fail()
    plain(
      '\nAn unexprected error occured while cleaning public dir.',
      err.message
    )
    return 1
  }

  try {
    output.start('copy static files')
    await copyStaticFiles(ctx)
    output.succeed()
  } catch (err) {
    output.fail()
    plain(
      '\nAn unexpected error occured while copying static files.',
      err.message
    )
    return 1
  }

  let styleManifest
  try {
    output.start('build CSS')
    styleManifest = await processStyles(ctx)
    output.succeed()
  } catch (err) {
    output.fail()
    plain('\nAn unexpected error occured while building css.', err.message)
    return 1
  }

  let scriptManifest
  try {
    output.start('build production JavaScript bundles')
    scriptManifest = await transformScripts(ctx)
    output.succeed()
  } catch (err) {
    output.fail()
    if (err instanceof Error) {
      plain(err.message)

      return 1
    }

    plain('\nAn unexpected error occured while transforming js.', err.message)
    return 1
  }

  try {
    output.start('build static HTML for pages')
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
    plain(
      '\nAn unexpected error occured while creating static pages.',
      err.message
    )
    return 1
  }

  if (config.rss) {
    if (config.siteUrl) {
      try {
        output.start('create RSS feed')
        await createRSSFeed(pages, ctx)
        output.succeed()
      } catch (err) {
        output.fail()
        plain(
          '\nAn unexpected error occured while creating rss feed',
          err.message
        )
        return 1
      }
    } else {
      warn('RSS feed not created as "siteUrl" is not set.')
    }
  }

  if (config.sitemap) {
    if (config.siteUrl) {
      try {
        output.start('create sitemap')
        await createSitemap(pages, ctx)
        output.succeed()
      } catch (err) {
        output.fail()
        plain(
          '\nAn unexpected error occured while creating sitemap',
          err.message
        )
        return 1
      }
    } else {
      warn('sitemap not created as "siteUrl" is not set.')
    }
  }

  if (config.serviceWorker) {
    try {
      output.start('create service worker')
      const stats = await createServiceWorker(ctx)
      output.succeed()
      info(stats)
    } catch (err) {
      output.fail()
      plain(
        '\nAn unexpected error occured while creating service worker',
        err.message
      )
      return 1
    }
  }

  const endTime = process.hrtime(startTime)
  const executionTime = formatExecutionTime(startTime, endTime)

  newLine()
  info(`Done building in ${executionTime}.`)
}

module.exports = main
