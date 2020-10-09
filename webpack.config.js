const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {

    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'

    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: { // this is for the loader 

        rules: [{
            test: /\.js$/, // we want to test all js files and here we are using the $ which indicates that it should be applicable for all files which ends with .js
            exclude: /node_modules/, // exclude js files in node_modules folder
            use: {
                loader: 'babel-loader' // loader property
            }
        }]
    }

};