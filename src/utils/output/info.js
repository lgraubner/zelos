const { blue } = require('chalk')

const info = msg => console.log(blue('info'), msg)

module.exports = info
