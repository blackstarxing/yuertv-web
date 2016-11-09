$(function(){
	$(".m-hot .m-lst:nth-child(5n)").css("margin-right","0");
	$(".m-video .m-lst:nth-child(5n)").css("margin-right","0");
	liveHomeInterf = {

        //首页直播Flash对象
        flash: null,

        rtmp: "",
        anchorid: "",
        anchorhead: "",
        head_icon: "head.png",


        //初始化Flash
        init: function ()
        {   
            //播放直播视频，参数：视频地址
            this.flash.playLive(this.rtmp);

            //更新主播信息，参数：主播ID, 主播头像，是否已关注
            this.flash.updateAnchor("123", this.head_icon, false);
            // this.flash.updateAnchor("123", "head.png", false);
        },

        //关注主播，参数：主播ID
        focusAnchor: function ( anchorId )
        {
            //调用后台，关注成功后请回调 flash.updateAnchor
            this.flash.updateAnchor(anchorId, null, true);
        },

        //刷新
        refresh: function ()
        {
            // alert("刷新直播页面");
            this.flash.playLive(this.rtmp);
        },

        //进入直播间，参数：主播ID
        enterRoom: function ( anchorId )
        {
            alert("进入直播间：" + anchorId);
        },
    };
    //视频播放器接口
    videoPlayerInterf = {

        //视频播放器Flash对象
        flash: null,

        //初始化Flash
        init: function ()
        {
            //播放视频，参数：视频地址, 视频标题, 游戏名称
            this.flash.playVideo("http://pili-media.wangyuhudong.com/7FUkDXBrj3kr1leI8VjVFX6GGD0=/Fk8ffjjNrphUwlioPxjmXIB0R7tl", "界黄盖暴力输出，秒全场", "王者荣耀");

            //更新主播信息，参数：主播ID, 主播昵称, 主播头像，是否已关注
            this.flash.updateAnchor("123", "奔波儿灞", "head.png", false);
        },

        //关注主播，参数：主播ID
        focusAnchor: function ( anchorId )
        {
            //调用后台，关注成功后请回调 flash.updateAnchor
            this.flash.updateAnchor(anchorId, null, null, true);
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

    att.id = "LiveHome";
    att.data = "YeLiveHome.swf";
    liveHomeInterf.rtmp = "rtmp://live.hkstv.hk.lxdns.com/live/hks";
    liveHomeInterf.flash = swfobject.createSWF(att, par, "LiveHomeDiv");

    att.id = "VideoPlayer";
    att.data = "YeVideoPlayer.swf";
    videoPlayerInterf.flash = swfobject.createSWF(att, par, "VideoPlayerDiv");
        $('.m-play-list a').click(function(event){
            event.preventDefault();
            liveHomeInterf.flash.playLive($(this).attr('href'));
            liveHomeInterf.flash.updateAnchor("123", $(this).attr('data-icon'), false);
            console.log(liveHomeInterf.rtmp);
        })
    
})