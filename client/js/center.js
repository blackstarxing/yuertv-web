// if(obj=='女'){img.src="nv"}else{img.src="nan"}
$(function(){
	$(".m-bottom a").on("click",function(){
		$(this).addClass(".switch").Siblings().removeClass(".switch");
		$(".m-switch2").hide().eq($(this).index()).show();
	})
	$(".m-bottom a:eq(0)").trigger("click");
})