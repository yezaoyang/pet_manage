// 在 common.js 的 switchPage 成功回调中调用
function initDashboard() {
    $.get("/admin/api/dashboard/stats", function(res) {
        if(res.code === 200) {
            $("#today-orders").text(res.data.orderCount);
            $("#today-revenue").text(res.data.revenue.toFixed(2));
            $("#new-users").text(res.data.userCount);
            $("#stock-warning").text(res.data.warningCount);
        }
    });

    $.get("/admin/api/good/latest", function(res) {
        let html = "";
        res.data.forEach(item => {
            html += `<tr>
                <td><img src="${item.pic}" width="40" class="rounded"></td>
                <td>${item.name}</td>
                <td>¥${item.price}</td>
                <td>${item.stock}</td>
            </tr>`;
        });
        $("#recent-goods-table tbody").html(html);
    });
}