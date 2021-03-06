var messageLog = new Vue({
  	el: '#messageLog',
  	delimiters: ['${', '}'],
  	data: {
        regPic:'',
        phone:'',
        code:'',
        codeError:'',
        phoneError:'',
        messageCodeError:'',
        regText:'获取验证码',
        // 短信验证码
        messCode:'',
        // 获取验证码是否点击
        regdis:false,
  	},
  	mounted:function(){
  		this.$nextTick(function () {
        var _this = this;
  	   /*去掉iphone手机滑动默认行为*/
        $('body').on('touchmove', function (event) {
            event.preventDefault();
        });
        $('.set').hide();
        $('.noset').show();
        $('.g-checkCodeMask').hide();
        this.phoneError = '';
        this.codeError = '';
        this.messageCodeError = '';
  		});
  	},
  	methods: {
       // 图形验证码
        showPic:function(type){
            var _this = this;
            if(type==0){
                if(_this.phone){
                    if(/^1[34578][0-9]{9}$/.test(_this.phone)){
                        $.ajax({
                            // url: 'http://172.16.10.134:8080/checkCode?phone='+_this.phone,
                            url: 'http://qa.web.yuerlive.cn/api/checkCode?phone='+_this.phone,
                            type: 'get',
                            success: function(data) {
                               _this.code = '';
                               // _this.regPic = 'http://172.16.10.134:8080/checkCode?phone='+_this.phone+'&rand='+new Date();
                               _this.regPic = 'http://qa.web.yuerlive.cn/api/checkCode?phone='+_this.phone+'&rand='+new Date();
                               $('.g-checkCodeMask').show();
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
                    else{
                         _this.phoneError = '手机号码错误';
                        setTimeout(function(){
                           _this.phoneError = '';
                        },2000);
                    }
                }else{
                     _this.phoneError = '请输入手机号';
                        setTimeout(function(){
                           _this.phoneError = '';
                        },2000);
                   
                }                       
            }else{
                console.log('没有传参');
            }
        },
        //改变图形验证码
        changePic:function(){
            // this.regPic = 'http://172.16.10.134:8080/checkCode?phone='+this.phone+'&rand='+new Date();
            this.regPic = 'http://qa.web.yuerlive.cn/api/checkCode?phone='+this.phone+'&rand='+new Date();
        },
        // 校验验证码
        checkCode:function(){
            var _this = this;
            if(_this.code){
                if(_this.code.length<4){
                    _this.codeError = '验证码错误';
                    setTimeout(function(){
                        _this.codeError = '';
                    },2000); 
                }else{

                }
            }else{
                _this.coderror = '请输入验证码';
                setTimeout(function(){
                    _this.codeError = '';
                },2000); 
            }                   
        },

        //弹出框取消
        codeCancel:function(){
            $('.g-checkCodeMask').hide();
        },
        //弹出框确定(校验验证码)
        codeConfirm:function(e){
            var _this = this;
            if(_this.code){
                if(_this.code.length<4){
                    // _this.regPic = 'http://172.16.10.134:8080/checkCode?phone='+_this.phone+'&rand='+new Date();
                    _this.regPic = 'http://qa.web.yuerlive.cn/api/checkCode?phone='+_this.phone+'&rand='+new Date();
                    _this.codeError = '验证码错误';
                    setTimeout(function(){
                        _this.codeError = '';
                    },2000); 
                }else{
                     $.ajax({
                        // url: 'http://172.16.10.134:8080/verifyCheckCode?phone='+_this.phone+'&checkCode='+_this.code,
                        url: 'http://qa.web.yuerlive.cn/api/verifyCheckCode?phone='+_this.phone+'&checkCode='+_this.code,
                        type: 'get',
                        dataType: 'json',
                        success: function(data) {
                            if(data.code==0){
                               $('.g-checkCodeMask').hide();
                               $.ajax({
                                  // url: 'http://172.16.10.134:8080/sendSMSCode',
                                  url: 'http://qa.web.yuerlive.cn/api/sendSMSCode',
                                  data:{
                                    mobile:_this.phone,
                                    type:3
                                  },
                                  type: 'get',
                                  dataType: 'json',
                                  success: function(data) {
                                        var second = 59;
                                        _this.regdis = true;
                                        _this.regText = second+'(s)';
                                        function settime(val) { 
                                            if (second > 0) { 
                                                $('.u-getCode').removeClass('fc-f36').addClass('fc-b6');
                                                _this.regText = second+'(s)重新获取';
                                                second--;
                                                setTimeout(function() { 
                                                    settime(val) 
                                                },1000);
                                            } else {
                                                $('.u-getCode').removeClass('fc-b6').addClass('fc-f36');
                                                _this.regdis = false;
                                                _this.regText = '获取验证码';                             
                                            } 
                                        } 
                                        settime(second);
                                  },
                                  error: function() {
                                      layer.open({
                                        content: '网络异常，请刷新重试',
                                        btn: '好的',
                                        shadeClose: false,
                                      });
                                  }
                               });                       
                            }else if(data.code==-3){
                               // _this.regPic = 'http://172.16.10.134:8080/checkCode?phone='+_this.phone+'&rand='+new Date();
                               _this.regPic = 'http://qa.web.yuerlive.cn/api/checkCode?phone='+_this.phone+'&rand='+new Date();
                                _this.codeError = '验证码错误';
                                setTimeout(function(){
                                    _this.codeError = '';
                                },2000); 
                            }else if(data.code == -5){
                                 _this.codeError = '请输入验证码';
                                 setTimeout(function(){
                                     _this.codeError = '';
                                 },2000); 
                            }else{
                              layer.open({
                               content: '服务器出错',
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
                _this.codeError = '请输入验证码';
                setTimeout(function(){
                    _this.codeError = '';
                },2000); 
            }                   
           
        },
        // 短信验证码-登录
        messCodeLogin:function(){
            var _this = this;
            if(/^1[34578][0-9]{9}$/.test(_this.phone) && _this.messCode.length==6){
                var parm = {};
                parm.checkCode = _this.messCode;
                parm.mobile = _this.phone;
                $.ajax({
                    // url: 'http://172.16.10.134:8080/withdraw/login',
                    url: 'http://qa.web.yuerlive.cn/api/withdraw/login',
                    type: 'get',
                    data:parm,
                    dataType: 'json',
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true,
                    },  
                    success: function(data) {
                        // localStorage.setItem("phone",_this.phone);
                        if(data.code==0){
                             if(data.object.code==1){
                                  layer.open({
                                    content: '非主播绑定手机',
                                    btn: '好的',
                                    shadeClose: false,
                                  });      
                                }else if(data.object.code==2){
                                  layer.open({
                                    content: '验证码错误,登录失败',
                                    btn: '好的',
                                    shadeClose: false,
                                  });      
                                }else if(data.object.code==3){
                                  layer.open({
                                    content: '该手机号已经绑定其它微信号',
                                    btn: '好的',
                                    shadeClose: false,
                                  });      
                                }else if(data.object.code==4){
                                  layer.open({
                                    content: '微信号绑定失败',
                                    btn: '好的',
                                    shadeClose: false,
                                  });      
                                }else{
                                    window.location.href = '/withdrawCash/income';
                                    console.log('登录成功。。。');
                                }    
                        }else if(data.code==-3){
                            layer.open({
                              content: '授权失败',
                              btn: '好的',
                              shadeClose: false,
                            });  
                        }else if(data.code == -5){
                            layer.open({
                             content: '手机验证码不正确',
                             btn: '好的',
                             shadeClose: false,
                            });
                        }else if(data.code==302){
                            $.ajax({
                               // url: 'http://172.16.10.134:8080/withdraw/checkAuth',
                               url: 'http://qa.web.yuerlive.cn/api/withdraw/checkAuth',
                               type: 'get',
                               dataType:'json',
                               crossDomain:true,
                                xhrFields: {
                                   withCredentials: true,
                                },
                               success: function(data) {
                                  if(data.code == 0){
                                      window.location.href = '/withdrawCash/income';
                                  }else if(data.code == 302){
                                    window.location.href = data.result;
                                  }else{
                                    layer.open({
                                     content: '参数错误',
                                     btn: '好的',
                                     shadeClose: false,
                                    });
                                  }
                               },
                               error: function(){
                                    layer.open({
                                         content: '网络异常，请刷新重试',
                                         btn: '好的',
                                         shadeClose: false,
                                    });
                               }
                            });       
                        }else{
                            layer.open({
                              content: '服务器出错',
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
            }else if(_this.phone ==''){
                _this.phoneError = "手机号码不能为空";
                setTimeout(function(){
                    _this.phoneError = '';
                },2000);
            }else if(!/^1[34578][0-9]{9}$/.test(_this.phone)){
                _this.phoneError = "手机号码错误，请重新输入";
                setTimeout(function(){
                    _this.phoneError = '';
                },2000);
            }else if(_this.messCode==''){
                _this.messageCodeError = "验证码不能为空";
                setTimeout(function(){
                    _this.messageCodeError = '';
                },2000);
            }else if(_this.messCode!='' && _this.messCode.length<6){
                _this.messageCodeError = "验证码错误，请重新输入";
                setTimeout(function(){
                    _this.messageCodeError = '';
                },2000);
            }           
        },
  	}
})