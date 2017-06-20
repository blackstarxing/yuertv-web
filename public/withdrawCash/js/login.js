var login = new Vue({
    el: '#login',
    delimiters: ['${', '}'],
    data: {
       
    },
    mounted:function(){
        this.$nextTick(function () {
           /*去掉iphone手机滑动默认行为*/
          $('body').on('touchmove', function (event) {
              event.preventDefault();
          });
          var _this = this;
               $.ajax({
                // url: 'http://172.16.10.134:8080/withdraw/checkAuth',
                url: 'http://118.190.21.195:39999/withdraw/checkAuth',
                type: 'get',
                dataType:'json',
                crossDomain:true,
                xhrFields: {
                      withCredentials: true,
                },
                success: function(data) {
                  if(data.code == 0){
                  }else if(data.code == 302){
                    window.location.href = data.result;
                  }else{
                    layer.open({
                      content: '授权失败',
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
         
        })
    },
    methods: {
        // 删除cookie
        delCookie:function($name){
            var myDate=new Date();    
            myDate.setTime(-1000);//设置时间    
            document.cookie=$name+"=''; expires="+myDate.toGMTString()+"; path=/";   
        },
        // 获取url参数
        getQueryString:function(name){
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
         // 三方登录（微信登录）
       thirdLogin:function(type){
              $.ajax({
                // url: 'http://172.16.10.134:8080/thirdPartyLogin?platform='+type,
                url: 'http://118.190.21.195:39999/thirdPartyLogin?platform='+type,
                type: 'get',
                dataType:'json',
                crossDomain:true,
                xhrFields: {
                  withCredentials: true,
                },
                success: function(data) {
                  if(data.code == 1){
                    window.location.href = data.result;
                  }else if(data.cdoe == 2){
                    window.location.href = data.result;
                  }else if(data.code == 3){
                    window.location.href = data.result;
                  }else if(data.code == 4){
                    layer.open({
                      content: '用户未注册',
                      btn: '好的',
                      shadeClose: false,
                     });
                  }else if(data.code == 200){
                    window.location.href = data.result;
                    console.log('登录成功');
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
        },
        // 手机登录
        phoneLogin:function(){
            window.location.href = '/withdrawCash/messageLog';    
        },
        // QQ登录,微信登录 未开放
        disopen:function(){
            layer.open({
              content: '功能暂未开放,敬请期待',
              btn: '好的',
              shadeClose: false,
            });
        }


    }
})
