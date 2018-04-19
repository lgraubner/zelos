// @flow
const serve = require('serve')
const { resolve } = require('resolve')

const cwd = process.cwd()

module.exports = (ctx: Object): any =>
  serve(resolve(cwd, ctx.config.publicDir), {
    port: 3000,
    open: true,
    local: true,
    clipless: true
  })
