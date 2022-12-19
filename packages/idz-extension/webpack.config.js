const path = require('path')
const WebExtPlugin = require('web-ext-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    background: './src/background.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist')
  },
  plugins: [
    new WebExtPlugin({ browserConsole: false }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static' },
        { from: 'manifest.json' },
        {
          from: '../idz-popup/build',
          to: 'popup'
        }
      ]
    })
  ],
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.html'],
    alias: {
      'webextension-polyfill-ts': path.resolve(path.join(__dirname, 'node_modules', 'webextension-polyfill-ts'))
    }
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  }
}
