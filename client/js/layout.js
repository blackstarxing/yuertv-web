$(function(){
	$('.u-login-btn').click(function(e){
        e.preventDefault();
        $('.l-usrname').val('');
        $('.l-pwd').val('');
        $('.m-login-wrap').show();
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
            url: 'http://172.16.2.62:8777/login',
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