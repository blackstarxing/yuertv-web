$(function(){
	$('.match').on('click',function(){
		var eventid=$(this).find('.get_eventid').text();
		window.location.href='/detail?id='+eventid;
	})
})