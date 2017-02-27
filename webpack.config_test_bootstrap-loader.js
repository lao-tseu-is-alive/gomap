/**
 * Created by cgil on 1/31/17.
 */
var webpack = require('webpack');
var path = require('path');
const autoprefixer = require('autoprefixer');
const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HTMLWebpackPlugin = require('html-webpack-plugin');

const DEV = process.env.NODE_ENV === 'development';
const PRODUCTION = process.env.NODE_ENV === 'production';

// eslint-disable-next-line no-console
console.log(`=> bootstrap-loader configuration: ${bootstrapEntryPoints.dev}`);

const myEntry = PRODUCTION ? [
        './src/index.js'
    ] : [
        'webpack-hot-middleware/client',
        'tether',
        'font-awesome-loader',
        bootstrapEntryPoints.dev,
        './src/index.js',
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080'
    ];

const myPlugins = PRODUCTION ? [
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            mangle: true,
            compress: {
                warnings: true
            }
        }),
        new ExtractTextPlugin('style-[contenthash:10].css'),
        new HTMLWebpackPlugin({template: 'index_webpack_template.html'})
    ] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            'window.Tether': 'tether',
        }),
        new webpack.LoaderOptionsPlugin({
            postcss: [autoprefixer],
        }),

        new webpack.ProvidePlugin({
            'jQuery': 'jquery',
            '$': 'jquery',
            'global.jQuery': 'jquery',
            'windows.jQuery': 'jquery'
        })

    ];

myPlugins.push(
    new webpack.DefinePlugin({
        DEV: JSON.stringify(DEV),
        PROD: JSON.stringify(PRODUCTION)
    })
);

const cssIdentifier = PRODUCTION ? '[hash:base64:10]' : '[path][name]---[local]';

var cssLoader = PRODUCTION ? ExtractTextPlugin.extract({
        loader: 'css-loader?minimize&localIdentName=' + cssIdentifier
    })
    : ['style-loader', 'css-loader?localIdentName=' + cssIdentifier];

// for inline css
cssLoader = ['style-loader', 'css-loader?localIdentName=' + cssIdentifier];


module.exports = {
    devtool: 'source-map',
    entry: myEntry,
    plugins: myPlugins,
    externals: {
        //jquery: 'jQuery', //jquery can be an external (script tag in html available at the global variable jQuery
        //ol: 'ol'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            }, /* {
             test: /\.(png|jpg)$/,
             loaders: ['file-loader'],
             exclude: /node_modules/
             }
             ,*/
            {
                test: /\.(png|jpg|gif)$/,
                loaders: ['url-loader?limit=10000&name=images/[hash:12].[ext]'],
                exclude: /node_modules/
            },
            /*{
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader",
                //exclude: /node_modules/
            }, {
                test: /\.css$/,
                loaders: cssLoader,
                //exclude: /node_modules/
            },*/
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
                    'postcss-loader',
                ],

            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000',
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                use: 'file-loader',
            },
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: PRODUCTION ? '' : '/dist/',
        filename: PRODUCTION ? 'bundle.[hash:12].min.js' : 'bundle.js',
        library: 'gochantier',
    },
    resolve: {
        alias: {
            // Force all modules to use the same jquery version.
            'jquery': path.join(__dirname, 'node_modules/jquery/src/jquery'),
            //'datetimepicker': path.join(__dirname, 'node_modules/eonasdan-bootstrap-datetimepicker/bootstrap-datetimepicker.js')
        }
    },

}
;