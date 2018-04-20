// @flow
const fs = require('fs-extra')
const spinner = require('ora')

const error = require('../utils/output/error')
const exit = require('../utils/exit')

const copyStaticFiles = async (ctx: Object) => {
  const output = spinner('copying static files').start()
  try {
    fs.copy(ctx.paths.static, ctx.paths.public)
    output.succeed()
  } catch (err) {
    output.fail()
    error(
      'An unexpected error occured while copying the static files.',
      err.message
    )
    exit(1)
  }
}

module.exports = copyStaticFiles
