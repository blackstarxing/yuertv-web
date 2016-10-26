var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:3000/dist/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

module.exports = {
    entry: {
        layout: ['./client/js/layout.js',hotMiddlewareScript],
        index: ['./client/css/index.css', './client/js/index.js',hotMiddlewareScript],
        register: ['./client/css/register.css',hotMiddlewareScript],
        center: ['./client/css/center.css', './client/js/center.js',hotMiddlewareScript],
        register: ['./client/css/register.css','./client/js/register.js',hotMiddlewareScript],
    },
    output: {
        filename: './[name].js',
        path: path.resolve('./public/dist/'),
        publicPath: publicPath
        // publicPath: './'
    },
    module: {
        loaders: [{
            test: /\.(png|jpg)$/,
            loader: 'url?limit=20480&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
        }, {
            test: /\.css$/,
            loaders: ['style', 'css']
        }]
    },
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ],
    module.exports.devtool = false
} else {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module.exports.devtool = '#eval-source-map'
}