/**
 * dashboard.js
 * 对应 dashboard.html 的逻辑控制
 */

// 1. 初始化顶部统计指标
window.initDashboardStats = function() {
    console.log("Dashboard: 正在加载统计指标...");

    $.ajax({
        url: "/api/admin/statistics/dashboard", // 确保与 Controller 中的 Mapping 一致
        type: "GET",
        dataType: "json",
        success: function(res) {
            if (res.code === 200) {
                const data = res.data;

                // 渲染数据
                // 使用 animateNumber 增加动感效果
                animateNumber("#today-orders", data.pendingOrders || 0);
                animateNumber("#new-users", data.totalCustomers || 0);

                // 金额处理
                const revenue = parseFloat(data.monthlyRevenue || 0).toFixed(2);
                $("#today-revenue").text(Number(revenue).toLocaleString());

                // 库存告急
                $("#stock-warning").text(data.stockWarningCount || 0);
                if (data.stockWarningCount > 0) {
                    $("#stock-warning").addClass("text-danger fw-bold animate__animated animate__pulse animate__infinite");
                }
            } else {
                console.error("统计数据获取失败:", res.msg);
            }
        },
        error: function(xhr) {
            console.error("请求统计接口失败，状态码:", xhr.status);
        }
    });
};

// 2. 初始化最新商品列表
window.initRecentGoods = function() {
    console.log("Dashboard: 正在加载最新商品...");

    $.ajax({
        url: "/api/good/list", // 复用已有的商品列表接口
        type: "GET",
        data: { page: 1, size: 5 }, // 首页只展示前5条
        success: function(res) {
            if (res.code === 200) {
                const list = res.data.list;
                let html = "";

                if (!list || list.length === 0) {
                    html = '<tr><td colspan="4" class="text-center text-muted">暂无商品数据</td></tr>';
                } else {
                    list.forEach(item => {
                        html += `
                            <tr>
                                <td>
                                    <img src="${item.image || '/static/pictures/placeholder.jpg'}" 
                                         width="40" height="40" class="rounded border" style="object-fit:cover">
                                </td>
                                <td>
                                    <div class="fw-bold">${item.name}</div>
                                    <small class="text-muted">ID: ${item.id}</small>
                                </td>
                                <td class="text-success fw-bold">¥${item.price.toFixed(2)}</td>
                                <td>
                                    <span class="badge ${item.stock < 10 ? 'bg-danger' : 'bg-light text-dark'}">
                                        ${item.stock}
                                    </span>
                                </td>
                            </tr>`;
                    });
                }
                $("#recent-goods-table tbody").html(html);
            }
        }
    });
};

/**
 * 数字滚动动画工具函数
 */
function animateNumber(selector, target) {
    $(selector).prop('Counter', 0).animate({
        Counter: target
    }, {
        duration: 800,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
}

// 自动执行一次（防止手动刷新页面时逻辑不触发）
$(function() {
    if ($("#today-orders").length > 0) {
        window.initDashboardStats();
        window.initRecentGoods();
    }
});