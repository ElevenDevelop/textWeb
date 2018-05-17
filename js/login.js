$(function () {
    $(".content .con_right .right").click(function (e) {
        $(this).css({"color": "#333333", "border-bottom": "2px solid #2e558e"});
        $(".content .con_right .left").css({"color": "#999999", "border-bottom": "2px solid #dedede"});
        $(".content .con_right ul .con_r_right").css("display", "block");
        $(".content .con_right ul .con_r_left").css("display", "none");
    });
    $(".content .con_right .left").click(function (e) {
        $(this).css({"color": "#333333", "border-bottom": "2px solid #2e558e"});
        $(".content .con_right .right").css({"color": "#999999", "border-bottom": "2px solid #dedede"});
        $(".content .con_right ul .con_r_left").css("display", "block");
        $(".content .con_right ul .con_r_right").css("display", "none");
    });
})

//登录
function login() {
    if ($.trim($('#userid').val()) == '') {
        $("#mesguser").css({"display":"block"});
        return false;
    } else if ($.trim($('#pwd').val()) == '') {
        $("#mesgpwd").css({"display":"block"});
        return false;
    } else {
        $("#mesguser").css({"display":"none"});
        $("#mesgpwd").css({"display":"none"});
        var name = $("#userid").val();
        var password = $("#pwd").val();
        var postData = {
            username: name,
            userpassword: password,
        };
        $("#btn_Login").attr({"disabled":"disabled"});
        $("#btn_Login").html("正在登录中...");
        $.ajax({
            type: "post",
            url: "http://192.168.6.25:1531/api/Users/Login",
            data: JSON.stringify(postData),
            contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (data) {
                var json = eval("(" + data + ")");
                if (json.loginMes) {
                    sessionStorage['username']=name;
                    window.location.href = "index.html";
                    $("#userid").val("");
                    $("#pwd").val("");
                } else if(json.loginstate){
                   alert("用户已登录");
                    $("#userid").val("");
                    $("#pwd").val("");
                    $("#btn_Login").attr({"disabled":false});
                    $("#btn_Login").html("登录");
                } else {
                    alert("用户名或密码错误...");
                    $("#userid").val("");
                    $("#pwd").val("");
                    $("#btn_Login").attr({"disabled":false});
                    $("#btn_Login").html("登录");
                }
            },
            error: function (data) {
                alert(+data.status + " : " + data.statusText + " : " + data.responseText);
            },
        })
    }
}

//注册
function register() {
    if ($.trim($('#registerName').val()) == '') {
        //alert('请输入您的用户名');
        $("#mesgreg").css({"display":"block"});
        return false;
    } else if ($.trim($('#registerPassword').val()) == '') {
        alert('请输入密码');
        return false;
    } else if ($.trim($("#affirmpwd").val()) != $.trim($('#registerPassword').val())) {
        alert("两次密码不一致");
        return false;
    } else {
        $("#mesgreg").css({"display":"none"});
        var registerData = {
            username: $("#registerName").val(),
            password: $("#registerPassword").val()
        }
        $.ajax({
            type: "post",
            url: "http://192.168.6.25:1531/api/Users/Register",
            data: JSON.stringify(registerData),
            contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (data) {
                var json = eval("(" + data + ")");
                if (json.DuplicationName) {
                    alert("用户已注册..");
                    $("#registerName").val("");
                    $("#registerPassword").val("");
                    $("#affirmpwd").val("");
                } else if (json.RegisterSucceed) {
                    window.location.href = "login.html";
                    $("#userid").val($("#registerName").val());
                }

            },
            error: function (data) {
                alert(+data.status + " : " + data.statusText + " : " + data.responseText);
            },
        })
    }
}

//回车键
document.onkeydown = function (e) {
    if (!e) e = window.event;
    if ((e.keyCode || e.which) == 13) {
        var btlogin = document.getElementById("btn_Login");
        var registerbtn=document.getElementById("btn_register");
        registerbtn.click();
        btlogin.click();
    }
}
