// 当前选中的标签（login 或 register）
let currentTab = 'login';
// 切换标签的函数
function switchTab(tab) {
    currentTab = tab;

    // 获取元素
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const title = document.getElementById('title');

    // 更新标签样式
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        title.textContent = '你好！欢迎登录！';
        // 切换到登录表单
        showLoginForm();
    } else {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        title.textContent = '你好！欢迎注册！';
        // 切换到注册表单
        showRegisterForm();
    }
}

// 显示登录表单
function showLoginForm() {
    const loginForm = document.getElementById('loginForm');

    // 清空表单内容
    loginForm.innerHTML = `
      <div class="row-form">
        <div>
          <label for="username">用户名：</label>
        </div>
        <div>
          <input type="text" id="username" placeholder="请输入用户名">
        </div>
      </div>
      <div class="row-form">
        <div>
          <label for="password">密码：</label>
        </div>
        <div>
          <input type="password" id="password" placeholder="请输入密码">
        </div>
      </div>
      <div class="bottom-form">
        <button type="button" style="background-color: rgba(110,90,115,0.9);border: none;border-radius: 5px;padding: 5px 10px;font-size: 20px; color: white" onclick="login()">登&nbsp;&nbsp;录</button>
      </div>
    `;
}

// 显示注册表单
function showRegisterForm() {
    const loginForm = document.getElementById('loginForm');

    // 清空表单内容，添加注册需要的字段
    loginForm.innerHTML = `
      <div class="row-form">
        <div>
          <label for="reg-username">用户名：</label>
        </div>
        <div>
          <input type="text" id="reg-username" placeholder="请输入用户名">
        </div>
      </div>
<!--      <div class="row-form">-->
<!--        <div>-->
<!--          <label for="reg-email">邮箱：</label>-->
<!--        </div>-->
<!--        <div>-->
<!--          <input type="email" id="reg-email" placeholder="请输入邮箱">-->
<!--        </div>-->
<!--      </div>-->
      <div class="row-form">
        <div>
          <label for="reg-password">密码：</label>
        </div>
        <div>
          <input type="password" id="reg-password" placeholder="请输入密码">
        </div>
      </div>
      <div class="row-form register-field">
        <div>
          <label for="reg-confirm-password">确认密码：</label>
        </div>
        <div>
          <input type="password" id="reg-confirm-password" placeholder="请再次输入密码">
        </div>
      </div>
      <div class="bottom-form">
        <button type="button" style="background-color: rgba(110,90,115,0.9);border: none;border-radius: 5px;padding: 5px 10px;font-size: 20px; color: white" onclick="register()">注&nbsp;&nbsp;册</button>
      </div>
    `;
}


function showToast(msg, type = 'error') {
    const toastBox = document.getElementById('toastBox');
    toastBox.className = 'alert text-center';
    toastBox.classList.add(type === 'error' ? 'alert-danger' : 'alert-success');
    toastBox.innerText = msg;
    toastBox.classList.remove('d-none');

    setTimeout(() => {
        toastBox.classList.add('d-none');
    }, 2500);
}
// 登录函数
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!username || !password) {
        showToast("请填写用户名和密码");
        return;
    }

    showToast("登录成功！", "success");
}


// 注册函数
function register() {
    const username = document.getElementById('reg-username').value;
    // const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (!username || !password) {
        showToast('请填写完整信息');
        return;
    }

    if (password !== confirmPassword) {
        showToast('两次输入的密码不一致');
        return;
    }

    // 这里写你的注册逻辑
    console.log('注册', { username, password });
    showToast('注册成功！请登录', "success");
    // 注册成功后自动切换到登录
    switchTab('login');
}

// 页面加载完成后，设置默认激活状态
window.onload = function() {
    // 默认激活登录标签
    document.getElementById('loginTab').classList.add('active');
    // 确保显示登录表单
    showLoginForm();
    // // 隐藏提示
    // document.getElementById('xiaoxiTip').style.display = 'none';
};