$(function() {
    var checked = false;
    var UsubmitCheck=false;
    //我的资料的tab切换；
    $(".m-bottom a").on("click", function(e) {
        e.preventDefault();
        $(this).addClass("switch").siblings().removeClass("switch");
        $(".switch-content").hide().eq($(this).index()).show();
    })
    $(".m-bottom a:eq(0)").trigger("click");
    //我的资料对应的手机认证
    if(window.location.hash=="#m-change"){
        $("#m-change").trigger("click");
    }
    //我的资料对应的实名认证
    if(window.location.hash=="#m-realname"){
        $("#m-realname").trigger("click");
    }
    window.location.hash = "";
    // 我的道具弹出框
    $(".imgprops .u-props").off("click").on("click", function(e) {
        e.preventDefault();
        $(".m-layerMask").show();
    });
     $(".u-propsgtips a").off("click").on("click", function(e) {
        e.preventDefault();
        $(".m-layerMask").hide();
    });
    //我的消息中的div之间的切换
        $(".m-mainm a").on("click", function(e) {
            e.preventDefault();
            $(this).addClass("focuscurrent").siblings().removeClass("focuscurrent");
            $(".mcurrent").hide().eq($(this).index()).show();
        })
    $(".m-mainm a:eq(0)").trigger("click");
    // 我的消息页面的初始化
    //  $("#myMessageBox").on("click",function(){
    //     // e.preventDefault();
    //     // $("#initMessage").trigger("click");
    // });
    //我的消息－－关注消息的划入事件
    $(".u-foucscolor").on("mouseenter", function() { 
        $(".u-messnickname").show().css("top", $(this).position().top+'2px') 
    });
    $(".u-foucscolor").on("mouseleave", function() { 
        $(".u-messnickname").hide() 
    })       
    $("#cancel").off("click").on("click", function() {
            $(".u-topupwindow").hide();
    })
    //我要当主播的div之间的切换
    $(".m-mainh .u-top a").on("click", function(e) {
        e.preventDefault();
        $(this).addClass("switchcon").siblings().removeClass("switchcon");
        $(".switchcontent").hide().eq($(this).index()).show();
    })
    $(".m-mainh a:eq(0)").trigger("click");
    //我要当主播中的下级div的切换
    $(".u-certification .u-ctop a").on("click", function(e) {
        e.preventDefault();
         $(this).addClass("underline").siblings().removeClass("underline");
        $(".switchrepeat").hide().eq($(this).index()).show();
    })
    $(".u-certification .u-ctop a:eq(0)").trigger("click");
    // 我要当主播的如何直播下面的切换
        $(".u-live #u-liveAI a").on("click", function(e) {
        e.preventDefault();
         $(this).addClass("underline").siblings().removeClass("underline");
        $(".switchAI").hide().eq($(this).index()).show();
    })
    $(".u-live #u-liveAI a:eq(0)").trigger("click");
    // 修改昵称弹出框
    $("#nickname").on("click", function() {
         $(".m-layer").show();
    });
    $(".lybt .u-btn").on("click", function() {
        $(this).parents(".m-layer").hide();
    });
    // 全文显示
    $(".u-messtips").off().on("click",function(){
        $(".u-messagecontent").show();
    })
    //选中支付宝
    // $(".payimg.initShow").off("click").on("click",function(){$(".payimg .u-checked").hide();
    // $(".initShow").off("click").on("click",function(){$(".payimg .u-checked").hide();
    // $(".payimg .u-dischecked").show();$(this).find(".u-checked").show();$(this).find(".u-dischecked").hide();})
    //我要充值－－选中鱼币的样式
    $(".u-value div").on("click", function() {
        $(this).addClass("checktopup").siblings().removeClass("checktopup");
        window.checktopup=this;
        checked = true
    })
    //我要充值－－－点击充值出现弹框
    $("#topupvalue").off("click").on("click", function(e) {
        e.preventDefault();  
        if(checked){
            $(".u-wmtips").text($(window.checktopup).find(".u-vmoney").text().substr(0,$(window.checktopup).find(".u-vmoney").text().length-1));
            $(".u-topupwindow").show(); 
            $.ajax({
                method: "GET", //对于请求类型
                url: "/api/pay/recharge",
                dataType: 'json',
                data:{id:$(window.checktopup).attr("data-id")}, //这个是一个验证是否重名的接口。参数只有一个 名字
                success: function(data) {
                    if (data.code == 0) { //data.code的值这个是后端人员规定的。
                        console.log("请求成功");
                        $("#tovalue").attr("href","/alipay?id="+data.object);
                        $(".u-wn span:eq(1)").text(data.object);
                        // 隐藏订单号
                        $("#hiddenOrder").text("***********"); 
                        if (data.object == 1) { //1为重复
                            console.log("这个重复啦");
                        } else if (data.object == 0) {
                            console.log("这个不重复");
                        } else {
                            console.log("未知异常");
                        }
                    } else if (data.code == -2) {
                        console.log("你没有权限，通常来讲，你是没有登录");
                    } else if (data.code == -5) {
                        console.log("参数错误哦。");
                    } else {
                        console.log(data.result);
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            })
        }else{
            alert('请选择鱼币');
        }
    })
// 初始函数
var local={
    updatePasswordTag_current:false,
    updatePasswordTag_new:false,
    updatePasswordTag_confirm:false,
    iphoneAuth:false,
    // 分页的变量
    cur_page:1,
    cur_pageSize:5,
    cur_maxPage:1,
    cur_total:0,
    cur_pageCallback:null,
    cur_type:0,
    init : function(){
        local.eventBind();
        local.cur_type=0;
        local.newsList();
        local.followList();
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
        // $("#u-new").off().on("blur",function(){
        //     if($(this).val().length<=6){
        //         $("#u-new").parent().find("span").each(function(){
        //             if($(this).attr("class").indexOf("u-vpassword") != -1){
        //                 $(this).show();
        //             }else{
        //                 $(this).hide();
        //             }
        //         });
        //     }else{
        //         $("#u-new").parent().find("span").each(function(){
        //                 $(this).hide();
        //         });
        //     }
        //     if(local.updatePasswordTag_confirm==true){
        //         $("#u-confirm").trigger("blur")
        //     }
        // });
        // $("#u-confirm").off().on("blur",function(){
        //    local.updatePasswordTag_confirm=false;
        //    if($(this).val() === $("#u-new").val() && $(this).val()!=="" && $("#u-new").val()){
        //         local.updatePasswordTag_confirm=true;
        //         $("#u-confirm").parent().find("span").each(function(){
        //             if($(this).attr("class").indexOf("u-rightpassword") != -1){
        //                 $(this).show();
        //             }else{
        //                 $(this).hide();
        //             }
        //         });
        //     }else{
        //         $("#u-confirm").parent().find("span").each(function(){
        //             if($(this).attr("class").indexOf("u-failpassword") != -1){
        //                 $(this).show();
        //             }else{
        //                 $(this).hide();
        //             }
        //         });
        //     }
        // });
        // $("#send").off().on("click",function(){
        //     if(local.updatePasswordTag_current && local.updatePasswordTag_confirm){
        //         $.ajax({
        //             method: "GET",
        //             url: "/api/person-center/update-password",
        //             dataType: 'json',
        //             data: {
        //                 oldPassword:$("#u-current").val(),
        //                 password: $("#u-new").val()
        //             },
        //             success: function(data) {
        //                 if (data.code == 0) {
        //                     $(".m-psuccess").show();
        //                 }else if(data.code == 1){
        //                     alert("更新失败");//没找到你的弹窗
        //                 }else if(data.code == 2){
        //                     alert("密码错误");//没找到你的弹窗
        //                 }else{
        //                     console.log(data.result);
        //                 }
        //             },
        //             error: function(a, b, c) {
        //                 console.log("接口出问题啦");
        //             }
        //         })
        //     }
        // });
        // $(".m-psuccess").off().on("click",function(e){
        //     e.preventDefault();
        //     $(this).hide();
        //     window.location.href = window.location.href;
        // });
        // //我的资料－－－ 手机认证
        // function settime(time){
        //     var copySecond=$("#copySecond");
        //     if(time>0){
        //         time--;
        //         copySecond.text(time+"秒后重新获取");
        //         setTimeout(function(){
        //             settime(time)
        //         },1000);
        //     }else{
        //         $("#copySecond").hide();
        //         $("#gainnumber").show();
        //     }
        // }
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
            //     $("#verify").off().on("focus",function(){
            //         $(".u-verifyInput").hide();
            //         $(".u-verify").show();
            //         $("#verify").addClass("change-color");
            //         $(this).parent().find("span").each(function(){
            //                 $(this).hide();
            //         });
            //     });
            //     $("#verify").on("blur",function(){
            //         $("#verify").removeClass("change-color");
            //     });
            //     // 我要当主播的实名认证
            //     $(".u-cbottom").on("click",function(){
            //         if(""!==$("#hiddenField").html()){
            //             $("#jump").trigger("click");
            //         }else{
            //             $("#hostTel").trigger("click");
            //                 function settimes(time){
            //                     var copySeconds=$("#copySeconds");
            //                     if(time>0){
            //                         time--;
            //                         copySeconds.text(time+"秒后重新获取");
            //                             setTimeout(function(){
            //                                 settimes(time)
            //                             },1000);
            //                         }else{
            //                             $("#copySeconds").hide();
            //                             $("#gainnumbers").show();
            //                     }
            //                 }
            //                     $(".inputTel").off("keydown").on("keydown",function(e){
            //                         if((e.keyCode >=48 && e.keyCode <=57)||(e.keyCode >=97 && e.keyCode <=105)||(e.keyCode == 8)){
                                    
            //                         }else{
            //                             e.preventDefault();
            //                         }
            //                     })
            //                     $("#numbers").on("focus",function(){
            //                         $(".u-numberphones").hide();
            //                         $("#gainnumbers").show();
            //                         $(".u-numbertels").hide();
            //                         $("#numbers").addClass("change-color");
            //                     });
            //                     $("#numbers").on("blur",function(){
            //                         $("#numbers").removeClass("change-color");
            //                     });
            //                     $("#gainnumbers").off().on("click",function(){
            //                         if(($("#numbers").val().length === 11) && (/^(13|15|17|18){1}[0-9]{9}$/.test($("#numbers").val()))){
            //                             $("#numbers").removeClass("change-color");
            //                             $(".m-mask").show().find(".pic-code img").attr("src","/api/checkCode?phone="+$("#numbers").val() + '&phoneCache=' + new Date());
            //                         } else {
            //                              $("#gainnumbers").hide();
            //                              $(".u-numbertels").show();
            //                         }

            //                     });
            //                     $(".m-mask .changePic").off().on("click",function(e){
            //                         e.preventDefault();
            //                         $(".m-mask .pic-code img").attr("src","/api/checkCode?phone="+$("#numbers").val());
            //                     });
            //                     $(".m-mask .confirm").off().on("click",function(event){
            //                         event.preventDefault();
            //                         $.ajax({
            //                             method: "GET",
            //                             url: "/api/sendSMSCode",
            //                             dataType: 'json',
            //                             data: {
            //                                 imgCheckCode:$(".m-mask .m-input input").val(),
            //                                 mobile:$("#numbers").val(),
            //                             },
            //                             success: function(data) {
            //                                 if(data.code == 0){
            //                                     $(".m-mask").hide();
            //                                     $("#copySeconds").show();
            //                                     settimes(60);
            //                                 }else{
            //                                     $(".m-mask .changePic").trigger("click");
            //                                     alert(data.result);//这个先这样用，后台应该是文档写的有问题
            //                                 }
            //                             },
            //                             error: function(a, b, c) {
            //                                 console.log("接口出问题啦");
            //                             }
            //                         });
            //                     });
            //                     $(".m-mask .cancel").off().on("click",function(e){
            //                         e.preventDefault();
            //                         $(".m-mask").hide();
            //                     });
            //                     // 验证码
            //                     $("#userboxs").off().on("click",function(){
            //                         if($("#verifys").val()!="" && $("#numbers").val()!=""){
            //                             $.ajax({
            //                                 method: "GET",
            //                                 url: "/api/person-center/mobile-auth",
            //                                 dataType: 'json',
            //                                 data: {
            //                                     checkCode:$("#verifys").val(),
            //                                     mobile:$("#numbers").val(),
            //                                 },
            //                                 success: function(data) {
            //                                     if (data.code == 0) {
            //                                         alert("认证成功");//没找到你的弹框
            //                                         window.location.href=window.location.href;
            //                                     }else if(data.code == 1){
            //                                         alert("更新失败");//没找到你的弹窗
            //                                     }else if(data.code == 2){
            //                                         alert("手机号已被绑定");//没找到你的弹窗
            //                                     }else if(data.code == 3){
            //                                         alert("已绑定手机号");//没找到你的弹窗
            //                                         window.location.href=window.location.href;
            //                                     }else if(data.code == 4){
            //                                         $("#verifys").parent().find("span").each(function(){
            //                                             if($(this).attr("class").indexOf("error-tips") != -1){
            //                                                 $(this).show();
            //                                             }else{
            //                                                 $(this).hide();
            //                                             }
            //                                         });
            //                                     }else{
            //                                         console.log(data.result);
            //                                     }
            //                                 },
            //                                 error: function(a, b, c) {
            //                                     console.log("接口出问题啦");
            //                                 }
            //                             })
            //                         }
            //                     });
            //                     $("#verifys").off().on("focus",function(){
            //                         $(".u-verifyInputs").hide();
            //                         $(".u-verifys").show();
            //                         $("#verifys").addClass("change-color");
            //                         $(this).parent().find("span").each(function(){
            //                                 $(this).hide();
            //                         });
            //                     });
            //                     $("#verifys").on("blur",function(){
            //                         $("#verifys").removeClass("change-color");
            //                     });
            //         }
            //     });
            // // 修改昵称
            // $("#checktips").off().on("focus",function(){
            //     $(this).parent().find("span").each(function(){
            //         $(this).hide();
            //     });
            // });
            // $("#btnCan").off().on("click",function(e){
            //     e.preventDefault();
            //     // $("#u-btnCan").hide();
            //     $(this).parents(".m-layer").hide();
            // }
            }
        });
        // 修改密码提交的校验
        $("#send").off().on("click",function(){
            if(local.updatePasswordTag_current && local.updatePasswordTag_new &&local.updatePasswordTag_confirm){
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
        // 60秒定时器
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
        // 获取验证码的事件
        $("#gainnumber").off().on("click",function(){
            if(($("#number").val().length === 11) && (/^(13|15|17|18){1}[0-9]{9}$/.test($("#number").val()))){
                $("#number").removeClass("change-color");
                $(".m-mask").show().find(".pic-code img").attr("src","/api/checkCode?phone="+$("#number").val() + '&phoneCache=' + new Date());
            } else {
                 $("#gainnumber").hide();
                 $(".u-numbertel").show();
            }

        });
        // 验证码中的看不清，换一个的点击事件
        $(".m-mask .changePic").off().on("click",function(e){
            e.preventDefault();
            $(".m-mask .pic-code img").attr("src","/api/checkCode?phone="+$("#number").val());
        });
        // 验证码的整体确认的点击事件
        $(".m-mask .confirm").off().on("click",function(event){
            event.preventDefault();
            $.ajax({
                method: "GET",
                url: "/api/sendSMSCode",
                dataType: 'json',
                data: {
                    imgCheckCode:$(".m-mask .m-input input").val(),
                    mobile:$("#number").val(),
                },
                success: function(data) {
                    if(data.code == 0){
                        $(".m-mask").hide();
                        $("#copySecond").show();
                        settime(60);
                    }else{
                        $(".m-mask .changePic").trigger("click");
                        alert(data.result);//这个先这样用，后台应该是文档写的有问题
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
        });
        $(".m-mask .cancel").off().on("click",function(e){
            e.preventDefault();
            $(".m-mask").hide();
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
        // 我要当直播－如何直播下面的滑块实现
        $("#biulive").css({width:"220px",left:0,position:"absolute",height:"3px",background:"#cecfd2"})
        $("#u-liveAI a").on("click",function(e){
            $("#biulive").animate({left:$(this).position().left},300)
        })
        //我的资料手机认证－－修改手机号码弹框
        $("#modifyTel").on("click",function(){
            $("#telValBounced").show();
        }); 
        //我要当主播手机认证－－修改手机号码弹框
        $("#modifyTelVer").on("click",function(){
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
        $(".inputTel").off("keydown").on("keydown",function(e){
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
        $("#gainnumberTelVer").off().on("click",function(){
            if(($("#numberTelVer").val().length === 11) && (/^(13|15|17|18){1}[0-9]{9}$/.test($("#numberTelVer").val()))){
                $("#numberTelVer").removeClass("change-color");
                $("#telValBounced").hide();
                $(".m-mask").show().find(".pic-code img").attr("src","/api/checkCode?phone="+$("#numberTelVer").val() + '&phoneCache=' + new Date());
            } else {
                 $("#gainnumberTelVer").hide();
                 $(".u-numbertelTelVer").show();
            }

            // // 手机号中间隐藏
            // $("#hiddenField").text($("#hiddenField").text().substr(0,3)+"****"+$("#hiddenField").text().substr(7,4))   
            // $("#hiddenFields").text($("#hiddenFields").text().substr(0,3)+"****"+$("#hiddenFields").text().substr(7,4)) 
            // // 我要当直播的a的滑块
            // $("#biubiubiu").css({width:"60px",left:0,position:"absolute",height:"3px",background:"#cecfd2"})
            // $("#u-ctop a").on("click",function(e){
            //     $("#biubiubiu").animate({left:$(this).position().left},300)
            // })
            // // 修改手机号码弹框
            // $("#modifyTel").on("click",function(e){
            //     e.preventDefault();
            //     $("#telValBounced").show();
            // }); 
            // $("#modifyTelVer").on("click",function(e){
            //     e.preventDefault();
            //     $("#telValBounced").show();
            // }); 
            // $("#userboxTelCancel").on("click",function(){
            //     $("#telValBounced").hide();
            // }); 
            // function settime(time){
            //     var copySecondTelVer=$("#copySecondTelVer");
            //     if(time>0){
            //         time--;
            //         copySecondTelVer.text(time+"秒后重新获取");
            //             setTimeout(function(){
            //                 settime(time)
            //             },1000);
        });
        $(".m-mask .changePic").off().on("click",function(e){
            e.preventDefault();
            $(".m-mask .pic-code img").attr("src","/api/checkCode?phone="+$("#numberTelVer").val());
        });
        $(".m-mask .confirm").off().on("click",function(event){
            event.preventDefault();
            $.ajax({
                method: "GET",
                url: "/api/sendSMSCode",
                dataType: 'json',
                data: {
                    imgCheckCode:$(".m-mask .m-input input").val(),
                    mobile:$("#numberTelVer").val(),
                },
                success: function(data) {
                    if(data.code == 0){
                        $(".m-mask").hide();
                        $("#telValBounced").show();
                        $("#copySecondTelVer").show();
                        settime(60);
                    }else{
                        $(".m-mask .changePic").trigger("click");
                        alert(data.result);//这个先这样用，后台应该是文档写的有问题
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            });
        });
        $(".m-mask .cancel").off().on("click",function(e){
            e.preventDefault();
            $(".m-mask").hide();
        });
        // 验证码
        $("#userboxTelVer").off().on("click",function(){
            if($("#verifyTelVer").val()!="" && $("#numberTelVer").val()!=""){
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
                            // window.location.href=window.location.href;
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
        // 我的资料－认证
        // 实名认证
        // $(".u-div input").off("focus").on("focus",function(){$(this).addClass("change-color");});
        // $(".u-div input").off("blur").on("blur",function(){$(this).removeClass("change-color");});
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
                         url: 'http://172.16.2.62:8777/common/upload',
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
        // 按从上往下的顺序去提示错误信息
        $('#u-submit').on("click",function(e){  
            e.preventDefault();

            var UsubmitCheck=true;

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
                    showTip("名字过长");
                }else if($("#Qqnumber").val().length<5 && $("#Qqnumber").val().length>12){
                    UsubmitCheck=false;
                    showTip("QQ号位数错误");
                }else if((!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test($("#Idcard").val())) ){
                    UsubmitCheck=false;
                    showTip("身份证号错误");
                }
            }
            //实名认证；
            if(UsubmitCheck){
                $.ajax({  
                    type: "GET",  
                    url: "http://172.16.2.62:8777/person-center/realname-auth",  
                    data: {idCard:$("#idCard").val(),
                           idCardBackScan:$("#idCardBackScan").val(),
                           idCardDueDate:$("#idCardDueDate").val(),
                           idCardFrontScan:$("#idCardFrontScan").val(),
                           idCardHandScan:$("#idCardHandScan").val(),
                           qq:$("#Qqnumber"),
                           realname:$("#name")
                    },  
                    dataType: "json",  
                    success: function(data){  
                        if(data.code == 0){//data.code的值这个是后端人员规定的。
                            console.log("请求成功");
                            $("#userbox").attr('disabled',true).addClass("infogrey");
                            // infogrey:变灰
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
        // 日期插件
        $('#datetimepicker').datetimepicker({
              lang:"ch",           //语言选择中文
              format:"Y-m-d",      //格式化日期
              timepicker:false,    //关闭时间选项
              yearStart:2000,     //设置最小年份
             yearEnd:2050,        //设置最大年份
              todayButton:false    //关闭选择今天按钮
        });
        $.datetimepicker.setLocale('ch');
        // 设置等到当前日期之后的时间
        $('#datetimepicker').datetimepicker('setStartDAte',new Date().toLocaleDateString().replace(/\//g,"-"));
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
                         url: 'http://172.16.2.62:8777/common/upload',
                         type: 'POST',
                          data: data,
                          cache: false,
                          contentType: false, //不可缺参数
                            processData: false, //不可缺参数
                           success: function(data) {
                                // _this.parents('.u-addIcon').find('.img').css('background','none');
                                _this.parents('.u-addIcon').find('img').attr('src',data.object);
                            },
                           error: function() {
                                 console.log('error');
                           }
                    });
                }
            }
        });
        // 分页－－我的关注，我的消息
         $(".focushost a").on("click",function(e){
                e.preventDefault();
            })
             $(".prevBtn").off().on("click",function(event){
                event.preventDefault();
                local.cur_page--;
                if(local.cur_pageCallback == "news"){
                    local.cur_type=0;
                    local.newsList();
                }else{
                    local.cur_type=0;
                    local.followList();
                }
            })
            $(".nextBtn").off().on("click",function(event){
                event.preventDefault();
                local.cur_page++;
                if(local.cur_pageCallback == "news"){
                    local.cur_type=0;
                    local.newsList();
                }else{
                    local.cur_type=0;
                    local.followList();
                }
            })
            $("#myfocusclick").on("click",function(){
                local.Pagination(1,0,5,"follow");
                local.followList();
            })
            $("#mymessageclick").on("click",function(e){
                e.preventDefault();
                local.Pagination(1,0,5,"news");
                local.cur_type=0;
                // local.newsList();
            });
            $(".u-m-top a:eq(0)").on("click",function(e){
                e.preventDefault();
                local.Pagination(1,0,5,"news");
                local.cur_type=0;
                local.newsList();
            })
            $(".u-m-top a:eq(1)").on("click",function(e){
                e.preventDefault();
                local.Pagination(1,0,5,"news");
                local.cur_type=1;
                local.newsList();
            })
        },
        Pagination:function(_page,_total,_pageSize,callback){
            local.cur_page = _page || 1;
            local.cur_total = _total || 0;
            local.cur_pageSize = _pageSize || 5;
            local.cur_maxPage = (parseInt((local.cur_total+5)/ local.cur_pageSize)) || 1;
            local.cur_pageCallback=callback;
            var _total = (_total<5) ? 1 : (parseInt(_total/5));
            $(".totalPage").show().text(local.cur_page+"/"+ local.cur_total);

            $(".nextBtn").show();
            $(".prevBtn").show();
            if(local.cur_page==1){
                $(".prevBtn").hide();
            }
            if(local.cur_page==local.cur_maxPage){
                $(".nextBtn").hide();
            }
            if(local.cur_maxPage==1){
                $(".prevBtn").hide();
                $(".nextBtn").hide();
            }
            if( local.cur_total == 0 ){ $(".totalPage").hide()};
        },
        
        
    //     $(".focushost a").on("click",function(e){
    //         e.preventDefault();
    //     })
    //     $(".prevBtn").off().on("click",function(event){
    //         event.preventDefault();
    //         local.cur_page--;
    //         if(local.cur_pageCallback == "news"){
    //             local.cur_type=0;
    //             local.newsList();
    //         }else{
    //             local.cur_type=0;
    //             local.followList();
    //         }
    //     })
    //     $(".nextBtn").off().on("click",function(event){
    //         event.preventDefault();
    //         local.cur_page++;
    //         if(local.cur_pageCallback == "news"){
    //             local.cur_type=0;
    //             local.newsList();
    //         }else{
    //             local.cur_type=0;
    //             local.followList();
    //         }
    //     })
    //     $("#myfocusclick").on("click",function(){
    //         local.Pagination(1,0,5,"follow");
    //         local.followList();
    //     })
    //     $("#mymessageclick").on("click",function(){
    //         // e.preventDefault();
    //         local.Pagination(1,0,5,"news");
    //         local.cur_type=0;
    //         // local.newsList();
    //     });
    //     $(".u-m-top a:eq(0)").on("click",function(e){
    //         e.preventDefault();
    //         local.Pagination(1,0,5,"news");
    //         local.cur_type=0;
    //         local.newsList();
    //     })
    //     $(".u-m-top a:eq(1)").on("click",function(e){
    //         e.preventDefault();
    //         local.Pagination(1,0,5,"news");
    //         local.cur_type=1;
    //         local.newsList();
    //     })
    // },
        // 分页插件
        // Pagination:function(_page,_total,_pageSize,callback){
        //     local.cur_page = _page || 1;
        //     local.cur_total = _total || 0;
        //     local.cur_pageSize = _pageSize || 5;
        //     local.cur_maxPage = Math.ceil(local.cur_total / local.cur_pageSize)
        //     local.cur_pageCallback=callback;


        //     $(".totalPage").show().text(local.cur_page + "/"+ local.cur_maxPage);

            
        //     if(local.cur_page == 1){
        //         $(".prevBtn").hide();
        //     }else{
        //         $(".prevBtn").show();
        //     }
        //     if(local.cur_page == local.cur_maxPage){
        //         $(".nextBtn").hide();
        //     }else{
        //         $(".nextBtn").show();
        //     }

        //     if(local.cur_maxPage <= 1){
        //         $(".prevBtn").hide();
        //         $(".nextBtn").hide();
        //     }
        //     if(local.cur_total == 0 ){
        //         $(".totalPage").hide()
        //     };
        // },
        // 我的关注页面的事件处理
        followList:function(){
            $.ajax({
                method: "GET",
                url: "/api/person-center/my-concern",
                dataType: 'json',
                data: {
                    page: local.cur_page,
                    pageSize: local.cur_pageSize,
                }, 
                success: function(data) {
                    console.log(data);
                    if (data.code == 0) {
                        if(data.object.list.length>0){
                            var str = "";
                            for (index in data.object.list) {
                                if(data.object.list[index].state == 1){
                                    str +='<div class="u-host"><div class="u-hleft"><div class="u-focusimg">'+
                                        '<img src="http://img.wangyuhudong.com/' + data.object.list[index].icon + '">'+
                                        '</div><div class="u-nickhost"><p class="u-nicksex">'+
                                        '<span>' + data.object.list[index].nickname + '</span>'+
                                        '<img src="' + (data.object.list[index].sex==0?"/images/male.png":"/images/female.png") + '">'+
                                        '</p><div class="u-hostfans"><p><span class="u-hf">直播间ID</span>&nbsp;'+
                                        '<span class="u-num">' + data.object.list[index].room_number + '</span>'+
                                        '</p><p class="u-hhf"><span class="u-hf">粉丝</span>&nbsp;'+
                                        '<span class="u-num">' + data.object.list[index].fans + '</span>'+
                                        '</p></div></div></div><div class="u-hright">'+
                                        '<a href="/liveroom?live_id=' + data.object.list[index].live_id+'">进入房间</a>'+
                                        '</div></div>'
                                }else{
                                     str +='<div class="u-host"><div class="u-hleft"><div class="u-focusimg">'+
                                        '<img src="http://img.wangyuhudong.com/' + data.object.list[index].icon + '">'+
                                        '</div><div class="u-nickhost"><p class="u-nicksex">'+
                                        '<span>' + data.object.list[index].nickname + '</span>'+
                                        '<img src="' + (data.object.list[index].sex==0?"/images/male.png":"/images/female.png") + '">'+
                                        '</p><div class="u-hostfans"><p><span class="u-hf">直播间ID</span>&nbsp;'+
                                        '<span class="u-num">' + data.object.list[index].room_number + '</span>'+
                                        '</p><p class="u-hhf"><span class="u-hf">粉丝</span>&nbsp;'+
                                        '<span class="u-num">' + data.object.list[index].fans + '</span>'+
                                        '</p></div></div></div><div class="u-hright">'+
                                        '<a href="" id="haveBeenOffline">已经离线</a>'+
                                        '</div></div>'
                                }
                            }
                            $(".u-host").remove();
                            $(".empty").hide();
                            $(".emptyText").hide();
                            $(".focushost").html($(".focushost").html()+str);
                            local.Pagination(local.cur_page,data.object.total,local.cur_pageSize,"follow");
                        }else{
                            $(".u-host").remove();
                            $(".empty").show();
                            $(".emptyText").show();
                        }                  
                    } else {
                        console.log(data.result);
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            })
        },
        // 我的消息的页面的事件处理
        newsList:function(){
            $.ajax({
                method: "GET",
                url: "/api/person-center/my-msg",
                dataType: 'json',
                data: {
                    page: local.cur_page,
                    pageSize: local.cur_pageSize,
                    type:local.cur_type,
                }, 
                success: function(data) {
                    if (data.code == 0) {
                        if(data.object.list.length>0){
                            // console.log(data.object.list.length);
                            $(".empty").hide();
                            $(".emptyText").hide();
                            if(local.cur_type == 0){
                                var str = "";
                                for (index in data.object.list) {
                                    str+='<div class="u-message"><div class="u-msystem">'+
                                        '<img src="/images/messagehead.png">'+
                                        '</div><div class="u-yuer"><p>'+
                                        '<h3>'+data.object.list[index].title+'</h3>'+
                                        '<span class="u-messagetime">'+data.object.list[index].create_date+'</span>'+
                                        '<p><p>'+
                                        '<span class="u-messagecontent">'+data.object.list[index].content+'</span>'+
                                        '<span class="u-messtips" id="messshow">全文&gt;&gt;</span>'+
                                        '</p></div></div>';
                                }
                                $(".u-message").remove();
                                $(".messageBox").html($(".messageBox").html()+str).show();
                            }else{
                                var str = "";
                                for (index in data.object.list) {
                                    str+='<div class="u-focusmess"><p class="u-focusnc">'+
                                        '<span class="u-foucscolor">'+data.object.list[index].nickname+'</span>'+
                                        '<span class="u-focusc">关注了你</span></p>'+
                                        '<span class="u-focustime">'+data.object.list[index].create_date+'</span>'+
                                        '</div><div class="u-messnickname">'+
                                        '<img src="'+data.object.list[index].icon+'"><img src="'+data.object.list[index].sex+'" class="messimgsex">'+
                                        '<p class="u-mkname">'+data.object.list[index].nickname+'</p>'+
                                        '<p><span>ID：</span><span>'+data.object.list[index].user_id+'</span></p></div>';
                                }
                                $(".u-focusmess").remove();
                                $(".focusmessage").show().html($(".focusmessage").html()+str);
                            }
                            
                            local.Pagination(local.cur_page,data.object.total,local.cur_pageSize,"follow");      
                        }else{
                            // console.log(local.cur_type);
                            // $(".u-message").remove();
                            // $(".u-focusmess").remove();
                            $(".messageBox").hide();
                            // $(".focusmessage").hide();
                            $(".empty").show();
                            $(".emptyText").show();
                        }             
                    } else {
                        console.log(data.result);
                    }
                },
                error: function(a, b, c) {
                    console.log("接口出问题啦");
                }
            })
        }
    };
    local.init();
    // cookie
    function delCookie($name){    
            var myDate=new Date();    
            myDate.setTime(-1000);//设置时间    
            document.cookie=$name+"=''; expires="+myDate.toGMTString();                
    } 
    // 登出
    $('.logout').click(function(e){
        e.preventDefault();
        delCookie('yuer_userId');
        delCookie('yuer_token');
        localStorage.clear();
        window.location.href = "/";
    }) 
});
// ;(function(window,$,undefined){

// })(window,jQuery);