$(function() {
    var $nickname = $('.nickname');
    var $telnumber = $('.telnumber');
    var $picCode = $('.pic-code img');
    var pwlandTip = false;

    function delCookie($name){    
        var myDate=new Date();    
        myDate.setTime(-1000);//设置时间    
        document.cookie=$name+"=''; expires="+myDate.toGMTString();                
    } 

    $('.m-register .m-input input').blur(function(e){
        var _current = $(e.currentTarget);
        var _error = _current.parent().find('.error-tip');
        if(!$(this).val()){
            _error.show();
            if($(this).hasClass('telnumber')){
                setTimeout(function(){
                    _error.hide();
                },2000);
            }
        }else{
            if($(this).hasClass('telnumber')){
                if(/^1([0-9]){10}$/.test($telnumber.val())){
                    _error.hide();
                }else{
                    _error.show();
                    _error.text('请输入正确号码');
                    setTimeout(function(){
                        _error.hide();
                        _error.text('手机号码不能为空');
                    },2000);
                }
            }else if($(this).hasClass('password')){
                if($('.password').val().length>=6){
                    _error.hide();
                }else{
                    _error.show();
                    _error.text('密码太短');
                    setTimeout(function(){
                        _error.hide();
                        _error.text('密码不能为空');
                    },2000);
                }
            }else{
                _error.hide();
            }
            
        }
    });

    $('.m-input input').focus(function(e){
        var _current = $(e.currentTarget);
        var _error = _current.parent().find('.error-tip');
        _error.hide();
    });

    $("body").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('.confirm').click();
            $('.u-reg-btn').click();
        }
    }); 

    // 长度校验
    function strlen(str){
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
    }

    // 昵称校验
    $nickname.blur(function(e) {
        var _current = $(e.currentTarget);
        var _error = _current.next('.error-tip');
        if($nickname.val()){
            if (strlen($nickname.val())>=6 && strlen($nickname.val())<=20) {
                //判断是否有错误提示
                accoutTip = true;
                _error.hide();
                var parm = {};
                parm.nickname = $nickname.val();
                $.ajax({
                    url: '/api/isNicknameExist',
                    data: parm,
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {
                        if (data.object==0) {
                            // window.location.href = '/';
                        }else{
                            _error.show();
                            _error.text('昵称已被占用');
                        }
                    },
                    error: function() {
                        alert('通讯服务器错误');
                    }
                });
            }else{
                _error.show();
                _error.text('您的昵称不符合规范');
            }
        }     
    })

    // 刷新图形验证码
    function changeCode(){
        $('.code-wrap input').val('');
        // $picCode.attr('src','http://172.16.2.62:8777/checkCode?phone='+$telnumber.val()+'&rand='+new Date());
        $picCode.attr('src','http://wy.yuerwebapi.wangyuhudong.com/checkCode?phone='+$telnumber.val()+'&rand='+new Date());
    }

    $('.getCode').click(function(e){
        var _current = $(e.currentTarget);
        var _error = _current.next('.error-tip');
        if($telnumber.val()){
            if(/^1([0-9]){10}$/.test($telnumber.val())){
                var parm = {};
                parm.mobile = $telnumber.val();
                $.ajax({
                    url: '/api/isMobileExist',
                    data: parm,
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {
                        if (data.object==0) {
                            $('.code-wrap input').val('');
                            $('.code-wrap .error-tip').hide();
                            $('.m-mask').show();
                            changeCode();
                        }else{
                            _error.show();
                            _error.text('手机号已被注册');
                            setTimeout(function(){
                                _error.hide();
                                _error.text('手机号码不能为空');
                            },2000);
                        }
                    },
                    error: function() {
                        alert('通讯服务器错误');
                    }
                });
            }else{
                _error.show();
                _error.text('请输入正确号码');
                setTimeout(function(){
                    _error.hide();
                    _error.text('手机号码不能为空');
                },2000);
            }
        }else{
            _error.show();
            setTimeout(function(){
                _error.hide();
            },2000);
        }
    })

    $('.pic-code a').click(function(e){
        e.preventDefault();
        changeCode();
    })

    $('.confirm').click(function(e){
        e.preventDefault();
        var _error = $('.code-wrap .error-tip');
        var parm = {};
        parm.mobile = $telnumber.val();
        parm.imgCheckCode = $('.code-wrap input').val();
        $.ajax({
            url: '/api/sendSMSCode',
            data: parm,
            type: 'post',
            dataType: 'json',
            success: function(data) {
                if (data.code==0) {
                    $('.m-mask').hide();
                    var second = 59;
                    $('.getCode').attr('disabled',true).text(second+'(s)');
                    function settime(val) { 
                        if (second > 0) { 
                            $('.getCode').text(second+'(s)');
                            second--;
                            setTimeout(function() { 
                                settime(val) 
                            },1000);
                        } else {
                            $('.getCode').attr('disabled',false).text('获取验证码');                             
                        } 
                    } 
                    settime(second);                 
                }else{
                    _error.show();
                    setTimeout(function(){
                        _error.hide();
                    },2000);
                }
            },
            error: function() {
                alert('通讯服务器错误');
            }
        });
    })

    $('.cancel').click(function(e){
        e.preventDefault();
        $('.m-mask').hide();
    })
    
    $('.u-reg-btn').click(function(e){
        e.preventDefault();
        var formComplete = true;
        if($('.password').val()!=$('.repassword').val() && $('.password').val() && $('.repassword').val()){
            formComplete = false;
            $('.repassword').next('.error-tip').text('密码不一致').show();
        }else if(!$('.repassword').val()){
            formComplete = false;
            $('.repassword').next('.error-tip').text('密码不能为空');
        }else if($('.password').val().length<6){
            formComplete = false;
            $('.password').next('.error-tip').text('密码太短');
        }
        $('.m-regform input').each(function(){
            if(!$(this).val()){
                $(this).parent().find('.error-tip').show();
                formComplete = false;
            }
        });
        if(formComplete){
            var parm = {};
            parm.nickname = $('.nickname').val();
            parm.mobile = $telnumber.val();
            parm.checkCode = $('.code').val();
            parm.password = $('.password').val();
            $.ajax({
                url: '/api/register',
                data: parm,
                type: 'post',
                dataType: 'json',
                success: function(data) {
                    if (data.code==0) {
                        $('.m-mask').show();
                        $('.code-wrap').hide();
                        $('.reg-success').show();
                        delCookie('yuer_userId');
                        delCookie('yuer_token');
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
                        $('.code').next('.error-tip').text('验证码错误').show();
                        setTimeout(function(){
                            $('.code').next('.error-tip').hide().text('验证码不能为空');
                        },2000);
                    }
                },
                error: function() {
                    alert('通讯服务器错误');
                }
            });
        }
    })
})