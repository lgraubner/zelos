const mri = require('mri')
const fs = require('fs-extra')
const { resolve } = require('path')

const logError = require('../utils/logError')
const error = require('../utils/output/error')
const info = require('../utils/output/info')
const exit = require('../utils/exit')

const help = () => {
  console.log(`

`)
}

const configContent = `module.exports = {
  siteName: 'My blog'
}
`

const bootstrap = async projectPath => {
  const layoutDir = resolve(projectPath, 'layouts')
  const pagesDir = resolve(projectPath, 'pages')
  const staticDir = resolve(projectPath, 'static')

  const configPath = resolve(projectPath, 'config.js')

  // make sure project dir exists
  await fs.ensureDir(projectPath)

  // create directories
  await Promise.all([
    fs.ensureDir(layoutDir),
    fs.ensureDir(pagesDir),
    fs.ensureDir(staticDir),
    fs.writeFile(configPath, configContent)
  ])

  info('Done. Start hacking!')
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

  let target = argv._[0]
  if (!target) {
    target = '.'
  }

  console.log('')

  const projectPath = resolve(process.cwd(), target)

  const exists = await fs.pathExists(projectPath)
  if (exists) {
    const files = await fs.readdir(projectPath)
    if (files.length) {
      error(
        `Destination path ${projectPath} already exists and is not an empty directory.`
      )
      exit(1)
    }
  }

  try {
    await bootstrap(projectPath)
  } catch (err) {
    logError(err)
  }
}

module.exports = main
