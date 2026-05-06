function switchPage(pageName, menuTitle) {
    const pureName = pageName.replace(".html", "");
    const apiUrl = "admin/loadPage/" + pureName;

    // --- 新增：自动同步侧边栏高亮 ---
    // 找到 data-page 属性包含该文件名的菜单项
    const $targetMenu = $(`.menu-item[data-page*="${pureName}"]`);
    if ($targetMenu.length > 0) {
        $(".menu-item").removeClass("active"); // 移除其他高亮
        $targetMenu.addClass("active");        // 激活当前高亮

        // 如果你的菜单在折叠面板里（如：商品管理下有子菜单），还需要展开父级
        $targetMenu.parents('.collapse').addClass('show');
    }else {
        // 如果是个人中心等不在菜单里的页面，移除所有侧边栏高亮
        $(".menu-item").removeClass("active");
    }
    // ----------------------------

    $("#main-container").load(apiUrl, function(response, status, xhr) {
        if (status === "error") {
            if (xhr.status === 401 || xhr.status === 302) {
                window.location.href = "login.html";
            } else {
                $("#main-container").html("<div class='alert alert-danger'>页面加载失败</div>");
            }
        } else {
            // 如果传入了标题则更新，没传则尝试从菜单项获取
            const title = menuTitle || $targetMenu.text().trim();
            if (title) window.updateBreadcrumb(title);

            // 模块初始化逻辑...
            if (pageName.includes("category_list")) {
                if (typeof loadCategoryList === "function") loadCategoryList(1);
            }
            // 模块初始化逻辑...
            if (pageName.includes("user_list")) {
                if (typeof initUserModule === "function") initUserModule();
            }
        }
    });
}

$(function() {
    // 定义切换页面的函数

    // 绑定点击事件
    $(".menu-item").click(function(e) {
        e.preventDefault();
        $(".menu-item").removeClass("active");
        $(this).addClass("active");

        const page = $(this).data("page");
        switchPage(page);
    });

    // 侧边栏折叠切换按钮
    $('#sidebarCollapse').on('click', function() {
        // 1. 切换侧边栏的收缩类
        $('.sidebar').toggleClass('collapsed');

        // 2. 切换内容区的扩展类（使其 margin-left 变小）
        $('.main-content').toggleClass('expanded');

        // 3. 可选：如果顶部导航栏也需要移动，且不是兄弟节点
        // $('.top-navbar').toggleClass('expanded');
    });

    // 动态更新面包屑函数
    window.updateBreadcrumb = function(name) {
        $('#breadcrumb-current').text(name);
    };

    // 退出登录逻辑
    window.logout = function() {
        if(confirm("确定要退出系统吗？")) {
            // 这里调用你的后端登出接口
            $.post("/api/user/logout", function(res) {
                localStorage.clear();
                window.location.href = "login.html";
            }).fail(function() {
                // 即使接口报错，前端也强制跳转，保证安全
                window.location.href = "login.html";
            });
        }
    };
    // 默认加载首页
    switchPage("dashboard.html");
});