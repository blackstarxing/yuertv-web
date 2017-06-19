// window.document.title = "我的收益"
var exchangeRst = new Vue({
    el: '#exchangeRst',
    delimiters: ['${', '}'],
    data: {
        exchangerstCash:'',
    },
    mounted:function(){
        this.$nextTick(function () {
            /*去掉iphone手机滑动默认行为*/
            $('body').on('touchmove', function (event) {
                event.preventDefault();
            });
           var _this = this;
           _this.exchangerstCash=_this.getQueryString('exchangerstCash');
          
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
        //完成确认
        confirmBtn:function(){
            window.location.href = "/withdrawCash/income";    
        }
    }

})
