var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var request = require('request');

router.get('/', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/index', function(error, response, body) {
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
            title: "娱儿直播_一个处女座都喜欢的手游直播平台",
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
router.get('/center/information', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/person-center/user-info', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('center/information', {
            title: "我的资料",
            info: JSON.parse(result[0]).object,
            // islogin: JSON.parse(result[2]).object.loginFlag,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/center/focus', function(req, res, next) {
    res.render('center/focus', { title: "我的关注" });
});
router.get('/center/props', function(req, res, next) {
    res.render('center/props', { title: "我的道具" });
});
router.get('/center/message', function(req, res, next) {
    res.render('center/message', { title: "我的消息" });
});
router.get('/center/top-up', function(req, res, next) {
    res.render('center/top-up', { title: "我要充值" });
});
router.get('/center/host', function(req, res, next) {
    res.render('center/host', { title: "我要当主播" });
});

module.exports = router;