$(function(){
usernmae();
treetable();
getDescriptionlist();
});
//加载表格
function treetable()
{
$("#deptTreeTable").bootstrapTreeTable({
    id: 'Id', // 选取记录返回的值
    code: 'Id', // 用于设置父子关系
    parentCode: 'ParentId', // 子节点
    type:"post",
    url:"http://192.168.6.25:1531/api/HomeData/GetData",
    ajaxParams: {
        option:$("#combox option:selected").val(),
        serchdata: $("#keyword").val().trim(),
     }, // 请求数据的ajax的data属性
    expandColumn: 2, // 在哪一列上面显示展开按钮
    expandAll: true, // 是否全部展开
    striped: true, // 是否各行渐变色
    columns: [
        //{field: 'selectItem', checkbox: true},
        {field: 'selectItem', radio: true},
        {title:'编号',field:'Counts',width:"40px;"},
        // {title:'编号',field:'Id',width:"40px;",visible:true},
        {title:"测点描述",field:"Description",width:"180px"},
        {title:"累计测点数",field:"Points",width:"140px"},
        {title:"Team工作项号",field:"TeamNumber",width:"180px"},
        {title:"状态(是否通过)",field:"State",width:"180px"},
        {title:"备忘",field:"Cheat"},
        {title:"用户",field:"UserName"}
    ], // 设置列
    toolbar: null, //顶部工具条
    expanderExpandedClass: 'glyphicon glyphicon-chevron-down', // 展开的按钮的图标
    expanderCollapsedClass: 'glyphicon glyphicon-chevron-right' // 缩起的按钮的图标
})

}

//查询
function search(){
treetable();
}
function GetQueryString(url){
    var reg = new RegExp("(^|&)"+ url +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
//获取登录的用户
function usernmae(){
    // var myurl=GetQueryString("name");
    // if(myurl !=null && myurl.toString().length>1)
    // {
    //    $("#showuser").text(myurl);
    //    if(myurl=="admin"){
    //    $("#btn_add").css({"display":"block"});
    //    }
    // }
    var name=sessionStorage['username'];
    if (name!=null){
        $.ajax({
            url: "http://192.168.6.25:1531/api/Users/GetUserRole",
            type: "post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({UserName:name}),
            success: function (data) {
           var json=eval("(" + data + ")");
                if(json.RoleId==3){
                    $("#showuser").text(name+"(系统用户)欢迎您!");
                    $("#btn_add").css({"display":"block"});
                    $("#btn_role").css({"display":"block"});
                    $("#role").text("系统用户");
                }
               else if(json.RoleId==1){
                    $("#showuser").text(name+"(管理员)欢迎您!");
                    $("#btn_add").css({"display":"block"});
                    $("#role").text("管理员");
                }else{
                    $("#showuser").text(name+"欢迎您!");
                    $("#role").text("普通用户");
                }
            }

        });
        $("#user").text(name);
    }else{
        alert("请先登录");
        window.location.href ="login.html";
        return false;
    }

}
//添加信息
function add(){
    //修改信息
if($("#DescriptionId").val()!=""&&$("#parentId").val()==""){
    var editdata;
    if($("#DescriptionManger").val()==""){
         editdata={
            Id:$("#DescriptionId").val(),
            Description:$("#Description").val(),
            TeamNumber:$("#TeamNumber").val(),
            State:$(".radio").find("input[name='optionsRadios']:checked").val(),
            Cheat:$("#Cheat").val(),
        };
    }else{
         editdata={
            Id:$("#DescriptionId").val(),
            Description:$("#DescriptionManger").val(),
            TeamNumber:$("#TeamNumber").val(),
            State:$(".radio").find("input[name='optionsRadios']:checked").val(),
            Cheat:$("#Cheat").val(),
        };
    }
    $.ajax({
        type: "post",
        url: "http://192.168.6.25:1531/api/HomeData/Edit",
        data: JSON.stringify(editdata),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (data) {
            var json = eval("(" + data + ")");
            if(json.handleState)
            {
                treetable();
                $("#DescriptionCom").attr("disabled",false);
                $("#DescriptionCom").val("");
                $("#Description").val("");
                $("#DescriptionManger").val("");
                $("#TeamNumber").val("");
                $("#Cheat").val("");
                $("#DescriptionId").val("");
                $("#parentId").val("");
            }
        },
        error: function (data) {
            alert(+data.status + " : " + data.statusText + " : " + data.responseText);
        },
    });
}else{
    if($.trim($('#Description').val()) == ''){return false;}else{
        if ($("#DescriptionCom").val()==""){
            alert("请选择父级节点");
            return false;
        }
        var addChild={
            ParentId:$("#parentId").val(),
            Description:$("#Description").val(),
            UserName:$("#user").text(),
            TeamNumber:$("#TeamNumber").val(),
            State:$(".radio").find("input[name='optionsRadios']:checked").val(),
            Cheat:$("#Cheat").val()
        };
        $.ajax({
            type: "post",
            url: "http://192.168.6.25:1531/api/HomeData/addChild",
            data: JSON.stringify(addChild),
            contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (data) {
                var json = eval("(" + data + ")");
                if(json.handleState)
                {
                    $("#DescriptionCom").attr("disabled",false);
                    $("#DescriptionCom").val("");
                    $("#Description").val("");
                    $("#TeamNumber").val("");
                    $("#Cheat").val("");
                    $("#DescriptionId").val("");
                    $("#parentId").val("");
                    treetable();
                }
            },
            error: function (data) {
                alert(+data.status + " : " + data.statusText + " : " + data.responseText);
            },
        });
    }
}
}
//修改信息
function Edit(){
  var editdata={
      Id:$("#DescriptionIdedit").val(),
      Description:$("#DescriptionParentedit").val(),
      TeamNumber:$("#TeamNumberedit").val(),
      State:$(".radio").find("input[name='optionsRadiosedit']:checked").val(),
      Cheat:$("#Cheatedit").val(),
  };
    $.ajax({
        type: "post",
        url: "http://192.168.6.25:1531/api/HomeData/Edit",
        data: JSON.stringify(editdata),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (data) {
            var json = eval("(" + data + ")");
            if(json.handleState)
            {
                $("#editmodel").modal("hide");
                treetable();
                $("#btn_edit").attr("disabled", "disabled");
                $("#DescriptionIdedit").val("");
                $("#DescriptionParentedit").val("");
                $("#TeamNumberedit").val("");
                $("#Cheatedit").val("");
            }
        },
        error: function (data) {
            alert(+data.status + " : " + data.statusText + " : " + data.responseText);
        },
    });
}
//添加父级节点信息
function addParent(){
    if ($("#DescriptionParent").val()!=""){
        var dataParent={
            DescriptionParent:$("#DescriptionParent").val(),
            TeamNumber:$("#TeamNumberParent").val(),
            State:$(".radio").find("input[name='optionsRadiosParent']:checked").val(),
            Cheat:$("#CheatParent").val(),
            UserName:$("#user").text(),
        };
   $.ajax({
            type: "post",
            url: "http://192.168.6.25:1531/api/HomeData/add",
            data: JSON.stringify(dataParent),
            contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (data) {
                var json = eval("(" + data + ")");
                if(json.handleState)
                {
                    $("#addmodel").modal("hide");
                    $("#DescriptionParent").val("");
                    $("#TeamNumberParent").val("");
                    $("#CheatParent").val("");
                    treetable();
                    getDescriptionlist();
                }
            },
            error: function (data) {
                alert(+data.status + " : " + data.statusText + " : " + data.responseText);
            },
        });
    };
}
//删除一条
function delet(){
    Ewin.confirm({message:"确认要删除选择的数据的吗？"}).on(function(e){
        if(!e){
            return;
        };
        var deldata={delId:$("#DescriptionId").val()};
        $.ajax({
            type: "post",
            url: "http://192.168.6.25:1531/api/HomeData/Delete",
            data: JSON.stringify(deldata),
            contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (data) {
                var json = eval("(" + data + ")");
                if(json.handleState) {
                    treetable();
                    $("#DescriptionCom").attr("disabled",false);
                    $("#DescriptionCom").val("");
                    $("#Description").val("");
                    $("#TeamNumber").val("");
                    $("#Cheat").val("");
                    $("#btn_delete").attr("disabled", "disabled");
                }else{
                    alert("无权限操作！");
                }
            },
            error: function (data) {
                alert(+data.status + " : " + data.statusText + " : " + data.responseText);
            },
        });
    })

}
//获取下拉框信息
function getDescriptionlist() {
    $('#DescriptionCom').html("");
    $('#DescriptionCom').append("<option value=''>--请选择--</option>");
    $.ajax({
        url: "http://192.168.6.25:1531/api/HomeData/getDescriptionlist",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({parentId:0}),
        success: function (data) {
            $.each(JSON.parse(data), function (i,t) {
                $('#DescriptionCom').append("<option value=" + t.vaueId + ">" + t.Descriptionname + "</option>");
            });
        },
        error: function (data) {
            alert("加载失败" + data);
        }
    });
}
//显示子节点
function showItem(text){
    if(text==""){
        $("#childName").hide();
        $("#Description").hide();
        $("#Description").val("");
    }else{
        $("#childName").show();
        $("#Description").show();
        $("#parentId").val(text);
        $("#DescriptionId").val("");
    }
}
document.onkeydown = function (e) {
    if (!e) e = window.event;
    if ((e.keyCode || e.which) == 13) {
        var btparen = document.getElementById("btn_addprent");
        btparen.click();
    }
}
//退出登录
function loginout(){
    window.location.href="login.html";
    sessionStorage["username"].clear();
}
//获得用户列表
function UserList(){
    $('#UserCom').html("");
    $('#UserCom').append("<option value=''>--请选择--</option>");
    $.ajax({
        url: "http://192.168.6.25:1531/api/Users/GetUser",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: "",
        success: function (data) {
            $.each(JSON.parse(data), function (i,t) {
                $('#UserCom').append("<option value=" + t.UserId + ">" + t.UserNames + "</option>");
            });
        },
        error: function (data) {
            alert("节点信息加载失败" + data);
        }
    });
}
//保存角色信息
function UserRole(){
    if ($("#UserCom").val()!=""&&$("#UserRoleCom").val()!=""){
        var role={
            userId:$("#UserCom").val(),
            RoleId:$("#UserRoleCom").val()
        };
        $.ajax({
            url: "http://192.168.6.25:1531/api/Users/SetUserRole",
            type: "post",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(role),
            success: function (data) {
                if(data){
                    $("#addRole").modal("hide");
                    $("#UserCom").val("");
                    $("#UserRoleCom").val("");
                    UserList();
                }
            },
        });
    }
}
//刷新
function refresh(){
    window.location.href ="index.html";
}