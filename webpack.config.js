var webpack = require('webpack');
var path = require('path');

var publicPath = 'http://localhost:3000/dist/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        layout: ['./client/js/layout.js'],
        index: ['./client/css/index.css', './client/js/index.js'],
        liveroom: ['./client/css/liveroom.css', './client/js/liveroom.js'],
        center: ['./client/css/center.css', './client/js/center.js'],
        register: ['./client/css/register.css', './client/js/register.js'],
        activity: ['./client/css/activity.css'],
        search: ['./client/css/search.css'],
    },
    output: {
        filename: './[name].[hash].js',
        path: path.resolve('./public/dist/'),
        // publicPath: publicPath
            publicPath: './'
    },
    module: {
        loaders: [{
            test: /\.(png|jpg)$/,
            loader: 'url?context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            loader: 'style!css?sourceMap!resolve-url!sass?sourceMap'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }, ]
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
            new ExtractTextPlugin('./[name].[hash].css', {
                allChunks: true
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
            new ExtractTextPlugin('./[name].css', {
                allChunks: true
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
        ],
        module.exports.devtool = '#eval-source-map'
}