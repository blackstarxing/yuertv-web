$(function() { 
//提交认证；
checkName
checkQQ
checkIdCard

$('#Usubmit').on("click",function(){  
  var UsubmitCheck=true;
  $(".Ucenter input").each(function(){
    if(!$(this).val()){
      showTip($(this).attr("name")+"不能为空！")；
      UsubmitCheck=false;
      return false;
    }
  })
  if($("#checkName").val() && $("#checkQQ").val() && $("#checkIdCard").val() && ){
    if($("#checkName").val().length<9){
      UsubmitCheck=false;
    }else if($("#checkQQ").val().length<9){
      UsubmitCheck=false;
    }else if($("#checkIdCard").val().length<9){
      UsubmitCheck=false;
    }
  }
    $.ajax({  
        type: "GET",  
        url: "http://172.16.2.62:8777/person-center/realname-auth",  
        data: {idCard:$("#idCard").val(),
               idCardBackScan:$("#idCardBackScan").val(),
               idCardDueDate:$("#idCardDueDate").val(),
               idCardFrontScan:$("#idCardFrontScan").val(),
               idCardHandScan:$("#idCardHandScan").val(),
               qq:$("#checkQQ"),
               realname:$("#checkName"),
               token:$("#token"),
               userId:$("#userId")
        },  
        dataType: "json",  
        success: function(data){  
            if(data.code == 0){//data.code的值这个是后端人员规定的。
              // console.log("请求成功");
              alert("上传成功");
            } else if (data.code == -2) {
                console.log("你没有权限，通常来讲，你是没有登录");
            } else if (data.code == -5) {
                console.log("参数错误哦。");
                
            }else{
                console.log(data.result);
            }    
        },
        error: function() {
            alert('通讯服务器错误');
        } 
    });  
}); 
// 验证qq号
$(".inputCheck").off("keydown").on("keydown",function(e){
    if((e.keyCode >=48 && e.keyCode <=57)||(e.keyCode >=97 && e.keyCode <=105)||(e.keyCode == 8)){
    
    }else{
        e.preventDefault();
    }
})
$("#checkQQ").off().on("blur",function(){
    if((($("#checkQQ").val().length >= 5) && ($("#checkQQ").val().length <= 11)) && (/^(13|15|17|18){1}[0-9]{9}$/.test($("#number").val()))){
        alert("")
    } else {
        alert("请输入正确的QQ号");
    }
});
// 验证身份证号
$("#checkIdCard").off().on("blur",function(){
    if(($("#checkIdCard").val().length === 18) && (/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test($("#number").val()))){
        alert("请输入正确的身份证号")
    }else{
      alert("请输入正确的身份证号")
    }
});
//设定倒数秒数  
var t = 10;  
//显示倒数秒数  
function showTime(){  
    t -= 1;  
    t = $("#second").html();
    if(t==0){  
        location.href='http://www.baidu.com';  
    }  
    //每秒执行一次,showTime()  
    setTimeout("showTime()",1000);  
}  
var s = 10;  
//显示倒数秒数  
function showTimes(){  
    s -= 1;  
    s = $("#seconds").html();
    if(s==0){  
        location.href='http://www.baidu.com';  
    }  
    //每秒执行一次,showTime()  
    setTimeout("showTime()",1000);  
}  

// 审核状态
  // $('#userbox').on("click",function(){  
      $.ajax({  
          type: "GET",  
          url: "http://172.16.2.62:8099/h5/certificateState",  
          data: {token:$("#").val(),
                 userId:$("#").val(),
          },  
          dataType: "json",  
          success: function(data){  
              if(data.code == 0){//data.code的值这个是后端人员规定的。
                console.log("请求成功");
                  $("u-Authentication").hide();//认证页面
                  $("u-InTheReview").hide();//审核中
                  $("u-Approved").hide();//审核通过
                  $("u-AuditDidNotPass").hide();//审核不通过
                if(object.certificate_state == 1){
                  $("u-InTheReview").show();//审核中
                }else if(object.certificate_state == 2){
                  $("u-Approved").show();//审核通过
                  //执行showTime()  
                  showTime();
                }else if(object.certificate_state == 3){
                  $("u-AuditDidNotPass").show();//审核不通过
                  //执行showTimes()  
                  showTimes();
                }else {
                  if(object.is_first==0){
                    $("u-Authentication").show();//认证页面
                  }else if(object.is_first==1){
                    $("u-Authentication").hide();//认证页面
                  }
                 
                }  
              } else if (data.code == -2) {
                console.log("你没有权限，通常来讲，你是没有登录");
              } else if (data.code == -5) {
                console.log("参数错误哦。");     
              }else{
                  console.log(data.result);
              }    
          },
          error: function() {
              alert('通讯服务器错误');
          } 
      });  
  // }); 
})