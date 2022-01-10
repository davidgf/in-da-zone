const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebExtPlugin = require('web-ext-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    // popup: './src/popup/index.tsx',
    background: './src/background.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist')
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './src/popup/index.html',
    //   filename: 'index.html',
    //   inject: 'body',
    //   chunks: ['popup']
    // }),
    new WebExtPlugin({ browserConsole: true }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static' }
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
