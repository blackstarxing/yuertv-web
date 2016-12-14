$(function(){
    function resize(){
        var clientW = document.body.clientWidth;
        var clientH = document.body.offsetHeight;
        var liveW = clientW - 440;
        var chatroomH = clientH - 300;
        $('.m-live-left').css("width",liveW+"px");
        $('.videoBox').css("height",0.56*liveW+"px");
        $('.right-block').css("height",chatroomH+"px");
        if(clientW<1340){
            $('.send-gift').addClass('m-l-gift');
        }else{
            $('.send-gift').removeClass('m-l-gift');
        }
    }
    resize();
    $(window).resize(function() {
        resize();
    });

    var islogin = (document.cookie.indexOf('yuer_userId')>=0) ? 1 : 0;

    var live_account = "",
        live_token = "",
        nickname = "";

    var hidegiftmes = "",
        hideEnter = "";

    var lct = document.getElementById('chatarea');

    var lastTime = "",
        giftNumber = 1,
        giftName = "";


    if(!islogin){
        $.ajax({
            method: "GET",
            url: "/api/visitor",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    live_account = data.object.accid;
                    live_token = data.object.token;
                    enterLiveroom();
                }else{
                    console.log(data.result);
                }
            },
            error: function(a, b, c) {
                console.log("接口出问题啦");
            }
        }); 
    }else{
        live_account = window.localStorage.getItem("id");
        live_token = window.localStorage.getItem("id");
        nickname = window.localStorage.getItem("nickname");
        enterLiveroom();
    }

    var giftparm = {};
    giftparm.type = 2;
    giftparm.upUserId = $('.hide-rtmp').attr('data-anchorid');
    $.ajax({
        method: "GET",
        url: "/api/contributionRank",
        dataType: 'json',
        data: giftparm,
        success: function(data) {
            if (data.code == 0) {
                var contributionRank = '';
                for(var i=0;i<data.object.length;i++){
                    contributionRank+='<div class="contributionRank f-cb">'+
                    '<div class="bank-left f-fl"><span class="rank-index">'+(i+1)+'</span><div class="bank-head"><img src="http://img.wangyuhudong.com/'+data.object[i].icon+'" alt=""></div>'+data.object[i].nickname+'</div>'+
                    '<div class="bank-right f-fr"><span>'+data.object[i].yuer_coin+'</span>鱼币</div>'+
                '</div>';
                }
                $('.gift-block').html(contributionRank);
            }else{
                console.log(data.result);
            }
        },
        error: function(a, b, c) {
            console.log("接口出问题啦");
        }
    });

    $('.wantreport').click(function(e){
        e.preventDefault();
        if(islogin){
           $('.m-report-mask').show();
        }else{
            $('.m-login-wrap').show();
        }
    })

    $('.report-radio label').click(function(){
        var radioId = $(this).attr('name');
        $('.report-radio label').removeAttr('class') && $(this).attr('class', 'checked');
        $('.report-radio input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
    });

    $('.u-report-next').click(function(e){
        e.preventDefault();
        $('.m-report-mask').hide();
        $('.m-result-mask').show();
        setTimeout(function(){
            $('.m-result-mask').hide();
        },1500);
        $('.report').text('已举报').off().click(function(e){e.preventDefault()});
    });

    $('.u-report-cancel').click(function(e){
        e.preventDefault();
        $('.m-report-mask').hide();
    });

    $('.givemoney').click(function(e){
        e.preventDefault();
        if(islogin){
           window.location.href = '/center/topup';
        }else{
            $('.m-login-wrap').show();
        }
    });

    $('.room-tab li').each(function(index){
        $(this).click(function(){
            $(this).addClass('current').siblings().removeClass('current');
            $('.right-block').eq(index).show().siblings('.right-block').hide();
        })
    })

    $('.m-livenav li').each(function(index){
        $(this).click(function(){
            $(this).addClass('current').siblings().removeClass('current');
            $('.recommendBox').eq(index).show().siblings('.recommendBox').hide();
        })
    });

    $('.follow,.disfollow').click(function(e){
        e.preventDefault();
        if(islogin){
            var parm = {};
            parm.userId = window.localStorage.getItem("id");
            parm.upUserId = $(this).attr('data-id');
            $.ajax({
                method: "GET",
                url: "/api/concern/up",
                dataType: 'json',
                data: parm,
                success: function(data) {
                    if (data.code == 0) {
                        console.log('关注成功！');
                        if($(e.currentTarget).attr('class')=='follow'){
                            $(e.currentTarget).attr('class','disfollow').text('已关注');
                        }else{
                            $(e.currentTarget).attr('class','follow').text('关注');
                        }
                    }else{
                        console.log(data.result);
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
        }else{
            $('.m-login-wrap').show();
        }
    })

    // 消息设置
    $('.set-option').hover(function(){
        $(this).find('.option-block').show();
    },function(){
        $(this).find('.option-block').hide();
    });

    $('.shield-radio label').click(function(){
        var radioId = $(this).attr('name');
        $('.shield-radio label').removeAttr('class') && $(this).attr('class', 'checked');
        $('.shield-radio input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
    });

    $('#shield1').click(function(){
        hidegiftmes = '';
        hideEnter = '';
        $('.gift-mes').removeClass('hidegiftmes');
        $('.memberEnter').removeClass('hideEnter');
    });

    $('#shield2').click(function(){
        hidegiftmes = 'hidegiftmes';
        hideEnter = '';
        $('.gift-mes').addClass('hidegiftmes');
        $('.memberEnter').removeClass('hideEnter');
    });

    $('#shield3').click(function(){
        hidegiftmes = '';
        hideEnter = 'hideEnter';
        $('.gift-mes').removeClass('hidegiftmes');
        $('.memberEnter').addClass('hideEnter');
    });

    $('.clearmes').click(function(){
        $('.mes-block').html('');
    })
    
    var endingtime = $('.hide-rtmp').attr('data-time')*60;
     

    $('.gift').hover(function(){
        $(this).find('.gift-hover').show();
    },function(){
        $(this).find('.gift-hover').hide();
    });

    $('.myGift').hover(function(){
        $(this).find('.my-prop').show();
    },function(){
        $(this).find('.my-prop').hide();
    })

    var giftlist = [];
    var proplist = [];
    var yuerCoin = null;

    function getGift(){
        $.ajax({
            method: "GET",
            url: "/api/gift/list",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    for(var i=0;i<data.object.length;i++){
                        var gift = {
                            id:data.object[i].id,
                            name: data.object[i].name,
                            icon:'http://img.wangyuhudong.com/'+data.object[i].icon,
                            noframe:data.object[i].no_frame_icon,
                            tips:data.object[i].name+'（<font color=\'#ffff00\'>'+data.object[i].price+'</font>鱼币）<br/>点击送给主播',
                        }
                        giftlist.push(gift);
                    }
                }else{
                    console.log(data.result);
                }
            },
            error: function(a, b, c) {
                console.log("接口出问题啦");
            }
        });
    } 
 

    getGift();
    // getProp();
    
    function enterLiveroom(){
        // 聊天室服务器地址
        var address=[];
        // 当前时间
        var myDate = new Date(),
            y = myDate.getFullYear(),   //获取完整的年份(4位,1970-????)
            m = myDate.getMonth()+1,      //获取当前月份(0-11,0代表1月)
            d = myDate.getDate(),       //获取当前日(1-31)
            h = myDate.getHours(),      //获取当前小时数(0-23)
            mi = myDate.getMinutes(),    //获取当前分钟数(0-59)
            s = myDate.getSeconds();   //获取当前秒数(0-59)
        var CurTime = Date.UTC(y,m,d,h,mi,s);
        var roomid = parseInt(4174310);
        var shaObj = new jsSHA("SHA-1", "TEXT");
        // AppSecret
        shaObj.update('1981023862be'+1+CurTime);
        var hash = shaObj.getHash("HEX");

        // 获取聊天室信息重要参数
        var appKey = '5585496885932f31d478ed0222072bcf',
            roomid = $('.hide-rtmp').attr('data-roomid'),
            accid = $('.hide-rtmp').attr('data-anchorid');

        $.ajax({
            url: "https://api.netease.im/nimserver/chatroom/requestAddr.action",
            contentType:"application/x-www-form-urlencoded;charset=utf-8",
            type: 'POST',
            beforeSend: function (req) {
                req.setRequestHeader('appkey', appKey);
                req.setRequestHeader('Nonce',1);
                req.setRequestHeader('CurTime',CurTime);
                req.setRequestHeader('CheckSum',hash);
            },
            data:{roomid:roomid,accid:accid}
        }).done(function(data) {
            console.log(data)
            if(data.code===200){
               address = data.addr;
               getChat();
            }else{
                alert("获取连接房间地址失败");
            }   
        })

        function getChat(){
            var chatroom = Chatroom.getInstance({
                appKey: appKey,
                account: live_account,
                token: live_token,
                chatroomId: roomid,
                chatroomNick: nickname,
                chatroomAddresses: address,
                onconnect: onChatroomConnect,
                onerror: onChatroomError,
                onwillreconnect: onChatroomWillReconnect,
                ondisconnect: onChatroomDisconnect,
                // 消息
                onmsgs: onChatroomMsgs
            });
            function sendChatroomMsgDone(error, msg) {
                console.log('发送聊天室' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient, error, msg);
                if(!error){
                    liveRoomInterf.flash.showDanmaku(msg.text, 0xffffff, 100);
                    $('.mes-block').append('<div class="text-mes"><span class="membName">'+nickname+' : </span>'+msg.text+'</div>');
                    $('.live-text').val("");
                    lct.scrollTop=Math.max(0,lct.scrollHeight-lct.offsetHeight);  
                }
            }

            function sendChatroomCustomMsgDone(error, msg) {
                console.log('发送聊天室' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient, error, msg);
                var gift = JSON.parse(msg.content);
                if(!error){
                    liveRoomInterf.flash.showDanmaku(nickname+'送给主播一个'+gift.data.giftName, 0xffffff, 100);
                    if(giftNumber>1){
                        $('.mes-block').append('<div class="gift-mes '+hidegiftmes+'"><span class="membName">'+nickname+' : 送给主播1个</span>'+gift.data.giftName+'<span class="combo">'+giftNumber+'<i></i></span></div>');
                    }else{
                        $('.mes-block').append('<div class="gift-mes '+hidegiftmes+'"><span class="membName">'+nickname+' : 送给主播1个</span>'+gift.data.giftName+'</div>');
                    }
                        lct.scrollTop=Math.max(0,lct.scrollHeight-lct.offsetHeight); 
                    }
            }
            function flashSend(text){
                var msg = chatroom.sendText({
                        text: text,
                        done: sendChatroomMsgDone
                    });
                    console.log('正在发送聊天室text消息, id=' + msg.idClient);
            }

            function flashSendCustom(name,id,icon,type){                
                var parm = {};
                parm.giftId = id;
                parm.num = 1;
                parm.upUserId = $('.hide-rtmp').attr('data-anchorid');
                parm.type = type;
                $.ajax({
                    method: "GET",
                    url: "/api/gift/send",
                    dataType: 'json',
                    data: parm,
                    success: function(data) {
                        if (data.code == 0) {
                            if(data.object.state == 0){
                                var nowTime = new Date().getTime();
                                console.log(nowTime);
                                if((nowTime-lastTime)<5000 && name == giftName){
                                    giftNumber+=1;
                                }else{
                                    giftNumber = 1;
                                }
                                lastTime = nowTime;
                                giftName = name;
                                var content = {
                                    type: 1,
                                    data: {
                                        giftName:name,
                                        giftNum:giftNumber,
                                        giftShowImage:icon,
                                        senderName:nickname,
                                        giftID:id,
                                        senderID:live_account
                                    }
                                };
                                var msg = chatroom.sendCustomMsg({
                                    content: JSON.stringify(content),
                                    done: sendChatroomCustomMsgDone
                                });
                                console.log('正在发送聊天室自定义消息, id=' + msg.idClient);
                                getProp();
                            }else{
                                if(data.object.str == '娱币不足'){
                                    $('.wallet-text').text('钱包空啦！赶紧去充值吧');
                                    $('.wallet-empty').fadeIn();
                                    setTimeout(function(){
                                        $('.wallet-empty').fadeOut();
                                    },2000);
                                }else{
                                   $('.wallet-text').text(data.object.str); 
                                   $('.wallet-empty').fadeIn();
                                    setTimeout(function(){
                                        $('.wallet-empty').fadeOut();
                                    },2000);
                               }                                
                            }
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                });
                
            }

            function getProp(){
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/my-gifts",
                    dataType: 'json',
                    success: function(data) {
                        var myprop = "";
                        if (data.code == 0) {
                            proplist = [];
                            if(data.object.gifts.length == 0){
                                myprop+='<div class="propBox" data-name="鱼饵" data-id="11"><img src="/images/prop.png" alt="">鱼饵<span>0</span></div>';
                            }else{
                                for(var i=0;i<data.object.gifts.length;i++){
                                    var prop = {
                                        id:data.object.gifts[i].id,
                                        name: data.object.gifts[i].name,
                                        icon:'http://img.wangyuhudong.com/'+data.object.gifts[i].icon,
                                        noframe:data.object.gifts[i].no_frame_icon,
                                        count:data.object.gifts[i].num,
                                    }
                                    myprop+='<div class="propBox" data-frame="'+data.object.gifts[i].no_frame_icon+'"data-name="'+data.object.gifts[i].name+'" data-id="'+data.object.gifts[i].id+'"><img src="http://img.wangyuhudong.com/'+data.object.gifts[i].icon+'" alt="">'+data.object.gifts[i].name+'<span>'+data.object.gifts[i].num+'</span></div>';
                                    proplist.push(prop);
                                    liveRoomInterf.flash.updateMyItems(proplist);
                                }
                            }                           
                            $('.my-prop').html(myprop);
                            $('.propBox').click(function(){
                                if(islogin){
                                    flashSendCustom($(this).attr('data-name'),$(this).attr('data-id'),$(this).attr('data-frame'),1);
                               }else{
                                    $('.m-login-wrap').show();
                               } 
                            });
                        }else{
                            myprop+='<div class="propBox" data-name="鱼饵" data-id="11"><img src="/images/prop.png" alt="">鱼饵<span>0</span></div>';
                            console.log(data.result);
                            $('.my-prop').html(myprop);
                            $('.propBox').click(function(){
                                if(islogin){
                                    flashSendCustom($(this).attr('data-name'),$(this).attr('data-id'),$(this).find('img').attr('src'),1);
                               }else{
                                    $('.m-login-wrap').show();
                               } 
                            });
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                });
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/user-info",
                    dataType: 'json',
                    success: function(data) {
                        if (data.code == 0) {
                            yuerCoin = data.object.yuerCoin;
                            $('.yuerCoin').html(data.object.yuerCoin);
                            liveRoomInterf.flash.updateCoins(yuerCoin);
                        }else{
                            $('.yuerCoin').html("0");
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                });               

            }

            function endingTime(val) { 
                if (endingtime > 0) { 
                    $('.endingtime').text(endingtime);
                    endingtime--;
                    setTimeout(function() { 
                        endingTime(val);
                    },1000);
                } else if(endingtime = 0){
                    $('.countdown').html('<div class="freegift">点击领取</div>');
                    $('.freegift').click(function(){
                        if(islogin){
                           $.ajax({
                                method: "GET",
                                url: "/api/dailyGift",
                                dataType: 'json',
                                success: function(data) {
                                    if (data.code == 0) {
                                        if(data.object && data.object.count_down!=25){
                                            getProp();
                                            endingtime = data.count_down*60;
                                            $('.countdown').html('<span class="endingtime">300</span>秒后<br>惊喜降临');
                                            setTimeout(function() { 
                                                endingTime(endingtime);
                                            },1000);
                                        }else{
                                            endingtime = 1500;
                                        }                                        
                                    }else{
                                        console.log(data.result);
                                    }
                                },
                                error: function(a, b, c) {
                                    console.log("接口出问题啦");
                                }
                            }); 
                       }else{
                            $('.m-login-wrap').show();
                       }
                        
                    })
                } else if(endingtime = 1500){
                    $('.countdown').html('福利已领完<br>明天再来吧');
                }
            } 

            liveRoomInterf = {

                //直播间Flash对象
                flash: null,
                //初始化Flash
                init: function ()
                {   
                    // alert(proplist[0]);
                    //播放直播视频，参数：视频地址
                    this.flash.playLive($('.hide-rtmp').html());
                    // rtmp://pili-live-rtmp.wangyuhudong.com/wyds/wyds_4231257?key=e27f6170-a1c7-4f6f-ae0f-1de109b6b1b7

                    //更新主播信息，参数：主播ID
                    this.flash.updateAnchor($('.hide-rtmp').attr('data-anchorid'));

                    //更新热词列表，参数：[热词1, 热词2, ...]

                    this.flash.updateHotWords(["666666666", "憋说话，吻我", "你是要上天吗？","主播求约", "1111111111111", "22222222222","23333333333", "不作死就不会死", "主播别逗", "简直要崩溃","快点吧", "带我飞", "夭寿啦"]);

                    //更新鱼币数量，参数：鱼币数量
                    // this.flash.updateCoins(yuerCoin);

                    //更新道具列表，参数：[道具1, 道具2, ...]
                    //道具格式：{id:道具ID, icon:道具图标, tips:道具提示（HTML格式）}
                    // this.flash.updateItems([
                    //     {id:1, name:"123",icon:"icon.png", tips:"贝壳（<font color='#ffff00'>10</font>鱼币）<br/>点击送给主播"},
                    //     {id:2, icon:"icon.png", tips:"海星（<font color='#ffff00'>20</font>鱼币）<br/>点击送给主播"},
                    //     {id:3, icon:"icon.png", tips:"水母（<font color='#ffff00'>30</font>鱼币）<br/>点击送给主播"},
                    //     {id:4, icon:"icon.png", tips:"龙虾（<font color='#ffff00'>40</font>鱼币）<br/>点击送给主播"},
                    //     {id:5, icon:"icon.png", tips:"螃蟹（<font color='#ffff00'>50</font>鱼币）<br/>点击送给主播"},
                    //     {id:6, icon:"icon.png", tips:"海马（<font color='#ffff00'>60</font>鱼币）<br/>点击送给主播"},
                    //     {id:7, icon:"icon.png", tips:"海龟（<font color='#ffff00'>70</font>鱼币）<br/>点击送给主播"},
                    //     {id:8, icon:"icon.png", tips:"鲸鱼（<font color='#ffff00'>80</font>鱼币）<br/>点击送给主播"},
                    // ]);
                    this.flash.updateItems(giftlist);

                    //更新我的道具列表，参数：[道具1, 道具2, ...]
                    //道具格式：{id:道具ID, icon:道具图标, name:道具名称, count:道具数量}
                    // this.flash.updateMyItems([
                    //     {id:1, icon:"icon.png", name:"贝壳", count:3},
                    //     {id:2, icon:"icon.png", name:"海星", count:2},
                    // ]);

                    getProp();

                    endingTime(endingtime); 

                    // this.flash.updateMyItems(proplist);

                    //显示弹幕，参数：弹幕文字, 颜色值（0xRRGGBB，默认0xffffff）, 滚动速度（像素/秒，默认100）, 延迟时间（秒，默认0，<0表示超前）, 纵坐标百分比（0~100，默认在10~70间随机）
                    // this.flash.showDanmaku("我是一条弹幕", 0xffffff, 100);
                    // this.flash.showDanmaku("我是延后显示的弹幕", 0xffff00, 150, 5);
                    // this.flash.showDanmaku("我是超前显示的弹幕", 0x00ffff, 80, -3);

                    //显示固定弹幕，参数：通告文字, 颜色值（0xRRGGBB，默认0xffffff）, 显示时间（秒，默认5）, 纵坐标百分比（0~100，默认10）
                    // this.flash.showStaticDanmaku("这是一条通告", 0xff0000, 10);
                },

                //刷新
                refresh: function ()
                {
                    this.flash.playLive($('.hide-rtmp').html());
                },

                //发送弹幕，参数：弹幕文字
                sendDanmaku: function ( text )
                {
                    //调用后台，发送成功后请回调 flash.showDanmaku
                    // this.flash.showDanmaku(text, 0xffff00, 100);
                    if(islogin){
                       flashSend(text); 
                    }else{
                        this.flash.exitFullscreen();
                        $('.m-login-wrap').show();
                    }
                    
                },

                //充值
                recharge: function ()
                {
                    if(islogin){
                       window.location.href = '/center?type=4';
                    }else{
                        this.flash.exitFullscreen();
                        $('.m-login-wrap').show();
                    }
                },

                //赠送礼物，参数：道具ID
                presentGift: function ( item , isMine)
                {   
                    // console.log(item.noframe)
                    //调用后台，若赠送的是购买的道具，请回调 flash.updateCoins，若赠送的是我的道具，请回调 flash.updateMyItems
                    if(islogin){
                        if(isMine){
                            isMine=1;
                        }else{
                            isMine=0;
                        }
                        // this.flash.showDanmaku(nickname+"送了一个"+name+"给主播", 0xffff00, 100);
                       flashSendCustom(item.name,item.id,item.noframe,isMine); 
                       
                    }else{
                        this.flash.exitFullscreen();
                        $('.m-login-wrap').show();
                    }
                    getGift();
                },
            };

            //视频播放器接口
            videoPlayerInterf = {

                //视频播放器Flash对象
                flash: null,

                isinit: false,

                callLater: function (callback)
                {
                    // if (this.isinit)
                    // {
                    //     callback();
                    // }
                    // else
                    // {
                        this.callback = callback;
                    // }
                },
                callback: null,

                //初始化Flash
                init: function ()
                {   
                    this.isinit = true;
                    if (this.callback != null)
                    {
                        this.callback();
                    }

                    //播放视频，参数：视频地址, 视频标题, 游戏名称
                    //this.flash.playVideo("http://pili-media.wangyuhudong.com/7FUkDXBrj3kr1leI8VjVFX6GGD0=/Fk8ffjjNrphUwlioPxjmXIB0R7tl", "界黄盖暴力输出，秒全场", "王者荣耀");
                    // this.flash.playVideo();

                    //更新主播信息，参数：主播ID, 主播昵称, 主播头像，是否已关注
                    //this.flash.updateAnchor("123", "奔波儿灞", "head.png", false);
                },

                //关注主播，参数：主播ID
                focusAnchor: function ( anchorId )
                {
                    //调用后台，关注成功后请回调 flash.updateAnchor
                    var _this = this;
                    if(islogin){
                        var parm = {};
                        parm.userId = window.localStorage.getItem("id");
                        parm.upUserId = anchorId;
                        $.ajax({
                            method: "GET",
                            url: "/api/concern/up",
                            dataType: 'json',
                            data: parm,
                            success: function(data) {
                                if (data.code == 0) {
                                    console.log('关注成功！');
                                    _this.flash.updateAnchor(anchorId, null, null, true);
                                    $('.video-open').attr('data-follow',1);
                                }else{
                                    console.log(data.result);
                                }
                            },
                            error: function(a, b, c) {
                                console.log("接口出问题啦");
                            }
                        });
                    }else{
                        $('.m-login-wrap').show();
                    }
                },
            };

            var att = {};
            att.width = "100%";
            att.height = "100%";
            var par = {};
            par.quality = "high";
            par.bgcolor = "#000000";
            par.allowscriptaccess = "sameDomain";
            par.allowfullscreen = "true";
            par.allowFullScreenInteractive = "true";
            par.wmode = "transparent";

            att.id = "LiveRoom";
            att.data = "YeLiveRoom.swf";
            liveRoomInterf.flash = swfobject.createSWF(att, par, "LiveRoomDiv");

            att.id = "VideoPlayer";
            att.data = "YeVideoPlayer.swf";
            videoPlayerInterf.flash = swfobject.createSWF(att, par, "VideoPlayerDiv");

            $('.sendText').click(function(){
                if(islogin){
                    if($('.live-text').val()){
                        flashSend($('.live-text').val());
                    }
                }else{
                    $('.m-login-wrap').show();
                }
                
            });

            $("body").keydown(function() {
                if (event.keyCode == "13") {//keyCode=13是回车键
                    $('.sendText').click();
                }
            }); 

            $('.quicktext li').click(function(){
                if(islogin){
                    flashSend($(this).text());
                    $('.quicktext').hide();
                }else{
                    $('.m-login-wrap').show();
                }
                
            });

            $('.gift').click(function(){
                if(islogin){
                    flashSendCustom($(this).attr('data-name'),$(this).attr('data-id'),$(this).attr('data-frame'),0); 
               }else{
                    $('.m-login-wrap').show();
               }           
            });

            $('.m-video .live-address').click(function(e){
                e.preventDefault();
                $(this).addClass('video-open').siblings('.live-address').removeClass('video-open');
                var name = $(this).attr('data-name'),
                    title = $(this).attr('data-title'),
                    flv = $(this).attr('data-rtmp'),
                    id = $(this).attr('data-id'),
                    nickname = $(this).attr('data-nickname'),
                    icon = $(this).parent().find('.head-icon').attr('src'),
                    follow = $(this).attr('data-follow')==1 ? true :false;
                $('.m-video-mask').show();
                liveRoomInterf.flash.pause();
                videoPlayerInterf.callLater(function () {
                    // videoPlayerInterf.flash.playVideo("http://pili-media.wangyuhudong.com/7FUkDXBrj3kr1leI8VjVFX6GGD0=/Fpe0CIJCfu80Ey29nmt4y2wVqhzx", "界黄盖暴力输出，秒全场", "王者荣耀");
                    videoPlayerInterf.flash.playVideo(flv,title,name);
                    videoPlayerInterf.flash.updateAnchor(id, nickname,icon, follow);
                });
                
            });
            $('.m-video-mask .close').click(function(e){
                e.preventDefault();
                $('.m-video-mask').hide();
                liveRoomInterf.flash.play();
            })

        }


        function onChatroomConnect(chatroom) {
            console.log('进入聊天室', chatroom);
            $('.mes-block').append("<div>你已进入聊天室！<div>"); 
            // var msg = chatroom.sendText({
            //     text: 'hello',
            //     done: sendChatroomMsgDone
            // });
            // console.log('正在发送聊天室text消息, id=' + msg.idClient);
            // function sendChatroomMsgDone(error, msg) {
            //     console.log('发送聊天室' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient, error, msg);
            // }
        }
        function onChatroomWillReconnect(obj) {
            // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
            console.log('即将重连', obj);
        }
        function onChatroomDisconnect(error) {
            // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
            console.log('连接断开', error);
            if (error) {
                switch (error.code) {
                // 账号或者密码错误, 请跳转到登录页面并提示错误
                case 302:
                    break;
                // 被踢, 请提示错误后跳转到登录页面
                case 'kicked':
                    break;
                default:
                    break;
                }
            }
            $('.mes-block').append("<div>聊天室连接断开，请刷新页面<div>"); 
        }
        function onChatroomError(error, obj) {
            console.log('发生错误', error, obj);
        }
        function onChatroomMsgs(msgs) {
            console.log('收到聊天室消息', msgs);
            // $('.chat').html(msgs)
            for(var i=0;i<msgs.length;i++){
                if(msgs[i].content){
                    var content=JSON.parse(msgs[i].content);
                    // console.log(content);
                    if(content.data.giftNum>1){
                        $('.mes-block').append('<div class="gift-mes '+hidegiftmes+'"><span class="membName">'+content.data.senderName+' : 送给主播1个</span>'+content.data.giftName+'<span class="combo">'+content.data.giftNum+'<i></i></span></div>');
                    }else{
                        $('.mes-block').append('<div class="gift-mes '+hidegiftmes+'"><span class="membName">'+content.data.senderName+' : 送给主播1个</span>'+content.data.giftName+'</div>');
                        liveRoomInterf.flash.showDanmaku(content.data.senderName+'送给主播一个'+content.data.giftName, 0xffffff, 100);
                    }
                }else if(msgs[i].text && msgs[i].fromNick){
                    var host = msgs[i].fromNick=="1" ? '<label for="">主播</label>&nbsp;' : '';
                    $('.mes-block').append('<div class="text-mes">'+host+'<span class="membName">'+msgs[i].fromNick+' : </span>'+msgs[i].text+'</div>');        
                    liveRoomInterf.flash.showDanmaku(msgs[i].text, 0xffffff, 100);
                }else if(msgs[i].text && !msgs[i].fromNick && msgs[i].custom){
                    var custom=JSON.parse(msgs[i].custom);
                    $('.mes-block').append('<div class="text-mes"><span class="membName">'+custom.nickname+' : </span>'+msgs[i].text+'</div>');        
                    liveRoomInterf.flash.showDanmaku(msgs[i].text, 0xffffff, 100);
                }else if(msgs[i].flow=="in" && !msgs[i].text && msgs[i].attach.fromNick && msgs[i].attach.type=="memberEnter"){
                    $('.mes-block').append('<div class="memberEnter '+hideEnter+'">欢迎用户'+msgs[i].attach.fromNick+'进入直播间</div>');
                }else if(msgs[i].flow=="in" && msgs[i].text && msgs[i].custom =="" ){
                    $('.mes-block').append('<div class="memberEnter '+hideEnter+'">'+msgs[i].text+'</div>');
                }
                lct.scrollTop=Math.max(0,lct.scrollHeight-lct.offsetHeight);       
            }

        }
    }

    $('.followme,.is-subscibe').click(function(e){
        e.preventDefault();
        var follownum = $('.follownum').text();
        if(islogin){
            var parm = {};
            parm.userId = window.localStorage.getItem("id");
            parm.upUserId = $(this).attr('data-id');
            $.ajax({
                    method: "GET",
                    url: "/api/concern/up",
                    dataType: 'json',
                    data: parm,
                    success: function(data) {
                        if (data.code == 0) {
                            console.log('关注成功！');
                            if($(e.currentTarget).attr('class')=='followme'){
                                $('.follownum').text(parseInt(follownum)+1);
                                $(e.currentTarget).attr('class','is-subscibe').html('已关注');
                            }else{
                                $('.follownum').text(parseInt(follownum)-1);
                                $(e.currentTarget).attr('class','followme').html('<i class="iconfont icon-follow"></i>关注');
                            }
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                });
        }else{
            $('.m-login-wrap').show();
        }
    })


})