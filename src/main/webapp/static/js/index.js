function switchPage(pageName, menuTitle) {
    const pureName = pageName.replace(".html", "");
    const apiUrl = "admin/loadPage/" + pureName;

    // --- 1. 处理侧边栏高亮 ---
    const $targetMenu = $(`.menu-item[data-page*="${pureName}"]`);
    $(".menu-item").removeClass("active");
    if ($targetMenu.length > 0) {
        $targetMenu.addClass("active");
        $targetMenu.parents('.collapse').addClass('show');
    }

    // --- 2. 加载页面内容 ---
    $("#main-container").load(apiUrl, function(response, status, xhr) {
        if (status === "error") {
            if (xhr.status === 401 || xhr.status === 302) {
                window.location.href = "login.html";
            } else {
                $("#main-container").html("<div class='alert alert-danger'>页面加载失败</div>");
            }
            return;
        }

        // --- 3. 更新面包屑 ---
        const title = menuTitle || $targetMenu.text().trim();
        if (title) window.updateBreadcrumb(title);

        // --- 4. 动态加载 JS 并初始化 ---
        // 我们约定：JS 文件名必须和页面名一致，例如 user_list.html 对应 user_list.js
        const scriptPath = "../js/" + pureName + ".js";

        // 检查该模块是否需要专门的 JS 初始化
        const modulesNeedingJs = ["user_list", "category_list", "good_list"];

        if (modulesNeedingJs.includes(pureName)) {
            $.getScript(scriptPath)
                .done(function() {
                    console.log(pureName + ".js 加载成功");
                    // 统一执行初始化
                    if (pureName === "user_list" && typeof initUserModule === "function") {
                        initUserModule();
                    }
                    if (pureName === "category_list" && typeof loadCategoryList === "function") {
                        loadCategoryList(1);
                    }
                })
                .fail(function() {
                    console.error("加载脚本失败: " + scriptPath);
                });
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