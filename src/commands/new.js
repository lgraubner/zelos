// @flow
const mri = require('mri')
const fs = require('fs-extra')
const { resolve } = require('path')
const pkg = require('../../package')
// $FlowFixMe
const { bold } = require('chalk')

const error = require('../utils/output/error')
const info = require('../utils/output/info')
const exit = require('../utils/exit')
const plain = require('../utils/output/plain')

const help = () => {
  plain(`
  ${bold(pkg.name)} ${bold('new')} [options] <dir>

  Options:

    -h, --help            Display help
`)
}

const configContent = `module.exports = {
  siteName: 'My blog'
}
`

const main = async (argv_: string[]) => {
  const argv = mri(argv_, {
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

  const layoutDir = resolve(projectPath, 'layouts')
  const contentDir = resolve(projectPath, 'pages')
  const staticDir = resolve(projectPath, 'static')

  const configPath = resolve(projectPath, 'config.js')

  // make sure project dir exists
  await fs.ensureDir(projectPath)

  // create directories
  await Promise.all([
    fs.ensureDir(layoutDir),
    fs.ensureDir(contentDir),
    fs.ensureDir(staticDir),
    fs.writeFile(configPath, configContent)
  ])

  info('Done. Start hacking!')
}

module.exports = main
