function onlyNumber(obj){ 
     var firstChar = obj.value.substr(0,1);
     console.log(firstChar); 
     //必须保证第一个为数字而不是.       
     obj.value = obj.value.replace(/^\./g,'');       
     //保证只有出现一个.而没有多个.       
     obj.value = obj.value.replace(/\.{2,}/g,'.');       
     //保证.只出现一次，而不能出现两次以上       
     obj.value = obj.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');  
     obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); 
     if(firstChar == 0  || firstChar == "."){
        obj.value = '';
        $('.u-withdrawBtn').addClass('u-btn-disclick').removeClass('u-btn-click');
        return;
     }
} 
//检测输入金额
function checkCash(){
    var cashLength = $('.exchangeCash').val().length;
    var InexchangeCash = parseFloat($('.u-headCash').text());
    var exchangeCash = parseFloat($('.exchangeCash').val());
    var exchangeClue = $('.exchangeClue').text();
    if(exchangeCash<100 && exchangeCash > 0){
        $('.exchangeClue').text("请输入大于100的金额");
        $('.u-withdrawBtn').removeClass('u-btn-click').addClass('u-btn-disclick');
    }else if(exchangeCash>InexchangeCash ){
        $('.exchangeClue').text("输入金额超过钱包余额");
        $('.u-withdrawBtn').removeClass('u-btn-click').addClass('u-btn-disclick');
    }else if(cashLength == 0){
      $('.u-withdrawBtn').addClass('u-btn-disclick').removeClass('u-btn-click');
    }else{
        $('.exchangeClue').text("");
        $('.u-withdrawBtn').removeClass('u-btn-disclick').addClass('u-btn-click');
    }
}
var login = new Vue({
  	el: '#income',
  	delimiters: ['${', '}'],
  	data: {
        income:[],
  	    // 兑换收益提示语
        exchangeClue:'',
        // 兑换金额
        exchangeCash:'',
        //提现结果金额
        exchangerstCash:'',
        iphone:'',
        android:'',
    	},
  	mounted:function(){
  		this.$nextTick(function () {
        /*去掉iphone手机滑动默认行为*/
        $('body').on('touchmove', function (event) {
            event.preventDefault();
        });
        var _this = this;
         // 判断是andriod还是iphone
        var sUserAgent = navigator.userAgent;
        // _this.android = sUserAgent.match(/android/i) == "android";
        // _this.iphone = sUserAgent.match(/iPhone|iPod|iPad/i)=="iPhone|iPod|iPad";
        if (/(iPhone|iPad|iPod|iOS)/i.test(sUserAgent)) {
            _this.iphone = true;
        } else if (/(Android)/i.test(sUserAgent)) {
            _this.android = true; 
        } else {
            _this.iphone = false;
            _this.android  = false;
        };
        $.ajax({
             // url: 'http://172.16.10.134:8080/withdraw/index',
             url: 'http://qa.web.yuerlive.cn/api/withdraw/index',
             type: 'get',
             dataType:'json',
             crossDomain:true,
             xhrFields: {
                 withCredentials: true,
             },
             success: function(data) {
                if(data.code == -2){
                  window.location.href = '/withdrawCash/login';
                }else if(data.code == -1){
                  window.location.href = '/withdrawCash/login';
                }else if(data.code == 0){
                  _this.income = data.object;
                }
             },
             error: function() {
                layer.open({
                  content: '网络异常，请刷新重试',
                  btn: '好的',
                  shadeClose: false,
                });
             }
           });
  	    	})
  	},
  	methods: {
        // 获取url参数
        getQueryString:function(name){
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
  		 // 收益明细
       incomeDetail:function(){
           window.location.href='/withdrawCash/incomeDetail';
       },
      // 兑换金额输入
       exchangeIncome:function(){
        var _this = this;
        var exchangeCash = parseFloat(_this.exchangeCash);
        var withdraw_amount = parseFloat(_this.income.withdraw_amount);
          // if(exchangeCash != NaN){
             if(exchangeCash>=100){
                if(exchangeCash>withdraw_amount){
                  _this.exchangeClue = '输入金额超过钱包余额';
                  setTimeout(function(){
                      _this.exchangeClue = '';
                  },2000); 
                }else{
                    $.ajax({
                      // url: 'http://172.16.10.134:8080/withdraw/apply?money='+_this.exchangeCash,
                      url: 'http://qa.web.yuerlive.cn/api/withdraw/apply?money='+_this.exchangeCash,
                      type: 'get',
                      dataType:'json',
                      crossDomain:true,
                      xhrFields: {
                          withCredentials: true,
                      },
                      success: function(data) {
                        if(data.code == 0){
                           if(data.object.code == 0){
                             _this.exchangerstCash = data.object.amount;
                            window.location.href = '/withdrawCash/exchangerst?exchangerstCash='+_this.exchangerstCash;
                           }else if(data.object.code == 1){
                              layer.open({
                                content: '您有未审核的提现申请',
                                btn: '好的',
                                shadeClose: false,
                              });
                           }else if(data.object.code == 2){
                              layer.open({
                                content: '可提现魅力值不足',
                                btn: '好的',
                                shadeClose: false,
                              });
                           }else if(data.object.code == 3){
                              layer.open({
                                content: '可提现金额不足',
                                btn: '好的',
                                shadeClose: false,
                              });
                           }else if(data.object.code == 4){
                              layer.open({
                                content: '申请失败',
                                btn: '好的',
                                shadeClose: false,
                              });
                           }
                        }else{
                          layer.open({
                            content: '申请失败',
                            btn: '好的',
                            shadeClose: false,
                          });
                        }
                        
                      },
                      error: function() {
                        layer.open({
                          content: '网络异常，请刷新重试',
                          btn: '好的',
                          shadeClose: false,
                        });
                      }
                   });
                }
             }else{
              _this.exchangeClue = '请输入大于100的金额';
              setTimeout(function(){
                    _this.exchangeClue = '';
                },2000); 
              }
          },
          // 退出登录
          quitLog: function(){
                   $.ajax({
                     // url: 'http://172.16.10.134:8080/withdraw/logout',
                     url: 'http://qa.web.yuerlive.cn/api/withdraw/logout',
                     type: 'get',
                     dataType:'json',
                     crossDomain:true,
                     xhrFields: {
                          withCredentials: true,
                     },
                     success: function(data) {
                        if(data.code == 0){
                          window.location.href = '/withdrawCash/login';
                        }else if(data.code == -1){
                          window.location.href = '/withdrawCash/login';  
                        }else if(data.code == -2){
                          window.location.href = '/withdrawCash/login';  
                        }else{
                          layer.open({
                            content: '网络异常，请刷新重试',
                            btn: '好的',
                            shadeClose: false,
                          });
                        }
                     },
                    error: function() {
                        layer.open({
                          content: '网络异常，请刷新重试',
                          btn: '好的',
                          shadeClose: false,
                        });
                    }
              });
          },
          //andiord  ios 兑换说明
          exchangeExplain:function(){
            window.location.href = '/withdrawCash/exchangeExplain';
          },
         
       }
})