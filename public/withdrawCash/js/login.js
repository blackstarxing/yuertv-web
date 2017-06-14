var login = new Vue({
  	el: '#messageLog',
  	delimiters: ['${', '}'],
  	data: {
  		// 直播间id
  		live_id:'',
  		accid:'4246291',
  		live_account:'',
  		live_token:'',
  		roomid:'8898958',
  		// 用户卡片显示
    	cardDisplay:false,
    	// 直播结束
    	is_live_end:false,
    	game:{
    		showTip:false,
    		showClock:false,
    		tipClass:'',
    		tip:'',
    		time:5,
    		poker_group:[false,false,false],
    		mask:[false,false,false],
    	}
  	},
  	mounted:function(){
  		this.$nextTick(function () {
  	    console.log('加载、、、')
  		})
  	},
  	methods: {
  		  // 三方登录
        thirdLogin:function(type){
            window.location.href = 'http://118.190.21.195:39999/rainbow-web/thirdPartyLogin?platform='+type;
        }
        // //手机登录
        // phoneLogin:function(){
        //     window.location.href="/messageLog.html"
        // }
   //      phone1Login:function(){
   //          var _this = this;
   //          if(/^1[34578][0-9]{9}$/.test(_this.phoneForm.mobile) && _this.phoneForm.checkCode.length==6){
   //              var parm = {};
   //              parm.checkCode = _this.phoneForm.checkCode;
   //              parm.mobile = _this.phoneForm.mobile;
   //              $.ajax({
   //                  url: '/api/mobileQuickLogin',
   //                  type: 'get',
   //                  data:parm,
   //                  dataType: 'json',
   //                  success: function(data) {
   //                      if(data.code==0){
   //                          _this.delCookie('yuer_userId');
   //                          _this.delCookie('yuer_token');
   //                          document.cookie="yuer_userId="+data.object.id; 
   //                          document.cookie="yuer_token="+data.object.token; 
   //                          window.localStorage.setItem("id", data.object.id);
   //                          window.localStorage.setItem("avatar", data.object.icon);
   //                          window.localStorage.setItem("nickname",data.object.nickname);
   //                          if(window.location.pathname == '/register' || window.location.pathname == '/reset'){                           
   //                              window.location="/";
   //                          }else{
   //                              window.location.href = window.location.href;
   //                          } 
   //                      }else{
   //                          _this.phoneError.code = "验证码错误，请重新输入";
   //                          setTimeout(function(){
   //                              _this.phoneError.code = '';
   //                          },2000);
   //                      }
   //                  },
   //                  error: function() {
   //                      console.log('网络异常，请刷新重试');
   //                  }
   //              });
   //          }else if(_this.phoneForm.mobile==''){
   //              _this.phoneError.phone = "手机号码不能为空";
   //              setTimeout(function(){
   //                  _this.phoneError.phone = '';
   //              },2000);
   //          }else if(!/^1[34578][0-9]{9}$/.test(_this.phoneForm.mobile)){
   //              _this.phoneError.phone = "手机号码错误，请重新输入";
   //              setTimeout(function(){
   //                  _this.phoneError.phone = '';
   //              },2000);
   //          }else if(_this.phoneForm.checkCode==''){
   //              _this.phoneError.code = "验证码不能为空";
   //              setTimeout(function(){
   //                  _this.phoneError.code = '';
   //              },2000);
   //          }else if(_this.phoneForm.checkCode!='' && _this.phoneForm.checkCode.length<6){
   //              _this.phoneError.code = "验证码错误，请重新输入";
   //              setTimeout(function(){
   //                  _this.phoneError.code = '';
   //              },2000);
   //          }           
   //      },
  	}
})