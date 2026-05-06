// 当用户管理页面加载完成后执行
function initUserModule() {
    // 假设登录成功后，你把用户信息存在了 localStorage 或通过接口获取
    const currentUser = JSON.parse(localStorage.getItem("userInfo"));

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
            // 根据权限决定是否显示操作按钮
            let actionButtons = "";
            if (role === 1) {
                actionButtons = `
                    <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.id})">编辑</button>
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