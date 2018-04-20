// @flow
const fs = require('fs-extra')
const spinner = require('ora')

const exit = require('../utils/exit')
const error = require('../utils/output/error')

const cleanPublicDir = async (ctx: Object) => {
  const output = spinner('cleaning public folder').start()
  try {
    await fs.emptyDir(ctx.paths.public)
    output.succeed()
  } catch (err) {
    output.fail()
    error(
      'An unexpected error occurred while cleaning the public folder.',
      err.message
    )
    exit(1)
  }
}

module.exports = cleanPublicDir
