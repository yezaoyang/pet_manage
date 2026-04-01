// 当用户管理页面加载完成后执行
const currentUser = JSON.parse(localStorage.getItem("userInfo"));

function initUserModule() {
    // 假设登录成功后，你把用户信息存在了 localStorage 或通过接口获取
    // 1. 如果不是超级管理员(role != 1)，隐藏全局的“新增”按钮
    if (currentUser.role !== 1) {
        $("#btnAddUser").hide();
        // 提示信息
        $("#auth-tips").html('<span class="badge bg-warning text-dark">当前为只读模式</span>');
    }
    loadUserData(currentUser.role);
}

function loadUserData(role) {
    $.get("/api/user/list", function(res) {
        let html = "";
        res.data.forEach(user => {
            const userJson = JSON.stringify(user).replace(/"/g, '&quot;');
            // 根据权限决定是否显示操作按钮
            let actionButtons = "";
            if (role === 1) {
                actionButtons = `
                    <button class="btn btn-sm btn-outline-primary" onclick="editUser(${userJson})">编辑</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">删除</button>`;
            } else {
                actionButtons = `<span class="text-muted small">无权操作</span>`;
            }

            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role === 1 ? '超级管理员' : '普通管理员'}</td>
                    <td>${user.createTime}</td>
                    <td>${actionButtons}</td>
                </tr>`;
        });
        $("#userTable tbody").html(html);
    });
}
// 显示新增弹窗
function showAddUserModal() {
    $("#userModalLabel").text("新增用户");
    $("#userForm")[0].reset(); // 重置表单
    $("#userId").val("");     // 清空ID
    $("#username").prop("readonly", false); // 新增时账号可写
    $("#userModal").modal("show");
}

// 显示编辑弹窗
function editUser(userJson) {
    console.log(userJson)
    $("#userModalLabel").text("编辑用户");
    $("#userForm")[0].reset();

    // 填充数据
    $("#userId").val(userJson.id);
    $("#username").val(userJson.username).prop("readonly", true); // 账号通常不允许修改
    $("#role").val(userJson.role);
    $("#email").val(userJson.email);
    $("#password").val(userJson.password);


    $("#userModal").modal("show");
}

// 提交保存
function saveUser() {
    // 简单的表单校验
    const username = $("#username").val();
    if(!username) {
        alert("用户名不能为空");
        return;
    }

    // 组装数据
    const formData = {
        id: $("#userId").val(),
        username: username,
        password: $("#password").val(),
        email: $("#email").val(),
        role: $("#role").val(),
    };

    $.ajax({
        url: "/api/user/save",
        type: "POST",
        // 关键点 1：明确告诉服务器，我发的是 JSON 格式的数据
        contentType: "application/json; charset=utf-8",
        // 关键点 2：将 JS 对象序列化为字符串
        data: JSON.stringify(formData),
        success: function(res) {
            if(res.code === 200) {
                alert("操作成功！");
                $("#userModal").modal("hide");
                loadUserData(currentUser.role);
            } else {
                alert("操作失败：" + res.message);
            }
        },
        error: function(xhr) {
            console.error("请求失败:", xhr);
            alert("系统错误，状态码：" + xhr.status);
        }
    });
}
