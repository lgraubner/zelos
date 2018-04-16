const { red } = require('chalk')

const error = (...msgs) =>
  console.error(`${red('> Error!')} ${msgs.join('\n')}`)

module.exports = error
