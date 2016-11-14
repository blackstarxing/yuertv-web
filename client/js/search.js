$(function(){
	$('.search-btn').click(function(){
		if($('.search-key').val()){
            window.location.href = "/search?content="+$('.search-key').val();
        }
	})
})