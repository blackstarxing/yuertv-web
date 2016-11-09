$(function(){
    $('.avatar-icon').attr('src',"http://img.wangyuhudong.com/"+window.sessionStorage.getItem("avatar")); 
    // 显示个人中心
    $('.avatar').hover(function(){
    	$('.nav-list').show();
    },function(){
    	$('.nav-list').hide();
    });
    // 登出
    $('.logout').click(function(e){
    	e.preventDefault();
    	delCookie('userId');
        delCookie('token');
        window.location.href = window.location.href;
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
        document.cookie=$name+"=''; expires="+myDate.toGMTString();                
  	} 
    $('.u-login').click(function(e){
    	var parm = {};
            parm.nickname = $('.l-usrname').val();
            parm.password = $('.l-pwd').val();
    	$.ajax({
            url: 'http://172.16.2.62/login',
            data: parm,
            type: 'post',
            dataType: 'json',
            success: function(data) {
                if (data.code==0) {
                	delCookie('userId');
                	delCookie('token');
                    document.cookie="userId="+data.object.id; 
                    document.cookie="token="+data.object.token; 
           			window.sessionStorage.setItem("id", data.object.id);
           			window.sessionStorage.setItem("avatar", data.object.icon);
                    window.location="/";
                }else{
                    
                }
            },
            error: function() {
                alert('通讯服务器错误');
            }
        });
    })
})