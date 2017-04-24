var mvue = new Vue({
    el: '#mvue',
    delimiters: ['${', '}'],
    data:{
        totalshow:'',
        totalshows:'',
        totallivelist:[],
        totaluplist:[],
        totalvideolist:[],
        totallivelists:[],
        totaluplists:[],
        totalvideolists:[],
        livetotal:0,
        uptotal:0,
        videototal:0,
        livetotals:0,
        uptotals:0,
        videototals:0,
        liveislast:'',
        upislast:'',
        videoislast:'',
        keyword:'',
        page : 1,
        livepage: 1,
        uppage: 1,
        videopage: 1,
        pageSize : 30,
        type: 0,
        userId:'',
        tab: [{
            name:"综合",
            iscur:true,
            },
            {
            name:"主播",
            iscur:false,
            },
            {
            name:"直播",
            iscur:false,
            },
            {
            name:"视频",
            iscur:false,
        }],
        index:0,
        shows: true,
        islogin:"",
    },
    updated:function(){
        this.$nextTick(function () {
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
            $('.follow,.disfollow').click(function(e){
                var _this=this;
                e.preventDefault();
                if(islogin){
                    var parm = {};
                    parm.userId = window.localStorage.getItem("id");
                    parm.upUserId = $(_this).attr('data-id');
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
        })
    },
    mounted: function () {
        this.$nextTick(function () {
            var _this=this;
            _this.keyword = _this.getQueryString("content");
            _this.islogin = (document.cookie.indexOf('yuer_userId')>=0) ? 1 : 0;
            _this.totals(0);
            $('.live-address').hover(function(){
                $(this).find('.play-mask').show();
            },function(){
                $(this).find('.play-mask').hide();
            })
            $(window).scroll(function(){ 
                var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()); 
                if($(document).height() <= totalheight && _this.index != 0){
                    if(!_this.liveislast && _this.index==1){
                        _this.livepage+=1;
                        _this.pagetotal(_this.index);
                    }
                    if(!_this.upislast && _this.index==2){
                      _this.uppage+=1;
                      _this.pagetotal(_this.index);
                    }
                    if(!_this.videoislast && _this.index==3){
                      _this.videopage+=1;
                      _this.pagetotal(_this.index);
                    }                    
                }
            })
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
        })
    },
    methods:{
        getQueryString:function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                // return unescape(r[2]);
                return decodeURIComponent(r[2]);
            }
            return null;
        },
        resultswitch:function(i){
          var _this=this;
          _this.index=i;
          _this.setCur(_this.index);
        },
        watchPeople: function (num) {
          return num>10000 ? (num/10000).toFixed(1)+'万' : num;
        },
        totals:function(type) {
            var _this=this;
            $.ajax({
                method: "GET",
                url:"/api/search",
                dataType: 'json',
                data:{
                    keyword:_this.getQueryString("content"),
                    type:0
                },
                success: function(data) {
                    if (data.code == 0) {
                        // 获得最大的对象
                        _this.totalshow = data.object; 
                        // 获得主播，直播，视频数组
                        _this.totaluplist=data.object.upList;
                        _this.totallivelist=data.object.liveList;
                        _this.totalvideolist=data.object.videoList;
                        // 获得主播，视频，直播的total
                        _this.livetotal=_this.totalshow.liveTotal; 
                        _this.uptotal=_this.totalshow.upTotal;
                        _this.videototal=_this.totalshow.videoTotal;
                        if(_this.livetotal!=0 || _this.uptotal!=0 || _this.videototal!=0){
                            _this.shows=true;
                        }else{
                            _this.shows=false;
                        }
                        $('.live-address').hover(function(){
                            $(_this).find('.play-mask').show();
                        },function(){
                            $(_this).find('.play-mask').hide();
                        })
                    } else {
                        console.log(data.result);
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            })
        },
        pagetotal:function(type){
            var _this=this;
            if(type==1){
              _this.page = _this.livepage;
            }else if(type==2){
              _this.page = _this.uppage;
            }else if(type==3){
              _this.page=_this.videopage;
            }else{
              _this.page=_this.page;
            }
            $.ajax({
                method: "GET",
                url:"/api/search",
                dataType: 'json',
                data:{
                    keyword:_this.getQueryString("content"),
                    page:_this.page,
                    pageSize:_this.pageSize,
                    type:type
                },
                success: function(data) {
                    if (data.code == 0) {
                        // 获得最大的对象
                        _this.totalshows = data.object;                        
                        // 全部主播
                        if(_this.totalshows.upList){ 
                         _this.totaluplists=data.object.upList.list; 
                         _this.uptotals=_this.totalshow.upList.total; 
                          if(_this.page==1 || type==0){
                            _this.totaluplist=[];
                            _this.uppage=1;
                          }
                          // if(_this.totaluplists!=0){
                          //   _this.totaluplist=[];
                          // }
                          _this.totaluplist=_this.totaluplist.concat(data.object.upList.list);
                          _this.upislast=_this.totalshow.upList.isLast;
                        } 
                        // 全部直播
                        if(_this.totalshows.liveList){
                          _this.livetotals=_this.totalshow.liveList.total; 
                          _this.totallivelists=data.object.liveList.list;
                          if(_this.page==1 || type==0){
                            _this.totallivelist=[];
                            _this.livepage=1;
                          }
                          // if(_this.livetotals!=0){
                          //   _this.totallivelist=[];
                          // }
                          _this.totallivelist=_this.totallivelist.concat(data.object.liveList.list);
                          _this.liveislast=_this.totalshow.liveList.isLast;
                        }
                        // 全部视频
                        if(_this.totalshows.videoList){
                        _this.totalvideolists=data.object.videoList.list;
                        _this.videototals=_this.totalshow.videoList.total;    
                          if(_this.page==1 || type==0){
                            _this.totalvideolist=[];
                            _this.videopage=1;
                          } 
                          // if(_this.totalvideolists!=0){
                          //   _this.totalvideolist=[];
                          // }
                          _this.totalvideolist=_this.totalvideolist.concat(data.object.videoList.list);
                          _this.videoislast=_this.totalshow.videoList.isLast;
                        }    
                    } else {
                        console.log(data.result);
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            })
        },
        setCur: function (index) {
            var _this=this;
                this.tab.map(function (v,i) {
                    i==index? v.iscur=true: v.iscur=false;     
                });
                _this.index = index;
                if(_this.index==0){
                    _this.totals();
                }else if(_this.index==1){
                    _this.pagetotal(_this.index);
                }else if(_this.index==2){
                    _this.pagetotal(_this.index);
                }else if(_this.index==3){
                    _this.pagetotal(_this.index);
                }           
        }
    }  
})