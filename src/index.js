#!/usr/bin/env node

const mri = require('mri')
const { bold } = require('chalk')
const debug = require('debug')('ssg:main')
const resolve = require('resolve')

const pkg = require('../package')
const commands = require('./commands')
const exit = require('./utils/exit')
const error = require('./utils/output/error')
const info = require('./utils/output/info')
const config = require('../example/config')

global.publicPath = `${process.cwd()}/public`
global.staticPath = `${process.cwd()}/static`
global.pagesPath = `${process.cwd()}/pages`
global.layoutPath = `${process.cwd()}/layouts`

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

  console.log('')
  if (!availableCommands.has(command)) {
    error(`Command ${command} not found`)
    exit(1)
  }

  if (command !== 'new') {
    try {
      resolve.sync('tap', {
        basedir: process.cwd()
      })
    } catch (err) {
      error(`Command can only be run for a ${pkg.name} site.`)
      info(
        `Either the current working directory does not contain a package.json or "${
          pkg.name
        }" is not specified as a dependency.`
      )
      exit(1)
    }
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

  exit(1)
}

process.on('uncaughtException', handleUnexpected)

main(process.argv.slice(2)).catch(handleUnexpected)
