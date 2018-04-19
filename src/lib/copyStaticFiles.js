// @flow
const fs = require('fs-extra')
const spinner = require('ora')
const logError = require('../utils/logError')

const copyStaticFiles = async (ctx: Object) => {
  const output = spinner('copying static files').start()
  try {
    fs.copy(ctx.paths.static, ctx.paths.public)
    output.succeed()
  } catch (err) {
    output.fail()
    logError(err)
  }
}

module.exports = copyStaticFiles
