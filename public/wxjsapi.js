/**
 * 启用微信支付 依赖： 
 * <script type="text/javascript" src="${base}/resources/app/js/jquery.min.js"></script> 
 * <script type="text/javascript" src="${base}/resources/app/js/jquery.sha1.js"></script>
 * <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
 */
var errorTime = 0;
function enableWxShare(opt) {
	if (!inWxClient()) {
		return false;
	}

	var appId = opt.appId;
	var ticket = opt.ticket;
	var title = opt.title;
	var imgUrl = opt.imgUrl;
	var desc = opt.desc;
	var type = 'link';
	if(opt.type) {
		type = opt.type;
	}

	var time = new Date().getTime();
	var timestamp = time;
	var nonceStr = $.sha1(time.toString()).substring(0, 16);
	var url = location.href.split('#')[0];
	var signStr = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url;
	var signature = $.sha1(signStr);
	var signatureTime = new Date().getTime();
	
	var debug = false;
	function log(str) {
		if(debug) {
			alert(str);
		}
	}
	wx.config({
		debug : debug,
		appId : appId,
		timestamp : timestamp,
		nonceStr : nonceStr,
		signature : signature,
		jsApiList : [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo' ],
	})

	wx.ready(function() {
		var readyTime = new Date().getTime();
		log('signature: ' + (signatureTime - time) + 'ms\r\nconfig: ' + (readyTime - time) + 'ms');
		
		wx.checkJsApi({
			jsApiList : [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo' ],
			success : function(res) {
				var checkResult = res.checkResult;
				if (checkResult['onMenuShareTimeline']) {
					// 朋友圈
					wx.onMenuShareTimeline({
						title : title, // 分享标题
						desc : desc, // 分享描述
						imgUrl : imgUrl, // 分享图标
						type : type,
						success : function() {
						},
						cancel : function() {
						}
					});
				}
				if (checkResult['onMenuShareAppMessage']) {
					// 朋友
					wx.onMenuShareAppMessage({
						title : title,
						desc : desc,
						imgUrl : imgUrl,
						type : type,
						success : function() {
						},
						cancel : function() {
						}
					});
				}
				if (checkResult['onMenuShareQQ']) {
					wx.onMenuShareQQ({
						title : title,
						desc : desc,
						imgUrl : imgUrl,
						type : type,
						success : function() {
						},
						cancel : function() {
						}
					});
				}
				if (checkResult['onMenuShareWeibo']) {
					wx.onMenuShareWeibo({
						title : title,
						desc : desc,
						imgUrl : imgUrl,
						type : type,
						success : function() {
						},
						cancel : function() {
						}
					});
				}
			}
		});
	});
	
	wx.error(function() {
		errorTime++;
		if(errorTime < 10) {
			enableWxShare(opt);
		}
	});
}


/**
 * String 扩展
 */
String.prototype.contains = function(name) {
	if(this.indexOf(name) != -1) {
		return true;
	} else {
		return false;
	}
}

/**
 * 是否在微信浏览器中
 */
var userAgent = navigator.userAgent;
function inWxClient() {
	return userAgent.contains("MicroMessenger");
}

/**
 * 是否在微信浏览器中
 */
function inIOS() {
	if(userAgent.contains("iPhone") || userAgent.contains("iPod") || userAgent.contains("iPad")) {
		return true;
	} else {
		return false;
	}
}