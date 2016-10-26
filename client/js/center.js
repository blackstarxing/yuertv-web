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
			               console.log(data);
			            },
			           error: function() {
			                 console.log('error');
			           }
			         });
			        }
			     }
		// 	var objUrl = getObjectURL(this.files[0]) ;
		// 	console.log("objUrl = "+objUrl) ;
		// 	if (objUrl) {
		// 		_this.parents('.u-card').find('img').attr("src", objUrl) ;
		// 	}
		// function getObjectURL(file) {
		// 	var url = null ; 
		// 	if (window.createObjectURL!=undefined) { // basic
		// 				url = window.createObjectURL(file) ;
		// 	} else if (window.URL!=undefined) { // mozilla(firefox)
		// 				url = window.URL.createObjectURL(file) ;
		// 	} else if (window.webkitURL!=undefined) { // webkit or chrome
		// 		url = window.webkitURL.createObjectURL(file) ;
		// 	}
		// 	return url ;
		// }
	});
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
//表单验证：
// $(function(){
// 			$("#current").on("blur",function(){
// 				if(.test($(this).val())){
// 					$(this).next(".form-info").text("验证通过").addClass("success").removeClass("error");
// 				}else{
// 					$(this).next(".form-info").text("请输入正确密码").addClass("error").removeClass("success");
// 				}
// 			})
// })
// 修改昵称弹出框
	$("#nickname").on("click",function(){
		$(".m-layer").addClass("z-show");
	});
	$(".lybt .u-btn").on("click",function(){
		$(this).parents(".m-layer").removeClass("z-show");
	});

//修改密码页面接口设置－－－－－修改昵称是否正确
// $(function(){  
// 	$('#checktips').on("blur",function(){  
//   		$.ajax({  
// 			type: "GET",  
// 			url: "http://172.16.2.62:8777/person-center/update-nickname",  
// 			data: {checktips:$("#checktips").val()},  
// 			dataType: "json",  
// 			success: function(data){  
// 				 console.log(data);

// 			},
//             error: function() {
//                 alert('通讯服务器错误');
//             } 
// 		});  
// 	});  
// $("#checktips").on("blur",function(){
// 	$.ajax({  
// 		type: "GET",  
// 		url: "http://172.16.2.62:8777/person-center/update-nickname",  
// 		data: {checktips:$("#checktips").val()},  
// 		dataType: "json",  
// 		success: function(data){  
// 			 console.log(data);

// 		},
//         error: function() {
//             alert('通讯服务器错误');
//         } 
// 	});  
// });
$("#checktips").on("blur",function(){
$.ajax({
    method:"GET",//对于请求类型
    url:"http://172.16.2.62:8777/person-center/update-nickname",//请求url，这个我抹黑了。直接复制过来就可以了
    dataType: 'json',
    data: {
    	nickName:$.trim($("#checktips").val())
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
//修改密码页面接口设置－－－－－当前密码是否正确
	$('#current').on("blur",function(){  
  		$.ajax({  
			type: "GET",  
			url: "http://172.16.2.62:8777/person-center/is-password-right",  
			data: {current:$("#current").val()},  
			dataType: "json",  
			success: function(data){  
				 // var html = '';   
				 // $.each(data, function(commentIndex, comment){  
				 // html +=  comment['code']+ comment['result'] ;  
				 // });  
				 // $('#current').html(html);  
				 // if(code==){

				 // }else{

				 // }
				 console.log(data);

			},
            error: function() {
                alert('通讯服务器错误');
            } 
		});  
	});  
//修改密码页面接口设置－－－－－修改密码是否正确
	$('#confirm').on("blur",function(){  
  		$.ajax({  
			type: "GET",  
			url: "http://172.16.2.62:8777/person-center/update-password",  
			data: {confirm:$("#confirm").val()},  
			dataType: "json",  
			success: function(data){  
				 console.log(data);

			},
            error: function() {
                alert('通讯服务器错误');
            } 
		});  
	});  
//手机认证；
	// $('#').on("blur",function(){  
 //  		$.ajax({  
	// 		type: "GET",  
	// 		url: "http://172.16.2.62:8777/person-center/mobile-auth",  
	// 		data: {:$("#").val()},  
	// 		dataType: "json",  
	// 		success: function(data){  
	// 			 console.log(data);

	// 		},
 //            error: function() {
 //                alert('通讯服务器错误');
 //            } 
	// 	});  
	// });  
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
//我的道具：
// 	$('#').on("blur",function(){  
//   		$.ajax({  
// 			type: "GET",  
// 			url: "http://172.16.2.62:8777/person-center/my-gifts",  
// 			data: {:$("#").val()},  
// 			dataType: "json",  
// 			success: function(data){  
// 				 console.log(data);

// 			},
//             error: function() {
//                 alert('通讯服务器错误');
//             } 
// 		});  
// 	});  
}); 

