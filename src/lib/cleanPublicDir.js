// @flow
const fs = require('fs-extra')

const cleanPublicDir = async (ctx: Object) => fs.emptyDir(ctx.paths.public)

module.exports = cleanPublicDir
