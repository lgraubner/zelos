const { resolve } = require('path')

const cwd = process.cwd()

const createConfig = localConfig => ({
  publicPath: resolve(cwd, 'public'),
  staticPath: resolve(cwd, 'static'),
  pagesPath: resolve(cwd, 'pages'),
  layoutPath: resolve(cwd, 'layouts'),
  ...localConfig
})

module.exports = createConfig
