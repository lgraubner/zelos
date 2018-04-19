// @flow
// $FlowFixMe
const { gray } = require('chalk')

const info = (msg: string, newLine?: boolean = false): any =>
  console.log(`${newLine ? '\n' : ''}${gray('>')} ${msg}`)

module.exports = info
