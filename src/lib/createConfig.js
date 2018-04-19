// @flow

const defaultConfig = {
  publicDir: 'public',
  staticDir: 'static',
  contentDir: 'content',
  layoutDir: 'layouts',
  serviceWorker: true,
  sitemap: true,
  minifyContent: true,
  defaultLayout: 'default',
  defaultPageType: 'page',
  rss: true
}

// @TODO: merge with cli flags
const createConfig = (localConfig: Object): Object => ({
  ...defaultConfig,
  ...localConfig
})

module.exports = createConfig
