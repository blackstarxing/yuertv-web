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

    att.id = "VideoPlayer";
    att.data = "YeVideoPlayer.swf";
    videoPlayerInterf.flash = swfobject.createSWF(att, par, "VideoPlayerDiv");

    $('.m-video .live-address').click(function(e){
        e.preventDefault();
        $('.m-video-mask').show();
        $(this).addClass('video-open').siblings('.live-address').removeClass('video-open');
        var name = $(this).attr('data-name'),
            title = $(this).attr('data-title'),
            flv = $(this).attr('data-rtmp'),
            id = $(this).attr('data-id'),
            nickname = $(this).attr('data-nickname'),
            icon = $(this).parent().find('.head-icon').attr('src'),
            follow = $(this).attr('data-follow')==1 ? true :false;
        $('.m-video-mask').show();
        videoPlayerInterf.callLater(function () {
            // videoPlayerInterf.flash.playVideo("http://pili-media.wangyuhudong.com/7FUkDXBrj3kr1leI8VjVFX6GGD0=/Fpe0CIJCfu80Ey29nmt4y2wVqhzx", "界黄盖暴力输出，秒全场", "王者荣耀");
            videoPlayerInterf.flash.playVideo(flv,title,name);
            videoPlayerInterf.flash.updateAnchor(id, nickname,icon, follow);
        });
        
    });
    $('.m-video-mask .close').click(function(e){
        e.preventDefault();
        $('.m-video-mask').hide();
    });

    var stop=true; 
    var page = 1;
    var nomore = false;
    $(window).scroll(function(){ 
        totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()); 
        if($(document).height() <= totalheight){ 
            if(stop && !nomore){ 
                stop=false; 
                page+=1
                var parm={};
                parm.page = page;
                parm.pageSize = 30;
                $.ajax({
                    url: '/api/video/list',
                    data: parm,
                    type: 'get',
                    dataType: 'json',
                    success: function(data) {
                        var newPage = '';
                        var icon = '';
                        var list = data.object.list;
                        if (data.code==0) {
                            if(list.length != 0){
                                for(var i = 0; i < list.length; i++){
                                    var sex = "male";
                                    if(list[i].sex == 1){
                                        sex = "female";
                                    }
                                    if(list[i].user_icon){
                                        icon = (list[i].user_icon.indexOf('http')>-1) ?  list[i].user_icon : 'http://img.wangyuhudong.com/'+list[i].user_icon;
                                    }else{
                                        icon = '/images/default_avatar.png';
                                    }
                                    newPage += '<div class="m-lst m-video">'+
                                                '<a href="" class="live-address" data-rtmp="'+list[i].rtmp+'" data-title="'+list[i].title+'" data-icon="'+list[i].up_user_icon+'" data-id="'+list[i].id+'" data-name="'+list[i].name+'" data-nickname="'+list[i].nickname+'">'+
                                                    '<img src="'+list[i].icon+'" alt="">'+
                                                    '<span><i>·</i>'+list[i].game_name+'</span>'+
                                                    '<div class="play-mask online"></div>'+
                                                '</a>'+
                                                '<div class="m-info">'+
                                                    '<div class="anchor-head video-head">'+
                                                        '<img src="'+icon+'" alt="" class="head-icon">'+
                                                            '<img src="/images/'+sex+'.png" alt="" class="sex">'+
                                                    '</div>'+
                                                    '<div class="anchor-info">'+
                                                        '<div><a href="javascript:void(0);">'+list[i].nickname+'</a></div>'+
                                                    '</div>'+
                                                    '<div class="video-name"><a href="javascript:void(0);">'+list[i].title+'</a></div>'+
                                                '</div>'+
                                            '</div>';
                                }
                                $('.live-container').append(newPage);
                                $(".m-video:nth-child(5n)").css("margin-right","0");
                                $('.live-address').hover(function(){
                                    $(this).find('.play-mask').show();
                                },function(){
                                    $(this).find('.play-mask').hide();
                                })
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
                                    videoPlayerInterf.callLater(function () {
                                        // videoPlayerInterf.flash.playVideo("http://pili-media.wangyuhudong.com/7FUkDXBrj3kr1leI8VjVFX6GGD0=/Fpe0CIJCfu80Ey29nmt4y2wVqhzx", "界黄盖暴力输出，秒全场", "王者荣耀");
                                        videoPlayerInterf.flash.playVideo(flv,title,name);
                                        videoPlayerInterf.flash.updateAnchor(id, nickname,icon, follow);
                                    });
                                    
                                });
                                $('.m-video-mask .close').click(function(e){
                                    e.preventDefault();
                                    $('.m-video-mask').hide();
                                });
                            }else{
                                nomore = true;
                                $('.list-tip').show();
                            }
                        }
                        stop=true;
                    },
                    error: function() {
                        alert('通讯服务器错误');
                    }
                }); 
            } 
        } 
    });
})