$(function() {
    var register = new Vue({
        el: '#register',
        delimiters: ['${', '}'],
        data: {
            step:1,
        },
        mounted: function () {
            this.$nextTick(function () {
                // 代码保证 this.$el 在 document 中
                $('.m-step').eq(this.step-1).css('transform','rotateX(0deg)');
                // 性别选择
                $('.sex-box label').click(function(){
                    var radioId = $(this).attr('name');
                    $('.sex-box label').removeClass('checked') && $(this).addClass('checked');
                    $('.sex-box input[type="radio"]').removeAttr('checked') && $('#' + radioId).attr('checked', 'checked');
                });
            })
        },
        // 在 `methods` 对象中定义方法
        methods: {
            // 下一步
            nextStep:function(){
                var _this = this;
                if(_this.step<7){
                    // console.log($('.m-step').eq(_this.step-1).find('input').val());
                    if($('.m-step').eq(_this.step-1).find('input').val()){
                        if(_this.step==1){
                            _this.checkNickname();
                        }else if(_this.step==3){
                            _this.checkTel();
                        }else if(_this.step==4){
                            if($('.code').val().length<6){
                                $('.error-tip').eq(_this.step-1).text('验证码错误').show();
                                setTimeout(function(){
                                    $('.error-tip').eq(_this.step-1).hide().text('验证码不能为空');
                                },2000); 
                            }else{
                                _this.enterNext();
                            }
                        }else if(_this.step==5){
                            if($('.password').val().length<6){
                                $('.error-tip').eq(_this.step-1).text('密码太短').show();
                                setTimeout(function(){
                                    $('.error-tip').eq(_this.step-1).hide().text('密码不能为空');
                                },2000); 
                            }else{
                                _this.enterNext();
                            }
                        }else if(_this.step==6){
                            if($('.repassword').val()!=$('.password').val()){
                                $('.error-tip').eq(_this.step-1).text('两次密码不一致').show();
                                setTimeout(function(){
                                    $('.error-tip').eq(_this.step-1).hide().text('密码不能为空');
                                },2000); 
                            }else{
                                _this.enterNext();
                            }
                        }else{
                            _this.enterNext();
                        }                      
                    }else{
                        if(_this.step==3){
                            $('.getCode').text('手机号码不能为空');
                            setTimeout(function(){
                                $('.getCode').text('获取验证码');
                            },2000);
                        }else{
                            $('.error-tip').eq(_this.step-1).show();
                            setTimeout(function(){
                                $('.error-tip').eq(_this.step-1).hide();
                            },2000);  
                        }
                        
                    }                  
                }          
            },
            enterNext:function(){
                var _this = this;
                $('.m-step').eq(_this.step-1).addClass('flip-next').removeClass('flip-prev flip-show flip-hide') && $('.m-step').eq(_this.step).addClass('flip-show').removeClass('flip-prev flip-next flip-hide');
                _this.step+=1;
                if(_this.step==7){
                    $('.prev-btn').removeClass('prev-step');
                } 
            },
            //上一步
            prevStep:function(){
                if(this.step>1){
                    $('.prev-btn').addClass('prev-step');
                    $('.m-step').eq(this.step-1).addClass('flip-hide').removeClass('flip-next flip-prev flip-show') && $('.m-step').eq(this.step-2).addClass('flip-prev').removeClass('flip-next flip-hide flip-show');
                    this.step-=1;
                }
            },
            // 长度校验
            strlen:function(str){
                var len = 0;
                for (var i=0; i<str.length; i++) { 
                    var c = str.charCodeAt(i); 
                    //单字节加1 
                    if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
                       len++; 
                    } 
                    else { 
                      len+=2; 
                    } 
                } 
                return len;
            },
            // 昵称校验
            checkNickname:function(){
                var _this = this;
                var _error = $('.nickname').next('.error-tip');
                if (_this.strlen($('.nickname').val())>0 && _this.strlen($('.nickname').val())<=16) {
                    //判断是否有错误提示
                    accoutTip = true;
                    _error.hide();
                    var parm = {};
                    parm.nickname = $('.nickname').val();
                    $.ajax({
                        url: '/api/isNicknameExist',
                        data: parm,
                        type: 'post',
                        dataType: 'json',
                        success: function(data) {
                            if (data.object==0) {
                                _this.enterNext();
                            }else{
                                _error.show();
                                _error.text('昵称已被占用');
                                setTimeout(function(){
                                    $('.error-tip').eq(_this.step-1).hide().text('昵称不能为空');
                                },2000);
                            }
                        },
                        error: function() {
                            alert('通讯服务器错误');
                        }
                    });
                }else{
                    _error.show();
                    _error.text('您的昵称不符合规范');
                    setTimeout(function(){
                        $('.error-tip').eq(_this.step-1).hide().text('昵称不能为空');
                    },2000);
                }
            },
            // 获取验证码
            getCode:function(){
                var _this = this;
                var _error = $('.getCode');
                // var _error = _current.next('.error-tip');
                if($('.telnumber').val()){
                    if(/^1([0-9]){10}$/.test($('.telnumber').val())){
                        var parm = {};
                        parm.type = 1;
                        parm.mobile = $('.telnumber').val();
                        $.ajax({
                            url: '/api/sendSMSCode',
                            data: parm,
                            type: 'post',
                            dataType: 'json',
                            success: function(data) {
                                if (data.code==0) {
                                    _this.enterNext();
                                    var second = 59;
                                    _error.attr('disabled',true).text(second+'(s)');
                                    function settime(val) { 
                                        if (second > 0) { 
                                            _error.text(second+'(s)');
                                            second--;
                                            setTimeout(function() { 
                                                settime(val) 
                                            },1000);
                                        } else {
                                            _error.attr('disabled',false).text('获取验证码');                             
                                        } 
                                    } 
                                    settime(second);                 
                                }else{
                                    _error.text(data.result);
                                    setTimeout(function(){
                                        _error.text('获取验证码');
                                    },2000);
                                }
                            },
                            error: function() {
                                alert('通讯服务器错误');
                            }
                        });
                    }else{
                        _error.text('请输入正确号码');
                        setTimeout(function(){
                            _error.text('获取验证码');
                        },2000);
                    }
                }else{
                    _error.text('手机号码不能为空');
                    setTimeout(function(){
                        _error.text('获取验证码');
                    },2000);
                }
            },
            // 验证手机号
            checkTel:function(){
                var _this = this;
                if(/^1([0-9]){10}$/.test($('.telnumber').val())){
                    var parm = {};
                    parm.mobile = $('.telnumber').val();
                    $.ajax({
                        url: '/api/isMobileExist',
                        data: parm,
                        type: 'post',
                        dataType: 'json',
                        success: function(data) {
                            if (data.object==0) {
                                _this.enterNext();
                            }else{
                                $('.getCode').text('手机号已被注册');
                                setTimeout(function(){
                                    $('.getCode').text('获取验证码');
                                },2000);
                            }
                        },
                        error: function() {
                            alert('通讯服务器错误');
                        }
                    });
                }else{
                    $('.getCode').text('请输入正确号码');
                    setTimeout(function(){
                        $('.getCode').text('获取验证码');
                    },2000);
                }
            },
            // 清除cookie
            delCookie:function($name){
                var myDate=new Date();    
                myDate.setTime(-1000);//设置时间    
                document.cookie=$name+"=''; expires="+myDate.toGMTString()+"; path=/"; 
            },
            // 注册
            register:function(){
                var _this = this;
                var parm = {};
                parm.nickname = $('.nickname').val();
                parm.mobile = $('.telnumber').val();
                parm.checkCode = $('.code').val();
                parm.password = $('.password').val();
                parm.sex = $('.sex-box .checked').find('input').val();
                $.ajax({
                    url: '/api/register',
                    data: parm,
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {
                        if (data.code==0) {
                            $('.reg-step').hide() && $('.reg-success').show();
                            _this.delCookie('yuer_userId');
                            _this.delCookie('yuer_token');
                            document.cookie="yuer_userId="+data.object.id; 
                            document.cookie="yuer_token="+data.object.token; 
                            window.localStorage.setItem("id", data.object.id);
                            window.localStorage.setItem("avatar", data.object.icon);
                            window.localStorage.setItem("nickname",data.object.nickname);
                            var second = 3;
                            function settime(val) { 
                                if (second < 0) { 
                                    window.location = '/';
                                } else {
                                    $('.jump-index').text('('+second+'s) 回到首页'); 
                                    second--;                              
                                } 
                                setTimeout(function() { 
                                    settime(val) 
                                },1000) 
                            } 
                            settime(second);
                        }else{
                            $('.error').text(data.result).show();
                            setTimeout(function(){
                                $('.error').hide();
                            },2000);
                        }
                    },
                    error: function() {
                        alert('通讯服务器错误');
                    }
                });               
            }
        }
    })   
})