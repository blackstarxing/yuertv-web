// if(obj=='女'){img.src="nv"}else{img.src="nan"}
$(function(){
	$(".m-bottom a").on("click",function(e){
		e.preventDefault();
		$(this).addClass("switch").siblings().removeClass("switch");
		$(".switch-content").hide().eq($(this).index()).show();
	})
	$(".m-bottom a:eq(0)").trigger("click");
})
		$(function(){
			$('.fileupload').change(function(event) {
				var _this = $(this);
			    /* Act on the event */
			    // if ($('.fileupload').val().length) {
			    //     var fileName = $('.fileupload').val();
			    //     var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
			    //     if (extension == ".jpg" || extension == ".png") {
			    //             var data = new FormData();
			    //             data.append('upload', $('#fileToUpload')[0].files[0]);
			    //             $.ajax({
			    //                 url: 'http://www.xywangluo.com/abasd/sdlfk',
			    //                 type: 'POST',
			    //                 data: data,
			    //                 cache: false,
			    //                 contentType: false, //不可缺参数
			    //                 processData: false, //不可缺参数
			    //                 success: function(data) {
			    //                     console.log(data);
			    //                 },
			    //                 error: function() {
			    //                     console.log('error');
			    //                 }
			    //             });
			    //     }
			    // }
			    var objUrl = getObjectURL(this.files[0]) ;
				console.log("objUrl = "+objUrl) ;
				if (objUrl) {
					_this.parents('.u-card').find('img').attr("src", objUrl) ;
				}
				function getObjectURL(file) {
					var url = null ; 
					if (window.createObjectURL!=undefined) { // basic
						url = window.createObjectURL(file) ;
					} else if (window.URL!=undefined) { // mozilla(firefox)
						url = window.URL.createObjectURL(file) ;
					} else if (window.webkitURL!=undefined) { // webkit or chrome
						url = window.webkitURL.createObjectURL(file) ;
					}
					return url ;
				}
			});
		})
//我要当主播的div之间的切换
$(function(){
	$(".m-mainh a").on("click",function(e){
		e.preventDefault();
		$(this).addClass("").siblings().removeClass("");
		$(".switchcontent").hide().eq($(this).index()).show();
	})
	$(".m-mainh a:eq(0)").trigger("click");
})
//我要当主播中的下级div的切换
$(function(){
	$(".u-certification a").on("click",function(e){
		e.preventDefault();
		$(this).addClass("").siblings().removeClass("");
		$(".switchrepeat").hide().eq($(this).index()).show();
	})
	$(".u-certification a:eq(0)").trigger("click");
})
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
//修改昵称弹出框
$(function(){
		$(".m-layer .lywrap .lybt .lybtns button").on("click",function(){$(this).parents(".m-layer").removeClass("z-show");});

		$("input")
	})

//修改密码页面接口设置－－－－－修改昵称是否正确
$(function(){  
	$('#rename').on("blur",function(){  
  		$.ajax({  
			type: "GET",  
			url: "h http://172.16.2.62:8777/person-center/update-nickname",  
			data: {rename:$("#rename").val()},  
			dataType: "json",  
			success: function(data){  
				 console.log(data);

			},
            error: function() {
                alert('通讯服务器错误');
            } 
		});  
	});  
}); 
//修改密码页面接口设置－－－－－当前密码是否正确
$(function(){  
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
}); 
//修改密码页面接口设置－－－－－修改密码是否正确
$(function(){  
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
}); 


