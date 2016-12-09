$(function(){
	var userId = "",
		token = "";

	var jumpsecond = 10;

	function getQueryString(name) {
	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return unescape(r[2]);
	    }
	    return null;
	}

	userId = getQueryString("userId");
	token = getQueryString("token");

	var bindMobile = getQueryString("mobile"),
		certificate = getQueryString("certificate");

	// if(userId &&)  

	if(userId && bindMobile){
		var icon = "",
			sex = 1,
			name = "",
			id = "";

		//设定倒数秒数  
		var t = 10;  
		//显示倒数秒数  
		function showTime(){  
		    t -= 1;  
		    t = $("#second").html();
		    if(t==0){  
		        $('.step-three').hide();
		        myInfo(); 
		    }  
		    //每秒执行一次,showTime()  
		    setTimeout("showTime()",1000);  
		}  
		var s = 10;  
		//显示倒数秒数  
		function showTimes(){  
		    s -= 1;  
		    s = $("#seconds").html();
		    if(s==0){  
		        $('.u-Authentication').show();
		        $(".u-AuditDidNotPass").hide();
		    }  
		    //每秒执行一次,showTime()  
		    setTimeout("showTime()",1000);  
		}

        function myInfo(){
        	$('.step-final').show();
        	$.ajax({
	            url: 'http://wy.yuerapi.wangyuhudong.com/tv/my/my',
	            data: {token:token,
			        userId:userId,
			  	},  
	            type: 'get',
	            dataType: 'json',
	            success: function(data) {
	                if (data.code==0) {
	                	icon = 'http://img/wangyuhudong.com'+data.object.icon;
	                	sex = data.object.sex;
	                	name = data.object.nickname;
	                	id = data.object.room_id;
	                	$('.Uicon img').attr('src',icon);
	                	if(sex == 0){
	                		$('.USex img').attr('src','/mobile/images/hostmale.png')
	                	}
	                	$('.Uname span').text(name);
	                	$('.UId').text('房间:'+id);
	                }else{
	                    showTip(data.result);
	                }
	            },
	            error: function() {
	                showTip('通讯服务器错误');
	            }
	        });
        }

        // 审核状态 
		$.ajax({  
		  	type: "GET",  
		  	url: "http://wy.yuerapi.wangyuhudong.com/h5/certificateState",  
		  	data: {token:token,
		        userId:userId,
		  	},  
		  	dataType: "json",  
		  	success: function(data){  
		      	if(data.code == 0){//data.code的值这个是后端人员规定的。
		        	console.log("请求成功");
		          	// $(".u-Authentication").hide();//认证页面
		          	// $("u-InTheReview").hide();//审核中
		          	// $("u-Approved").hide();//审核通过
		          	// $("u-AuditDidNotPass").hide();//审核不通过
			        if(object.certificate_state == 1){
			          	$(".u-InTheReview").show();//审核中
			        }else if(object.certificate_state == 2){
			          	$(".u-Approved").show();//审核通过
			          	if(object.is_first==0){
			          		$('.step-one').hide();
			          		$('.step-three').show();
			          		$('.u-Authentication').hide();
			          		$(".u-Approved").show();//审核通过
			            	//执行showTime()  
			          		showTime();
			          	}else if(object.is_first==1){
			          		$('.step-one').hide();
			          		myInfo(); 
			          	}
			        }else if(object.certificate_state == 3){
						$("u-AuditDidNotPass").show();//审核不通过
						if(object.is_first==0){
							$('.step-one').hide();
			          		$('.step-three').show();
			          		$('.u-Authentication').hide();
			            	$(".u-AuditDidNotPass").show();//审核不通过
			            	//执行showTimes()  
							showTimes();
			          	}else if(object.is_first==1){
			          		$('.step-one').hide();
			            	$(".step-three").show();//认证页面
			          	}
			        }else {
			          	if(object.is_first==0){
			            	$(".u-Authentication").show();//认证页面
			          	}else if(object.is_first==1){
			            	$(".u-Authentication").hide();//认证页面
			          	}
		         	}  
			   	} else if (data.code == -2) {
			        console.log("你没有权限，通常来讲，你是没有登录");
			    } else if (data.code == -5) {
			        console.log("参数错误哦。");     
			    }else{
			        console.log(data.result);
			    }    
			},
		  	error: function() {
		      	showTip('通讯服务器错误');
		  	} 
		}); 
	}else if(userId && !bindMobile){
		$('.register').hide();
		$('.bindmobile').show();
	}

	// 教程显示
	if (/(Android)/i.test(navigator.userAgent)) {
	    $('.ios').hide() && $('.android').show();
	}

	$('.sex-radio label').click(function(){
        var radioId = $(this).attr('name');
        $('.sex-radio label').removeAttr('class') && $(this).attr('class', 'checked');
        $('.sex-radio input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
    });

	var $regnumber = $('.m-register .telnumber');
	var $bindnumber = $('.m-bindmobile .telnumber');

	// 错误弹出提示
	function showTip(text){
		$('.tip').text(text).fadeIn();
        setTimeout(function(){
            $('.tip').fadeOut();
        },1500);
	}
	// 注册
    $('.m-register .getCode').click(function(e){
        if($regnumber.val()){
            if(/^1([0-9]){10}$/.test($regnumber.val())){
                var parm = {};
                parm.mobile = $regnumber.val();
                parm.type = 6;
                $.ajax({
		            url: 'http://wy.yuerapi.wangyuhudong.com/sendSMSCode',
		            data: parm,
		            type: 'get',
		            dataType: 'json',
		            success: function(data) {
		                if (data.code==0) {
		                    var second = 59;
		                    $('.m-register .getCode').attr('disabled',true).text(second+'(s)');
		                    function settime(val) { 
		                        if (second > 0) { 
		                            $('.m-register .getCode').text(second+'(s)');
		                            second--;
		                            setTimeout(function() { 
		                                settime(val) 
		                            },1000);
		                        } else {
		                            $('.m-register .getCode').attr('disabled',false).text('获取验证码');                             
		                        } 
		                    } 
		                    settime(second);                 
		                }else{
		                    showTip(data.result);
		                }
		            },
		            error: function() {
		                showTip('通讯服务器错误');
		            }
		        });
            }else{
            	showTip('请输入正确的手机号！');
            }
        }else{
        	showTip('手机号码不能为空！');
        }
    });

    // 长度校验
    function strlen(str){
        var len = 0;
        for (var i=0; i<str.length; i++) { 
            var c = str.charCodeAt(i); 
            //单字节加1 
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
               len++; 
            } 
            else { 
              len+=2; 
            } 
        } 
        return len;
    }

    // 注册
    $('.u-reg-btn').click(function(){
    	var formComplete = true;
        
    	$('.m-register input').each(function(){
    		if(!$(this).val()){
    			showTip($(this).attr('name')+'不能为空！');
    			formComplete = false;
    			return false;
    		}
    	})

    	if($('.m-register .telnumber').val() && $('.m-register .code').val() && $('.m-register .password').val() && $('.nickname').val()){
			if($('.m-register .code').val().length<6){
	            formComplete = false;
	            showTip('验证码位数错误!');
	        }else if($('.m-register .password').val().length<6){
	            formComplete = false;
	            showTip('密码太短!');
	        }else if(strlen($('.nickname').val())>16){
	            formComplete = false;
	            showTip('昵称过长！');
	        }
    	}

    	if(formComplete){
    		var parm = {};
            parm.nickname = $('.m-register .nickname').val();
            parm.mobile = $regnumber.val();
            parm.smsCode = $('.m-register .code').val();
            parm.password = $('.m-register .password').val();
            parm.sex = $("input[name='sex']:checked").val();
            $.ajax({
                url: 'http://wy.yuerapi.wangyuhudong.com/h5/register',
                data: parm,
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    if (data.code==0) {
                    	userId = data.object.id;
                    	token = data.object.token;
                        $('.m-register').hide();
                        $('.register .reg-success').show();
                        window.location.href = 'yuertvopen://register?mobile='+parm.mobile+'&password='+parm.password;
                        function jump(val) { 
	                        if (jumpsecond > 0) { 
	                            $('.autojump .time').text(jumpsecond+'S');
	                            jumpsecond--;
	                            setTimeout(function() { 
	                                jump(val) 
	                            },1000);
	                        } else {
	                            $('.step-one').hide();
	                            $('.step-two').show();                    
	                        } 
	                    } 
	                    jump(jumpsecond);
                    }else{
                    	showTip(data.result);
                    }
                },
                error: function() {
                    showTip('通讯服务器错误');
                }
            });
    	}
    })

    // 登录
    $('.u-log-btn').click(function(){
    	window.location.href = "yuertvopen://login";
    })

    // 绑定手机号
    $('.m-bindmobile .getCode').click(function(e){
        if($bindnumber.val()){
            if(/^1([0-9]){10}$/.test($bindnumber.val())){
                var parm = {};
                parm.mobile = $bindnumber.val();
                parm.type = 5;
                $.ajax({
		            url: 'http://wy.yuerapi.wangyuhudong.com/sendSMSCode',
		            data: parm,
		            type: 'get',
		            dataType: 'json',
		            success: function(data) {
		                if (data.code==0) {
		                    var second = 59;
		                    $('.m-bindmobile .getCode').attr('disabled',true).text(second+'(s)');
		                    function settime(val) { 
		                        if (second > 0) { 
		                            $('.m-bindmobile .getCode').text(second+'(s)');
		                            second--;
		                            setTimeout(function() { 
		                                settime(val) 
		                            },1000);
		                        } else {
		                            $('.m-bindmobile .getCode').attr('disabled',false).text('获取验证码');                             
		                        } 
		                    } 
		                    settime(second);                 
		                }else{
		                    showTip(data.result);
		                }
		            },
		            error: function() {
		                showTip('通讯服务器错误');
		            }
		        });
            }else{
            	showTip('请输入正确的手机号！');
            }
        }else{
        	showTip('手机号码不能为空！');
        }
    });

    $('.u-bind-btn').click(function(){
    	var formComplete = true;
        
    	$('.m-bindmobile input').each(function(){
    		if(!$(this).val()){
    			showTip($(this).attr('name')+'不能为空！');
    			formComplete = false;
    			return false;
    		}
    	})

    	if($('.m-bindmobile .telnumber').val() && $('.m-bindmobile .code').val() && $('.m-bindmobile .password').val()){
			if($('.m-bindmobile .code').val().length<6){
	            formComplete = false;
	            showTip('验证码位数错误!');
	        }else if($('.m-bindmobile .password').val().length<6){
	            formComplete = false;
	            showTip('密码太短!');
	        }
    	}

    	if(formComplete){
    		var parm = {};
            parm.mobile = $bindnumber.val();
            parm.checkCode = $('.m-bindmobile .code').val();
            parm.password = $('.m-bindmobile .password').val();
            parm.token = token;
            parm.userId = userId;
            $.ajax({
                url: 'http://wy.yuerapi.wangyuhudong.com/bindMobile',
                data: parm,
                type: 'get',
                dataType: 'json',
                success: function(data) {
                    if (data.code==0) {
                        $('.m-bindmobile').hide();
                        $('.bindmobile .reg-success').show();
                        function jump(val) { 
	                        if (jumpsecond > 0) { 
	                            $('.autojump .time').text(jumpsecond+'S');
	                            jumpsecond--;
	                            setTimeout(function() { 
	                                jump(val) 
	                            },1000);
	                        } else {
	                            $('.step-one').hide();
	                            $('.step-two').show();                    
	                        } 
	                    } 
	                    jump(jumpsecond);
                    }else{
                    	showTip(data.result);
                    }
                },
                error: function() {
                    showTip('通讯服务器错误');
                }
            });
    	}
    })

    $('.u-steptwo').click(function(){
    	$('.step-one').hide();
    	$('.step-two').show();
    });

    // 发送手播下载地址
    $('.u-download-btn').click(function(){
    	var parm = {};
        parm.token = token;
        parm.userId = userId;
    	$.ajax({
            url: 'http://wy.yuerapi.wangyuhudong.com/h5/sendSMStoDownload',
            data: parm,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                if (data.code==0) {
                    showTip('短信发送成功,请注意查看噢');
                }else{
                	showTip(data.result);
                }
            },
            error: function() {
                showTip('通讯服务器错误');
            }
        });
    })

    // 认证主播

	$('.fileupload').each(function(){
		$(this).change(function(){
			// showTip($(this).attr('id'));
			var _this = $(this);
			var fileName = $(this).val();
			var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
			if (extension == ".jpg" || extension == ".png") {
			    var data = new FormData();
			    data.append('upload', $(this)[0].files[0]);
			    $.ajax({
			        url: 'http://wy.yuerapi.wangyuhudong.com/common/upload',
			        type: 'post',
			        data: data,
			        cache: false,
			        contentType: false, //不可缺参数
			        processData: false, //不可缺参数
			        success: function(data) {
			        	_this.parents('.u-card').find('.img').css('background','none');
			            _this.parents('.u-card').find('.img img').attr('src','http://img.wangyuhudong.com'+data.object);
			        },
			        error: function() {
			            console.log('error');
			        }
			    });
			}
		});
	})

	$("#idCardDueDate").on("input",function(){
	   	if($(this).val().length>0){
		   $(this).addClass("full");
		}
		else{
		  $(this).removeClass("full");
	  	}
	});

    $('#Usubmit').on("click",function(e){  
    	e.preventDefault();

	  	var UsubmitCheck=true;

	  	$(".Ucenter input").each(function(){
	    	if(!$(this).val()){
	      		showTip($(this).attr("name"));
	      		UsubmitCheck=false;
	      		return false;
	    	}
	  	});
	  	
	  	if($("#checkName").val() && $("#checkQQ").val() && $("#checkIdCard").val()){
	    	if($("#checkName").val().length>9){
		      	UsubmitCheck=false;
		      	showTip("名字过长");
		    }else if($("#checkQQ").val().length<5 && $("#checkQQ").val().length>12){
		      	UsubmitCheck=false;
		      	showTip("QQ号位数错误");
		    }else if((!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test($("#checkIdCard").val())) ){
		      	UsubmitCheck=false;
		      	showTip("身份证号错误");
		    }
	  	}

	  	if(UsubmitCheck){
	  		$.ajax({  
		        type: "GET",  
		        url: "http://wy.yuerapi.wangyuhudong.com/h5/upCertificate",  
		        data: {idCard:$("#checkIdCard").val(),
		               idCardBackScan:$("#idCardBackScan").attr('src'),
		               idCardDueDate:$("#idCardDueDate").val(),
		               idCardFrontScan:$("#idCardFrontScan").attr('src'),
		               idCardHandScan:$("#idCardHandScan").attr('src'),
		               qq:$("#checkQQ").val(),
		               realname:$("#checkName").val(),
		               token:token,
		               userId:userId
		        },  
		        dataType: "json",  
		        success: function(data){  
		            if(data.code == 0){//data.code的值这个是后端人员规定的。
		              	// console.log("请求成功");
		              	showTip("上传成功");
		            } else if (data.code == -2) {
		                console.log("你没有权限，通常来讲，你是没有登录");
		            } else if (data.code == -5) {
		                console.log("参数错误哦。");
		                
		            }else{
		                console.log(data.result);
		            }    
		        },
		        error: function() {
		            showTip('通讯服务器错误');
		        } 
		    });
	  	}      
	}); 
	// 验证qq号只能输入数字
	$(".inputCheck").off("keydown").on("keydown",function(e){
	    if((e.keyCode >=48 && e.keyCode <=57)||(e.keyCode >=97 && e.keyCode <=105)||(e.keyCode == 8)){
	    
	    }else{
	        e.preventDefault();
	    }
	})

	$('#clickObtain').on("click",function(e){ 
        e.preventDefault(); 
        $.ajax({  
            type: "GET",  
            url: "http://wy.yuerapi.wangyuhudong.com/h5/sendSMStoDownload",  
            data: {
                   token:token,
                   userId:userId
            },  
            dataType: "json",  
            success: function(data){  
                if(data.code == 0){//data.code的值这个是后端人员规定的。
                  console.log("请求成功");
                  showTip("短信发送成功，请注意查看手机短信噢");
                } else if (data.code == 1) {
                    showTip("短信发送失败,请稍后再试");
                } else if (data.code == 2) {
                    showTip("获取短信过于频繁,请稍后再试");
                } else if (data.code == -2) {
                    console.log("你没有权限，通常来讲，你是没有登录");
                } else if (data.code == -5) {
                    console.log("参数错误哦。");
                    
                }else{
                    console.log(data.result);
                }    
            },
            error: function() {
                showTip('通讯服务器错误');
            } 
        });  
    }); 
})