$(function() {
    // 定义切换页面的函数
    function switchPage(pageName, menuTitle) {
        // 假设 pageName 原本是 "user_list.html"
        // 我们去掉后缀，请求后端的 RESTful 接口
        const pureName = pageName.replace(".html", "");
        const apiUrl = "admin/loadPage/" + pureName;

        $("#main-container").load(apiUrl, function(response, status, xhr) {
            if (status === "error") {
                // 如果拦截器返回了 302 重定向到登录页，load 可能会报错或加载出登录页
                if (xhr.status === 401 || xhr.status === 302) {
                    window.location.href = "login.html";
                } else {
                    $("#main-container").html("<div class='alert alert-danger'>页面加载失败</div>");
                }
            } else {
                // 更新面包屑和初始化逻辑保持不变
                if (menuTitle) window.updateBreadcrumb(menuTitle);

                if (pageName.includes("user_list")) {
                    if (typeof initUserModule === "function") initUserModule();
                }
            }
        });
    }

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
            $.post("/admin/logout", function(res) {
                window.location.href = "login.html";
            });
        }
    };
    // 默认加载首页
    switchPage("dashboard.html");
});