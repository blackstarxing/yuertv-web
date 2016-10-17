var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var request = require('request');

router.get('/', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('http://www.kaisaiba.com/api/banner/list', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }, function(cont) {
        var parm = {}
        parm.jsonInfo = JSON.stringify({ pageNumber: 1 });
        request('http://www.kaisaiba.com/api/event/getRecommendEventRoundList', parm, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }, function(cont) {
        request('http://www.kaisaiba.com/api/isLogin', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        res.render('index', {
            title: "首页",
            bannerlists: JSON.parse(result[0]).object.list,
            recommendlists: JSON.parse(result[1]).object.map.eventmsTop.slice(0, 3),
            matchlists: JSON.parse(result[1]).object.map.eventmsBottom.slice(0, 9),
            islogin: JSON.parse(result[2]).object.loginFlag,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: "登录", islogin: false });
});

router.get('/register', function(req, res, next) {
    res.render('register', { title: "注册", registerPage: true });
});
router.get('/center', function(req, res, next) {
    res.render('center', { title: "个人中心" });
});

router.get('/center', function(req, res, next) {
    res.render('center', { title: "个人中心" });
});
router.get('/realname', function(req, res, next) {
    res.render('center', { title: "个人中心--实名认证" });
});
router.get('/register', function(req, res, next) {
    res.render('register', { title: "注册", islogin: false });
});
module.exports = router;