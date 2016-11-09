// if(obj=='女'){img.src="nv"}else{img.src="nan"}
$(function() {
    // 个人中心的tab切换
    // $(".g-left a").on("click",function(e){
    // 	e.preventDefault();
    // 	$(this).addClass("rightswitchcolor").siblings().removeClass("rightswitchcolor");
    // 	$(".g-right .rightswitch").hide().eq($(this).index()).show();
    // })
    // $(".g-left a:eq(0)").trigger("click");	


    $("#leftmain li").off('click').on('click', function(event) {
        event.preventDefault();
        console.log($(this).index());
        $(this).addClass("rightswitchcolor").siblings().removeClass("rightswitchcolor");
        $("div.rightswitch").eq($(this).index() - 1).show().siblings().hide();
    });
    //我的资料的tab切换；
    $(".m-bottom a").on("click", function(e) {
        e.preventDefault();
        $(this).addClass("switch").siblings().removeClass("switch");
        $(".switch-content").hide().eq($(this).index()).show();
    })
    $(".m-bottom a:eq(0)").trigger("click");

    // 我的道具弹出框
    $(".imgprops .u-props").off("click").on("click", function(e) {
        e.preventDefault();
        $(".u-propsgtips").show();
    });

    //我的消息中的div之间的切换
    $(".m-mainm a").on("click", function(e) {
        e.preventDefault();
        $(this).addClass("focuscurrent").siblings().removeClass("focuscurrent");
        $(".mcurrent").hide().eq($(this).index()).show();
    })
    $(".m-mainm a:eq(0)").trigger("click");
    //我的消息－－关注消息的划入事件
    $(".u-foucscolor").on("mouseenter", function() { $(".u-messnickname").show().css("top", $(this).position().top) })
    $(".u-foucscolor").on("mouseleave", function() { $(".u-messnickname").hide() })
        //我要充值－－选中鱼币的样式
    $(".u-value div").on("click", function() {
            $(".value div").addClass("checktopup");
        })
        //我要充值－－－点击充值出现弹框
    $("#topupvalue").off("click").on("click", function(e) {
        e.preventDefault();
        $(".u-topupwindow").show();
    })
    $("#cancel").off("click").on("click", function() {
            $(".u-topupwindow").hide();
        })
        //我要当主播的div之间的切换
    $(".m-mainh a").on("click", function(e) {
        e.preventDefault();
        $(this).addClass("").siblings().removeClass("");
        $(".switchcontent").hide().eq($(this).index()).show();
    })
    $(".m-mainh a:eq(0)").trigger("click");
    //我要当主播中的下级div的切换
    $(".u-certification a").on("click", function(e) {
        e.preventDefault();
        $(this).addClass("").siblings().removeClass("");
        $(".switchrepeat").hide().eq($(this).index()).show();
    })
    $(".u-certification a:eq(0)").trigger("click");
    // 修改昵称弹出框
    $("#nickname").on("click", function() {
        $(".m-layer").addClass("z-show");
    });
    $(".lybt .u-btn").on("click", function() {
        $(this).parents(".m-layer").removeClass("z-show");
    });
    //修改昵称
    $("#checktips").on("blur", function() {
            $.ajax({
                method: "GET", //对于请求类型
                url: "http://172.16.2.62:8777/yuer-web/person-center/update-nickname",
                dataType: 'json',
                data: {
                    nickName: $.trim($("#checktips").val())
                }, //这个是一个验证是否重名的接口。参数只有一个 名字
                success: function(data) {
                    console.log(data);
                    if (data.code == 0) { //data.code的值这个是后端人员规定的。
                        console.log("请求成功");
                        if (data.object == 1) { //1为重复
                            console.log("这个nickName重复啦");
                            $("#retips").show();
                        } else if (data.object == 0) {
                            console.log("这个nickName不重复");
                            $("#retips").hide();
                        } else {
                            console.log("未知异常");
                        }
                    } else if (data.code == -2) {
                        console.log("你没有权限，通常来讲，你是没有登录");
                    } else if (data.code == -5) {
                        console.log("参数错误哦。");
                    } else {
                        console.log(data.result);
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            })
        })
        //表单验证--当前密码是否正确
    $("#current").on("blur", function() {
        $("#current").parent().find("span").hide();
        $("#current").parent().find(".verifypassword").show();
        $.ajax({
            method: "GET", //对于请求类型
            url: "http://localhost:3000/api/person-center/is-password-right",
            dataType: 'json',
            data: {
                password: $.trim($("#current").val())
            }, //这个是一个验证是否重名的接口。参数只有一个 名字
            success: function(data) {
                if (data.code == 0) { //data.code的值这个是后端人员规定的。
                    console.log("请求成功");
                    if (data.object == 1) { //1为重复
                        console.log("这个password正确啦");
                        $("#current").parent().find("span").hide();
                        $("#current").parent().find(".rightpassword").show();
                    } else if (data.object == 0) {
                        console.log("这个password不正确");
                        $("#current").parent().find("span").hide();
                        $("#current").parent().find(".failpassword").show();
                    } else {
                        console.log("未知异常");
                    }
                } else if (data.code == -2) {
                    console.log("你没有权限，通常来讲，你是没有登录");
                } else if (data.code == -5) {
                    console.log("参数错误哦。");
                } else {
                    console.log(data.result);
                }
            },
            error: function(a, b, c) {
                console.log("接口出问题啦");
            }
        })
    })
    $("#new").on("blur", function() {
        if ($("#new").val().length < 6) {
            $("#new").parent().find(".u-vpassword").show();
        } else {
            $("#new").parent().find("span").hide();
        }
    })
    $("#confirm").on("blur", function() {
            if ($("#new").val() == $("#confirm").val()) {
                $("#confirm").parent().find("span").hide();
                $("#confirm").parent().find(".rightpassword").show();
            } else {
                $("#confirm").parent().find("span").hide();
                $("#confirm").parent().find(".failpassword").show();
            }
        })
        //修改密码成功弹框
    $("#userbox").on("click", function() {
        $(".m-psuccess").addClass("z-show");
    });
    $(".m-psuccess #userbox").on("click", function() {
        $(this).parents(".m-psuccess").removeClass("z-show");
    });
    //修改密码接口
    $('#send').on("click", function() {
        $.ajax({
            type: "GET",
            url: "http://172.16.2.62:8777/person-center/update-password",
            data: { oldPassword: $("#current").val(), password: $("#new") },
            dataType: "json",
            success: function(data) {
                if (data.code == 0) { //data.code的值这个是后端人员规定的。
                    console.log("请求成功");
                    if (data.object == 1) { //1为重复
                        console.log("这个重复啦");
                    } else if (data.object == 0) {
                        console.log("这个不重复");
                    } else {
                        console.log("未知异常");
                    }
                } else if (data.code == -2) {
                    console.log("你没有权限，通常来讲，你是没有登录");
                } else if (data.code == -5) {
                    console.log("参数错误哦。");
                } else {
                    console.log(data.result);
                }


            },

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
    url:"http://172.16.2.62/person-center/update-nickname",
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
//表单验证--当前密码是否正确
$("#current").on("blur",function(){
	$("#current").parent().find("span").hide();
	$("#current").parent().find(".verifypassword").show();
	$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62/person-center/is-password-right",
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
$("#new").on("blur",function(){
	if($("#new").val().length<6){
		$("#new").parent().find(".u-vpassword").show();
	}else{
		 $("#new").parent().find("span").hide();
	}
})
$("#confirm").on("blur",function(){
	if($("#new").val()==$("#confirm").val()){
		 $("#confirm").parent().find("span").hide();
	     $("#confirm").parent().find(".rightpassword").show();
	}else{
		 $("#confirm").parent().find("span").hide();
	     $("#confirm").parent().find(".failpassword").show();
	}
})
//修改密码成功弹框
	$("#userbox").on("click",function(){
		$(".m-psuccess").addClass("z-show");
	});
	$(".m-psuccess #userbox").on("click",function(){
		$(this).parents(".m-psuccess").removeClass("z-show");
	});
//修改密码接口
	$('#send').on("click",function(){  
  		$.ajax({  
			type: "GET",  
			url: "http://172.16.2.62/person-center/update-password",  
			data: {oldPassword:$("#current").val(),password:$("#new")},   
			dataType: "json",  
			success: function(data){  
				if(data.code == 0){//data.code的值这个是后端人员规定的。
		        	console.log("请求成功");
			        if(data.object==1){//1为重复
	           			 console.log("这个重复啦");
	        		}else if(data.object==0){
	            		console.log("这个不重复");
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
	
            error: function() {
                alert('通讯服务器错误');
            }

		});  
	});  
// 刷新图形验证码
	var $telnumber = $('.telnumber');
    function changeCode(){
        $picCode.attr('src','http://172.16.2.62/checkCode?phone='+$telnumber.val()+'&rand='+new Date());

    }

    $('#gainnumber').click(function(e) {
        var _current = $(e.currentTarget);
        var _error = _current.next('.error-tip');
        if ($telnumber.val()) {
            if (/^1([0-9]){10}$/.test($telnumber.val())) {
                var parm = {};
                parm.mobile = $telnumber.val();
                console.log(parm);
                $.ajax({
                    url: 'http://172.16.2.62:8777/sendSMSCode',
                    data: parm,
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {
                        if (data.object == 0) {
                            $('.code-wrap input').val('');
                            $('.m-mask').show();
                            changeCode();
                        } else {
                            _error.show();
                            _error.text('手机号已被注册');
                            setTimeout(function() {
                                _error.hide();
                                _error.text('手机号码不能为空');
                            }, 2000);
                        }
                    },
                    error: function() {
                        alert('通讯服务器错误');
                    }
                });
            } else {
                _error.show();
                _error.text('请输入正确号码');
                setTimeout(function() {
                    _error.hide();
                    _error.text('手机号码不能为空');
                }, 2000);
            }
        } else {
            _error.show();
            setTimeout(function() {
                _error.hide();
            }, 2000);
        }
    })

    $('.pic-code a').click(function(e) {
        e.preventDefault();
        changeCode();
    })

//日期插件
//$('#datetimepicker').datetimepicker({
      //lang:"ch",           //语言选择中文
      //format:"Y-m-d",      //格式化日期
      //timepicker:false,    //关闭时间选项
      //yearStart:2000,     //设置最小年份
     // yearEnd:2050,        //设置最大年份
      //todayButton:false    //关闭选择今天按钮
// });
// $.datetimepicker.setLocale('ch');
//手机认证

$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62/person-center/mobile-auth",
    dataType: 'json',
 //    data: {checkCode:$.trim($("#verify").val()),
 //           mobile:$.trim($("#number").val()),
	// },
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        if (!checkCode.val().match(/^[1][3][0-9]{9}$/)) {
		$("#verify").html("<font color='red'>手机号码格式不正确！请重新输入</font>");
		$("#verify").unbind("focus");  // 添加这行，在focus()之前先把绑定的 focus 处理事件去掉
		$("#verify").focus();	
	}
	     if(data.object==1){//1为重复
            console.log("这个重复啦");
        	}else if(data.object==0){
            	console.log("这个不重复");
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
    url:"http://172.16.2.62/pay/recharge-list",
    dataType: 'json',
    data: {},//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
    	console.log(data);
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	         var str = "";
	  			for(index in data.object){
	  				str+='<div class="m-maint">'+
						 '<div class="u-topup">'+
						 '<a href="" class="u-topfish">'+data.object[index].id+'</a>'+
						 '</div>'+
						 '<div class="u-value">'+
						 '<div>'+
						 '<span class="u-vfish">'+data.object[index].rmb+'</span>'+
						 '<span class="u-vmoney">'+data.object[index].yuer_amount+'</span>'+
						 '</div>;';
				}
	        if(data.object==1){//1为重复
            	console.log("这个重复啦");
        	}else if(data.object==0){
            	console.log("这个不重复");
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
//充值
$("#tuvalue").on("click",function(){
$.ajax({
    method:"GET",//对于请求类型
    url:" http://172.16.2.62/pay/recharge",
    dataType: 'json',
    data: {id:$.trim($("#id").val()) },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        $("#topupvalue").each(function(){

                    })
                    if (data.object == 1) { //1为重复
                        console.log("这个重复啦");
                    } else if (data.object == 0) {
                        console.log("这个不重复");
                    } else {
                        console.log("未知异常");
                    }
                } else if (data.code == -2) {
                    console.log("你没有权限，通常来讲，你是没有登录");
                } else if (data.code == -5) {
                    console.log("参数错误哦。");
                } else {
                    console.log(data.result);
                }
            },
            error: function(a, b, c) {
                console.log("接口出问题啦");
            }
        })
    })

//支付宝
$("#tuvalue").on("click",function(){
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62/pay/alipay",
    dataType: 'json',
    data: { id:$.trim($("#id").val()),
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	     if(data.object==1){//1为重复
            console.log("这个重复啦");
        	}else if(data.object==0){
            	console.log("这个不重复");
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
    url:"http://172.16.2.62/person-center/my-concern",
    dataType: 'json',
    data: { page:$.trim($("#page").val()),
    		pageSize:$.trim($("#pageSize").val())
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        var str = "";
	  			for(index in data.object.list){
	  				str+='<div class="m-main"><div class="u-top"><h3>主播</h3></div>'+
	  				'<div class="u-host"><div class="u-hleft"><div class="u-focusimg">'+
	  				'<img src="'+data.object.list[index].icon+'"></div>'+
	  				'<div class="u-nickhost"><p class="u-nicksex"><span>'+data.object.list[index].nickname+'</span>'+
	  				'<img src="'+data.object.list[index].sex+'"></p><div class="u-hostfans"><p>'+
	  				'<span class="u-hf">直播间ID</span>&nbsp;	'+	
	  				'<span class="u-num">'+data.object.list[index].room_number+'</span></p>'+
	  				'<p class="u-hhf"><span class="u-hf">粉丝</span>&nbsp;'+
	  				'<span class="u-num">'+data.object.list[index].fans+'</span></p></div>'+
	  				'</div></div><div class="u-hright"><img src="/images/focusclick.png">'+
	  				'<a href="'+data.object.list[index].room_number+'">进入房间</a></div></div>'	
					console.log("性别0男1女是"+data.object.list[index].sex);
					console.log("关注对象id是"+data.object.list[index].user_id);
				}
	      	if(data.object.total==0){

                } else if (data.object.total < 6) {
                    for (index in data.object.list) {
                        console.log("粉丝数是" + data.object.list[index].fans);
                        console.log("头像是" + data.object.list[index].icon);
                        console.log("昵称是" + data.object.list[index].nickname);
                        console.log("房间号是" + data.object.list[index].room_number);
                        console.log("性别0男1女是" + data.object.list[index].sex);
                        console.log("关注对象id是" + data.object.list[index].user_id);
                    }
                } else {
                    for (index in data.object.list) {
                        console.log("粉丝数是" + data.object.list[index].fans);
                        console.log("头像是" + data.object.list[index].icon);
                        console.log("昵称是" + data.object.list[index].nickname);
                        console.log("房间号是" + data.object.list[index].room_number);
                        console.log("性别0男1女是" + data.object.list[index].sex);
                        console.log("关注对象id是" + data.object.list[index].user_id);
                    }
                }
                if (data.object == 1) { //1为重复
                    console.log("这个重复啦");
                } else if (data.object == 0) {
                    console.log("这个不重复");
                } else {
                    console.log("未知异常");
                }
            } else if (data.code == -2) {
                console.log("你没有权限，通常来讲，你是没有登录");
            } else if (data.code == -5) {
                console.log("参数错误哦。");

            } else {
                console.log(data.result);
            }
        },
        error: function(a, b, c) {
            console.log("接口出问题啦");
        }
    })

//我的消息
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62/person-center/my-msg",
    dataType: 'json',
    data: {page:$.trim($("#page").val()),
    	   pageSize:$.trim($("#pageSize").val()),
    	   type:$.trim($("#type").val()),
    },//这个是一个验证是否重名的接口。参数只有一个 名字
    success:function(data){
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        var str="";
	        for(index in data.object.list){
	  				str+='<div class="m-mainm">'+
						'<div class="u-m-top">'+
						'<a href="">系统消息</a>'+
						'<a href="">关注消息</a>'+
						'</div>'+
						'<div class="u-systemmessage mcurrent">'+
						'<div class="u-message">'+
						'<div class="u-msystem">'+
						'<img src="/images/messagehead.png">'+
						'</div>'+
						'<div class="u-yuer">'+
						'<p>'+
							'<h3>'+data.object.list[index].title+'</h3>'+
							'<span class="u-messagetime">'+data.object.list[index].create_date+'</span>'+
						'<p>'+
						'<p>'+
						'<span class="u-messagecontent"></span><span class="u-messtips">'+data.object.list[index].obj_id+'</span>'+
						'</p>'+
					'</div>'+
					'</div>'	
			}
						if(data.object.total==0){

                    } else if (data.object.total < 11) {
                        for (index in data.object.list) {
                            console.log("内容是" + data.object.list[index].content);
                            console.log("时间是" + data.object.list[index].create_date);
                            console.log("消息id是" + data.object.list[index].id);
                            console.log("目标id是" + data.object.list[index].obj_id);
                            console.log("标题是" + data.object.list[index].title);
                        }
                    } else {

                    }
                    if (data.object == 1) { //1为重复
                        console.log("这个重复啦");
                    } else if (data.object == 0) {
                        console.log("这个不重复");
                    } else {
                        console.log("未知异常");
                    }
                } else if (data.code == -2) {
                    console.log("你没有权限，通常来讲，你是没有登录");
                } else if (data.code == -5) {
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
    url:"http://172.16.2.62/person-center/my-gifts",
    dataType: 'json',
    data: {},
    success:function(data){
    	console.log(data);
	    if(data.code == 0){//data.code的值这个是后端人员规定的。
	        console.log("请求成功");
	        var str="";
	        var str1="";
	        for(index in data.object.gifts){
	  			str+='<div class="m-mainp">'+
					'<div class="u-top">'+
					'<h3>道具信息</h3>'+
					'</div>'+
					'<div class="u-imgmessage">'+
					'<div class="imgprops">'+
					'<div class="u-props">'+
					'<img src="'+data.object.gifts[index].icon+'">'+
					'<p>'+
					'<span>'+data.object.gifts[index].name+'</span>'+
					'<span class="u-propscolor">'+data.object.gifts[index].num+'</span>'+
					'<span>个</span>'+
					'</p>'+
					'</div>'+
					'</div>'+
					'</div>'+
					'</div>';
			}
			str1+='<div class="u-bottom">'+
					'<p>'+
					'<span class="u-bvalue">道具价值：</span>'+
					'<span class="u-bmoney">'+data.object[index].totalValue+'</span>'+
					'<span class="u-bunit">鱼币</span>'+
					'</p>'+
					'</div>';
	        if(data.object==1){//1为重复
            	console.log("这个重复啦");
        	}else if(data.object==0){
            	console.log("这个不重复");
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
    url:"http://172.16.2.62/person-center/user-info",
    dataType: 'json',
    data: {id:window.sessionStorage.getItem("id")
    },
    success:function(data){
    	console.log(data);
	    if(data.code == 0){
	        console.log("请求成功");
	        if(data.object==1){//1为重复
            console.log("这个重复啦");
        	}else if(data.object==0){
            	console.log("这个不重复");
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


});
