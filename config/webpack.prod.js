const path = require('path')
const merge = require('webpack-merge')
const webpackCommonConfig = require('./webpack.common.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(
    webpackCommonConfig,
    {
        plugins:
        [
            new CleanWebpackPlugin(['build'], { root: path.resolve(__dirname, '..') }),
            new UglifyJSPlugin()
        ]
    }
)
