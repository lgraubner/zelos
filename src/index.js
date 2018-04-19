// @flow
const mri = require('mri')
// $FlowFixMe
const { bold } = require('chalk')
const debug = require('debug')('zelos:main')
const { resolve } = require('path')

const pkg = require('../package')

const commands = require('./commands')
const createConfig = require('./lib/createConfig')

const exit = require('./utils/exit')
const error = require('./utils/output/error')
const info = require('./utils/output/info')
const logError = require('./utils/logError')

const availableCommands = new Set(['build', 'develop', 'serve', 'new'])

const help = (): void =>
  console.log(`
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
    try {
      config = await createConfig()
    } catch (err) {
      if (err.code === 'ENOENT') {
        error('Config file not found.')
        info(
          'The current working directory does not contain a config.json which is required for a zelos site.'
        )
      } else {
        logError(err)
      }

      exit(1)
    }
  }

  console.log('')
  if (!availableCommands.has(command)) {
    error(`Command ${command} not found`)
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
      content: resolve(cwd, config.contentDir),
      layouts: resolve(cwd, config.layoutDir)
    }
  }

  return commands[command](ctx)
}

debug('start')

const handleUnexpected = err => {
  debug('handling unexpected error')

  console.error(err)

  exit(1)
}

process.on('uncaughtException', handleUnexpected)

main(process.argv.slice(2)).catch(handleUnexpected)
