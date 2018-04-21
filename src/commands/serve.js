// @flow
const serve = require('serve')
const mri = require('mri')

const createContext = require('../lib/createContext')

module.exports = async (argv_: string[]): any => {
  const argv = mri(argv_)

  const ctx = await createContext(argv)
  const { paths } = ctx

  serve(paths.public, {
    port: 3000,
    open: true,
    local: true,
    clipless: true
  })
}
