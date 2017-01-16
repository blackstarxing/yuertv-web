var express = require('express');
var router = express.Router();
var Thenjs = require('thenjs');
var request = require('request');

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
    Thenjs.parallel([function(cont) {
        request({
            uri: 'http://172.16.2.62:8777/index?from='+from,
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
            uri: 'http://172.16.2.62:8777/live/detail?id='+id,
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

router.get('/center', function(req, res, next) {
    var type = req.url.split('=')[1];
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
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
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
            uri: 'http://172.16.2.62:8777/helpCenter/list?moduleId='+moduleId,
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
            uri: 'http://172.16.2.62:8777/activity/detail?id='+id,
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
            uri: 'http://172.16.2.62:8777/search/live?param='+content+'&page=1&pageSize=30',
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
    Thenjs.parallel([function(cont) {
        request({
            uri: 'http://172.16.2.62:8777/live/list?page=1&pageSize=30',
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
            title: "全部直播",
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
    Thenjs.parallel([function(cont) {
        request({
            uri: 'http://172.16.2.62:8777/video/list?page=1&pageSize=30',
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
    var id = req.url.split('=')[1];
    var ticket = '';
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
                    uri: 'http://172.16.2.62:8777/live/detail?id='+id,
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
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
});

router.get('/activity/cecgame', function(req, res, next) {
    Thenjs.parallel([function(cont) {
        request('http://172.16.2.62:8777/live/detail?id=4', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    },function(cont) {
        request('http://172.16.2.62:8777/live/detail?id=8', function(error, response, body) {
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
        request('http://172.16.2.62:8777/live/detail?id=8', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                cont(null, body);
            } else {
                cont(new Error('error!'));
            }
        })
    },function(cont) {
        request('http://172.16.2.62:8777/live/detail?id=4', function(error, response, body) {
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
            res.render('activity/propage', {
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
    // res.render('activity/propage', { title: "百万主播招募活动页" });
});

router.get('/mobile/down', function(req, res, next) {
    res.render('mobile/down', { title: "娱儿TV--领跑移动电竞的直播平台" });
});

router.get('/mobile/author', function(req, res, next) {
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
            res.render('mobile/author', {
                ticket: JSON.parse(result[0]).ticket
            });
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
        });
    }).fail(function(cont, error) { 
        console.log(error);
        res.render('error', { title: "错误"});
    });
    // res.render('mobile/author', { title: "娱儿TV--领跑移动电竞的直播平台" });
});

router.get('/activity/recruit', function(req, res, next) {
    res.render('activity/recruit');
});

router.get('/mobile/activityShare', function(req, res, next) {
    var id = req.query.id;
    // var id = req.url.split('=')[1];
    var ticket = '';
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
                    uri: 'http://172.16.2.62:8777/activity/detail?id='+id,
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
        }).fail(function(cont, error) { 
            console.log(error);
            res.render('error', { title: "错误"});
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
                    uri: 'http://172.16.2.62:8777/live/detail?id=3751',
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
                    uri: 'http://172.16.2.62:8777/live/detail?id=3751',
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
                    uri: 'http://172.16.2.62:8777/live/detail?id=3751',
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

router.get('/about', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('about', { title: "关于我们" ,islogin:islogin});
});

router.get('/connect', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('connect', { title: "联系我们" ,islogin:islogin});
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

router.get('/copyright', function(req, res, next) {
    var islogin = false;
    if(req.headers.cookie){
        if(req.headers.cookie.indexOf('yuer_userId')>=0){
           islogin = true; 
       }        
    }else{
        islogin = false;
    };
    res.render('copyright', { title: "著作权声明" ,islogin:islogin});
});

router.get('/activity/hrecruit', function(req, res, next) {
    res.render('activity/hrecruit', { title: "主播招募" });
});
router.get('/activity/general', function(req, res, next) {
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
            res.render('activity/general', {
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
router.get('/activity/flv', function(req, res, next) {
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
            res.render('activity/flv', {
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
                    uri: 'http://172.16.2.62:8777/live/detail?id=3754',
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
            uri: 'http://172.16.2.62:8777/taShanLive?type='+type+'&from=tashan',
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
            res.render('activity/anchorRecruit', {
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

router.get('/activity/conduct', function(req, res, next) {
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
            res.render('activity/conduct', {
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

router.get('/mobile/agreement', function(req, res, next) {
    res.render('mobile/agreement', { title: "最终用户使用许可协议" });
});

router.get('/mobile/liveagreement', function(req, res, next) {
    res.render('mobile/liveagreement', { title: "最终用户使用许可协议" });
});

module.exports = router;