const fs = require('fs-extra')
const { resolve } = require('path')

const readConfigFile = async () => {
  const configPath = resolve(process.cwd(), 'config.json')
  return await fs.readJson(configPath)
}

module.exports = readConfigFile
