const mri = require('mri')
const fs = require('fs-extra')
const frontmatter = require('frontmatter')
const debug = require('debug')('zelos:build')
const swPrecache = require('sw-precache')
const path = require('path')
const glob = require('glob')

const renderContent = require('../renderContent')

const logError = require('../utils/logError')
const info = require('../utils/output/info')
const getFileDir = require('../utils/getFileDir')

const help = () => {
  console.log(`
  build help
`)
}

const processFile = async (filePath, config) => {
  debug('found file %s', filePath)
  const fileContent = await fs.readFile(filePath, 'utf8')
  const parsed = frontmatter(fileContent)
  const data = parsed.data || {}
  const content = parsed.content || ''

  // get target path and create dir
  const fileDir = getFileDir(filePath, data, config)
  await fs.ensureDir(fileDir)

  const renderedContent = await renderContent(content, data, filePath, config)

  const file = `${fileDir}/index.html`
  return fs.writeFile(file, renderedContent)
}

const build = async config => {
  // clear destination folder
  info('cleaning public folder')
  await fs.emptyDir(config.publicPath)

  info('copying static files')
  await fs.copy(config.staticPath, config.publicPath)

  info('building static html for pages')
  const files = glob.sync(`${config.pagesPath}/**/*.md`)
  const filePromises = files.map(filePath => processFile(filePath, config))
  await Promise.all(filePromises)

  info('generate service worker')
  const swPath = path.resolve(config.publicPath, 'sw.js')
  await swPrecache.write(swPath, {
    staticFileGlobs: [`${config.publicPath}/**/*`],
    stripPrefix: config.publicPath
  })
}

const main = async ctx => {
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
