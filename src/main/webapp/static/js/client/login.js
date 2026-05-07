// login.js

// 切换标签
function switchTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const title = document.getElementById('title');

    if (tab === 'customerLogin' || tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        title.innerText = '你好！欢迎登录！';
        showLoginForm();
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        title.innerText = '你好！欢迎注册！';
        showRegisterForm();
    }
}

// 渲染登录表单
function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
      <div class="row-form">
        <label for="username">用户名：</label>
        <input type="text" id="username" placeholder="请输入用户名" style="width:100%">
      </div>
      <div class="row-form">
        <label for="password">密码：</label>
        <input type="password" id="password" placeholder="请输入密码" style="width:100%">
      </div>
      <div class="bottom-form">
        <button type="button" onclick="login()">登&nbsp;&nbsp;录</button>
      </div>`;
}

// 渲染注册表单
function showRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
      <div class="row-form">
        <label for="reg-username">用户名：</label>
        <input type="text" id="reg-username" placeholder="请输入用户名" style="width:100%">
      </div>
      <div class="row-form">
        <label for="reg-password">密码：</label>
        <input type="password" id="reg-password" placeholder="请输入密码" style="width:100%">
      </div>
      <div class="row-form">
        <label for="reg-confirm-password">确认密码：</label>
        <input type="password" id="reg-confirm-password" placeholder="请再次输入密码" style="width:100%">
      </div>
      <div class="bottom-form">
        <button type="button" onclick="register()">注&nbsp;&nbsp;册</button>
      </div>`;
}

// 统一弹窗
function showToast(msg, type = 'error') {
    const toastBox = document.getElementById('toastBox');
    if (!toastBox) return;
    toastBox.className = 'alert text-center';
    toastBox.classList.add(type === 'error' ? 'alert-danger' : 'alert-success');
    toastBox.innerText = msg;
    toastBox.classList.remove('d-none');
    setTimeout(() => { toastBox.classList.add('d-none'); }, 2500);
}

// 登录 Ajax
function login() {
    const username = $('#username').val();
    const password = $('#password').val();

    if (!username || !password) {
        showToast("请填写用户名和密码");
        return;
    }

    $.ajax({
        url: '/api/customer/login', // 确保后端对应 Customer 登录
        type: 'POST',
        data: { username, password },
        success: function(res) {
            if (res.code === 200) {
                showToast("登录成功，正在跳转...", "success");
                // 关键：存入 customerInfo 供首页使用
                localStorage.setItem("customerInfo", JSON.stringify(res.data));
                setTimeout(() => { window.location.href = "/html/client/index.html"; }, 1000);
            } else {
                showToast(res.msg || "登录失败");
            }
        },
        error: function() { showToast("服务器连接失败"); }
    });
}

// 注册 Ajax
function register() {
    const name = $('#reg-username').val();
    const password = $('#reg-password').val();
    const confirmPassword = $('#reg-confirm-password').val();

    if (!name || !password || !confirmPassword) {
        showToast('请填写完整信息');
        return;
    }
    if (password !== confirmPassword) {
        showToast('两次输入的密码不一致');
        return;
    }

    $.ajax({
        url: '/api/customer/register',
        type: 'POST',
        data: { name, password },
        success: function(res) {
            if (res.code === 200) {
                showToast('注册成功！请登录', "success");
                setTimeout(() => { switchTab('login'); }, 1500);
            } else {
                showToast(res.msg || "注册失败");
            }
        }
    });
}

// 初始化
$(function() {
    switchTab('customerLogin');
});