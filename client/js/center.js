// if(obj=='女'){img.src="nv"}else{img.src="nan"}
$(function(){
	$(".m-bottom a").on("click",function(e){
		e.preventDefault();
		$(this).addClass("switch").siblings().removeClass("switch");
		$(".switch-content").hide().eq($(this).index()).show();
	})
	$(".m-bottom a:eq(0)").trigger("click");
	$('.fileupload').change(function(event) {
		var _this = $(this);
			    /* Act on the event */
		if ($('.fileupload').val().length) {
			 var fileName = $('.fileupload').val();
			 var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
			  if (extension == ".jpg" || extension == ".png") {
			    var data = new FormData();
			    data.append('upload', $('#fileToUpload')[0].files[0]);
			    $.ajax({
			         url: 'http://172.16.2.62:8777/common/upload',
			         type: 'POST',
			          data: data,
			          cache: false,
			          contentType: false, //不可缺参数
			            processData: false, //不可缺参数
			           success: function(data) {
			               _this.parents('.u-card').find('img').attr('src',data.object);
			            },
			           error: function() {
			                 console.log('error');
			           }
			    });
		}
	 }
});
// 我的道具弹出框
	$(".imgprops .u-props").off("click").on("click",function(e){
		e.preventDefault();
		$(".u-propsgtips").show();
	});

//我的消息中的div之间的切换
$(".m-mainm a").on("click",function(e){
		e.preventDefault();
		$(this).addClass("focuscurrent").siblings().removeClass("focuscurrent");
		$(".mcurrent").hide().eq($(this).index()).show();
})
$(".m-mainm a:eq(0)").trigger("click");
//我的消息－－关注消息的划入事件
	$(".u-foucscolor").on("mouseenter",function(){$(".u-messnickname").show().css("top",$(this).position().top)})
	$(".u-foucscolor").on("mouseleave",function(){$(".u-messnickname").hide()})
//我要充值－－选中鱼币的样式
$(".u-value div").on("click",function(){
	$(".value div").addClass("checktopup");
})
//我要充值－－－点击充值出现弹框
	$("#topupvalue").off("click").on("click",function(e){
		e.preventDefault();
		$(".u-topupwindow").show();
	})
	$("#cancel").off("click").on("click",function(){
		$(".u-topupwindow").hide();
	})
//我要当主播的div之间的切换
	$(".m-mainh a").on("click",function(e){
		e.preventDefault();
		$(this).addClass("").siblings().removeClass("");
		$(".switchcontent").hide().eq($(this).index()).show();
	})
	$(".m-mainh a:eq(0)").trigger("click");
//我要当主播中的下级div的切换
	$(".u-certification a").on("click",function(e){
		e.preventDefault();
		$(this).addClass("").siblings().removeClass("");
		$(".switchrepeat").hide().eq($(this).index()).show();
	})
	$(".u-certification a:eq(0)").trigger("click");
// 修改昵称弹出框
	$("#nickname").on("click",function(){
		$(".m-layer").addClass("z-show");
	});
	$(".lybt .u-btn").on("click",function(){
		$(this).parents(".m-layer").removeClass("z-show");
	});
//修改昵称
$("#checktips").on("blur",function(){
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/person-center/update-nickname",
    dataType: 'json',
    data: {
    	nickName:$.trim($("#checktips").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
    	console.log(data);
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        if(data.object==1){//1为重复
	            console.log("这个nickName重复啦");
	            $("#retips").show();
	        }else if(data.object==0){
	            console.log("这个nickName不重复");
	            $("#retips").hide();
	        }else{
	            console.log("未知异常");
	        }
	    }else if(data.code == -2){
	        console.log("你没有权限，通常来讲，你是没有登录");
	    }else if(data.code == -5){
	        console.log("参数错误哦。");
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})
})
//表单验证
$("#current").on("blur",function(){
	$("#current").parent().find("span").hide();
	$("#current").parent().find(".verifypassword").show();
	$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/person-center/is-password-right",
    dataType: 'json',
    data: {
    	password:$.trim($("#current").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        if(data.object==1){//1为重复
	            console.log("这个password正确啦");
	            $("#current").parent().find("span").hide();
	            $("#current").parent().find(".rightpassword").show();
	        }else if(data.object==0){
	            console.log("这个password不正确");
	            $("#current").parent().find("span").hide();
	             $("#current").parent().find(".failpassword").show();
	        }else{
	            console.log("未知异常");
	        }
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})
})
$("#new").on("blur",function(){

})
$("#confirm").on("blur",function(){

})
//修改密码成功弹框
	$("#userbox").on("click",function(){
		$(".m-psuccess").addClass("z-show");
	});
	$(".m-psuccess #userbox").on("click",function(){
		$(this).parents(".m-psuccess").removeClass("z-show");
	});
//手机认证---获取验证码；
	// $('#gainnumber').on("click",function(){  
 //  		$.ajax({  
	// 		type: "GET",  
	// 		url: "http://172.16.2.62:8777/sendSMSCode",  
	// 		data: {gainnumber:$("#gainnumber").val()},  
	// 		dataType: "json",  
	// 		success: function(data){  
	// 			 console.log(data);

	// 		},
 //            error: function() {
 //                alert('通讯服务器错误');
 //            } 
	// 	});  
	// });  
// 刷新图形验证码
	var $telnumber = $('.telnumber');
    function changeCode(){
        $picCode.attr('src','http://172.16.2.62:8777/checkCode?phone='+$telnumber.val()+'&rand='+new Date());
    }

    $('#gainnumber').click(function(e){
        var _current = $(e.currentTarget);
        var _error = _current.next('.error-tip');
        if($telnumber.val()){
            if(/^1([0-9]){10}$/.test($telnumber.val())){
                var parm = {};
                parm.mobile = $telnumber.val();
                console.log(parm);
                $.ajax({
                    url: 'http://172.16.2.62:8777/sendSMSCode',
                    data: parm,
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {
                        if (data.object==0) {
                            $('.code-wrap input').val('');
                            $('.m-mask').show();
                            changeCode();
                        }else{
                            _error.show();
                            _error.text('手机号已被注册');
                            setTimeout(function(){
                                _error.hide();
                                _error.text('手机号码不能为空');
                            },2000);
                        }
                    },
                    error: function() {
                        alert('通讯服务器错误');
                    }
                });
            }else{
                _error.show();
                _error.text('请输入正确号码');
                setTimeout(function(){
                    _error.hide();
                    _error.text('手机号码不能为空');
                },2000);
            }
        }else{
            _error.show();
            setTimeout(function(){
                _error.hide();
            },2000);
        }
    })

    $('.pic-code a').click(function(e){
        e.preventDefault();
        changeCode();
    })
//实名认证；
	$('#userbox').on("blur",function(){  
  		$.ajax({  
			type: "GET",  
			url: "http://172.16.2.62:8777/person-center/mobile-auth",  
			data: {userbox:$("#userbox").val()},  
			dataType: "json",  
			success: function(data){  
				 console.log(data);

			},
            error: function() {
                alert('通讯服务器错误');
            } 
		});  
	}); 

//日期插件
$('#datetimepicker').datetimepicker({
      lang:"ch",           //语言选择中文
      format:"Y-m-d",      //格式化日期
      timepicker:false,    //关闭时间选项
      yearStart:2000,     //设置最小年份
      yearEnd:2050,        //设置最大年份
      todayButton:false    //关闭选择今天按钮
});
$.datetimepicker.setLocale('ch');
//接口测试
//手机认证
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/person-center/mobile-auth",
    dataType: 'json',
    data: {
    	// nickName:$.trim($("#checktips").val())

    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        if(data.object==1){//1为重复
	            console.log("这个nickName重复啦");
	            $("#retips").show();
	        }else if(data.object==0){
	            console.log("这个nickName不重复");
	            $("#retips").hide();
	        }else{
	            console.log("未知异常");
	        }
	    }else if(data.code == -2){
	        console.log("你没有权限，通常来讲，你是没有登录");
	    }else if(data.code == -5){
	        console.log("参数错误哦。");
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})
//充值列表
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/pay/recharge-list",
    dataType: 'json',
    data: {
    	// nickName:$.trim($("#checktips").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
    	console.log(data);
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})
//充值
$("#tuvalue").on("click",function(){
$.ajax({
    method:"GET",//对于请求类型
    url:" http://172.16.2.62:8777/pay/recharge",
    dataType: 'json',
    data: {
    	// nickName:$.trim($("#checktips").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        if(data.object==1){//1为重复
	            console.log("这个nickName重复啦");
	            $("#retips").show();
	        }else if(data.object==0){
	            console.log("这个nickName不重复");
	            $("#retips").hide();
	        }else{
	            console.log("未知异常");
	        }
	    }else if(data.code == -2){
	        console.log("你没有权限，通常来讲，你是没有登录");
	    }else if(data.code == -5){
	        console.log("参数错误哦。");
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})
})
//我的关注
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/person-center/my-concern",
    dataType: 'json',
    data: {
    	// nickName:$.trim($("#checktips").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        if(data.object==1){//1为重复
	            console.log("这个nickName重复啦");
	            $("#retips").show();
	        }else if(data.object==0){
	            console.log("这个nickName不重复");
	            $("#retips").hide();
	        }else{
	            console.log("未知异常");
	        }
	    }else if(data.code == -2){
	        console.log("你没有权限，通常来讲，你是没有登录");
	    }else if(data.code == -5){
	        console.log("参数错误哦。");
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})
//我的消息
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/person-center/my-msg",
    dataType: 'json',
    data: {
    	// nickName:$.trim($("#checktips").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        if(data.object==1){//1为重复
	            console.log("这个nickName重复啦");
	            $("#retips").show();
	        }else if(data.object==0){
	            console.log("这个nickName不重复");
	            $("#retips").hide();
	        }else{
	            console.log("未知异常");
	        }
	    }else if(data.code == -2){
	        console.log("你没有权限，通常来讲，你是没有登录");
	    }else if(data.code == -5){
	        console.log("参数错误哦。");
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})
//我的道具
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/person-center/my-gifts",
    dataType: 'json',
    data: {
    	// nickName:$.trim($("#checktips").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
    	console.log(data);
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        if(data.object==1){//1为重复
	            console.log("这个nickName重复啦");
	            $("#retips").show();
	        }else if(data.object==0){
	            console.log("这个nickName不重复");
	            $("#retips").hide();
	        }else{
	            console.log("未知异常");
	        }
	    }else if(data.code == -2){
	        console.log("你没有权限，通常来讲，你是没有登录");
	    }else if(data.code == -5){
	        console.log("参数错误哦。");
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})
//用户信息
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/person-center/user-info",
    dataType: 'json',
    data: {
    	// nickName:$.trim($("#checktips").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
    	console.log(data);
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	    }else{
	        console.log(data.result);
	    }
	},
	error:function(a,b,c){
    	console.log("接口出问题啦");
   }
})










}); 
