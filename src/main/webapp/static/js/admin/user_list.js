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
        res.data.forEach((user,index) => {
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
                    <td>
                        <input type="checkbox" class="form-check-input user-check" value="${user.id}" onclick="updateBatchBtnStatus()">
                    </td>
                    <td>${index+1}</td>
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
    if(userJson.id===currentUser.id)
        $("#role").val(userJson.role).prop("disabled", true);
    else $("#role").val(userJson.role)
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
// 删除用户方法
function deleteUser(id) {
    // 1. 安全校验：防止误操作删除当前正在登录的账号
    if (id === currentUser.id) {
        alert("温馨提示：你不能删除自己当前正在登录的账号！");
        return;
    }

    // 2. 弹出二次确认框，防止手抖
    if (!confirm("确定要删除 ID 为 " + id + " 的用户吗？该操作不可撤销！")) {
        return;
    }

    // 3. 执行 Ajax 删除请求
    $.ajax({
        url: "/api/user/delete", // 也可以是 "/api/user/delete/" + id，取决于后端接口设计
        type: "POST",           // 通常后端删除接口建议使用 POST 或 DELETE
        // 情况 A：如果后端通过 URL 参数或 Form 表单接收 id
        data: { id: id },

        /* 情况 B：如果后端要求发送 JSON 格式（如 @RequestBody Integer id），请改用下面这段：
        contentType: "application/json",
        data: JSON.stringify({ id: id }),
        */

        success: function(res) {
            if (res.code === 200) {
                alert("删除成功！");
                // 4. 重新加载数据列表，保持页面内容最新
                loadUserData(currentUser.role);
            } else {
                alert("删除失败：" + res.message);
            }
        },
        error: function(xhr) {
            console.error("删除请求失败:", xhr);
            alert("系统错误：无法连接到服务器，状态码 " + xhr.status);
        }
    });
}
/**
 * 全选/反选
 */
function toggleAll(obj) {
    const isChecked = $(obj).prop("checked");
    $(".user-check").prop("checked", isChecked);
    updateBatchBtnStatus();
}

/**
 * 更新批量删除按钮的可操作状态
 */
function updateBatchBtnStatus() {
    // 获取选中的复选框数量
    const checkedCount = $(".user-check:checked").length;

    // 如果选中数量 > 0，且当前用户有权限（role === 1），则解除禁用
    if (checkedCount > 0 && currentUser.role === 1) {
        $("#btnBatchDelete").prop("disabled", false);
    } else {
        $("#btnBatchDelete").prop("disabled", true);
    }
}

/**
 * 批量删除执行逻辑
 */
function batchDeleteUsers() {
    let ids = [];
    $(".user-check:checked").each(function() {
        ids.push(parseInt($(this).val()));
    });

    if (ids.length === 0) return;

    // 安全检查
    if (ids.includes(currentUser.id)) {
        alert("批量删除列表中包含您当前的登录账号，请取消勾选后再操作。");
        return;
    }

    if (!confirm(`确定要删除选中的 ${ids.length} 个管理员吗？`)) {
        return;
    }

    $.ajax({
        url: "/api/user/batchDelete",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(ids),
        success: function(res) {
            if (res.code === 200) {
                alert("批量删除成功");
                loadUserData(); // 重新加载数据
                // 关键：重置全选框和按钮状态
                $("#checkAll").prop("checked", false);
                $("#btnBatchDelete").prop("disabled", true);
            } else {
                alert("操作失败：" + res.msg);
            }
        }
    });
}