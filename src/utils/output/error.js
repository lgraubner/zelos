const { red } = require('chalk')

const error = (...msgs) =>
  console.error(`\n${red('> Error!')} ${msgs.join('\n')}`)

module.exports = error
