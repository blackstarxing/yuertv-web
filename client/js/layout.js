$(function(){
	$('.u-login-btn').click(function(e){
        e.preventDefault();
        $('.m-login-wrap').show();
    })

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
                    document.cookie="userId="+data.object.id; 
                    document.cookie="token="+data.object.token; 
           			// window.sessionStorage.setItem("userInfo", data.object);
                    window.location="/";
                    $('.l-usrname').val('');
            		$('.l-pwd').val('');
                }else{
                    
                }
            },
            error: function() {
                alert('通讯服务器错误');
            }
        });
    })
})