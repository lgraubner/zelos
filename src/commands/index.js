module.exports = {
  get build() {
    return require('./build')
  },
  get develop() {
    return require('./build')
  },
  get serve() {
    return require('./serve')
  },
  get new() {
    return require('./new')
  }
}
