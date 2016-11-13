$(function(){
    function resize(){
        var clientW = document.body.clientWidth;
        var clientH = document.body.offsetHeight;
        var liveW = clientW - 440;
        var chatroomH = clientH - 300;
        $('.m-live-left').css("width",liveW+"px");
        $('.videoBox').css("height",0.56*liveW+"px");
        $('.room-block').css("height",chatroomH+"px");
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
    console.log(islogin);
    
    var endingtime = 300;
    function endingTime(val) { 
        if (endingtime > 0) { 
            $('.endingtime').text(endingtime);
            endingtime--;
            setTimeout(function() { 
                endingTime(val);
            },1000);
        } else {
            $('.countdown').html('<div class="freegift">点击领取</div>');
            $('.freegift').click(function(){
                $.ajax({
                    method: "GET",
                    url: "/api/tv/gift/dailyGift",
                    dataType: 'json',
                    success: function(data) {
                        if (data.code == 0) {
                            endingtime = 300;
                            $('.countdown').html('<span class="endingtime">300</span>秒后<br>惊喜降临');
                            setTimeout(function() { 
                                endingTime(endingtime);
                            },1000);
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                });
            })
        } 
    } 
    endingTime(endingtime);  

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
                            tips:data.object[i].name+'（<font color=\'#ffff00\'>10</font>鱼币）<br/>点击送给主播',
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

    function getProp(){
        $.ajax({
            method: "GET",
            url: "/api/person-center/my-gifts",
            dataType: 'json',
            success: function(data) {
                if (data.code == 0) {
                    var myprop = "";
                    for(var i=0;i<data.object.gifts.length;i++){
                        var prop = {
                            id:data.object.gifts[i].id,
                            name: data.object.gifts[i].name,
                            icon:'http://img.wangyuhudong.com/'+data.object.gifts[i].icon,
                            count:data.object.gifts[i].num,
                        }
                        myprop+='<div class="propBox" data-name="'+data.object.gifts[i].name+'" data-id="'+data.object.gifts[i].id+'"><img src="http://img.wangyuhudong.com/'+data.object.gifts[i].icon+'" alt="">'+data.object.gifts[i].name+'<span>'+data.object.gifts[i].num+'</span></div>';
                        proplist.push(prop);
                    }
                    $('.my-prop').html(myprop);
                }else{
                    console.log(data.result);
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
                }else{
                    $('.yuerCoin').html("0");
                }
            },
            error: function(a, b, c) {
                console.log("接口出问题啦");
            }
        });
    } 

    getGift();
    getProp();
    
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
        roomid = '4580501',
        accid = '3835355';

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
            account: accid,
            token: accid,
            chatroomId: roomid,
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
                $('.room-block').append('<div class="text-mes"><span class="membName">blackstar : </span>'+msg.text+'</div>');
                $('.live-text').val("");
            }
        }

        function sendChatroomCustomMsgDone(error, msg) {
            console.log('发送聊天室' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient, error, msg);
            var gift = JSON.parse(msg.content);
            if(!error){
                liveRoomInterf.flash.showDanmaku('blackstar送给主播一个'+gift.data.giftName, 0xffffff, 100);
                $('.room-block').append('<div class="gift-mes"><span class="membName">blackstar : 送给主播1个</span>'+gift.data.giftName+'</div>');
                // $('.live-text').val("");
            }
        }
        function flashSend(text){
            var msg = chatroom.sendText({
                    text: text,
                    done: sendChatroomMsgDone
                });
                console.log('正在发送聊天室text消息, id=' + msg.idClient);
        }

        function flashSendCustom(name,id,type){
            var parm = {};
            parm.giftId = id;
            parm.num = 1;
            parm.upUserId = 1;
            parm.type = type;
            $.ajax({
                method: "GET",
                url: "/api/gift/send",
                dataType: 'json',
                data: parm,
                success: function(data) {
                    if (data.code == 0) {
                        if(data.object.state == 1){

                        }else{
                            getProp();
                        }
                    }else{
                        console.log(data.result);
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
            var content = {
                type: 1,
                data: {
                    giftName:name,
                    giftNum:1
                }
            };
            var msg = chatroom.sendCustomMsg({
                content: JSON.stringify(content),
                done: sendChatroomCustomMsgDone
            });
            console.log('正在发送聊天室自定义消息, id=' + msg.idClient);
        }
        liveRoomInterf = {

            //直播间Flash对象
            flash: null,
            giftlist : [],
            //初始化Flash
            init: function ()
            {
                //播放直播视频，参数：视频地址
                this.flash.playLive($('.hide-rtmp').html());
                // rtmp://pili-live-rtmp.wangyuhudong.com/wyds/wyds_4231257?key=e27f6170-a1c7-4f6f-ae0f-1de109b6b1b7

                //更新主播信息，参数：主播ID
                this.flash.updateAnchor("123");

                //更新热词列表，参数：[热词1, 热词2, ...]
                this.flash.updateHotWords(["666", "因吹思婷", "姑娘你真是条汉子","666", "因吹思婷", "姑娘你真是条汉子","666", "因吹思婷", "姑娘你真是条汉子"]);

                //更新鱼币数量，参数：鱼币数量
                this.flash.updateCoins(yuerCoin);

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

                this.flash.updateMyItems(proplist);

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
                alert("刷新直播页面");
            },

            //发送弹幕，参数：弹幕文字
            sendDanmaku: function ( text )
            {
                //调用后台，发送成功后请回调 flash.showDanmaku
                // this.flash.showDanmaku(text, 0xffff00, 100);
                flashSend(text);
            },

            //充值
            recharge: function ()
            {
                alert("打开充值页面");
            },

            //赠送礼物，参数：道具ID
            presentGift: function ( itemId )
            {
                //调用后台，若赠送的是购买的道具，请回调 flash.updateCoins，若赠送的是我的道具，请回调 flash.updateMyItems
                alert("赠送礼物：" + itemId);
                getGift();
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

        att.id = "LiveRoom";
        att.data = "YeLiveRoom.swf";
        liveRoomInterf.flash = swfobject.createSWF(att, par, "LiveRoomDiv");

        $('.sendText').click(function(){
            if($('.live-text').val()){
                // var msg = chatroom.sendText({
                //     text: $('.live-text').val(),
                //     done: sendChatroomMsgDone
                // });
                // console.log('正在发送聊天室text消息, id=' + msg.idClient);
                flashSend($('.live-text').val());
            }
        });

        $('.gift').click(function(){
            flashSendCustom($(this).attr('data-name'),$(this).attr('data-id'),1);
        });

        $('.propBox').click(function(){
            flashSendCustom($(this).attr('data-name'),$(this).attr('data-id'),2);
        });


    }


    function onChatroomConnect(chatroom) {
        console.log('进入聊天室', chatroom);
        $('#chat').append("<div>你已进入聊天室！<div>"); 
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
        $('#chat').append("<div>连接断开<div>"); 
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
                    $('#chat').append("<div class='gift'>"+content.data.senderName+":&nbsp;&nbsp;送给主播1个"+content.data.giftName+"<span class='combo'>"+content.data.giftNum+"<i></i></span><div>");
                }else{
                    $('#chat').append("<div class='gift'>"+content.data.senderName+":&nbsp;&nbsp;送给主播1个"+content.data.giftName+"<div>");
                }
            }else if(msgs[i].text){
                var host = msgs[i].fromNick=="1" ? '<label for="">主播</label>&nbsp;' : '';
                $('#chat').append("<div>"+host+"<span class='fromNick'>"+msgs[i].fromNick+":&nbsp;&nbsp;</span>"+msgs[i].text+"<div>");         
            }else if(msgs[i].flow=="in" && !msgs[i].text && !msgs[i].attach.fromNick && msgs[i].attach.type=="memberEnter"){
                $('#chat').append("<div>欢迎用户"+msgs[i].attach.fromNick+"进入直播间");
            }
            // lct.scrollTop=Math.max(0,lct.scrollHeight-lct.offsetHeight);        
        }

    }

    //直播间接口
    // liveRoomInterf = {

    //     //直播间Flash对象
    //     flash: null,
    //     giftlist : [],
    //     //初始化Flash
    //     init: function ()
    //     {
    //         var _this = this;
    //         //播放直播视频，参数：视频地址
    //         this.flash.playLive("rtmp://pili-live-rtmp.wangyuhudong.com/wyds/wyds_4231257");
    //         // rtmp://pili-live-rtmp.wangyuhudong.com/wyds/wyds_4231257?key=e27f6170-a1c7-4f6f-ae0f-1de109b6b1b7

    //         //更新主播信息，参数：主播ID
    //         this.flash.updateAnchor("123");

    //         //更新热词列表，参数：[热词1, 热词2, ...]
    //         this.flash.updateHotWords(["666", "因吹思婷", "姑娘你真是条汉子","666", "因吹思婷", "姑娘你真是条汉子","666", "因吹思婷", "姑娘你真是条汉子"]);

    //         //更新鱼币数量，参数：鱼币数量
    //         this.flash.updateCoins(yuerCoin);

    //         //更新道具列表，参数：[道具1, 道具2, ...]
    //         //道具格式：{id:道具ID, icon:道具图标, tips:道具提示（HTML格式）}
    //         // this.flash.updateItems([
    //         //     {id:1, name:"123",icon:"icon.png", tips:"贝壳（<font color='#ffff00'>10</font>鱼币）<br/>点击送给主播"},
    //         //     {id:2, icon:"icon.png", tips:"海星（<font color='#ffff00'>20</font>鱼币）<br/>点击送给主播"},
    //         //     {id:3, icon:"icon.png", tips:"水母（<font color='#ffff00'>30</font>鱼币）<br/>点击送给主播"},
    //         //     {id:4, icon:"icon.png", tips:"龙虾（<font color='#ffff00'>40</font>鱼币）<br/>点击送给主播"},
    //         //     {id:5, icon:"icon.png", tips:"螃蟹（<font color='#ffff00'>50</font>鱼币）<br/>点击送给主播"},
    //         //     {id:6, icon:"icon.png", tips:"海马（<font color='#ffff00'>60</font>鱼币）<br/>点击送给主播"},
    //         //     {id:7, icon:"icon.png", tips:"海龟（<font color='#ffff00'>70</font>鱼币）<br/>点击送给主播"},
    //         //     {id:8, icon:"icon.png", tips:"鲸鱼（<font color='#ffff00'>80</font>鱼币）<br/>点击送给主播"},
    //         // ]);
    //         this.flash.updateItems(giftlist);

    //         //更新我的道具列表，参数：[道具1, 道具2, ...]
    //         //道具格式：{id:道具ID, icon:道具图标, name:道具名称, count:道具数量}
    //         this.flash.updateMyItems([
    //             {id:1, icon:"icon.png", name:"贝壳", count:3},
    //             {id:2, icon:"icon.png", name:"海星", count:2},
    //         ]);

    //         this.flash.updateMyItems(proplist);

    //         //显示弹幕，参数：弹幕文字, 颜色值（0xRRGGBB，默认0xffffff）, 滚动速度（像素/秒，默认100）, 延迟时间（秒，默认0，<0表示超前）, 纵坐标百分比（0~100，默认在10~70间随机）
    //         this.flash.showDanmaku("我是一条弹幕", 0xffffff, 100);
    //         this.flash.showDanmaku("我是延后显示的弹幕", 0xffff00, 150, 5);
    //         this.flash.showDanmaku("我是超前显示的弹幕", 0x00ffff, 80, -3);

    //         //显示固定弹幕，参数：通告文字, 颜色值（0xRRGGBB，默认0xffffff）, 显示时间（秒，默认5）, 纵坐标百分比（0~100，默认10）
    //         this.flash.showStaticDanmaku("这是一条通告", 0xff0000, 10);
    //     },

    //     //刷新
    //     refresh: function ()
    //     {
    //         alert("刷新直播页面");
    //     },

    //     //发送弹幕，参数：弹幕文字
    //     sendDanmaku: function ( text )
    //     {
    //         //调用后台，发送成功后请回调 flash.showDanmaku
    //         this.flash.showDanmaku(text, 0xffff00, 100);
    //     },

    //     //充值
    //     recharge: function ()
    //     {
    //         alert("打开充值页面");
    //     },

    //     //赠送礼物，参数：道具ID
    //     presentGift: function ( itemId )
    //     {
    //         //调用后台，若赠送的是购买的道具，请回调 flash.updateCoins，若赠送的是我的道具，请回调 flash.updateMyItems
    //         alert("赠送礼物：" + itemId);
    //         getGift();
    //     },
    // };

    // var att = {};
    // att.width = "100%";
    // att.height = "100%";
    // var par = {};
    // par.quality = "high";
    // par.bgcolor = "#000000";
    // par.allowscriptaccess = "sameDomain";
    // par.allowfullscreen = "true";
    // par.allowFullScreenInteractive = "true";

    // att.id = "LiveRoom";
    // att.data = "YeLiveRoom.swf";
    // liveRoomInterf.flash = swfobject.createSWF(att, par, "LiveRoomDiv");

})