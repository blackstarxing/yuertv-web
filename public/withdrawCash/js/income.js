//检测输入金额
function checkCash(){
    var InexchangeCash = parseFloat($('.u-headCash').text());
    var exchangeCash = parseFloat($('.exchangeCash').val());
    var exchangeClue = $('.exchangeClue').text();
    if(exchangeCash<100){
        $('.exchangeClue').text("请输入大于100的金额");
        $('.u-withdrawBtn').removeClass('u-btn-click').addClass('u-btn-disclick');
    }else if(exchangeCash>InexchangeCash){
        $('.exchangeClue').text("输入金额超过钱包余额");
        $('.u-withdrawBtn').removeClass('u-btn-click').addClass('u-btn-disclick');
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
        exchangerstCash:''
    	},
  	mounted:function(){
  		this.$nextTick(function () {
        /*去掉iphone手机滑动默认行为*/
        $('body').on('touchmove', function (event) {
            event.preventDefault();
        });
        var _this = this;
        $.ajax({
             url: 'http://172.16.10.134:8080/withdraw/index',
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
                      url: 'http://172.16.10.134:8080/withdraw/apply?money='+_this.exchangeCash,
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
                     url: 'http://172.16.10.134:8080/withdraw/logout',
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