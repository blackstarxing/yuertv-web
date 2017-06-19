  var incomeDetail = new Vue({
     el: '#incomeDetail',
     delimiters: ['${', '}'],
     data: {
       //tab切换
       giftHistoryList:true,
       withdrawList:false,
       //兑换列表
       exchangeList:[],
       //收益列表
       incomeList:[],
       incomeislast:'',
       exchangeislast:'',
       incomepage:1,
       exchangepage:1,
       pageSize:10,
       //数据加载判断 
       giftislast:0,
       cashislast:0,
       //收礼加载中
       giftLoad:false,
       giftloadText:'',
       // 兑换加载
       changeLoad:false,
       exchangeloadText:'',
     },
     mounted:function(){
        this.$nextTick(function () {
             var _this = this;
             //收礼记录
             $.ajax({
              url: 'http://172.16.10.134:8080/withdraw/giftHistoryList',
              type: 'get',
              dataType:'json',
              data:{
                page: _this.incomepage,
                pageSize: _this.pageSize,
              }, 
              crossDomain:true,
              xhrFields: {
                  withCredentials: true,
              },
              success: function(data) {
                if(data.code == 0){
                   _this.incomeList = data.object.list;
                   _this.giftisLast = data.object.isLast;
                   _this.incomepage = data.object.currentPage;
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
             //滑动加载
            $(window).scroll(function(){ 
                var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()); 
                if($(document).height() <= totalheight){
                    if(!_this.giftislast  && _this.giftHistoryList == true){
                      _this.incomepage+=1;
                      _this.incomeLoad();
                    }else if(_this.giftislast == 1){
                      _this.giftloadText = '没有数据了';
                    }
                    if(!_this.cashislast && _this.withdrawList== true){
                       _this.exchangepage+=1;
                       _this.exchangeLoad();
                    }else if(_this.cashislast == 1){
                      _this.exchangeloadText = '没有数据了';
                    }
                }
            })
        })
     },
     beforeDestroy:function(){
         this.page = 1;
         $(window).unbind('scroll');
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
        // 兑换记录
        exchangeRecord:function(){
           $('.u-exchangeDetail').addClass('active');
           $('.u-incomeDetail').removeClass('active');
            var _this = this;
            _this.giftHistoryList = false;
            _this.withdrawList = true;
            $.ajax({
              url: 'http://172.16.10.134:8080/withdraw/withdrawList?page='+1+'&pageSize='+_this.pageSize,
              type: 'get',
              dataType:'json',
              crossDomain:true,
              xhrFields: {
                  withCredentials: true,
              },
              success: function(data) {
                if(data.code == 0){
                   _this.exchangeList = data.object.list;
                   _this.cashislast = data.object.isLast;
                }else if(data.code == -1){
                  // layer.open({
                  //   content: '未登陆',
                  //   btn: '好的',
                  //   shadeClose: false,
                  // });
                  window.location.href = '/withdrawCash/login';
                }else if(data.code == -2){
                  // layer.open({
                  //   content: '没有权限',
                  //   btn: '好的',
                  //   shadeClose: false,
                  // });
                  window.location.href = '/withdrawCash/login';
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
        // 收益记录
        incomeRecord:function(){
           $('.u-incomeDetail').addClass('active');
           $('.u-exchangeDetail').removeClass('active');
           var _this = this;
            _this.giftHistoryList = true;
            _this.withdrawList = false;
             $.ajax({
              url: 'http://172.16.10.134:8080/withdraw/giftHistoryList?page='+1+'&pageSize='+_this.pageSize,
              type: 'get',
              dataType:'json',
              crossDomain:true,
              xhrFields: {
                  withCredentials: true,
              },  
              success: function(data) {
                if(data.code == 0){
                   _this.incomeList = data.object.list;
                   _this.giftislast = data.object.isLast;
                }else if(data.code == -1){
                  // layer.open({
                  //   content: '未登陆',
                  //   btn: '好的',
                  //   shadeClose: false,
                  // });
                  window.location.href = '/withdrawCash/login';
                }else if(data.code == -2){
                  // layer.open({
                  //   content: '没有权限',
                  //   btn: '好的',
                  //   shadeClose: false,
                  // });
                  window.location.href = '/withdrawCash/login';
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
        // 收益记录加载更多
        incomeLoad:function(){
          var _this = this;
          _this.giftLoad = true;
          _this.giftloadText = '加载中...';
          $.ajax({
            url: 'http://172.16.10.134:8080/withdraw/giftHistoryList',
            type: 'get',
            dataType:'json',
            data:{
              page: _this.incomepage,
              pageSize: _this.pageSize,
            }, 
            crossDomain:true,
            xhrFields: {
                withCredentials: true,
            },
            success: function(data) {
              if(data.code == 0){
                _this.incomeList=_this.incomeList.concat(data.object.list);
                _this.giftislast = data.object.isLast;
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
          })
         },
        // 兑换记录加载更多
        exchangeLoad:function(type) {
            var _this = this;
            _this.changeLoad = true;
            _this.exchangeloadText = '加载中...';
            $.ajax({
                url: 'http://172.16.10.134:8080/withdraw/withdrawList',
                type: 'get',
                dataType:'json',
                data:{
                  page: _this.exchangepage,
                  pageSize: _this.pageSize,
                }, 
                crossDomain:true,
                xhrFields: {
                    withCredentials: true,
                },
                success: function(data) {
                  if(data.code == 0){
                     _this.exchangeList=_this.exchangeList.concat(data.object.list);
                     _this.cashislast = data.object.isLast;
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
      }
}) 