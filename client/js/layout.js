$(function(){
    var icon = window.localStorage.getItem("avatar");
    if(icon){
        if(icon.indexOf('http')>-1){
            $('.avatar-icon').attr('src',icon); 
        }else{
            $('.avatar-icon').attr('src','http://img.wangyuhudong.com/'+icon);
        }
    }else{
        $('.avatar-icon').attr('src','/images/default_avatar.png'); 
    }
    // $('.head_logo').click(function(){    
    //     window.location.href = "/";
    // })
    // 下载二维码显示
    $('.sweepme').hover(function(){
        $('.QRbox').show();
    },function(){
        $('.QRbox').hide();
    });
    // 注册奖励提示
    // $('.register-hover').hover(function(){
    //     $('.reward-tip').show();
    // },function(){
    //     $('.reward-tip').hide();
    // });
    // 显示个人中心
    $('.avatar').hover(function(){
        $(this).css('background',"#0c1014");
    	$('.nav-list').show();
    },function(){
        $(this).css('background',"none");
    	$('.nav-list').hide();
    });

    $('.m-search input').click(function(e){
        // $(this).css({'background':'#fff','color':"#333"});
        e.stopPropagation();
        $('.hot-anchor').show();

    })

    $("body").click(function(e){
        $('.hot-anchor').hide();
    });

    $('.hot-anchor').click(function(e){
        e.stopPropagation();
    })
    $('.u-search-btn').click(function(e){
        e.preventDefault();
        if($('.m-search input').val()){
            window.location.href = "/search?content="+$('.m-search input').val();
        }
    })
    // 登出
    $('.logout').click(function(e){
    	e.preventDefault();
    	delCookie('yuer_userId');
        delCookie('yuer_token');
        localStorage.clear();
        window.location.href = "/";
    })
    // 登录
	$('.u-login-btn').click(function(e){
        e.preventDefault();
        $('.l-usrname').val('');
        $('.l-pwd').val('');
        $('.m-login-wrap').show();
    })
    $('.close').click(function(e){
    	e.preventDefault();
        $('.l-usrname').val('');
        $('.l-pwd').val('');
        $('.m-login-wrap').hide();
    })
	function delCookie($name){   
        var myDate=new Date();    
        myDate.setTime(-1000);//设置时间    
        document.cookie=$name+"=''; expires="+myDate.toGMTString()+"; path=/";                
  	} 
     
    $('.u-login').click(function(e){
        var error = $('.login-content .lg-error');
        if(!$('.l-usrname').val() || !$('.l-pwd').val()){
            error.text('用户名或密码不能为空！').fadeIn(100);
            setTimeout(function(){
                error.fadeOut();
            },2000);
        }else{
            var parm = {};
                parm.nickname = $('.l-usrname').val();
                parm.password = $('.l-pwd').val();
            $.ajax({
                url: '/api/login',
                data: parm,
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    if (data.code==0) {
                        delCookie('yuer_userId');
                        delCookie('yuer_token');
                        document.cookie="yuer_userId="+data.object.id; 
                        document.cookie="yuer_token="+data.object.token; 
                        window.localStorage.setItem("id", data.object.id);
                        window.localStorage.setItem("avatar", data.object.icon);
                        window.localStorage.setItem("nickname",data.object.nickname);
                        if(window.location.pathname == '/register' || window.location.pathname == '/reset'){                           
                            window.location="/";
                        }else{
                            window.location.href = window.location.href;
                        }                       
                    }else{
                        error.text(data.result).fadeIn(100);
                        setTimeout(function(){
                            error.fadeOut();
                        },2000);
                    }
                },
                error: function() {
                    alert('通讯服务器错误');
                }
            });
        }
    	
    });

    $(".login-content").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('.u-login').click();
        }
    }); 

    $(".m-search").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('.u-search-btn').click();
        }
    }); 

    $(".m-common .m-lst:nth-child(5n)").css("margin-right","0");
    // 右侧挂件
    $('.u-download').hover(function(){
        $('.showQR').show();
    },function(){
        $('.showQR').hide();
    });
    $('.fade').hover(function(){
        $('.fade ul').stop(true,true);
        $(this).find("ul").animate({marginLeft:'-60px'},300);
    },function(){
        $('.fade ul').stop(true,true);
        $(this).find("ul").animate({marginLeft:0},300);
    });
    //收藏本页begin
    $(".collect").click(function(event) {
        var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
        try {
            if (document.all) { //IE类浏览器
                try {
                    window.external.toString(); //360浏览器不支持window.external，无法收藏
                    window.alert("360浏览器等不支持主动加入收藏。\n您可以尝试通过浏览器菜单栏 或快捷键 ctrl+D 试试。");
                } catch (e) {
                    try {
                        window.external.addFavorite(window.location, document.title);
                    } catch (e) {
                        window.external.addToFavoritesBar(window.location, document.title); //IE8
                    }
                }
            } else if (window.sidebar) { //firfox等浏览器
                window.sidebar.addPanel(document.title, window.location, "");
            } else {
                alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~');
            }
        } catch (e) {
            alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~');
        }
    });
    //收藏本页end

    //返回顶部begin
    $(window).scroll(function() {
        var scrollheight = $(this).scrollTop();
        if (scrollheight >= 350) {
            $(".collect").fadeIn(100);
            $(".backToTop").fadeIn(100);
        } else {
            $(".collect").fadeOut(100);
            $(".backToTop").fadeOut(100);
        }
    });
    $(".backToTop").click(function() {
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });

     //返回顶部end

    $('.live-address').hover(function(){
        $(this).find('.play-mask').show();
    },function(){
        $(this).find('.play-mask').hide();
    })
})