$(function() {
    var $nickname = $('.nickname');
    var $telnumber = $('.telnumber');
    var accoutTip = false;
    var pwlandTip = false;

    $('.m-input input').blur(function(e){
        var _current = $(e.currentTarget);
        var _error = _current.parent().find('.error-tip');
        if(!$(this).val()){
            _error.show();
            if($(this).hasClass('telnumber')){
                setTimeout(function(){
                    _error.hide();
                },2000);
            }
        }
    });

    $nickname.blur(function(e) {
        var _current = $(e.currentTarget);
        var _error = _current.next('.error-tip');
        if($nickname.val()){
            if (/^[a-zA-Z0-9_]{2,16}$/.test($nickname.val())) {
                //判断是否有错误提示
                accoutTip = true;
                _error.hide();
                var parm = {};
                parm.nickname = $nickname.val();
                $.ajax({
                    url: 'http://172.16.2.62:8777/isNicknameExist',
                    data: parm,
                    type: 'post',
                    dataType: 'json',
                    success: function(data) {
                        if (data.object==0) {
                            // window.location.href = '/';
                        }else{
                            accoutTip = false;
                            _error.show();
                            _error.text('昵称已被占用');
                        }
                    },
                    error: function() {
                        alert('通讯服务器错误');
                    }
                });
                // if ($phonetext.val().length != 11) {
                //     _error.show();
                //     //判断是否有错误提示
                //     accoutTip = false;
                //     _error.find('.error_tip').text('手机号码位数不对');
                // }
            }else{
                accoutTip = false;
                _error.show();
                _error.text('您的昵称不符合规范');
            }
        }     
    })

    $('.getCode').click(function(e){
        var _current = $(e.currentTarget);
        var _error = _current.next('.error-tip');
        if($telnumber.val()){
            if(/^1([0-9]){10}$/.test($telnumber.val())){
                $('.m-mask').show();
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

    $('.cancel').click(function(e){
        e.preventDefault();
        $('.m-mask').hide();
    })
    // $loginpw.blur(function(e) {
    //     var _current = $(e.currentTarget);
    //     var _error = _current.next('.reg_error');
    //     if ($loginpw.val() && $loginpw.val().length < 6) {
    //         _error.show();
    //         pwlandTip = false;
    //     } else {
    //         _error.hide();
    //         pwlandTip = true;
    //     }
    // })

    // $('.allow_login').on('click', function() {
    //     var parm = {};
    //     parm.username = $phonetext.val();
    //     parm.password = $loginpw.val();
    //     $.ajax({
    //         url: 'http://wy.kaisaiba.wangyuhudong.com/api/login',
    //         data: parm,
    //         type: 'post',
    //         dataType: 'json',
    //         success: function(data) {
    //             if (data.code) {
    //                 window.location.href = '/';
    //             }
    //         },
    //         error: function() {
    //             alert('通讯服务器错误');
    //         }
    //     });
    // })
})