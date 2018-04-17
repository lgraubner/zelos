// @flow
const serve = require('serve')

module.exports = (ctx: Object): any =>
  serve(ctx.config.publicPath, {
    port: 3000,
    open: true,
    local: true,
    clipless: true
  })
