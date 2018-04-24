module.exports = {
  get build() {
    return require('./build')
  },
  get new() {
    return require('./new')
  },
  get serve() {
    return require('./serve')
  }
}
