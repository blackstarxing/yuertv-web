$(function() {
    var $phonetext = $('.phone_text');
    var $loginpw = $('.login_pw_text');
    var accoutTip = false;
    var pwlandTip = false;
    $('.landreg_tab').on('click', 'li', function() {
        var _index = $(this).index();
        $(this).addClass('reg_active').siblings().removeClass('reg_active');
        $('.landreg_list').eq(_index).show().siblings().hide();
    })

    $phonetext.blur(function(e) {
        var _current = $(e.currentTarget);
        var _error = _current.next('.reg_error');
        if ($phonetext.val() && /^\d+$/.test($phonetext.val())) {
            //判断是否有错误提示
            accoutTip = true;
            _error.hide();
            if ($phonetext.val().length != 11) {
                _error.show();
                //判断是否有错误提示
                accoutTip = false;
                _error.find('.error_tip').text('手机号码位数不对');
            }
        } else {
            accoutTip = false;
            _error.show();
            _error.find('.error_tip').text('请填写正确的手机号');
        }
    })

    $loginpw.blur(function(e) {
        var _current = $(e.currentTarget);
        var _error = _current.next('.reg_error');
        if ($loginpw.val() && $loginpw.val().length < 6) {
            _error.show();
            pwlandTip = false;
        } else {
            _error.hide();
            pwlandTip = true;
        }
    })

    $('.allow_login').on('click', function() {
        var parm = {};
        parm.username = $phonetext.val();
        parm.password = $loginpw.val();
        $.ajax({
            url: 'http://wy.kaisaiba.wangyuhudong.com/api/login',
            data: parm,
            type: 'post',
            dataType: 'json',
            success: function(data) {
                if (data.code) {
                    window.location.href = '/';
                }
            },
            error: function() {
                alert('通讯服务器错误');
            }
        });
    })
})