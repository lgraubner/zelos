const { gray } = require('chalk')

const info = (...msgs) => console.log(`${gray('>')} ${msgs.join('\n')}`)

module.exports = info
