const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin')
const webpackMerge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = webpackMerge(common, {
    plugins:
    [
        new UglifyJSWebpackPlugin()
    ]
})