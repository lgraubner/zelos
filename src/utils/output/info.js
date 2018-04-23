const { gray } = require('chalk')

const info = (msg, newLine = false) =>
  console.log(`${newLine ? '\n' : ''}${gray('>')} ${msg}`)

module.exports = info
