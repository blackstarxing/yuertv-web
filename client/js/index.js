$(function(){
	$(".m-hot .m-lst:nth-child(5n)").css("margin-right","0");
	$(".m-video .m-lst:nth-child(5n)").css("margin-right","0");
	liveHomeInterf = {

        //首页直播Flash对象
        flash: null,

        roomid:"",
        rtmp: "",
        anchorId: "",
        anchorhead: "",


        //初始化Flash
        init: function ()
        {   
            //播放直播视频，参数：视频地址
            this.flash.playLive(this.rtmp);

            //更新主播信息，参数：主播ID, 主播头像，是否已关注
            this.flash.updateAnchor(this.anchorId, this.anchorhead, false);
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
            window.location.href = "/liveroom?id="+anchorId;
            // alert("进入直播间：" + anchorId);
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

    var defaultdata = $('.m-play-list li').eq(0).find('a');
    att.id = "LiveHome";
    att.data = "YeLiveHome.swf";
    liveHomeInterf.rtmp = defaultdata.attr('href');
    liveHomeInterf.anchorId = defaultdata.attr('data-id');
    liveHomeInterf.anchorhead = 'http://img.wangyuhudong.com/'+defaultdata.attr('data-icon');
    liveHomeInterf.rtmp = "rtmp://live.hkstv.hk.lxdns.com/live/hks";
    // liveHomeInterf.rtmp = "rtmp://pili-live-rtmp.wangyuhudong.com/wyds/wyds_dev_3835355";
    liveHomeInterf.flash = swfobject.createSWF(att, par, "LiveHomeDiv");

    att.id = "VideoPlayer";
    att.data = "YeVideoPlayer.swf";
    videoPlayerInterf.flash = swfobject.createSWF(att, par, "VideoPlayerDiv");

    var listindex = 0;
    var listpos = $('.m-play-list ul').css("marginTop");
    $(".arrow-down").click(function(){
        if(listindex<5){
            listindex++;
            listpos = -96.8*listindex+"px";
            $('.m-play-list ul').animate({marginTop:listpos},300);
        }       
    });
    $(".arrow-up").click(function(){
        if(listindex>0){
            listindex--;
            listpos = -96.8*listindex+"px";
            $('.m-play-list ul').animate({marginTop:listpos},300);
        }        
    })
    $('.m-play-list a').click(function(event){
        $(this).parent().addClass('current').siblings().removeClass('current');
        event.preventDefault();
        liveHomeInterf.id = $(this).attr('data-id');
        liveHomeInterf.flash.playLive($(this).attr('href'));
        liveHomeInterf.flash.updateAnchor($(this).attr('data-upid'), 'http://img.wangyuhudong.com/'+$(this).attr('data-icon'), false);
        console.log(liveHomeInterf.rtmp);
    })
    $('.m-video .live-address').click(function(e){
        e.preventDefault();
        videoPlayerInterf.flash.playVideo($(this).attr('data-rtmp'),$(this).attr('data-title'),$(this).attr('data-name'));
        videoPlayerInterf.flash.updateAnchor($(this).attr('data-id'), $(this).attr('data-nickname'),$(this).attr('data-icon'), false);
        $('.m-video-mask').show();
    });
    $('.m-video-mask .close').click(function(e){
        e.preventDefault();
        $('.m-video-mask').hide();
    })
})