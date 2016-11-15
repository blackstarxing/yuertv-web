$(function(){
	$(".m-video:nth-child(5n)").css("margin-right","0");

    var islogin = (document.cookie.indexOf('yuer_userId')>=0) ? 1 : 0;

    //视频播放器接口
    videoPlayerInterf = {

        //视频播放器Flash对象
        flash: null,

        isinit: false,

        callLater: function (callback)
        {
            if (this.isinit)
            {
                callback();
            }
            else
            {
                this.callback = callback;
            }
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

            //更新主播信息，参数：主播ID, 主播昵称, 主播头像，是否已关注
            //this.flash.updateAnchor("123", "奔波儿灞", "head.png", false);
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
    par.wmode = "transparent";

    att.id = "VideoPlayer";
    att.data = "YeVideoPlayer.swf";
    videoPlayerInterf.flash = swfobject.createSWF(att, par, "VideoPlayerDiv");

    $('.m-video .live-address').click(function(e){
        e.preventDefault();
        $('.m-video-mask').show();
        videoPlayerInterf.callLater(function () {
            // videoPlayerInterf.flash.playVideo("http://pili-media.wangyuhudong.com/7FUkDXBrj3kr1leI8VjVFX6GGD0=/Fk8ffjjNrphUwlioPxjmXIB0R7tl", "界黄盖暴力输出，秒全场", "王者荣耀");
            videoPlayerInterf.flash.playVideo($(this).attr('data-rtmp'),$(this).attr('data-title'),$(this).attr('data-name'));
            videoPlayerInterf.flash.updateAnchor($(this).attr('data-id'), $(this).attr('data-nickname'),$(this).attr('data-icon'), false);
        });
        
    });
    $('.m-video-mask .close').click(function(e){
        e.preventDefault();
        $('.m-video-mask').hide();
    })
})