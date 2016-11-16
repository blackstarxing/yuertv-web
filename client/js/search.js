$(function(){
	var islogin = (document.cookie.indexOf('yuer_userId')>=0) ? 1 : 0;

	$('.search-btn').click(function(){
		if($('.search-key').val()){
            window.location.href = "/search?content="+$('.search-key').val();
        }
	})

	$('.follow').click(function(){
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
                            console.log('关注成功！')
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