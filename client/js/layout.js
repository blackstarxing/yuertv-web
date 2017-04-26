$(function(){
    
    // $('.head_logo').click(function(){    
    //     window.location.href = "/";
    // })
    // 下载二维码显示
    $('.sweepme').hover(function(){
        $('.QRbox').show();
    },function(){
        $('.QRbox').hide();
    });
    // 注册奖励提示
    // $('.register-hover').hover(function(){
    //     $('.reward-tip').show();
    // },function(){
    //     $('.reward-tip').hide();
    // });
    // 显示个人中心
    $('.avatar').hover(function(){
        $(this).css('background',"#0c1014");
    	$('.nav-list').show();
    },function(){
        $(this).css('background',"none");
    	$('.nav-list').hide();
    });

    $('.m-search input').click(function(e){
        // $(this).css({'background':'#fff','color':"#333"});
        e.stopPropagation();
        if($('.anchor-list').html()!=''){
            $('.hot-anchor').show();
        }   
    })

    $("body").click(function(e){
        $('.hot-anchor').hide();
    });

    $('.hot-anchor').click(function(e){
        e.stopPropagation();
    })
    $('.u-search-btn').click(function(e){
        e.preventDefault();
        if($('.m-search input').val()){
            window.location.href = "/search?content="+$('.m-search input').val();
        }
    })

    $(".login-content").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('.u-login').click();
        }
    }); 

    $(".m-search").keydown(function() {
        if (event.keyCode == "13") {//keyCode=13是回车键
            $('.u-search-btn').click();
        }
    }); 

    $(".m-common .m-lst:nth-child(5n)").css("margin-right","0");
    // 右侧挂件
    $('.u-download').hover(function(){
        $('.showQR').show();
    },function(){
        $('.showQR').hide();
    });
    $('.fade').hover(function(){        $('.fade ul').stop(true,true);
        $(this).find("ul").animate({marginLeft:'-60px'},300);
    },function(){
        $('.fade ul').stop(true,true);
        $(this).find("ul").animate({marginLeft:0},300);
    });
    //收藏本页begin
    $(".collect").click(function(event) {
        var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL';
        try {
            if (document.all) { //IE类浏览器
                try {
                    window.external.toString(); //360浏览器不支持window.external，无法收藏
                    window.alert("360浏览器等不支持主动加入收藏。\n您可以尝试通过浏览器菜单栏 或快捷键 ctrl+D 试试。");
                } catch (e) {
                    try {
                        window.external.addFavorite(window.location, document.title);
                    } catch (e) {
                        window.external.addToFavoritesBar(window.location, document.title); //IE8
                    }
                }
            } else if (window.sidebar) { //firfox等浏览器
                window.sidebar.addPanel(document.title, window.location, "");
            } else {
                alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~');
            }
        } catch (e) {
            alert('您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~');
        }
    });
    //收藏本页end

    //返回顶部begin
    $(window).scroll(function() {
        var scrollheight = $(this).scrollTop();
        if (scrollheight >= 350) {
            $(".collect").fadeIn(100);
            $(".backToTop").fadeIn(100);
        } else {
            $(".collect").fadeOut(100);
            $(".backToTop").fadeOut(100);
        }
    });
    $(".backToTop").click(function() {
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    });

     //返回顶部end

    $('.live-address').hover(function(){
        $(this).find('.play-mask').show();
    },function(){
        $(this).find('.play-mask').hide();
    })
})

var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: {
        islogin:0,
        // 用户id
        id:'',
        // loginWrap:false,
        logType:1,
        regPic:'',
        // 登录表单
        loginForm:{

        },
        // 注册表单
        regForm:{
            mobile:'',
            checkCode:'',
            nickname:'',
            password:'',
            sex:0
        },
        regpicCode:'',
        regdis:false,
        regText:'获取验证码',
        regError:{
            phone:'',
            pic:'',
            code:'',
            password:'',
            nickname:''
        },
        phonePic:'',
        // 快捷登录表单
        phoneForm:{
            mobile:'',
            checkCode:''
        },
        phonepicCode:'',
        phonedis:false,
        phoneText:'获取验证码',
        phoneError:{
            phone:'',
            pic:'',
            code:''
        },
        //导航栏关注
        subs:'',
        his:''
    },
    mounted: function () {
        this.$nextTick(function () {
            this.islogin = (document.cookie.indexOf('yuer_userId')>=0) ? 1 : 0;
            // 获取用户头像
            var icon = window.localStorage.getItem("avatar");
            this.id = window.localStorage.getItem("id");
            if(icon && icon != 'undefined'){
                if(icon.indexOf('http')>-1){
                    $('.avatar-icon').attr('src',icon); 
                }else{
                    $('.avatar-icon').attr('src','http://img.wangyuhudong.com/'+icon);
                }
            }else{
                $('.avatar-icon').attr('src','/images/default_avatar.png'); 
            }
            var _this = this;
            if(this.getQueryString('uin')){
                $.ajax({
                    url: '/api/thirdPartyLogin/getUserInfo?key='+this.getQueryString('uin'),
                    type: 'get',
                    dataType: 'json',
                    success: function(data) {
                        _this.delCookie('yuer_userId');
                        _this.delCookie('yuer_token');
                        document.cookie="yuer_userId="+data.object.id; 
                        document.cookie="yuer_token="+data.object.token; 
                        window.localStorage.setItem("id", data.object.id);
                        window.localStorage.setItem("avatar", data.object.icon);
                        window.localStorage.setItem("nickname",data.object.nickname);
                        window.location.href = '/';
                    },
                    error: function() {
                        // console.log('网络异常，请刷新重试');
                    }
                }); 
            }
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
        clearInput:function(){
            $('.l-usrname').val('');
            $('.l-pwd').val('')
            this.regForm={
                mobile:'',
                checkCode:'',
                nickname:'',
                password:'',
                sex:0
            };
            this.phoneForm={
                mobile:'',
                checkCode:''
            };
            $('#reg-number').removeAttr('readonly');
            $('#quick-number').removeAttr('readonly');
            $('.reg-slide').hide();
            $('.phone-slide').hide();
        },
        showLogin:function(type)
        {
            // this.loginWrap = true;
            // $('.l-usrname').val('');
            // $('.l-pwd').val('');
            $('.m-login-wrap').show();
            if(type==1){
                this.logType = 2;
            }
        },
        getSub:function(){
            var _this = this;
            if(_this.islogin){
                $.ajax({
                    url: '/api/index/subscribeUps?userId='+_this.id,
                    type: 'get',
                    dataType: 'json',
                    success: function(data) {
                        _this.subs = data.object.subscribeUps;
                    },
                    error: function() {
                        // console.log('网络异常，请刷新重试');
                    }
                }); 
            }           
        },
        getHis:function(){
            var _this = this;
            if(_this.islogin){
                $.ajax({
                    url: '/api/index/historyUps?userId='+_this.id,
                    type: 'get',
                    dataType: 'json',
                    success: function(data) {
                        _this.his = data.object.histories;
                    },
                    error: function() {
                        console.log('网络异常，请刷新重试');
                    }
                }); 
            }            
        },
        userLogin:function(){
            var _this = this;
            var error = $('.login-content .lg-error');
            if(!$('.l-usrname').val() || !$('.l-pwd').val()){
                error.text('用户名或密码不能为空！').fadeIn(100);
                setTimeout(function(){
                    error.fadeOut();
                },2000);
            }else{
                var parm = {};
                    parm.nickname = $('.l-usrname').val();
                    parm.password = $('.l-pwd').val();
                $.ajax({
                    url: '/api/login',
                    data: parm,
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {
                        if (data.code==0) {
                            _this.delCookie('yuer_userId');
                            _this.delCookie('yuer_token');
                            document.cookie="yuer_userId="+data.object.id; 
                            document.cookie="yuer_token="+data.object.token; 
                            window.localStorage.setItem("id", data.object.id);
                            window.localStorage.setItem("avatar", data.object.icon);
                            window.localStorage.setItem("nickname",data.object.nickname);
                            if(window.location.pathname == '/register' || window.location.pathname == '/reset'){                           
                                window.location="/";
                            }else{
                                window.location.href = window.location.href;
                            }                       
                        }else{
                            error.text(data.result).fadeIn(100);
                            setTimeout(function(){
                                error.fadeOut();
                            },2000);
                        }
                    },
                    error: function() {
                        console.log('网络异常，请刷新重试');
                    }
                });
            }
        },
        logout:function(e){
            e.preventDefault();
            this.delCookie('yuer_userId');
            this.delCookie('yuer_token');
            localStorage.clear();
            window.location.href = "/";
        },
        delCookie:function($name){
            var myDate=new Date();    
            myDate.setTime(-1000);//设置时间    
            document.cookie=$name+"=''; expires="+myDate.toGMTString()+"; path=/";   
        },
        closeLogin:function(){
            // this.loginWrap = false;
            this.clearInput();
            $('.m-login-wrap').hide();
            this.logType = 1;
        },
        // 登录注册切换
        changeLogtype:function(type){
            this.clearInput();
            this.logType = type;
        },
        // 三方登录
        thirdLogin:function(type){
            window.location.href = '/api/thirdPartyLogin?platform='+type;
        },
        // 注册
        chooseSex:function(type){
            if(type==1){
                this.regForm.sex = 1;
            }
            if(type==0){
                this.regForm.sex = 0;
            }
        },
        // 图形验证码
        showPic:function(type){
            var _this = this;
            if(type==0){
                if(_this.regForm.mobile){
                    if(/^1[34578][0-9]{9}$/.test(_this.regForm.mobile)){
                        $.ajax({
                            url: '/api/CheckMobile?mobile='+_this.regForm.mobile,
                            type: 'get',
                            dataType: 'json',
                            success: function(data) {
                                if(data.code==0){
                                    _this.regPic = 'http://172.16.10.3:8777/checkCode?phone='+_this.regForm.mobile+'&rand='+new Date();
                                    $('#reg-number').attr('readonly','readonly');
                                    $('.reg-slide').slideDown();

                                }else{
                                    _this.regError.phone = "号码已被注册，请重新输入";
                                    setTimeout(function(){
                                        _this.regError.phone = '';
                                    },2000);
                                }
                            },
                            error: function() {
                                console.log('网络异常，请刷新重试');
                            }
                        });                        
                    }else{
                        _this.regError.phone = "手机号码错误，请重新输入";
                        setTimeout(function(){
                            _this.regError.phone = '';
                        },2000);
                    }
                }else{
                    _this.regError.phone = "请输入手机号码";
                    setTimeout(function(){
                        _this.regError.phone = '';
                    },2000);
                }                       
            }else{
                if(_this.phoneForm.mobile){
                    if(/^1[34578][0-9]{9}$/.test(_this.phoneForm.mobile)){
                        _this.phonePic = 'http://qa.webapi.yuerlive.cn:8777/checkCode?phone='+_this.phoneForm.mobile+'&rand='+new Date();
                        $('#quick-number').attr('readonly','readonly');
                        $('.phone-slide').slideDown();
                    }else{
                        _this.phoneError.phone = "手机号码错误，请重新输入";
                        setTimeout(function(){
                            _this.phoneError.phone = '';
                        },2000);
                    }
                }else{
                    _this.phoneError.phone = "请输入手机号码";
                    setTimeout(function(){
                        _this.phoneError.phone = '';
                    },2000);
                }                            
            }
        },
        changePic:function(type){
            if(type==0){
                this.regPic = 'http://qa.webapi.yuerlive.cn/checkCode?phone='+this.regForm.mobile+'&rand='+new Date();
            }else{
                this.phonePic = 'http://qa.webapi.yuerlive.cn/checkCode?phone='+this.phoneForm.mobile+'&rand='+new Date();
            }
        },
        // 发送验证码
        sendCode:function(type){
            var _this = this;
            if(type==0){
                var parm = {};
                parm.type = 2;
                parm.imgCheckCode = _this.regpicCode;
                parm.mobile = _this.regForm.mobile;
                if(parm.imgCheckCode.length==4){
                    $.ajax({
                        url: '/api/sendSMSCode',
                        data: parm,
                        type: 'post',
                        dataType: 'json',
                        success: function(data) {
                            if (data.code==0) {
                                _this.regpicCode = '';
                                $('.reg-slide').slideUp();
                                $('#reg-number').removeAttr('readonly');
                                var second = 59;
                                _this.regdis = true;
                                _this.regText = second+'(s)';
                                function settime(val) { 
                                    if (second > 0) { 
                                        _this.regText = second+'(s)';
                                        second--;
                                        setTimeout(function() { 
                                            settime(val) 
                                        },1000);
                                    } else {
                                        _this.regdis = false;
                                        _this.regText = '获取验证码';                             
                                    } 
                                } 
                                settime(second);                           
                            }else{
                                _this.regError.pic = data.result;
                                setTimeout(function(){
                                    _this.regError.pic = '';
                                },2000);
                            }
                        },
                        error: function() {
                            console.log('网络异常，请刷新重试');
                        }
                    });
                }else{
                    _this.regError.pic = '图形验证码错误';
                    setTimeout(function(){
                        _this.regError.pic = '';
                    },2000);
                }            
            }else{
                var parm = {};
                parm.type = 2;
                parm.imgCheckCode = _this.phonepicCode;
                parm.mobile = _this.phoneForm.mobile;
                if(parm.imgCheckCode.length==4){
                    $.ajax({
                        url: '/api/sendSMSCode',
                        data: parm,
                        type: 'post',
                        dataType: 'json',
                        success: function(data) {
                            if (data.code==0) {
                                _this.phonepicCode = '';
                                $('.phone-slide').slideUp();
                                $('#quick-number').removeAttr('readonly');
                                var second = 59;
                                _this.phonedis = true;
                                _this.phoneText = second+'(s)';
                                function settime(val) { 
                                    if (second > 0) { 
                                        _this.phoneText = second+'(s)';
                                        second--;
                                        setTimeout(function() { 
                                            settime(val) 
                                        },1000);
                                    } else {
                                        _this.phonedis = false;
                                        _this.phoneText = '获取验证码';                             
                                    } 
                                } 
                                settime(second);                           
                            }else{
                                _this.phoneError.pic = data.result;
                                setTimeout(function(){
                                    _this.phoneError.pic = '';
                                },2000);
                            }
                        },
                        error: function() {
                            console.log('网络异常，请刷新重试');
                        }
                    });
                }else{
                    _this.phoneError.pic = '图形验证码错误';
                    setTimeout(function(){
                        _this.phoneError.pic = '';
                    },2000);
                } 
            }           
        },
        // 快捷登录
        quickLogin:function(){
            var _this = this;
            if(/^1[34578][0-9]{9}$/.test(_this.phoneForm.mobile) && _this.phoneForm.checkCode.length==6){
                var parm = {};
                parm.checkCode = _this.phoneForm.checkCode;
                parm.mobile = _this.phoneForm.mobile;
                $.ajax({
                    url: '/api/mobileQuickLogin',
                    type: 'get',
                    data:parm,
                    dataType: 'json',
                    success: function(data) {
                        if(data.code==0){
                            _this.delCookie('yuer_userId');
                            _this.delCookie('yuer_token');
                            document.cookie="yuer_userId="+data.object.id; 
                            document.cookie="yuer_token="+data.object.token; 
                            window.localStorage.setItem("id", data.object.id);
                            window.localStorage.setItem("avatar", data.object.icon);
                            window.localStorage.setItem("nickname",data.object.nickname);
                            if(window.location.pathname == '/register' || window.location.pathname == '/reset'){                           
                                window.location="/";
                            }else{
                                window.location.href = window.location.href;
                            } 
                        }else{
                            _this.phoneError.code = "验证码错误，请重新输入";
                            setTimeout(function(){
                                _this.phoneError.code = '';
                            },2000);
                        }
                    },
                    error: function() {
                        console.log('网络异常，请刷新重试');
                    }
                });
            }else if(_this.phoneForm.mobile==''){
                _this.phoneError.phone = "手机号码不能为空";
                setTimeout(function(){
                    _this.phoneError.phone = '';
                },2000);
            }else if(!/^1[34578][0-9]{9}$/.test(_this.phoneForm.mobile)){
                _this.phoneError.phone = "手机号码错误，请重新输入";
                setTimeout(function(){
                    _this.phoneError.phone = '';
                },2000);
            }else if(_this.phoneForm.checkCode==''){
                _this.phoneError.code = "验证码不能为空";
                setTimeout(function(){
                    _this.phoneError.code = '';
                },2000);
            }else if(_this.phoneForm.checkCode!='' && _this.phoneForm.checkCode.length<6){
                _this.phoneError.code = "验证码错误，请重新输入";
                setTimeout(function(){
                    _this.phoneError.code = '';
                },2000);
            }           
        },
        register:function(){
            var _this = this;
            console.log(_this.regForm)
            if(/^1[34578][0-9]{9}$/.test(_this.regForm.mobile) && _this.regForm.checkCode.length==6 && _this.regForm.password && _this.regForm.nickname){
                console.log(123);
                var parm = {};
                parm.checkCode = _this.regForm.checkCode;
                parm.mobile = _this.regForm.mobile;
                parm.nickname = _this.regForm.nickname;
                parm.password = _this.regForm.password;
                parm.sex = _this.regForm.sex;
                $.ajax({
                    url: '/api/register',
                    type: 'get',
                    data:parm,
                    dataType: 'json',
                    success: function(data) {
                        if(data.code==0){
                            _this.delCookie('yuer_userId');
                            _this.delCookie('yuer_token');
                            document.cookie="yuer_userId="+data.object.id; 
                            document.cookie="yuer_token="+data.object.token; 
                            window.localStorage.setItem("id", data.object.id);
                            window.localStorage.setItem("avatar", data.object.icon);
                            window.localStorage.setItem("nickname",data.object.nickname);
                            if(window.location.pathname == '/register' || window.location.pathname == '/reset'){                           
                                window.location="/";
                            }else{
                                window.location.href = window.location.href;
                            } 
                        }else if(data.code==1){
                            _this.regError.nickname = data.result;
                            setTimeout(function(){
                                _this.regError.nickname = '';
                            },2000);
                        }else if(data.code==2){
                            _this.regError.password = data.result;
                            setTimeout(function(){
                                _this.regError.password = '';
                            },2000);
                        }else if(data.code==3){
                            _this.regError.code = data.result;
                            setTimeout(function(){
                                _this.regError.code = '';
                            },2000);
                        }
                    },
                    error: function() {
                        console.log('网络异常，请刷新重试');
                    }
                });
            }else if(_this.regForm.mobile==''){
                _this.regError.phone = "手机号码不能为空";
                setTimeout(function(){
                    _this.regError.phone = '';
                },2000);
            }else if(!/^1[34578][0-9]{9}$/.test(_this.regForm.mobile)){
                _this.regError.phone = "手机号码错误，请重新输入";
                setTimeout(function(){
                    _this.regError.phone = '';
                },2000);
            }else if(_this.regForm.checkCode==''){
                _this.regError.code = "验证码不能为空";
                setTimeout(function(){
                    _this.regError.code = '';
                },2000);
            }else if(_this.regForm.checkCode!='' && _this.regForm.checkCode.length<6){
                _this.regError.code = "验证码错误，请重新输入";
                setTimeout(function(){
                    _this.regError.code = '';
                },2000);
            }else if(_this.regForm.password==''){
                _this.regError.password = "密码不能为空";
                setTimeout(function(){
                    _this.regError.password = '';
                },2000);
            }else if(_this.regForm.nickname==''){
                _this.regError.nickname = "昵称不能为空";
                setTimeout(function(){
                    _this.regError.nickname = '';
                },2000);
            }  
        }
    }
})   
