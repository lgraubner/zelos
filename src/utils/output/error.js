const { red } = require('chalk')

const error = (...msgs) => console.error(`\n${red('error')} ${msgs.join('\n')}`)

module.exports = error
