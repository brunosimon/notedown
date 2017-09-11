const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry:
    {
        app: './src/index.js',
    },
    output:
    {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist')
    },
    plugins:
    [
        new CleanWebpackPlugin(['./dist']),
        new HtmlWebpackPlugin({
            title: 'Nodedown',
            hash: true
        })
    ],
    module:
    {
        rules:
        [
            {
                test: /\.styl$/,
                use:
                [
                    'style-loader',
                    'css-loader',
                    'stylus-loader',
                ]
            },
            {
                test: /\.css$/,
                use:
                [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:
                [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use:
                [
                    'file-loader'
                ]
            }
        ]
    }
}