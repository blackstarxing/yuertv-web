$(function(){
    function resize(){
        var clientW = document.body.clientWidth;
        var clientH = document.body.offsetHeight;
        var liveW = clientW - 440;
        var chatroomH = clientH - 300;
        $('.m-live-left').css("width",liveW+"px");
        $('.videoBox').css("height",0.56*liveW+"px");
        $('.room-block').css("height",chatroomH+"px");
    }
    resize();
    $(window).resize(function() {
        resize();
    });

    //直播间接口
    liveRoomInterf = {

        //直播间Flash对象
        flash: null,

        //初始化Flash
        init: function ()
        {
            //播放直播视频，参数：视频地址
            this.flash.playLive("rtmp://live.hkstv.hk.lxdns.com/live/hks");

            //更新主播信息，参数：主播ID
            this.flash.updateAnchor("123");

            //更新热词列表，参数：[热词1, 热词2, ...]
            this.flash.updateHotWords(["666", "因吹思婷", "姑娘你真是条汉子","666", "因吹思婷", "姑娘你真是条汉子","666", "因吹思婷", "姑娘你真是条汉子"]);

            //更新鱼币数量，参数：鱼币数量
            this.flash.updateCoins(123);

            //更新道具列表，参数：[道具1, 道具2, ...]
            //道具格式：{id:道具ID, icon:道具图标, tips:道具提示（HTML格式）}
            this.flash.updateItems([
                {id:1, icon:"icon.png", tips:"贝壳（<font color='#ffff00'>10</font>鱼币）<br/>点击送给主播"},
                {id:2, icon:"icon.png", tips:"海星（<font color='#ffff00'>20</font>鱼币）<br/>点击送给主播"},
                {id:3, icon:"icon.png", tips:"水母（<font color='#ffff00'>30</font>鱼币）<br/>点击送给主播"},
                {id:4, icon:"icon.png", tips:"龙虾（<font color='#ffff00'>40</font>鱼币）<br/>点击送给主播"},
                {id:5, icon:"icon.png", tips:"螃蟹（<font color='#ffff00'>50</font>鱼币）<br/>点击送给主播"},
                {id:6, icon:"icon.png", tips:"海马（<font color='#ffff00'>60</font>鱼币）<br/>点击送给主播"},
                {id:7, icon:"icon.png", tips:"海龟（<font color='#ffff00'>70</font>鱼币）<br/>点击送给主播"},
                {id:8, icon:"icon.png", tips:"鲸鱼（<font color='#ffff00'>80</font>鱼币）<br/>点击送给主播"},
            ]);

            //更新我的道具列表，参数：[道具1, 道具2, ...]
            //道具格式：{id:道具ID, icon:道具图标, name:道具名称, count:道具数量}
            this.flash.updateMyItems([
                {id:1, icon:"icon.png", name:"贝壳", count:3},
                {id:2, icon:"icon.png", name:"海星", count:2},
            ]);

            //显示弹幕，参数：弹幕文字, 颜色值（0xRRGGBB，默认0xffffff）, 滚动速度（像素/秒，默认100）, 延迟时间（秒，默认0，<0表示超前）, 纵坐标百分比（0~100，默认在10~70间随机）
            this.flash.showDanmaku("我是一条弹幕", 0xffffff, 100);
            this.flash.showDanmaku("我是延后显示的弹幕", 0xffff00, 150, 5);
            this.flash.showDanmaku("我是超前显示的弹幕", 0x00ffff, 80, -3);

            //显示固定弹幕，参数：通告文字, 颜色值（0xRRGGBB，默认0xffffff）, 显示时间（秒，默认5）, 纵坐标百分比（0~100，默认10）
            this.flash.showStaticDanmaku("这是一条通告", 0xff0000, 10);
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
            this.flash.showDanmaku(text, 0xffff00, 100);
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

})