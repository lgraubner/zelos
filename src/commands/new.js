// @flow
const mri = require('mri')
const fs = require('fs-extra')
const { resolve } = require('path')
const pkg = require('../../package')
// $FlowFixMe
const { bold } = require('chalk')
const path = require('path')

const error = require('../utils/output/error')
const plain = require('../utils/output/plain')
const spinner = require('../utils/output/spinner')

const help = () => {
  plain(`
  ${bold(pkg.name)} ${bold('new')} [options] <dir>

  Options:

    -h, --help            Display help
`)
}

const main = async (argv_: string[]) => {
  const argv = mri(argv_, {
    string: ['url'],
    boolean: ['help'],
    alias: {
      help: 'h',
      url: 'U'
    },
    default: {
      url: 'https://example.com'
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
      return 1
    }
  }

  const output = spinner()

  const exampleConfig = {
    siteUrl: argv.url
  }

  const baseLayoutPath = path.join(projectPath, 'layouts/_base.html')
  const defaultLayoutPath = path.join(projectPath, 'layouts/default.html')
  const staticPath = path.join(projectPath, 'static')
  const contentPath = path.join(projectPath, 'content')
  const configPath = path.join(projectPath, 'config.json')

  try {
    await Promise.all([
      fs.outputFile(baseLayoutPath, '{{{content}}}'),
      fs.outputFile(defaultLayoutPath, '{{{content}}}'),
      fs.ensureDir(staticPath),
      fs.ensureDir(contentPath),
      fs.outputJson(configPath, exampleConfig, {
        spaces: 2
      })
    ])
    plain(`Success! Your new Zelos site is created in ${projectPath}`)
  } catch (err) {
    output.fail()
    plain('\nAn unexpected error occured during bootstrapping', err.message)
  }
}

module.exports = main
