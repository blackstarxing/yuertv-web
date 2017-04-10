var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var request = require('request');

// 微信分享ticket
var ticket = '';
var ticketline = '';

var path = 'http://172.16.10.11:8777';
var apipath ="http://172.16.10.134:8099";
// var path = 'http://qa.webapi.yuerlive.cn';
// var apipath ="http://qa.api.yuerlive.cn";

function getTicket(){
    Thenjs.parallel([function(cont) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf96f728533f32fa8&secret=5007eda46723c5faf79a8b9ca3be131a', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        Thenjs.parallel([function(cont) {
            console.log(JSON.parse(result[0]).access_token);
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    cont(null, body);
                } else {
                    cont(new Error('error!'));
                }
            })
        }]).then(function(cont, result) {
            ticket = JSON.parse(result[0]).ticket;
            ticketline = new Date().getTime();
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
}

router.get('/', function(req, res, next) {
    var from = req.query.from;
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        res.redirect('http://m.yuerlive.cn/#/index');
    }
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/index?from='+from,
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
        res.render('index', {
            title: "娱儿直播--领跑移动电竞的直播平台",
            index: JSON.parse(result[0]).object,
            islogin: islogin,
            nav_index: 0,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/liveroom', function(req, res, next) {
    var id = req.query.id;
    var from = '';
    if(req.query.from){
        from = req.query.from;
    }
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        res.redirect('http://m.yuerlive.cn/#/liveDetail?id='+id);
    }
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/live/detail?id='+id+'&from='+from,
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
        request(path+'/gift/list', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('liveroom', {
            title: JSON.parse(result[0]).object.info.title+JSON.parse(result[0]).object.info.nickname+'-娱儿-手游直播攻略平台',
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
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('register', { title: "注册" ,islogin:islogin});
});

router.get('/reset', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('reset', { title: "找回密码" ,islogin:islogin});
});

router.get('/service', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('service', { title: "用户协议" ,islogin:islogin});
});

router.get('/center/information', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/person-center/user-info',
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
        console.log("zhangli"+JSON.parse(result[0]).object.icon);
        res.render('center/information', {
            title: "我的资料",
            index:0,
            info: JSON.parse(result[0]).object,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/center/focus', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('center/focus', { title: "我的关注" ,index:1,islogin:islogin});
});
router.get('/center/props', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/person-center/my-gifts',
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
        res.render('center/props', {
            title: "我的道具",
            index:2,
            myprops: JSON.parse(result[0]).object,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/center/message', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('center/message', { title: "我的消息" ,index:3,islogin:islogin});
});
router.get('/center/topup', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/pay/recharge-list',
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
            uri: path+'/person-center/my-yuer-coin',
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
        res.render('center/topup', {
            title: "我要充值",
            index:4,
            valuelist: JSON.parse(result[0]).object,
            valueyuer: JSON.parse(result[1]).object,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/center/host', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/person-center/user-info',
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
        console.log("zhangli"+JSON.parse(result[0]).object.icon);
        res.render('center/host', {
            title: "我要当主播",
            index:5,
            info: JSON.parse(result[0]).object,
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
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    console.log(id);
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/pay/alipay?id='+id,
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

router.get('/helpcenter', function(req, res, next) {
    var moduleId = req.query.moduleId;
    console.log(moduleId);
     var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/helpCenter/list?moduleId='+moduleId,
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
        console.log(JSON.parse(result[0]));
        res.render('helpcenter', {
            title: "帮助中心" ,
            islogin: islogin,
            moduleId:moduleId,
            navigation: JSON.parse(result[0]).object,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
    
});

router.get('/valuesuccess', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('valuesuccess', { title: "充值成功", islogin: islogin });
});

router.get('/activity', function(req, res, next) {
    var id = req.url.split('=')[1];
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/activity/detail?id='+id,
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
        res.render('activity', {
            title: JSON.parse(result[0]).object.info.title,
            detail: JSON.parse(result[0]).object,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/search', function(req, res, next) {
    var content = req.url.split('=')[1];
    content = decodeURIComponent(content);
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/search/live?param='+content+'&page=1&pageSize=30',
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
        res.render('search', {
            title: "搜索",
            result: JSON.parse(result[0]).object,
            islogin: islogin,
            content:content,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/alllive', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        res.redirect('http://m.yuerlive.cn/#/lives');
    }
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/live/list?page=1&pageSize=30',
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
        res.render('alllive', {
            title: "娱儿-手游直播攻略平台",
            live: JSON.parse(result[0]).object,
            islogin: islogin,
            nav_index : 1,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/allvideo', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
    if(agentID){
        res.redirect('http://m.yuerlive.cn/#/videos');
    }
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/video/list?page=1&pageSize=30',
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
        res.render('allvideo', {
            title: "全部视频",
            video: JSON.parse(result[0]).object,
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/liveShare', function(req, res, next) {
    var id = req.query.id;
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/live/detail?id='+id,
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
        res.render('liveShare', {
            title: JSON.parse(result[0]).object.info.title,
            result: JSON.parse(result[0]).object,
            id:id,
            link:JSON.parse(result[0]).object.info.rtmp.replace(/rtmp:/, "http:").replace(/rtmp/, "hls")+'.m3u8',
            ticket:ticket,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/activity/cecgame', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request(path+'/live/detail?id=4', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    },function(cont) {
        request(path+'/live/detail?id=8', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('activity/cecgame', {
            one: JSON.parse(result[0]).object.info,
            two: JSON.parse(result[1]).object.info,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
    // res.render('cecgame', { title: "CEC" });
});

router.get('/activity/cecforum', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request(path+'/live/detail?id=8', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    },function(cont) {
        request(path+'/live/detail?id=4', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('activity/cecforum', {
            one: JSON.parse(result[0]).object.info,
            two: JSON.parse(result[1]).object.info,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
    // res.render('cecforum', { title: "CEC" });
});

router.get('/activity/propage', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/propage', {
        ticket: ticket
    });
});

router.get('/mobile/down', function(req, res, next) {
    res.render('mobile/down', { title: "娱儿TV--领跑移动电竞的直播平台" });
});
router.get('/mobile/teachhost', function(req, res, next) {
    res.render('mobile/teachhost', { title: "娱儿TV--领跑移动电竞的直播平台" });
});
router.get('/mobile/author', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('mobile/author', {
        ticket: ticket
    });
});
router.get('/activity/datashow', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    var token = req.query.token;
    var userId = req.query.userId;
    Thenjs.parallel([function(cont) {
        request({
            uri: 'http://yuerapi.wangyuhudong.com/yearly/rank',
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
    },function(cont) {
        request({
            uri:'http://yuerapi.wangyuhudong.com/yearlyUserData?userId='+userId,
             headers: {
                'User-Agent': 'request',
                'cookie': req.headers.cookie,
              }
        },function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        if(JSON.parse(result[1]).code == 0){
            var daily_max_fans_date_month = "",
                daily_max_fans_date_day = "",
                first_concern_date_month = "",
                first_concern_date_day = "",
                first_live_date_month = "",
                first_live_date_day = "",
                register_date_month = "",
                register_date_day = "",
                first_get_gift_date_month = "",
                first_get_gift_date_day = "",
                first_send_gift_date_month = "",
                first_send_gift_date_day = "",
                first_fan_date_month = "",
                first_fan_date_day = "";
            if(JSON.parse(result[1]).object.daily_max_fans_date){
                daily_max_fans_date_month = JSON.parse(result[1]).object.daily_max_fans_date.split('-')[1];
                daily_max_fans_date_day = JSON.parse(result[1]).object.daily_max_fans_date.split('-')[2];
            }
            if(JSON.parse(result[1]).object.first_concern_date){
                first_concern_date_month = JSON.parse(result[1]).object.first_concern_date.split('-')[1];
                first_concern_date_day = JSON.parse(result[1]).object.first_concern_date.split('-')[2];
            }
            if(JSON.parse(result[1]).object.first_live_date){
                first_live_date_month = JSON.parse(result[1]).object.first_live_date.split('-')[1];
                first_live_date_day = JSON.parse(result[1]).object.first_live_date.split('-')[2];
            }
            if(JSON.parse(result[1]).object.register_date){
                register_date_month = JSON.parse(result[1]).object.register_date.split('-')[1];
                register_date_day = JSON.parse(result[1]).object.register_date.split('-')[2];
            }
            if(JSON.parse(result[1]).object.first_get_gift_date){
                first_get_gift_date_month = JSON.parse(result[1]).object.first_get_gift_date.split('-')[1];
                first_get_gift_date_day = JSON.parse(result[1]).object.first_get_gift_date.split('-')[2];
            }
            if(JSON.parse(result[1]).object.first_send_gift_date){
                first_send_gift_date_month = JSON.parse(result[1]).object.first_send_gift_date.split('-')[1];
                first_send_gift_date_day = JSON.parse(result[1]).object.first_send_gift_date.split('-')[2];
            }
            if(JSON.parse(result[1]).object.first_fan_date){
                first_fan_date_month = JSON.parse(result[1]).object.first_fan_date.split('-')[1];
                first_fan_date_day = JSON.parse(result[1]).object.first_fan_date.split('-')[2];
            }
            res.render('activity/datashow', {
                title: "数据分享",
                dataShow: JSON.parse(result[0]).object,
                datainfo: JSON.parse(result[1]).object,
                daily_max_fans_date_month:daily_max_fans_date_month,
                daily_max_fans_date_day:daily_max_fans_date_day,
                first_concern_date_month:first_concern_date_month,
                first_concern_date_day:first_concern_date_day,
                first_live_date_month:first_live_date_month,
                first_live_date_day:first_live_date_day,
                register_date_month:register_date_month,
                register_date_day:register_date_day,
                first_get_gift_date_month:first_get_gift_date_month,
                first_get_gift_date_day:first_get_gift_date_day,
                first_send_gift_date_month:first_send_gift_date_month,
                first_send_gift_date_day:first_send_gift_date_day,
                first_fan_date_month:first_fan_date_month,
                first_fan_date_day:first_fan_date_day,
                ticket:ticket,
            });
        }else{
            res.render('activity/datashow', {
                title: "数据分享",
                dataShow: JSON.parse(result[0]).object,
            }); 
        }
        
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/activity/recruit', function(req, res, next) {
    res.render('activity/recruit');
});
router.get('/activity/wkthr', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/wkthr',{ ticket:ticket});
});
router.get('/activity/wkthrmiddle', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/wkthrmiddle',{ ticket:ticket});
});
router.get('/activity/wkthrshow', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/wkthrshow');
});
router.get('/activity/wkthrweb', function(req, res, next) {
    res.render('activity/wkthrweb');
});
router.get('/activity/king', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    Thenjs.parallel([function(cont) {
        request(path+'/live/detail?id=8548', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('activity/king', {
            one: JSON.parse(result[0]).object.info,
            ticket:ticket
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/mobile/activityShare', function(req, res, next) {
    var id = req.query.id;
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/activity/detail?id='+id,
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
        res.render('mobile/activityShare', {
            title: JSON.parse(result[0]).object.info.title,
            result: JSON.parse(result[0]).object,
            ticket:ticket,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/activity/lolfinal', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf96f728533f32fa8&secret=5007eda46723c5faf79a8b9ca3be131a', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        Thenjs.parallel([function(cont) {
            console.log(JSON.parse(result[0]).access_token);
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    cont(null, body);
                } else {
                    cont(new Error('error!'));
                }
            })
        }]).then(function(cont, result) {
            console.log(JSON.parse(result[0]).ticket);
            res.render('activity/lolfinal', {
                ticket: JSON.parse(result[0]).ticket,
            });
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/activity/bostonMain', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf96f728533f32fa8&secret=5007eda46723c5faf79a8b9ca3be131a', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        Thenjs.parallel([function(cont) {
            console.log(JSON.parse(result[0]).access_token);
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    cont(null, body);
                } else {
                    cont(new Error('error!'));
                }
            })
        }]).then(function(cont, result) {
            ticket = JSON.parse(result[0]).ticket;
            Thenjs.parallel([function(cont) {
                request({
                    uri: path+'/live/detail?id=3751',
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
                res.render('activity/bostonMain', {
                    ticket: ticket,
                    state: JSON.parse(result[0]).object.info.state,
                });
            }).fail(function(cont, error) { 
                console.log(error);
                res.render('error', { title: "错误"});
            });
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/activity/bostonSecond', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf96f728533f32fa8&secret=5007eda46723c5faf79a8b9ca3be131a', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        Thenjs.parallel([function(cont) {
            console.log(JSON.parse(result[0]).access_token);
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    cont(null, body);
                } else {
                    cont(new Error('error!'));
                }
            })
        }]).then(function(cont, result) {
            ticket = JSON.parse(result[0]).ticket;
            Thenjs.parallel([function(cont) {
                request({
                    uri: path+'/live/detail?id=3751',
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
                res.render('activity/bostonSecond', {
                    ticket: ticket,
                    state: JSON.parse(result[0]).object.info.state,
                });
            }).fail(function(cont, error) { 
                console.log(error);
                res.render('error', { title: "错误"});
            });
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/activity/chinatop', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf96f728533f32fa8&secret=5007eda46723c5faf79a8b9ca3be131a', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        Thenjs.parallel([function(cont) {
            console.log(JSON.parse(result[0]).access_token);
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    cont(null, body);
                } else {
                    cont(new Error('error!'));
                }
            })
        }]).then(function(cont, result) {
            ticket = JSON.parse(result[0]).ticket;
            Thenjs.parallel([function(cont) {
                request({
                    uri: path+'/live/detail?id=3751',
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
                res.render('activity/chinatop', {
                    ticket: ticket,
                    state: JSON.parse(result[0]).object.info.state,
                });
            }).fail(function(cont, error) { 
                console.log(error);
                res.render('error', { title: "错误"});
            });
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/guide/about', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('guide/about', { title: "关于我们" ,islogin:islogin});
});

router.get('/guide/contact', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('guide/contact', { title: "联系我们" ,islogin:islogin});
});

router.get('/rules', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('rules', { title: "主播管理条例" ,islogin:islogin});
});

router.get('/guide/copyright', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('guide/copyright', { title: "著作权声明" ,islogin:islogin});
});

router.get('/guide/join', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('guide/join', { title: "人才招聘" ,islogin:islogin});
});

router.get('/activity/hrecruit', function(req, res, next) {
    res.render('activity/hrecruit', { title: "主播招募" });
});
router.get('/activity/general', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/general', {
        ticket: ticket
    });
});
// router.get('/activity/flv', function(req, res, next) {
//     Thenjs.parallel([function(cont) {
//         request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf96f728533f32fa8&secret=5007eda46723c5faf79a8b9ca3be131a', function(error, response, body) {
//             if (!error && response.statusCode == 200) {
//                 cont(null, body);
//             } else {
//                 cont(new Error('error!'));
//             }
//         })
//     }]).then(function(cont, result) {
//         Thenjs.parallel([function(cont) {
//             console.log(JSON.parse(result[0]).access_token);
//             request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
//                 if (!error && response.statusCode == 200) {
//                     cont(null, body);
//                 } else {
//                     cont(new Error('error!'));
//                 }
//             })
//         }]).then(function(cont, result) {
//             ticket = JSON.parse(result[0]).ticket;
//             res.render('activity/flv', {
//                 ticket: ticket
//             });
//         }).fail(function(cont, error) { 
//             console.log(error);
//             res.render('error', { title: "错误"});
//         });
//     }).fail(function(cont, error) { 
//         console.log(error);
//         res.render('error', { title: "错误"});
//     });
// });
router.get('/activity/ucg', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf96f728533f32fa8&secret=5007eda46723c5faf79a8b9ca3be131a', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        Thenjs.parallel([function(cont) {
            console.log(JSON.parse(result[0]).access_token);
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    cont(null, body);
                } else {
                    cont(new Error('error!'));
                }
            })
        }]).then(function(cont, result) {
            ticket = JSON.parse(result[0]).ticket;
            Thenjs.parallel([function(cont) {
                request({
                    uri: path+'/live/detail?id=3754',
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
                res.render('activity/ucg', {
                    ticket: ticket,
                    state: JSON.parse(result[0]).object.info.state,
                });
            }).fail(function(cont, error) { 
                console.log(error);
                res.render('error', { title: "错误"});
            });
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/spread/tashan', function(req, res, next) {
    var type = req.query.type;
    var index = req.query.index;
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    Thenjs.parallel([function(cont) {
        request({
            uri: path+'/taShanLive?type='+type+'&from=tashan',
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
        res.render('spread/tashan', {
            title: "娱儿TV--领跑移动电竞的直播平台",
            index: JSON.parse(result[0]).object[index],
            islogin: islogin,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/spread/login', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request({
            uri: apipath+'/v4/live/gameType?hasNum=0',
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
        res.render('spread/login', {
            title: "娱儿直播--领跑移动电竞的直播平台",
            index: JSON.parse(result[0]).object,
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
    // res.render('spread/login');
});
router.get('/activity/christmas', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxf96f728533f32fa8&secret=5007eda46723c5faf79a8b9ca3be131a', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        Thenjs.parallel([function(cont) {
            console.log(JSON.parse(result[0]).access_token);
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+JSON.parse(result[0]).access_token+'&type=jsapi', function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    cont(null, body);
                } else {
                    cont(new Error('error!'));
                }
            })
        }]).then(function(cont, result) {
            ticket = JSON.parse(result[0]).ticket;
            res.render('activity/christmas', {
                ticket: ticket
            });
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/activity/anchorRecruit', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/anchorRecruit', {
        ticket: ticket
    });
});

router.get('/activity/conduct', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/conduct', {
        ticket: ticket
    });
});

router.get('/mobile/agreement', function(req, res, next) {
    res.render('mobile/agreement', { title: "最终用户使用许可协议" });
});

router.get('/mobile/liveagreement', function(req, res, next) {
    res.render('mobile/liveagreement', { title: "最终用户使用许可协议" });
});

router.get('/activity/pvp', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/pvp', {
        ticket: ticket
    });
});

router.get('/activity/cardCoupon', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/cardCoupon', {
        ticket: ticket
    });
});
router.get('/activity/wolf', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    Thenjs.parallel([function(cont) {
        request(path+'/live/detail?id=8549', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        console.log(result);
        res.render('activity/wolf', {
            one: JSON.parse(result[0]).object.info,
            result: JSON.parse(result[0]).object,
            link:JSON.parse(result[0]).object.info.rtmp.replace(/rtmp:/, "http:").replace(/rtmp/, "hls")+'.m3u8',
            ticket:ticket
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/activity/wolfmiddle', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    res.render('activity/wolfmiddle', {
        ticket: ticket
    });
});
// 微信提现
router.get('/cash/withdrawCash', function(req, res, next) {
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    var deviceAgent = req.headers["user-agent"].toLowerCase();
    var iswechat = deviceAgent.match(/MicroMessenger/i)=="micromessenger";
    res.render('cash/withdrawCash', {
        ticket: ticket,
        iswechat: iswechat
    });
});
router.get('/cash/personcenter', function(req, res, next) {
    var nowtime = new Date().getTime();
    var islogin = false;
    var userId = req.query.userId;
    var token = req.query.token;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    Thenjs.parallel([function(cont) {
        request({
            uri: path+"/withdraw/personalCenter?userId="+userId+"&token="+token,
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
        res.render('cash/personcenter', {
            title: "娱儿直播--领跑移动电竞的直播平台",
            livenum: JSON.parse(result[0]).object,
            ticket:ticket,
        });  
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/cash/signup', function(req, res, next) {
    var nowtime = new Date().getTime();
    var userId= req.query.userId;
    var token= req.query.token;
    var type;
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    if(userId && token){
        Thenjs.parallel([function(cont) {
            request({
                uri: path+"/withdraw/enroll?userId="+userId+"&token="+token,
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
            if(JSON.parse(result[0]).object.code == 1){
                type=true;
                res.render('cash/signup', {
                    title: "娱儿直播--领跑移动电竞的直播平台",
                    ticket: ticket,
                    type:type,
                });
            }
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }else{
        res.render('cash/signup', {
            ticket: ticket
        });
    }    
});
router.get('/mobile/bbs', function(req, res, next) {
    var id = req.query.id;
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    Thenjs.parallel([function(cont) {
        request(path+'/bbs/share?id='+id, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        res.render('mobile/bbs', {
            info:JSON.parse(result[0]).object.bbsInfo,
            imgs:JSON.parse(result[0]).object.bbsInfo.imgs?JSON.parse(result[0]).object.bbsInfo.imgs.split(','):'',
            comments:JSON.parse(result[0]).object.comment,
            ticket:ticket
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
router.get('/mobile/news', function(req, res, next) {
    var id = req.query.id;
    var nowtime = new Date().getTime();
    if(!ticket || (nowtime-ticketline)>7000000){
        getTicket();
    }
    Thenjs.parallel([function(cont) {
        request(path+'/news/share?id=4104215', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    }]).then(function(cont, result) {
        if(JSON.parse(result[0]).code == 0){
            var content="",
                month = "",
                day = "",
                time = "",
                date = "",
                m = "",
                d="";
            if(JSON.parse(result[0]).object.newsInfo){
                month=JSON.parse(result[0]).object.newsInfo.create_date.split('-')[1];
                day=JSON.parse(result[0]).object.newsInfo.create_date.substr(8,2);
                time = JSON.parse(result[0]).object.newsInfo.create_date.substr(11,5);
                date = new Date(JSON.parse(result[0]).object.newsInfo.create_date);
                m = date.getMonth() + 1,
                d = date.getDate();
                content=JSON.parse(result[0]).object.newsInfo.content.replace(/<\/?[^>]*>/g,'');
            }
            res.render('mobile/news', {
                title: "资讯详情",
                info:JSON.parse(result[0]).object.newsInfo,
                comments:JSON.parse(result[0]).object.comment,
                month:month,
                day:day,
                m:m,
                d:d,
                time:time,
                content:content,
                ticket:ticket,
            });
        }else{
            res.render('mobile/news', {
                ticket:ticket
            });
        } 
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});
module.exports = router;