#!/usr/bin/env node

const mri = require('mri')
const { bold } = require('chalk')
const debug = require('debug')('ssg:main')

const commands = require('./commands')
const config = require('../example/config')

global.publicPath = `${process.cwd()}/public`

const availableCommands = new Set(['build', 'develop', 'serve', 'new'])

const help = () =>
  console.log(`
  ${bold('Simple static site generator')}

  Commands:

    -V, --version       Output version number
    -h, --help          Display help
`)

const main = async argv_ => {
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
      console.log(require('../package').version)
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
    debug('Command %s not found', command)
    return 1
  }

  const ctx = {
    argv: argv_,
    config
  }

  return commands[command](ctx)
}

debug('start')

const handleUnexpected = err => {
  debug('handling unexpected error')

  console.error(err)

  process.exit(1)
}

process.on('uncaughtException', handleUnexpected)

main(process.argv.slice(2)).catch(handleUnexpected)
