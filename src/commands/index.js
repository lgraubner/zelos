module.exports = {
  get build() {
    return require('./build')
  },
  get develop() {
    return require('./develop')
  },
  get serve() {
    return require('./serve')
  },
  get new() {
    return require('./new')
  }
}
