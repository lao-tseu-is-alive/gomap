/**
 * Created by cgil on 1/31/17.
 */
var path = require('path');
var webpack = require('webpack');

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

const entry = PRODUCTION ? [
        './src/index.js'
    ] : [
        './src/index.js',
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080'
    ];

const plugins = PRODUCTION ? [
        new webpack.optimize.UglifyJsPlugin({
            comments: true,
            mangle: false,
            compress: {
                warnings: true
            }
        })
    ] : [
        new webpack.HotModuleReplacementPlugin()
    ];

plugins.push(
    new webpack.DefinePlugin({
        DEVELOPMENT: JSON.stringify(DEVELOPMENT),
        PRODUCTION: JSON.stringify(PRODUCTION)
    })
);

module.exports = {
    devtool: 'source-map',
    entry: entry,
    plugins: plugins,
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/
        },/* {
            test: /\.(png|jpg)$/,
            loaders: ['file-loader'],
            exclude: /node_modules/
        }
        ,*/ {
         test: /\.(png|jpg|gif)$/,
         loaders: ['url-loader?limit=10000&name=images/[hash:12].[ext]'],
         exclude: /node_modules/
         },/* {
         test: /\.css$/,
         loaders: cssLoader,
         exclude: /node_modules/
         }*/
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'bundle.js'
    }
};