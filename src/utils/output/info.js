// @flow
// $FlowFixMe
const { gray } = require('chalk')

const info = (...msgs: any): any =>
  console.log(`${gray('>')} ${msgs.join('\n')}`)

module.exports = info
