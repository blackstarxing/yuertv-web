$(function() {
    var checked = false;
    // 全文显示
    $(".u-messtips").off().on("click",function(){
        $(".u-messagecontent").show();
    })
    // 设置等到当前日期之后的时间
    $('#datetimepicker').datetimepicker('setStartDAte',new Date().toLocaleDateString().replace(/\//g,"-"));
// 初始函数
var local={
    updatePasswordTag_current:false,
    updatePasswordTag_new:false,
    updatePasswordTag_confirm:false,
    iphoneAuth:false,
    init : function(){
        local.eventBind();
    },
    eventBind : function(){ 
        // 我的资料－修改密码
        // 当前密码的校验
        $("#u-current").off().on("blur",function(){
            local.updatePasswordTag_current=false;
            $("#u-current").parent().find("span").each(function(){
                if($(this).attr("class").indexOf("u-verifypassword") != -1 ){
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
            if( $("#u-current").val().length == 0 ){
                $("#u-current").parent().find("span").each(function(){
                    if($(this).attr("class").indexOf("PleaseEnterThePassword") != -1 ){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                });
            }else{
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/is-password-right",
                    dataType: 'json',
                    data: {
                        password: $("#u-current").val()
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            local.updatePasswordTag_current=true;
                            $("#u-current").parent().find("span").each(function(){
                                if($(this).attr("class").indexOf("u-rightpassword") != -1){
                                    $(this).show();
                                }else{
                                    $(this).hide();
                                }
                            });
                        }else if(data.code == 2){
                            $("#u-current").parent().find("span").each(function(){
                                if($(this).attr("class").indexOf("u-failpassword") != -1){
                                    $(this).show();
                                }else{
                                    $(this).hide();
                                }
                            });
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                })
            }
        });   
        // 新密码字段的校验  
        $("#u-new").off().on("blur",function(){
            if($(this).val().length<=6){
                $("#u-new").parent().find("span").each(function(){
                    if($(this).attr("class").indexOf("u-vpassword") != -1){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                });
            }else{
                $("#u-new").parent().find("span").each(function(){
                        $(this).hide();
                });
            }
            if(local.updatePasswordTag_confirm==true){
                $("#u-confirm").trigger("blur")
            }
        });
        // 确认新密码的校验
        $("#u-confirm").off().on("blur",function(){
           local.updatePasswordTag_confirm=false;
           if($(this).val() === $("#u-new").val() && $(this).val()!=="" && $("#u-new").val()){
                local.updatePasswordTag_confirm=true;
                $("#u-confirm").parent().find("span").each(function(){
                    if($(this).attr("class").indexOf("u-rightpassword") != -1){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                });
            }else{
                $("#u-confirm").parent().find("span").each(function(){
                    if($(this).attr("class").indexOf("u-failpassword") != -1){
                        $(this).show();
                    }else{
                        $(this).hide();
                    }
                });
            }
        });
        // 修改密码提交的校验
        $("#send").off().on("click",function(){
            if(local.updatePasswordTag_current && local.updatePasswordTag_new){
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/update-password",
                    dataType: 'json',
                    data: {
                        oldPassword:$("#u-current").val(),
                        password: $("#u-new").val()
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            $(".m-psuccess").show();
                        }else if(data.code == 1){
                            alert("更新失败");//没找到你的弹窗
                        }else if(data.code == 2){
                            alert("密码错误");//没找到你的弹窗
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                })
            }
        });
        // 修改密码成功的提示框
        $(".m-psuccess").off().on("click",function(e){
            e.preventDefault();
            $(this).hide();
            window.location.href = window.location.href;
        });
        //我的资料－－－ 手机认证
        //60秒定时器
        function settime(time){
            var copySecond=$("#copySecond");
            if(time>0){
                time--;
                copySecond.text(time+"秒后重新获取");
                    setTimeout(function(){
                        settime(time)
                    },1000);
            }else{
                $("#copySecond").hide();
                $("#gainnumber").show();
            }
        }
        // 确保输入框纯数字
        $(".inputTel").off("keydown").on("keydown",function(e){
            if((e.keyCode >=48 && e.keyCode <=57)||(e.keyCode >=97 && e.keyCode <=105)||(e.keyCode == 8)){
            
            }else{
                e.preventDefault();
            }
        })
        // 手机号码的校验
        $("#number").on("focus",function(){
            $(".u-numberphone").hide();
            $("#gainnumber").show();
            $(".u-numbertel").hide();
            $("#number").addClass("change-color");
        });
        $("#number").on("blur",function(){
            $("#number").removeClass("change-color");
        });
        // 验证码的整体确认的点击事件
        $("#gainnumber").off().on("click",function(event){
            event.preventDefault();
            if(($("#number").val().length === 11) && (/^(13|15|17|18){1}[0-9]{9}$/.test($("#number").val()))){
                $("#number").removeClass("change-color");
            } else {
                 $("#gainnumber").hide();
                 $(".u-numbertel").show();
            }
            $.ajax({
                method: "GET",
                url: "/api/sendSMSCode",
                dataType: 'json',
                data: {
                    mobile:$("#number").val(),
                    type:1,
                },
                success: function(data) {
                    if(data.code == 0){
                        $("#copySecond").show();
                        settime(60);
                    }else{
                        alert(data.result);//这个先这样用，后台应该是文档写的有问题
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
        });
        // 验证码字段的校验
        $("#userbox").off().on("click",function(){
            if($("#verify").val()!="" && $("#number").val()!=""){
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/mobile-auth",
                    dataType: 'json',
                    data: {
                        checkCode:$("#verify").val(),
                        mobile:$("#number").val(),
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            alert("认证成功");//没找到你的弹框
                            window.location.href=window.location.href;
                        }else if(data.code == 1){
                            alert("更新失败");//没找到你的弹窗
                        }else if(data.code == 2){
                            alert("手机号已被绑定");//没找到你的弹窗
                        }else if(data.code == 3){
                            alert("已绑定手机号");//没找到你的弹窗
                            window.location.href=window.location.href;
                        }else if(data.code == 4){
                            $("#verify").parent().find("span").each(function(){
                                if($(this).attr("class").indexOf("error-tip") != -1){
                                    $(this).show();
                                }else{
                                    $(this).hide();
                                }
                            });
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                })
            }
        });
        // 验证码字段的提示信息
        $("#verify").off().on("focus",function(){
            $(".u-verifyInput").hide();
            $(".u-verify").show();
            $("#verify").addClass("change-color");
            $(this).parent().find("span").each(function(){
                    $(this).hide();
            });
        });
        $("#verify").on("blur",function(){
            $("#verify").removeClass("change-color");
        });
        // 我要当主播的实名认证
        $(".u-cbottom").on("click",function(){
            if(""!==$("#hiddenField").html()){
                $("#jump").trigger("click");
            }else{
            }
        });
        // 修改昵称
        $("#checktips").off().on("focus",function(){
                $(this).parent().find("span").each(function(){
                    $(this).hide();
                });
        });
        // 修改昵称的取消事件
        $("#btnCan").off().on("click",function(e){
                e.preventDefault();
                // $("#u-btnCan").hide();
                $(this).parents(".m-layer").hide();
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
        $(".lybt button.u-confirm").off().on("click",function(){
            if(strlen($("#checktips").val())>=1 && strlen($("#checktips").val())<=16){
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/update-nickname",
                    dataType: 'json',
                    data: {
                        nickname:$("#checktips").val()
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            alert("昵称修改成功");//没找到弹框
                        }else if(data.code == 1){
                            alert("更新失败");//没找到弹窗
                        }else if(data.code == 2){
                            $("#retips").show();
                        }else if(data.code == 3){
                            alert("昵称只能免费修改一次");//没找到弹窗
                        }else{
                            console.log(data.result);  
                        }
                        window.location.href=window.location.href;
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                })
            }else{
                alert("请输入6-20位的中英文，数字，下划线");
            }
        })
        // 手机号中间隐藏（我的资料手机认证，我要当主播手机认证）
        $("#hiddenField").text($("#hiddenField").text().substr(0,3)+"****"+$("#hiddenField").text().substr(7,4))   
        $("#hiddenFields").text($("#hiddenFields").text().substr(0,3)+"****"+$("#hiddenFields").text().substr(7,4)) 
        // 身份证号的隐藏
        $("#hiddenIdCard").text($("#hiddenIdCard").text().substr(0,3)+"************"+$("#hiddenIdCard").text().substr(7,4))
        // 支付宝账号的隐藏
        $(".payzfbtip").text($(".payzfbtip").text().substr(0,3)+"*****"+$(".payzfbtip").text().substr(7,4))
        //我的资料手机认证－－修改手机号码弹框
        $("#modifyTel").on("click",function(){
            $("#telValBounced").show();
        }); 
        // 修改手机号码弹框的取消事件
        $("#userboxTelCancel").on("click",function(){
            $("#telValBounced").hide();
        }); 
        // 修改手机号码的弹框事件
        function settime(time){
            var copySecondTelVer=$("#copySecondTelVer");
            if(time>0){
                time--;
                copySecondTelVer.text(time+"秒后重新获取");
                    setTimeout(function(){
                        settime(time)
                    },1000);
                }else{
                    $("#copySecondTelVer").hide();
                    $("#gainnumberTelVer").show();
            }
        }
        // 手机号码和修改手机号码的的验证
        $(".inputTel,#numberTelVer").off("keydown").on("keydown",function(e){
            if((e.keyCode >=48 && e.keyCode <=57)||(e.keyCode >=97 && e.keyCode <=105)||(e.keyCode == 8)){
            
            }else{
                e.preventDefault();
            }
        })
        $("#numberTelVer").on("focus",function(){
            $(".u-numberphoneTelVer").hide();
            $("#gainnumberTelVer").show();
            $(".u-numbertelTelVer").hide();
            $("#numberTelVer").addClass("change-color");
        });
        $("#numberTelVer").on("blur",function(){
            $("#numberTelVer").removeClass("change-color");
        });
        $("#gainnumberTelVer").off().on("click",function(event){
             if(($("#numberTelVer").val().length === 11) && (/^(13|15|17|18){1}[0-9]{9}$/.test($("#numberTelVer").val()))){
                $("#numberTelVer").removeClass("change-color");
                $("#telValBounced").hide();
            } else {
                 $("#gainnumberTelVer").hide();
                 $(".u-numbertelTelVer").show();//请输入正确的手机号
            }
            event.preventDefault();
            $.ajax({
                method: "GET",
                url: "/api/sendSMSCode",
                dataType: 'json',
                data: {
                    mobile:$("#numberTelVer").val(),
                    type:1,
                },
                success: function(data) {
                    if(data.code == 0){
                        $("#telValBounced").show();
                        $("#copySecondTelVer").show();
                        settime(60);
                    }else{
                        alert(data.result);//这个先这样用，后台应该是文档写的有问题
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
        });
        // 验证码
        $("#userboxTelVer").off().on("click",function(){
            // 判断号码不为空，且和数据库的手机号码不重复
            if($("#numberTelVer").val()!="" && $("#verifyTelVer").val()!=""){
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/mobile-auth",
                    dataType: 'json',
                    data: {
                        checkCode:$("#verifyTelVer").val(),
                        mobile:$("#numberTelVer").val(),
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            alert("修改成功");//没找到你的弹框
                            $("#telValBounced").hide();
                            window.location.href=window.location.href;
                        }else if(data.code == 1){
                            alert("更新失败");//没找到你的弹窗
                        }else if(data.code == 2){
                            alert("手机号已被绑定");//没找到你的弹窗
                        }else if(data.code == 3){
                            alert("已绑定手机号");//没找到你的弹窗
                            window.location.href=window.location.href;
                        }else if(data.code == 4){
                            $("#verifyTelVer").parent().find("span").each(function(){
                                if($(this).attr("class").indexOf("error-tipTelVer") != -1){
                                    $(this).show();
                                }else{
                                    $(this).hide();
                                }
                            });
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                })
            }
        });
        $("#verifyTelVer").off().on("focus",function(){
            $(".u-verifyInputTelVer").hide();
            $(".u-verifyTelVer").show();
            $("#verifyTelVer").addClass("change-color");
            $(this).parent().find("span").each(function(){
                    $(this).hide();
            });
        });
        $("#verifyTelVer").on("blur",function(){
            $("#verifyTelVer").removeClass("change-color");
        });
        // 我的资料－－实名认证
        // 实名认证的审核状态
        var Iscardmodify;
        $("#m-realname").on("click",function(){
                $.ajax({  
                type: "GET",  
                url: "/api/person-center/certificateState",  
                data: {},  
                dataType: "json",  
                success: function(data){ 
                Iscardmodify=data.object.code; 
                    if(data.code == 0){
                        console.log("请求成功");
                        if(data.object.code == 1){
                            // 审核中
                            $(".switchshowcard").hide();
                            $("cardreviewing").show();
                        }else if(data.object.code == 2){
                            // 审核通过
                            $(".switchshowcard").hide();
                            $(".idcardtwomodify").show();
                        }else if(data.object.code == 3){
                            //审核不通过
                            $(".switchshowcard").hide();
                            $(".idcardtwomodify").hide();
                            $(".cardreviewingfailure").show();
                        }else{
                            $(".switchshowcard").show();
                            $(".idcardtwomodify").hide();
                        }    
                    }else{
                        console(data.result); 
                    }    
                },
                error: function() {
                    console.log('连接失败，请检查您的网络设置后重试');
                } 
            });
        })
        $("#wingfailure").on("click",function(){
            $(".switchshowcard").show();
        })
        // 字段验证不为空
        $(".nameuserbox").on("blur",function(){
            if($(".nameuserbox").val()==''){
                $(".namefieldempty").show();
            }else{
                $(".namefieldempty").hide();
            }
        })
        $(".qquserbox").on("blur",function(){
            if($(".qquserbox").val()==''){
                $(".qqfieldempty").show();
            }else{
                $(".qqfieldempty").hide();
            }
        })
        $(".idcarduserbox").on("blur",function(){
            if($("idcarduserbox").val()==''){
                $(".cardfieldempty").show();
            }else{
                $(".cardfieldempty").hide();
            }
        })
        $(".timeuserbox").on("blur",function(){
            if($(".timeuserbox").val()==''){
                $(".timefieldempty").show();
            }else{
                $(".timefieldempty").hide();
            }
        })
        $('.fileupload').change(function(event) {
            var _this = $(this);
            var fileName = $(this).val();
            if ($('.fileupload').val().length) {
                var fileName = $('.fileupload').val();
                var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
                if (extension == ".jpg" || extension == ".png") {
                    var data = new FormData();
                    data.append('upload', $(this)[0].files[0]);
                    $.ajax({
                         url: '/api/common/upload',
                         type: 'POST',
                          data: data,
                          cache: false,
                          contentType: false, //不可缺参数
                            processData: false, //不可缺参数
                           success: function(data) {
                                _this.parents('.u-card').find('.img').css('background','none');
                                _this.parents('.u-card').find('.img img').attr('src',data.object);
                            },
                           error: function() {
                                 console.log('error');
                           }
                    });
                }
            }
        });
        // 验证qq号只能输入数字
        $("#Qqnumber").off("keydown").on("keydown",function(e){
            if((e.keyCode >=48 && e.keyCode <=57)||(e.keyCode >=97 && e.keyCode <=105)||(e.keyCode == 8)){
            
            }else{
                e.preventDefault();
            }
        })
        // 身份证到期时间
        var currTime = new Date();
        // var currentTime = currTime.getFullYear()+ "年"+ month + "月" + currTime.getDate()+ "日 "+"星期"+day+" "+currTime.getHours()+ ":"+ time.getMinutes() + ":" +time.getSeconds();
        // document.write(currentTime);
        // if($("#u-finaltime").val()>currentTime){
        //     alert("请输入当前日期之后的有效日期");
        // }
        // 实名认证的错误提示
        function showTip(text){
        $('.tip').text(text).fadeIn();
        setTimeout(function(){
            $('.tip').fadeOut();
        },1500);
        }
        if($("#name").val()==null || $("#Qqnumber").val()==null || $("#Idcard").val()==null || $("#datetimepicker").val()==null || $("#fileToUpload1").val()==null || $("#fileToUpload2").val()==null || $("#fileToUpload3").val()==null){
            $("#carduserbox").attr('disabled',true).addClass("infogrey");
        }else{
            $("#carduserbox").attr('disabled',false).removeClass("infogrey");
        }
        // 按从上往下的顺序去提示错误信息
        $('#carduserbox').on("click",function(e){  
            e.preventDefault();
            console.log(123);
            var UsubmitCheck=true;
            // for(var i=0; i<=$(".switchshowcard input").length;i++){
            //     if(!$(".switchshowcard input").eq(i).val()){
            //         // showTip($(this).attr("name"));
            //         // UsubmitCheck=false;
                    
            //          $(".switchshowcard input").eq(i).focus();
            //          return false;
            //      }
            // }
            console.log(123);
            $(".switch-conCard input").each(function(){
                if(!$(this).val()){
                    showTip($(this).attr("name"));
                    UsubmitCheck=false;
                    // return false;
                     $(this).focus();
                }
            });
            // 姓名，QQ，身份证号的验证    
            if($("#name").val() && $("#Qqnumber").val() && $("#Idcard").val()){
                if($("#name").val().length>9){
                    UsubmitCheck=false;
                    $(".namemodify").show();
                }else if($("#Qqnumber").val().length<5 && $("#Qqnumber").val().length>12){
                    UsubmitCheck=false;
                    $(".qqmodify").show();
                }else if((!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test($("#Idcard").val())) ){
                    UsubmitCheck=false;
                    $(".idcardmodify").show();
                }
            }
            console.log(123);
            //实名认证；
            if(Iscardmodify==1){
                console.log("Iscardmodify");
                if(UsubmitCheck){
                    $.ajax({  
                        type: "GET",  
                        url: "/api/person-center/upCertificate4Web",  
                        data: {
                                idCard:$("#Idcard").val(),
                               idCardBackScan:$("#idCardBackScan3").attr('src'),
                               idCardDueDate:$("#datetimepicker").val(),
                               idCardFrontScan:$("#idCardFrontScan2").attr('src'),
                               idCardHandScan:$("#idCardHandScan1").attr('src'),
                               qq:$("#Qqnumber").val(),
                               realname:$("#name").val()
                        },   
                        success: function(data){  
                        console.log(data); 
                            if(data.code == 0){
                                console.log("接口请求成功");
                                if (data.object.code == 0) {
                                    alert("请求成功");
                                    // 审核中
                                    $(".switchshowcard").hide();
                                    $(".cardreviewing").show();
                               }else if(data.object.code == 1){
                                    alert("您目前还不是主播，不能成为认证主播；");//没找到你的弹窗
                                }else if(data.object.code == 2){
                                    // 审核通过
                                    $(".switchshowcard").hide();
                                    $(".idcardtwomodify").show();
                                }
                            }else{
                                console.log(data.result);
                            }
                        },
                        error: function() {
                            alert('通讯服务器错误');
                        } 
                    });  
                }
            }else{
                $.ajax({  
                    type: "GET",  
                    url: "/api/person-center/modifyCertificate",  
                    data: {},   
                    success: function(data){  
                    console.log(data); 
                        if(data.code == 0){
                            console.log("接口请求成功");
                            if (data.object.code == 0) {
                                alert("修改成功");
                                // 审核中
                                $(".switchshowcard").hide();
                                $(".cardreviewing").show();
                           }else if(data.object.code == 1){
                                alert("修改认证您目前还不是主播，不能成为认证主播；");//没找到你的弹窗
                            }else if(data.object.code == 2){
                                // 审核通过
                                alert("没有要修改的信息");
                                $(".switchshowcard").hide();
                                $(".idcardtwomodify").show();
                            }
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function() {
                        alert('通讯服务器错误');
                    } 
                }); 
            }

        });  

        // 修改认证信息
        $("#idcardtwomodifys").on("click",function(){
            console.log(1);
            $(".switchshowcard").show();
            $(".idcardtwomodify").hide();
        })

        $("#clickjump").on("click",function(){
            window.location.href="/service";
        })
        // 修改头像的实现
        $('#modifyPic').change(function(event) {
            var _this = $(this);
            var fileNames = $(this).val();
            if ($('#modifyPic').val().length) {
                var fileNames = $('#modifyPic').val();
                var extension = fileNames.substring(fileNames.lastIndexOf('.'), fileNames.length).toLowerCase();
                if (extension == ".jpg" || extension == ".png") {
                    var data = new FormData();
                    data.append('upload', $(this)[0].files[0]);
                    $.ajax({
                         url: 'http://yuerwebapi.wangyuhudong.com/common/upload',
                         type: 'POST',
                          data: data,
                          cache: false,
                          contentType: false, //不可缺参数
                            processData: false, //不可缺参数
                           success: function(data) {
                                console.log(data);
                                var icon = data.object;//顶部的头像显示
                                _this.parents('.u-addIcon').find('img').attr('src',icon);
                                $.ajax({
                                    url: '/api/person-center/update-head-icon',
                                    type: 'get',
                                    data: {
                                            headIcon:data.object,
                                    },
                                    success: function(data) {
                                        console.log(data);
                                        if(data.code == 0){
                                            console.log("上传成功");
                                            window.localStorage.setItem("avatar", icon);
                                            window.location.href = window.location.href;
                                        }else{
                                                console.log(data.result);
                                        }
                                    },
                                    error: function() {
                                            console.log('error');
                                    }
                                });
                            },
                           error: function() {
                                 console.log('error');
                           }
                    }); 
                }
            }  
        });
        // 绑定支付宝
        $("#realName").on("blur",function(){
            if($("#realName").val()==''){
                $(".paynametip").show();
            }else{
                $(".paynametip").hide();
            }
        })
        $("#payaccount").on("blur",function(){
            if($("#payaccount").val()==''){
                $(".paycounttip").show();
            }else{
                $(".paycounttip").hide();
            }
        })
        $("#userboxPay").off().on("click",function(){
            if($("#realName").val()!="" && $("#payaccount").val()!=""){
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/alipay-bind",
                    dataType: 'json',
                    data: {
                        alipayNickname:$("#realName").val(),
                        alipayAccount:$("#payaccount").val(),
                    },
                    success: function(data) {
                        console.log(data);
                        if (data.code == 0) {
                            $(".submitmask").show();
                            // window.location.href=window.location.href;
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                })
            }
        });
        // 提交成功的支付宝的弹框
        $(".u-submitcancel a").off().on("click",function(e){
            e.preventDefault();
            $(this).hide();
            window.location.href = window.location.href;
        });
        // 修改支付宝的弹框
          $("#payname").on("blur",function(){
            if($("#payname").val()==''){
                $(".paynametips").show();
            }else{
                $(".paynametips").hide();
            }
        })
        $("#paynumber").on("blur",function(){
            if($("#paynumber").val()==''){
                $(".paycounttips").show();
            }else{
                $(".paycounttips").hide();
            }
        })
        $("#payzfbmodify").on("click",function(){
            $("#paytips").show();
        })
        $("#payboxcel").on("click",function(){
            $("#paytips").hide();
        })
        $("#paybox").off().on("click",function(){
            if($("#payname").val()!="" && $("#paynumber").val()!=""){
                $.ajax({
                    method: "GET",
                    url: "/api/person-center/alipay-bind",
                    dataType: 'json',
                    data: {
                        alipayNickname:$("#payname").val(),
                        alipayAccount:$("#paynumber").val(),
                    },
                    success: function(data) {
                        if (data.object.code == 0) {
                            $(".m-psuccess").show();//没找到你的弹框
                            window.location.href=window.location.href;
                        }else if(data.object.code == 1){
                            alert("更新失败");//没找到你的弹窗
                        }else if(data.object.code == 2){
                            alert("支付宝号已被绑定");//没找到你的弹窗
                        }else{
                            console.log(data.result);
                        }
                    },
                    error: function(a, b, c) {
                        console.log("接口出问题啦");
                    }
                })
            }
        });
        // 修改成功的支付宝的弹框
        $(".u-cancel a").off().on("click",function(e){
            e.preventDefault();
            $(this).hide();
            window.location.href = window.location.href;
        });
    },
    };
    local.init();
});
