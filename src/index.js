// @flow
const mri = require('mri')
// $FlowFixMe
const { bold, gray } = require('chalk')
const debug = require('debug')('zelos:main')
const updateNotifier = require('update-notifier')
// const blocked = require('blocked-at')

const pkg = require('../package')

const commands = require('./commands')

const exit = require('./utils/exit')
const error = require('./utils/output/error')
const plain = require('./utils/output/plain')

const availableCommands = new Set(['build', 'develop', 'serve', 'new'])

const help = (): void =>
  plain(`
  ${bold(pkg.name)} [options] <command>

  Options:

    -V, --version   Output version number
    -h, --help      Display help

  Commands:

    build           Build static files from source ${bold('(default)')}
    develop         Start a development server
    new             Create a new ${pkg.name} project
    serve           Start a local server

  ${gray('Type "zelos <command> --help" for more information about a command.')}
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
      plain(pkg.version)
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

  if (!availableCommands.has(command)) {
    error(`Command "${command}" not found.`)
    exit(1)
  }

  // execute command, remove command from args
  commands[command](argv_[0] === 'command' ? argv_.slice(1) : argv_)

  updateNotifier({ pkg }).notify()
}

debug('start')

const handleRejection = err => {
  debug('handling rejection')

  if (err) {
    if (err instanceof Error) {
      handleUnexpected(err)
    } else {
      error('An unexpected rejection occurred', err.message)
    }
  } else {
    error('An unexpected empty rejection occurred')
  }

  exit(1)
}

const handleUnexpected = (err: Object) => {
  debug('handling unexpected error')

  error('An unexpected error occured!', err.message)

  exit(1)
}

process.on('unhandledRejection', handleRejection)
process.on('uncaughtException', handleUnexpected)

main(process.argv.slice(2)).catch(handleUnexpected)

// blocked(
//   (time, stack) => {
//     console.log(`Blocked for ${time}ms, operation started here:`, stack)
//   },
//   {
//     trimFalsePositives: true,
//     threshold: 200
//   }
// )
