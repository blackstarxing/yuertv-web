var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var request = require('request');

router.get('/', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        islogin = true;
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/index', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        res.render('index', {
            title: "娱儿直播_一个处女座都喜欢的手游直播平台",
            index: JSON.parse(result[0]).object,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/liveroom', function(req, res, next) {
    var id = req.url.split('=')[1];
    var islogin = false;
    if(req.headers.cookie){
        islogin = true;
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/live/detail', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    },function(cont) {
        request('http://172.16.2.62:8777/gift/list', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('liveroom', {
            title: "直播间",
            detail: JSON.parse(result[0]).object,
            gift: JSON.parse(result[1]).object,
            islogin: islogin,
            minihead :true,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/register', function(req, res, next) {
    res.render('register', { title: "注册", registerPage: true });
});

router.get('/center', function(req, res, next) {
    var type = req.url.split('=')[1];
    var islogin = false;
    if(req.headers.cookie){
        islogin = true;
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: 'http://172.16.2.62:8777/person-center/user-info',
            headers: {
                'User-Agent': 'request',
                'cookie': req.headers.cookie,
              }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    },function(cont) {
        request({
            uri: 'http://172.16.2.62:8777/person-center/my-gifts',
            headers: {
                'User-Agent': 'request',
                'cookie': req.headers.cookie,
              }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    },function(cont) {
        request({
            uri: 'http://172.16.2.62:8777/pay/recharge-list',
            headers: {
                'User-Agent': 'request',
                'cookie': req.headers.cookie,
              }
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('center', {
            title: "个人中心",
            info: JSON.parse(result[0]).object,
            myprops: JSON.parse(result[1]).object,
            valuelist: JSON.parse(result[2]).object,
            type:type,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/alipay', function(req, res, next) {
    var id = req.url.split('=')[1];
    var islogin = false;
    if(req.headers.cookie){
        islogin = true;
    }else{
        islogin = false;
    };
    console.log(id);
    Thenjs.parallel([function(cont) {
        request({
            uri: 'http://172.16.2.62:8777/pay/alipay?id='+id,
            headers: {
                'User-Agent': 'request',
                'cookie': req.headers.cookie,
            },
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('alipay', {
            title: "支付宝",
            myalipay: JSON.parse(result[0]).object,
            islogin: islogin,
            minihead :true,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/valuesuccess', function(req, res, next) {
    res.render('valuesuccess', { title: "充值成功", registerPage: true });
});

router.get('/activity', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        islogin = true;
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/index', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        res.render('activity', {
            title: "活动详情",
            recommend: JSON.parse(result[0]).object.live.slice(0,6),
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/search', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        islogin = true;
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/index', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        res.render('search', {
            title: "搜索",
            recommend: JSON.parse(result[0]).object.live.slice(0,6),
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/alllive', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        islogin = true;
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/index', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        res.render('alllive', {
            title: "全部直播",
            recommend: JSON.parse(result[0]).object.live,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/allvideo', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        islogin = true;
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/index', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        res.render('allvideo', {
            title: "全部视频",
            video: JSON.parse(result[0]).object.video,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

module.exports = router;