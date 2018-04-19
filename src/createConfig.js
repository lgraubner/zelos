// @flow
const { resolve } = require('path')

const cwd = process.cwd()

const createConfig = (localConfig: Object): Object => ({
  publicPath: resolve(cwd, 'public'),
  staticPath: resolve(cwd, 'static'),
  pagesPath: resolve(cwd, 'pages'),
  layoutPath: resolve(cwd, 'layouts'),
  serviceWorker: true,
  sitemap: true,
  minifyContent: true,
  defaultLayout: 'default',
  defaultPageType: 'page',
  rss: true,
  ...localConfig
})

module.exports = createConfig
