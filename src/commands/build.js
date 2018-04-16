const mri = require('mri')
const { promisify } = require('util')
const render = promisify(require('ejs').renderFile)
const path = require('path')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const debug = require('debug')('ssg:build')
const frontmatter = require('frontmatter')

const copyStaticDirectory = require('../utils/copy-static-directory')
const logError = require('../utils/log-error')
const info = require('../utils/output/info')

const pagesPath = `${process.cwd()}/example/pages`
const layoutPath = `${process.cwd()}/example/layouts`

const help = () => {
  console.log(`
  build help
`)
}

const getFileDir = filePath => {
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

const handleFile = async filePath => {
  const ext = path.extname(filePath)

  const fileDir = getFileDir(filePath)

  // @TODO: frontmatter url
  await fs.ensureDir(fileDir)

  if (ext === '.html') {
    debug('Copying html file to %s', fileDir)
    return fs.copy(filePath, `${fileDir}/index.html`)
  }

  if (ext === '.ejs') {
    debug('Rendering ejs file to %s', fileDir)
    const content = await render(filePath, ext)
    const fm = frontmatter(content)
    const layout = fm.layout || 'default'

    const page = await render(`${layoutPath}/${layout}.ejs`, {
      body: content
    })

    return fs.writeFile(`${fileDir}/index.html`, page)
  }

  debug('Unknown file type encountered')
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
