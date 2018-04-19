// @flow
const fs = require('fs-extra')
const spinner = require('ora')

const logError = require('../utils/logError')

const cleanPublicDir = async (ctx: Object) => {
  const output = spinner('cleaning public folder').start()
  try {
    await fs.emptyDir(ctx.paths.public)
    output.succeed()
  } catch (err) {
    output.fail()
    logError(err)
  }
}

module.exports = cleanPublicDir
