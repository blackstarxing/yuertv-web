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
//修改密码接口设置
$(function(){  
	$('#send').click(function(){  
  		$.ajax({  
			type: "GET",  
			url: " http://172.16.2.62:8777/findPassword",  
			data: {current:$("#current").val(), new:$("#new").val(), confirm:$("#confirm").val()},  
			dataType: "json",  
			success: function(data){  
				// $('#resText').empty();   //清空resText里面的所有内容  
				var html = '';   
				 // $.each(data, function(commentIndex, comment){  
				 // html +=  comment['code']+ comment['result'] ;  
				 // });  
				// $('#resText').html(html);  

			},
            error: function() {
                alert('通讯服务器错误');
            } 
		});  
	});  
});  
//实名认证接口设置：