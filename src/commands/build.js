const mri = require('mri')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const frontmatter = require('frontmatter')
const get = require('lodash/get')
const debug = require('debug')('ssg:build')

const copyStaticDirectory = require('../utils/copyStaticDirectory')
const logError = require('../utils/logError')
const info = require('../utils/output/info')
const renderContent = require('../utils/renderContent')
const getFileDir = require('../utils/getFileDir')

const help = () => {
  console.log(`
  build help
`)
}

const processFile = async filePath => {
  debug('found file %s', filePath)
  const content = await fs.readFile(filePath, 'utf8')
  const fm = get(frontmatter(content), 'data', {})

  // get target path and create dir
  const fileDir = getFileDir(filePath, fm)
  await fs.ensureDir(fileDir)

  const renderedContent = await renderContent(content, fm, filePath)

  const file = `${fileDir}/index.html`
  fs.writeFile(file, renderedContent)
}

const build = async () => {
  // clear destination folder
  await fs.emptyDir(global.publicPath)

  info('building static html for pages')
  chokidar
    .watch(`${global.pagesPath}/**/*.md`, {
      persistent: false
    })
    .on('add', processFile)
    .on('change', processFile)
    .on('error', err => logError(`Watcher error: ${err}`))

  info('copying static files')
  await copyStaticDirectory()
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
    await build()
  } catch (err) {
    logError(err)
  }
}

module.exports = main
