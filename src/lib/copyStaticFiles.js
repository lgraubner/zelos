// @flow
const fs = require('fs-extra')

const copyStaticFiles = async (ctx: Object) =>
  fs.copy(ctx.paths.static, ctx.paths.public)

module.exports = copyStaticFiles
