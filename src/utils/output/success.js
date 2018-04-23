const { cyan } = require('chalk')

const success = msg => console.log(`${cyan('> Success!')} ${msg}`)

module.exports = success
