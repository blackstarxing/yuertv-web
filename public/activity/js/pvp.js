$(function(){
	// var swiper = new Swiper('.swiper-container', {
 //        pagination: '.swiper-pagination',
 //        paginationClickable: true,
 //        direction: 'vertical',
 //        loop:true
 //    });  
    var mySwiper = new Swiper ('.swiper-container', {
    	direction: 'vertical',
    	loop:true,
	  	onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
		    swiperAnimateCache(swiper); //隐藏动画元素 
		    swiperAnimate(swiper); //初始化完成开始动画
		}, 
	  	onSlideChangeEnd: function(swiper){ 
	    	swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
	  	} 
	})  

    $('.pvp-container').bind("touchmove",function(e){
		e.stopPropagation();
	    e.preventDefault();
	});

    // 报名信息滚动
    $.ajax({
	    method: "GET",
	    url: "http://172.16.2.62:8099/activity/applyList",
	    dataType: 'json',
	    data:parm,
	    success: function(data) {
	    	var content = "";
	    	for(var i = 0;i<data.object.length;i++){
	    		content+='<li>用户'+data.object[i].nickname+'已报名</li>';
	    	}
	   	  	$('#list1').html(content);
	   	  	var index = 1;
		  	$("#list2").html($("#list1").html());
		  	var mar = function () {
		        if (index<=$('#list1 li').length) { 
		            $('.pvp-list #list1').animate({marginTop:-index*20});
		            index++;
		        }
		        else {               
		            index = 1;
		            $('.pvp-list #list1').css('marginTop',0).animate({marginTop:-index*20});
		            index++;
		        }

		    };
		    var vid = setInterval(mar, 2000);
	    },
	    error: function(a, b, c) {
	        console.log("接口出问题啦");
	    }
	}); 

    // 获取参数
	function getQueryString(name) {
	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) {
	        return unescape(r[2]);
	    }
	    return null;
	}

	var userId = getQueryString("userId"),
		token = getQueryString("token");

	// 代理
	var ua = navigator.userAgent.toLowerCase();	
	// 是否用娱儿直播打开
	var inyuer = ua.match(/YuertvBrowser/i)=="yuertvbrowser";

	var mobile = "",
		qq = "";
	// 查询用户状态或报名
	var parm={
		userId:userId,
	}
	$.ajax({
	    method: "GET",
	    url: "http://172.16.2.62:8099/activity/state",
	    dataType: 'json',
	    data:parm,
	    async:false,
	    success: function(data) {
	    	var state = data.object;
	    	if(state.activity_state==1){
	    		$('.pvp-btn').html('活动未开始').addClass('gray');
	    	}else if(state.activity_state==2){
	    		if(inyuer && userId){
	    			mobile = state.mobile;
	    			qq = state.mobile;
	    			if(state.user_state==10){
	    				$('.pvp-btn').html('审核中').addClass('gray');
	    			}else if(state.user_state==11){
	    				$('.pvp-btn').html('已报名').addClass('gray');
	    			}
	    		}
	    	}else if(state.activity_state==3){
	    		$('.pvp-btn').html('报名结束').addClass('gray');
	    	}else if(state.activity_state==4){
	    		$('.pvp-btn').html('活动已结束').addClass('gray');
	    	}else if(state.activity_state==5){
	    		if(inyuer && userId){
	    			if(state.user_state==20){
	    				$('.pvp-btn').html('成绩审核中').addClass('gray');
	    			}else if(state.user_state==21){
	    				$('.pvp-btn').html('成绩已提交').addClass('gray');
	    			}else{
	    				$('.pvp-btn').html('立即提交').addClass('apply');
	    			}
	    		}else if(!inyuer){
	    			$('.pvp-btn').html('立即提交').addClass('down');
	    		}
	    	}else if(state.activity_state==6){
	    		$('.pvp-btn').html('不可提交').addClass('gray');
	    	}
	    },
	    error: function(a, b, c) {
	        console.log("接口出问题啦");
	    }
	}); 
	$('.pvp-btn').click(function(){
		if($(this).attr('class')=='pvp-btn'){
			$('.pvp-intro').hide() && $('.pvp-form').show();
			$('.tel').val(mobile) && $('.qq').val(qq);
		}else if($(this).attr('class')=='pvp-btn apply'){
			$('.pvp-intro').hide() && $('.pvp-form').show() && $('.form').hide() && $('.form-ending').show();
		}else if($(this).attr('class')=='pvp-btn down'){
			window.location.href = "https://yuertvfile.wangyuhudong.com";
		}
		
	})

	var second = 59;
	// 获取验证码
	$('.getCode').click(function(e){
        if($('.tel').val()){
            if(/^1[34578]\d{9}$/.test($('.tel').val())){
                var parm = {};
                parm.mobile = $('.tel').val();
                parm.type = 7;
                $.ajax({
		            url: 'http://172.16.2.62:8099/sendSMSCode',
		            data: parm,
		            type: 'get',
		            dataType: 'json',
		            success: function(data) {
		                if (data.code==0) {
		                    second = 59;
		                    $('.getCode').attr('disabled',true).text(second+'(s)');
		                    function settime(val) { 
		                        if (second > 0) { 
		                            $('.getCode').addClass('cant').text(second+'(s)');
		                            second--;
		                            setTimeout(function() { 
		                                settime(val) 
		                            },1000);
		                        } else {
		                            $('.getCode').attr('disabled',false).removeClass('cant').text('获取验证码');                             
		                        } 
		                    } 
		                    settime(second);                 
		                }else{
		                    $('.getCode').text(data.result);
					        setTimeout(function(){
					            $('.getCode').text('获取验证码');
					        },1500);
		                }
		            },
		            error: function() {
		                showTip('连接失败，请检查您的网络设置后重试');
		            }
		        });
            }else{
            	$('.getCode').text('号码错误');
		        setTimeout(function(){
		            $('.getCode').text('获取验证码');
		        },1500);
            }
        }else{
        	$('.getCode').text('手机号为空');
	        setTimeout(function(){
	            $('.getCode').text('获取验证码');
	        },1500);
        }
    });
	// 上传截图
	var scanisUpload = false;
	$('.fileupload').change(function(){
		var _this = $(this);
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
		    $('.pic-btn span').html('图片上传中...');
		    $.ajax({
		        url: 'http://yuerapi.wangyuhudong.com/common/upload',
		        type: 'post',
		        data: data,
		        cache: false,
		        contentType: false, //不可缺参数
		        processData: false, //不可缺参数
		        success: function(data) {
		            _this.parents('.pvp-pic').find('.pic img').attr('src','http://img.wangyuhudong.com'+data.object);
		            $('.pic-btn span').html('图片已上传');
		            scanisUpload = true;
		        },
		        error: function() {
		            console.log('error');
		        }
		    });
		});
    });
    // 报名
    // 错误弹出提示
	function showTip(text,id){
		$('#'+id).parent().find('.error-tip').text(text).fadeIn();
        setTimeout(function(){
            $('#'+id).parent().find('.error-tip').fadeOut();
        },1500);
	}
    $('.pvp-submit').click(function(){  
	  	var UsubmitCheck=true;  	

	  	$(".form .u-ipt").each(function(){
	    	if(!$(this).val()){
	      		showTip($(this).attr("name"),$(this).attr('id'));
	      		UsubmitCheck=false;
	    	}
	  	});

    	if(!$('.tel').val()){
      		$('.getCode').text('号码为空');
	        setTimeout(function(){
	            $('.getCode').text('获取验证码');
	        },1500);
      		UsubmitCheck=false;
    	}
    	if(!scanisUpload){
    		$('.pic-btn span').text('请上传资料截图');
	        setTimeout(function(){
	            $('.pic-btn span').text('');
	        },1500);
      		UsubmitCheck=false;
    	}

	  	if($(".tel").val() && $(".code").val() && $(".qq").val() && $('.rank').val() && scanisUpload){
	    	if($(".qq").val().length<5 && $(".qq").val().length>12){
		      	UsubmitCheck=false;
		      	showTip("QQ号位数错误",'qq');
		    }
		    if($('.code').val().length<6){
	            UsubmitCheck = false;
	            showTip('验证码位数错误','code');
	        }
	  	}

	  	if(UsubmitCheck){
	  		$('.form').hide();
	  		$('.form-result').show();
	  		$('.download').show();

			if (/iphone|ipad|ipod/.test(ua)) {
				$('.download').attr('href','http://www.pgyer.com/qpN1');
			}

	  		$.ajax({  
		        type: "GET",  
		        url: "http://172.16.2.62:8099/activity/kingGloryApply",  
		        data: {mobile:$(".tel").val(),
		               checkCode:$(".code").val(),
		               qq:$(".qq").val(),
		               rank:$(".rank").val(),
		               img:$(".pic img").attr('src')
		        },  
		        dataType: "json",  
		        success: function(data){  
		            if(data.code == 0){
		            	var s = 5;

		            	$('.joinin').show();
		            	if(!inyuer){
		            		$('.form-result p').show();
							$('.download').attr('href','https://yuertvfile.wangyuhudong.com').text('下载娱儿直播');
						}   
						function settime(val) { 
		                    if (s > 0) { 
		                        $('.form-result h3').text('报名信息提交成功（'+s+'S)');
		                        s--;
		                        setTimeout(function() { 
		                            settime(val) 
		                        },1000);
		                    } else {
		                        $('.pvp-intro').show() && $('.pvp-form').hide();
		                        $('.pvp-btn').html('已报名').addClass('gray');                           
		                    } 
		                } 
		                settime(s);	
		            }else{
		                $('.form-result h3').text(data.result+',报名信息提交失败...');
		                $('.download').hide() && $('.rewrite').show();
		            }    
		        },
		        error: function() {
		            alert('连接失败，请检查您的网络设置后重试');
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
	});

	// 重新提交
	$('.rewrite').click(function(){
		second = 0;
		$('.form').show();
	  	$('.form-result').hide();
	  	$('.code').val('');
	  	$('.getCode').attr('disabled',false).removeClass('cant').text('获取验证码');  
	})

	// 结果提交
	$('.pvp-end-submit').click(function(){  
	  	var UsubmitCheck=true;  	

	  	$(".form-ending .u-ipt").each(function(){
	    	if(!$(this).val()){
	      		showTip($(this).attr("name"),$(this).attr('id'));
	      		UsubmitCheck=false;
	    	}
	  	});

    	if(!scanisUpload){
    		$('.pic-btn span').text('请上传资料截图');
	        setTimeout(function(){
	            $('.pic-btn span').text('');
	        },1500);
      		UsubmitCheck=false;
    	}


	  	if(UsubmitCheck){
			if(userId && token){
				$.ajax({  
			        type: "GET",  
			        url: "http://172.16.2.62:8099/activity/kingGloryResultSubmit",  
			        data: {
			               rank:$(".rank").val(),
			               img:$(".pic img").attr('src'),
			               userId:userId,
			               token:token
			        },  
			        dataType: "json",  
			        success: function(data){  
			            if(data.code == 0){
			            	$('.pvp-intro').show() && $('.pvp-form').hide();
		                    $('.pvp-btn').html('已提交').addClass('gray'); 
			            }else{
			               
			            }    
			        },
			        error: function() {
			            alert('连接失败，请检查您的网络设置后重试');
			        } 
			    });
			}else{
				$('.mask').show();
		        setTimeout(function(){
		            $('.mask').hide();
		        },1500);
			}	  		
	  	}      
	}); 
})