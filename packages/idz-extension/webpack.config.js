import WebExtPlugin from 'web-ext-plugin'
import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'

export default {
  entry: {
    background: './src/background.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist')
  },
  plugins: [
    new WebExtPlugin({
      devtools: true,
      buildPackage: true,
      artifactsDir: '../../dist',
      overwriteDest: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static',
          to: 'static'
        },
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
      'webextension-polyfill-ts': path.resolve(path.join('node_modules', 'webextension-polyfill-ts'))
    }
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  }
}
