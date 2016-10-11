var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var routerConfig = require('./server/middleware/router');
var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('./webpack.config.js');
var compiler = webpack(webpackDevConfig);
var NODE_ENV = process.env.NODE_ENV || 'production';
var isDev = NODE_ENV === 'development';

var routes = require('./server/routes/index');

var app = express();
nunjucks.configure('server/views', {
    autoescape: true,
    express: app
});

app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'html');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (isDev) {
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(path.join(__dirname, 'public')));
    
    routerConfig(app, {
        dirPath: __dirname + '/server/routes/'
    });
} else {
    app.use(express.static(path.join(__dirname, 'public')));
    routerConfig(app, {
        dirPath: __dirname + '/server/routes/'
    });
}

app.listen(3000);

module.exports = app;