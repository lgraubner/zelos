// @flow
const mri = require('mri')
// $FlowFixMe
const { bold } = require('chalk')
const debug = require('debug')('zelos:main')
const { resolve } = require('path')
const updateNotifier = require('update-notifier')

const pkg = require('../package')

const commands = require('./commands')
const createConfig = require('./lib/createConfig')

const exit = require('./utils/exit')
const error = require('./utils/output/error')
const plain = require('./utils/output/plain')

const availableCommands = new Set(['build', 'develop', 'serve', 'new'])

const help = (): void =>
  plain(`
  ${bold(pkg.name, '-', pkg.description)}

  Commands:

    -V, --version       Output version number
    -h, --help          Display help
`)

const main = async (argv_: string[]) => {
  const argv = mri(argv_, {
    boolean: ['help', 'version'],
    alias: {
      help: 'h',
      version: 'V'
    }
  })

  let command = argv._[0]

  if (!command) {
    if (argv.version) {
      console.log(pkg.version)
      return 0
    }

    if (argv.help) {
      help()
      return 0
    }

    // default command
    command = 'build'

    debug('Falling back to default command %s', command)
  }

  let config = {}

  if (command !== 'new') {
    config = await createConfig()
  }

  if (!availableCommands.has(command)) {
    error(`Command "${command}" not found.`)
    exit(1)
  }

  const cwd = process.cwd()

  const ctx = {
    argv: argv_,
    config,
    paths: {
      cwd,
      public: resolve(cwd, config.publicDir),
      static: resolve(cwd, config.staticDir),
      pages: resolve(cwd, config.pagesDir),
      layouts: resolve(cwd, config.layoutDir)
    }
  }

  // execute command
  commands[command](ctx)

  updateNotifier({ pkg }).notify()
}

main(process.argv.slice(2))
