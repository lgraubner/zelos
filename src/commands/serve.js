const serve = require('serve')

module.exports = () =>
  serve(global.publicPath, {
    port: 3000,
    open: true,
    local: true,
    clipless: true
  })
