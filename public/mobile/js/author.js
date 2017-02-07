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

	function myInfo(){
    	$('.step-final').show();
    	$.ajax({
            url: 'http://yuerapi.wangyuhudong.com/tv/my/my',
            data: {
            	toUserId:userId,
            	token:token,
		        userId:userId,
		  	},  
            type: 'get',
            dataType: 'json',
            success: function(data) {
                if (data.code==0) {
                	icon = 'http://img.wangyuhudong.com/'+data.object.icon;
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
                showTip('连接失败，请检查您的网络设置后重试');
            }
        });
    }

    //设定倒数秒数  
	var t = 10;  
	//显示倒数秒数  
	function showTime(val){  
	    $("#second").html(t);
	    if(t>0){  
	    	t -= 1;  
	    	//每秒执行一次,showTime()  
		    setTimeout(function(){
		    	showTime(val);
		    },1000);  
	    }else if(t == 0){
	    	$('.step-three').hide();
	        myInfo();
	    }			     
	}  
	var s = 10;  
	//显示倒数秒数  
	function showTimes(val){  
		$("#seconds").html(s);
	    if(s>0){  
	    	s -= 1;  
	    	//每秒执行一次,showTime()  
		    setTimeout(function(){
		    	showTimes(val);
		    },1000);  
	    }else if(s == 0){
	    	$('.u-Authentication').show();
	        $(".u-AuditDidNotPass").hide();
	    }		 
	}

	if(userId){
		var mobile = "";
		$.ajax({
            url: 'http://yuerapi.wangyuhudong.com/tv/my/my',
            data: {
            	toUserId:userId,
            	token:token,
		        userId:userId,
		  	},  
            type: 'get',
            async: false,
            dataType: 'json',
            success: function(data) {
                if (data.code==0) {
                	mobile = data.object.mobile;
                }else{
                    showTip(data.result);
                }
            },
            error: function() {
                showTip('连接失败，请检查您的网络设置后重试');
            }
        });

        if(mobile){
        	var icon = "",
				sex = 1,
				name = "",
				id = "";

	        // 审核状态 
			$.ajax({  
			  	type: "GET",  
			  	url: "http://yuerapi.wangyuhudong.com/h5/certificateState",  
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
				        if(data.object.certificate_state == 1){
				        	// $('.step-one').hide();
			          		$('.step-three').show();
			          		$('.u-Authentication').hide();
				          	$(".u-InTheReview").show();//审核中
				        }else if(data.object.certificate_state == 2){
				          	if(data.object.is_first==0){
				          		// $('.step-one').hide();
				          		$('.step-three').show();
				          		$('.u-Authentication').hide();
				          		$(".u-Approved").show();//审核通过
				            	// 执行showTime()  
				          		showTime(t);
				          	}else if(data.object.is_first==1){
				          		// $('.step-one').hide();
				          		myInfo(); 
				          	}
				        }else if(data.object.certificate_state == 3){
							if(data.object.is_first==0){
								// $('.step-one').hide();
				          		$('.step-three').show();
				          		$('.u-Authentication').hide();
				            	$(".u-AuditDidNotPass").show();//审核不通过
				            	//执行showTimes()  
								showTimes(s);
				          	}else if(data.object.is_first==1){
				          		// $('.step-one').hide();
				            	$(".step-three").show();//认证页面
				          	}
				        }else{
				        	// $('.step-one').hide();
				          	$('.step-two').show();
				        }
				   	} else if (data.code == -2) {
				        console.log("你没有权限，通常来讲，你是没有登录");
				    } else if (data.code == -5) {
				        console.log("参数错误哦。");     
				    }else{
				        showTip(data.result); 
				    }    
				},
			  	error: function() {
			      	showTip('连接失败，请检查您的网络设置后重试');
			  	} 
			}); 
        }else{
        	$('.step-one').show();
        	$('.register').hide();
			$('.bindmobile').show();
        }		
	}else{
		$('.step-one').show();
	}

	// $('.step-one').hide();
	// $('.step-three').show();
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
            if(/^1[34578]\d{9}$/.test($regnumber.val())){
                var parm = {};
                parm.mobile = $regnumber.val();
                parm.type = 6;
                $.ajax({
		            url: 'http://yuerapi.wangyuhudong.com/sendSMSCode',
		            data: parm,
		            type: 'get',
		            dataType: 'json',
		            success: function(data) {
		                if (data.code==0) {
		                    var second = 59;
		                    $('.m-register .getCode').attr('disabled',true).text(second+'(s)');
		                    function settime(val) { 
		                        if (second > 0) { 
		                            $('.m-register .getCode').addClass('cant').text(second+'(s)');
		                            second--;
		                            setTimeout(function() { 
		                                settime(val) 
		                            },1000);
		                        } else {
		                            $('.m-register .getCode').attr('disabled',false).removeClass('cant').text('获取验证码');                             
		                        } 
		                    } 
		                    settime(second);                 
		                }else{
		                    showTip(data.result);
		                }
		            },
		            error: function() {
		                showTip('连接失败，请检查您的网络设置后重试');
		            }
		        });
            }else{
            	showTip('请输入正确的手机号码！');
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
                url: 'http://yuerapi.wangyuhudong.com/h5/register',
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
	                        } else if(jumpsecond == 0){
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
                    showTip('连接失败，请检查您的网络设置后重试');
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
            if(/^1[34578]\d{9}$/.test($bindnumber.val())){
                var parm = {};
                parm.mobile = $bindnumber.val();
                parm.type = 5;
                $.ajax({
		            url: 'http://yuerapi.wangyuhudong.com/sendSMSCode',
		            data: parm,
		            type: 'get',
		            dataType: 'json',
		            success: function(data) {
		                if (data.code==0) {
		                    var second = 59;
		                    $('.m-bindmobile .getCode').attr('disabled',true).text(second+'(s)');
		                    function settime(val) { 
		                        if (second > 0) { 
		                            $('.m-bindmobile .getCode').addClass('cant').text(second+'(s)');
		                            second--;
		                            setTimeout(function() { 
		                                settime(val) 
		                            },1000);
		                        } else {
		                            $('.m-bindmobile .getCode').attr('disabled',false).removeClass('cant').text('获取验证码');                             
		                        } 
		                    } 
		                    settime(second);                 
		                }else{
		                    showTip(data.result);
		                }
		            },
		            error: function() {
		                showTip('连接失败，请检查您的网络设置后重试');
		            }
		        });
            }else{
            	showTip('请输入正确的手机号码！');
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
                url: 'http://yuerapi.wangyuhudong.com/bindMobile',
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
	                        } else if(jumpsecond == 0){
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
                    showTip('连接失败，请检查您的网络设置后重试');
                }
            });
    	}
    })

    $('.u-steptwo').click(function(){
    	jumpsecond = -1;
    	$('.step-one').hide();
    	$('.step-two').show();
    });

    $('.u-stepthree').click(function(){
    	jumpsecond = -1;
    	$('.step-two').hide();
    	$('.step-three').show();
    })

    // 发送手播下载地址
    $('.u-download-btn').click(function(){
    	var parm = {};
        parm.token = token;
        parm.userId = userId;
    	$.ajax({
            url: 'http://yuerapi.wangyuhudong.com/h5/sendSMStoDownload',
            data: parm,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                if(data.code == 0){//data.code的值这个是后端人员规定的。
                  	showTip("短信发送成功，请注意查看手机短信噢");
                  	var second = 59;
	                $('.u-download-btn').attr('disabled',true).addClass('cant');
	                function settime(val) { 
	                    if (second > 0) { 
	                        second--;
	                        setTimeout(function() { 
	                            settime(val) 
	                        },1000);
	                    } else {
	                        $('.u-download-btn').attr('disabled',false).removeClass('cant');                             
	                    } 
	                } 
	                settime(second); 
                } else if (data.code == 1) {
                    showTip("短信发送失败,请稍后再试");
                } else if (data.code == 2) {
                    showTip("动作太快啦，等等再试试");
                }
            },
            error: function() {
                showTip('连接失败，请检查您的网络设置后重试');
            }
        });
    })

    // 认证主播

	$('.fileupload').each(function(){
		$(this).change(function(){
			// showTip($(this).attr('id'));
			var _this = $(this);
			// var fileName = $(this).val();
			// var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
			// if (extension == ".jpg" || extension == ".png") {
			//     var data = new FormData();
			//     data.append('upload', $(this)[0].files[0]);
			//     $.ajax({
			//         url: 'http://yuerapi.wangyuhudong.com/common/upload',
			//         type: 'post',
			//         data: data,
			//         cache: false,
			//         contentType: false, //不可缺参数
			//         processData: false, //不可缺参数
			//         success: function(data) {
			//         	_this.parents('.u-card').find('.img').css('background','none');
			//             _this.parents('.u-card').find('.img img').attr('src','http://img.wangyuhudong.com'+data.object);
			//         },
			//         error: function() {
			//             console.log('error');
			//         }
			//     });
			// }
			lrz($(this)[0].files[0], {
		        width: 800,
		        quality: 0.9
		    }).then(function (rst) {
	            function dataURLtoBlob(dataurl) {
			        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			        while (n--) {
			            u8arr[n] = bstr.charCodeAt(n);
			        }
			        return new Blob([u8arr], { type: mime });
			    }
			    var data = new FormData();
			    data.append('upload', dataURLtoBlob(rst.base64));
			    $.ajax({
			        url: 'http://yuerapi.wangyuhudong.com/common/upload',
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
			});
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
	    	if(!$(this).val().trim()){
	      		showTip($(this).attr("name"));
	      		UsubmitCheck=false;
	      		return false;
	    	}
	  	});
	  	
	  	if($("#checkName").val().trim() && $("#checkQQ").val().trim() && $("#checkIdCard").val().trim()){
	    	if($("#checkName").val().length>8){
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
		        url: "http://yuerapi.wangyuhudong.com/h5/upCertificate",  
		        data: {idCard:$("#checkIdCard").val().trim(),
		               idCardBackScan:$("#idCardBackScan").attr('src'),
		               idCardDueDate:$("#idCardDueDate").val(),
		               idCardFrontScan:$("#idCardFrontScan").attr('src'),
		               idCardHandScan:$("#idCardHandScan").attr('src'),
		               qq:$("#checkQQ").val().trim(),
		               realname:$("#checkName").val().trim(),
		               token:token,
		               userId:userId
		        },  
		        dataType: "json",  
		        success: function(data){  
		            if(data.code == 0){//data.code的值这个是后端人员规定的。
		              	// console.log("请求成功");
		              	$('.u-Authentication').hide();
			          	$(".u-InTheReview").show();//审核中		              	
		            }else{
		                showTip(data.result);
		            }    
		        },
		        error: function() {
		            showTip('连接失败，请检查您的网络设置后重试');
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

	$('.u-Approved .specTips a').click(function(e){
		e.preventDefault();
		t = -1;
		$('.step-three').hide();
		myInfo();
	})

	$('.u-AuditDidNotPass .specTips a').click(function(e){
		e.preventDefault();
		s = -1;
		$('.u-Authentication').show();
		$(".u-AuditDidNotPass").hide();
	})

	$('#clickObtain').on("click",function(e){ 
        e.preventDefault(); 
        $.ajax({  
            type: "GET",  
            url: "http://yuerapi.wangyuhudong.com/h5/sendSMStoDownload",  
            data: {
                   token:token,
                   userId:userId
            },  
            dataType: "json",  
            success: function(data){  
                if(data.code == 0){//data.code的值这个是后端人员规定的。
                  	console.log("请求成功");
                  	showTip("短信发送成功，请注意查看手机短信噢");
                  	var second = 59;
	                $('#clickObtain').attr('disabled',true).addClass('cant');
	                function settime(val) { 
	                    if (second > 0) { 
	                        second--;
	                        setTimeout(function() { 
	                            settime(val) 
	                        },1000);
	                    } else {
	                        $('#clickObtain').attr('disabled',false).removeClass('cant');                             
	                    } 
	                } 
	                settime(second);
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
                showTip('连接失败，请检查您的网络设置后重试');
            } 
        });  
    }); 
})