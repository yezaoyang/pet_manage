$(function() {
    // 定义切换页面的函数
    function switchPage(pageUrl) {
        // 1. 加载 HTML 片段到容器
        $("#main-container").load(pageUrl, function(response, status, xhr) {
            if (status == "error") {
                $("#main-container").html("<div class='alert alert-danger'>页面加载失败: " + xhr.status + "</div>");
            } else {
                // 2. 页面加载成功后，立即去后台拉取 JSON 数据并渲染表格
                // 例如：如果是类目页，调用 loadCategoryData();
                if(pageUrl.includes("category-list")) {
                    initCategoryModule();
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