const { yellow } = require('chalk')

const warn = msg => console.log(yellow('warning'), msg)

module.exports = warn
