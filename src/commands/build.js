const mri = require('mri')
const { promisify } = require('util')
const render = promisify(require('ejs').render)
const path = require('path')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const debug = require('debug')('ssg:build')
const frontmatter = require('frontmatter')
const get = require('lodash/get')
const marked = require('marked')
const minify = require('html-minifier').minify

const copyStaticDirectory = require('../utils/copyStaticDirectory')
const logError = require('../utils/logError')
const info = require('../utils/output/info')

const pagesPath = `${process.cwd()}/example/pages`
const layoutPath = `${process.cwd()}/example/layouts`

const help = () => {
  console.log(`
  build help
`)
}

const getFileDir = (filePath, frontmatter) => {
  const url = get(frontmatter, 'data.url')

  if (url) {
    debug('found url in frontmatter')
    return path.join(global.publicPath, url)
  }

  const relativePath = path.relative(pagesPath, filePath)
  const basename = path.basename(relativePath)

  const dir = relativePath.replace(basename, '')

  if (basename.startsWith('index')) {
    debug('handling index file')

    return path.join(global.publicPath, dir)
  }

  const ext = path.extname(relativePath)

  return path.join(global.publicPath, dir, path.basename(relativePath, ext))
}

const renderContent = async (content, ext, layout = 'default') => {
  if (ext === 'html') {
    return content
  }

  if (ext === 'ejs') {
    const renderedContent = await render(content)

    return await render(`${layoutPath}/${layout}.ejs`, {
      body: renderedContent
    })
  }

  if (ext === 'md') {
    return marked(content)
  }

  debug('Unknown file type encountered')
}

const handleFile = async filePath => {
  const buffer = await fs.readFile(filePath)
  const content = buffer.toString()
  const fm = frontmatter(content)
  const ext = path.extname(filePath).slice(1)

  const fileDir = getFileDir(filePath, fm)

  await fs.ensureDir(fileDir)

  const page = minify(renderContent(content, ext, fm.layout || 'default'), {
    collapseWhitespace: true
  })

  return fs.writeFile(`${fileDir}/index.html`, page)
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

const build = async () => {
  // clear destination folder
  debug('clear existing public dir')
  await fs.emptyDir(global.publicPath)

  debug('copying static dir')
  console.log(info('copying static files'))
  await copyStaticDirectory()

  console.log(info('building static html for pages'))
  await chokidar
    .watch(pagesPath, {
      persistent: false
    })
    .on('add', handleFile)
    .on('change', handleFile)
    .on('error', error => console.log(`Watcher error: ${error}`))
}

module.exports = main
