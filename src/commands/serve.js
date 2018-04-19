// @flow
const serve = require('serve')

module.exports = (ctx: Object): any =>
  serve(ctx.paths.public, {
    port: 3000,
    open: true,
    local: true,
    clipless: true
  })
