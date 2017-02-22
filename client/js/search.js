$(function(){
	var islogin = (document.cookie.indexOf('yuer_userId')>=0) ? 1 : 0;

	$(".m-video:nth-child(5n)").css("margin-right","0");
	
	$('.search-btn').click(function(){
		if($('.search-key').val()){
            window.location.href = "/search?content="+$('.search-key').val();
        }
	})

	$(".search-key").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('.search-btn').click();
        }
    }); 

	function followanchor(){
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
    }

    followanchor();

    var stop=true; 
    var page = 1;
    var nomore = false;
    if($('.search-content').attr('data-last')==1){
        nomore = true;
    }
    $(window).scroll(function(){ 
        totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()); 
        if($(document).height() <= totalheight){ 
            if(stop && !nomore){ 
                stop=false; 
                page+=1
                var parm={};
                parm.param = $('.search-content').text();
                parm.page = page;
                parm.pageSize = 30;
                $.ajax({
                    url: '/api/search/live',
                    data: parm,
                    type: 'get',
                    dataType: 'json',
                    success: function(data) {
                        var newPage = '';
                        var list = data.object.list;
                        if (data.code==0) {
                            if(list.length != 0){
                                for(var i = 0; i < list.length; i++){
                                    var sex = "male";
                                    var icon = '';
                                    if(list[i].sex == 1){
                                        sex = "female";
                                    }
                                    if(list[i].user_icon){
                                        icon = (list[i].user_icon.indexOf('http')>-1) ?  list[i].user_icon : 'http://img.wangyuhudong.com/'+list[i].user_icon;
                                    }else{
                                        icon = '/images/default_avatar.png';
                                    }
                                    var link = (list[i].state == 1) ? '/liveroom?id='+list[i].id : 'javascript:void(0);',
                                        online = (list[i].state == 1) ? 'online' : 'outline',
                                        sex = (list[i].sex == 0) ? 'male' : 'female',
                                        concernclass = (list[i].is_concern == 1) ? 'disfollow' : 'follow',
                                        concerntext = (list[i].is_concern == 1) ? '已关注' : '关注';
                                    newPage += '<div class="m-lst">'+
                                                        '<a href="'+link+'" class="live-address">'+
                                                        '<img src="'+list[i].icon+'" alt="">'+
                                                        '<span><i>·</i>'+list[i].name+'</span>'+
                                                            '<div class="play-mask '+online+'"></div>'+
                                                    '</a>'+
                                                    '<div class="m-info">'+
                                                        '<div class="anchor-head">'+
                                                            '<img src="'+icon+'" alt="" class="head-icon">'+
                                                                '<img src="/images/'+sex+'.png" alt="" class="sex">'+
                                                        '</div>'+
                                                        '<div class="anchor-info">'+
                                                            '<div><a href="javascript:void(0);">'+list[i].nickname+'</a></div>'+
                                                            '<div class="anchor-id">ID:'+list[i].room_number+'</div>'+
                                                        '</div>'+
                                                            '<button class="'+concernclass+'" data-id="'+list[i].up_user_id+'">'+concerntext+'</button>'+
                                                    '</div>'+
                                                '</div>';
                                }
                                $('.search-container').append(newPage);
                                $(".m-video:nth-child(5n)").css("margin-right","0");
                                $('.live-address').hover(function(){
                                    $(this).find('.play-mask').show();
                                },function(){
                                    $(this).find('.play-mask').hide();
                                });
                                followanchor();
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