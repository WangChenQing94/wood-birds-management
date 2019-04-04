// import { override, fixBabelImports } from 'customize-cra';

// export default override(fixBabelImports('import', {
//   libraryName: 'antd',
//   libraryDirectory: 'es',
//   style: 'css'
// }))

const { override, fixBabelImports } = require('customize-cra')

module.exports = override(fixBabelImports('import', {
  libraryName: 'antd',
  libraryDirectory: 'es',
  style: 'css'
}))