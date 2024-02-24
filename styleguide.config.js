const path = require('path')

module.exports = {
  // set your styleguidist configuration here
  title: 'Documentación TravelDesign',
  components: 'src/dc-it/**/*.vue',
  defaultExample: false,
  // sections: [
  //   {
  //     name: 'First Section',
  //     components: 'src/components/**/[A-Z]*.vue'
  //   }
  // ],
  webpackConfig: {
    // custom config goes here
    resolve: {
      alias: {
        '@themeConfig': path.resolve(__dirname, 'themeConfig.js'),
        '@core': path.resolve(__dirname, 'src/@core'),
        '@validations': path.resolve(__dirname, 'src/@core/utils/validations/validations.js'),
        '@axios': path.resolve(__dirname, 'src/libs/axios'),
      },
    },
  },
  exampleMode: 'expand',
}
