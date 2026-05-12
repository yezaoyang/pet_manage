/**
 * 后台管理系统主框架逻辑
 * 核心功能：页面动态加载、权限拦截、面包屑更新、模块 JS 初始化
 */

// --- 全局配置 ---
const PROJECT_NAME = ""; // 根据你的项目部署名称修改

$(function() {

    // 1. 设置 jQuery Ajax 全局默认选项
    $.ajaxSetup({
        cache: false, // 禁用缓存，确保数据实时
        beforeSend: function(xhr) {
            // 每次请求带上用户信息（如果后端拦截器需要 Token）
            const userInfo = JSON.parse(localStorage.getItem("customerInfo") || "{}");
            if (userInfo.id) {
                xhr.setRequestHeader("X-User-Id", userInfo.id);
            }
        },
        error: function(xhr) {
            if (xhr.status === 401 || xhr.status === 302) {
                alert("会话已过期，请重新登录");
                window.location.href = "login.html";
            }
        }
    });

    /**
     * 核心函数：动态切换页面内容
     * @param {string} pageName - 页面文件名 (如 dashboard.html)
     * @param {string} menuTitle - 手动指定面包屑标题 (可选)
     */
    window.switchPage = function(pageName, menuTitle) {
        const pureName = pageName.replace(".html", "");
        const apiUrl = PROJECT_NAME + "/admin/loadPage/" + pureName;

        // --- 步骤 1: 处理侧边栏高亮状态 ---
        const $targetMenu = $(`.menu-item[data-page*="${pureName}"]`);
        if ($targetMenu.length > 0) {
            $(".menu-item").removeClass("active");
            $targetMenu.addClass("active");
            // 自动展开父级折叠菜单
            $targetMenu.parents('.collapse').addClass('show');
            $targetMenu.parents('.nav-item').find('[data-bs-toggle]').removeClass('collapsed');
        }

        // --- 步骤 2: 使用 Ajax 加载 HTML 片段 ---
        $("#main-container").fadeOut(100, function() {
            $(this).load(apiUrl, function(response, status, xhr) {
                if (status === "error") {
                    const errorMsg = xhr.status === 404 ? "页面未找到" : "系统异常";
                    $(this).html(`<div class='alert alert-danger mt-4'>⚠️ 加载失败: ${errorMsg}</div>`);
                } else {
                    $(this).fadeIn(200);

                    // --- 步骤 3: 更新面包屑标题 ---
                    const title = menuTitle || $targetMenu.find('span').text().trim() || "系统首页";
                    window.updateBreadcrumb(title);

                    // --- 步骤 4: 动态加载配套的 JS 脚本 ---
                    loadModuleScript(pureName);
                }
            });
        });
    };

    /**
     * 动态加载模块对应的 JS 文件并初始化
     * @param {string} moduleName - 模块名称
     */
    function loadModuleScript(moduleName) {
        // 定义需要额外执行 JS 初始化的模块
        const moduleConfigs = {
            "dashboard": ["initDashboardStats", "initRecentGoods"],
            "good_list": ["initGoodModule"],
            "user_list": ["initUserModule"],
            "category_list": ["initCategoryModule"],
            "order": ["initOrderModule"]
        };

        if (moduleConfigs.hasOwnProperty(moduleName)) {
            const scriptPath = `${PROJECT_NAME}/static/js/admin/${moduleName}.js`;

            $.getScript(scriptPath)
                .done(function() {
                    console.log(`[Script] ${moduleName}.js 加载成功`);
                    // 执行该模块配置的所有初始化函数
                    const functions = moduleConfigs[moduleName];
                    functions.forEach(funcName => {
                        if (typeof window[funcName] === "function") {
                            window[funcName]();
                        }
                    });
                })
                .fail(function() {
                    console.warn(`[Script] 未找到模块脚本: ${scriptPath}，将跳过 JS 初始化。`);
                });
        }
    }

    // --- 交互事件绑定 ---

    // 侧边栏菜单点击
    $(".menu-item").click(function(e) {
        e.preventDefault();
        const page = $(this).data("page");
        if (page) window.switchPage(page);
    });

    // 侧边栏折叠收缩控制
    $('#sidebarCollapse').on('click', function() {
        $('.sidebar').toggleClass('collapsed');
        $('.main-content').toggleClass('expanded');
    });

    // 更新面包屑文本
    window.updateBreadcrumb = function(name) {
        $('#breadcrumb-current').text(name);
    };

    // 退出登录逻辑
    window.logout = function() {
        if (confirm("🐾 确定要离开萌宠星球管理后台吗？")) {
            $.post(PROJECT_NAME + "/api/user/logout", function() {
                localStorage.removeItem("customerInfo");
                window.location.href = "login.html";
            }).fail(function() {
                // 即使接口失败也强制清理并跳转
                localStorage.clear();
                window.location.href = "login.html";
            });
        }
    };

    // --- 初始化 ---
    // 默认进入首页
    window.switchPage("dashboard.html", "系统概览");
});