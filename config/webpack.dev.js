const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = webpackMerge(common, {
    devServer:
    {
        contentBase: './dist',
        hot: true
    },
    devtool: 'source-map',
    plugins:
    [
        new webpack.HotModuleReplacementPlugin()
    ]
})