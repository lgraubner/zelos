// @flow
const ora = require('ora')

const spinner = (msg: string) => ora(msg).start()

module.exports = spinner
