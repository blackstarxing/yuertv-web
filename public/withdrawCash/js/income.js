var login = new Vue({
  	el: '#income',
  	delimiters: ['${', '}'],
  	data: {
  	
    	},
  	mounted:function(){
  		this.$nextTick(function () {
  	    console.log('加载、、')
  		})
  	},
  	methods: {
  		 // 收益明细
       incomeDetail:function(){
           window.location.href='/withdrawCash/incomeDetail';
       }
  	}
})