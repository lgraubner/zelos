// @flow
const mri = require('mri')
const fs = require('fs-extra')
const frontmatter = require('frontmatter')
const debug = require('debug')('zelos:build')
const swPrecache = require('sw-precache')
const path = require('path')
const glob = require('glob')
const url = require('url')
const nanoseconds = require('nanoseconds')
const prettyMs = require('pretty-ms')

const renderContent = require('../renderContent')
const createSitemap = require('../createSitemap')

const logError = require('../utils/logError')
const info = require('../utils/output/info')
const getUrlPath = require('../utils/getUrlPath')

const help = () => {
  console.log(`
  build help
`)
}

const getFormattedExecutionTime = (startTime: [number, number]): string => {
  const endTime = process.hrtime(startTime)
  // convert to ms and round
  const nanoTime = Math.ceil(nanoseconds(endTime) / 1e9)

  return prettyMs(nanoTime)
}

const processFile = async (filePath: string, config: Object): Promise<any> => {
  debug('found file %s', filePath)
  const fileContent = await fs.readFile(filePath, 'utf8')
  const parsed = frontmatter(fileContent)
  const data = parsed.data || {}
  const content = parsed.content || ''

  // get target path and create dir
  const relativePath = path.relative(config.pagesPath, filePath)
  const urlPath = getUrlPath(relativePath, data)
  const fileDir = path.join(config.publicPath, urlPath)
  await fs.ensureDir(fileDir)

  const renderedContent = await renderContent(content, data, filePath, config)

  const file = `${fileDir}/index.html`
  await fs.writeFile(file, renderedContent)

  return {
    file,
    frontmatter: data,
    url: url.resolve(config.siteUrl, urlPath)
  }
}

const build = async (config: Object): Promise<any> => {
  const startTime = process.hrtime()

  // clear destination folder
  info('cleaning public folder')
  await fs.emptyDir(config.publicPath)

  info('copying static files')
  await fs.copy(config.staticPath, config.publicPath)

  info('building static html for pages')
  const files = glob.sync(`${config.pagesPath}/**/*.md`)
  const filePromises = files.map(filePath => processFile(filePath, config))

  const pages = await Promise.all(filePromises)

  if (config.sitemap) {
    info('creating sitemap')
    await createSitemap(pages, config)
  }

  if (config.serviceWorker) {
    info('generating service worker\n')
    const swPath = path.resolve(config.publicPath, 'sw.js')
    await swPrecache.write(swPath, {
      staticFileGlobs: [`${config.publicPath}/**/*`],
      stripPrefix: config.publicPath
    })
  }

  const executionTime = getFormattedExecutionTime(startTime)
  console.log(`Built ${pages.length} pages in ${executionTime}.`)
}

const main = async (ctx: Object): Promise<any> => {
  const argv = mri(ctx.argv.slice(1), {
    boolean: ['help'],
    alias: {
      help: 'h'
    }
  })

  if (argv.help) {
    help()
    return 0
  }

  try {
    await build(ctx.config)
  } catch (err) {
    logError(err)
  }
}

module.exports = main
