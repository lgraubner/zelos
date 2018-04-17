const fs = require('fs-extra')
const path = require('path')

const readConfigFile = async () => {
  const configPath = path.resolve(process.cwd(), 'config.json')
  return await fs.readJson(configPath)
}

module.exports = readConfigFile
