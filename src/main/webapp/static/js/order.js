/**
 * 订单管理模块 JavaScript
 * 包含：分页加载、条件筛选、查看详情、删除订单
 */

// 1. 全局配置
var currentPage = 1;
var pageSize = 5;

$(document).ready(function() {
    // 页面加载完成后立即获取数据
    loadOrderData(1);
});

/**
 * 2. 加载订单分页列表
 * @param {number} page - 指定跳转页码
 */
function loadOrderData(page = 1) {
    currentPage = page;

    // 获取搜索框的值
    const params = {
        page: currentPage,
        size: pageSize,
        orderNo: $('#search_order_no').val().trim(),
        customerId: $('#search_customer_id').val().trim()
    };

    $.ajax({
        url: '/api/order/list',
        type: 'GET',
        data: params,
        success: function(res) {
            if (res.code === 200) {
                // 渲染表格主体
                renderOrderTable(res.data.list);
                // 渲染分页插件
                renderPagination(res.data.total);
                // 更新页面信息文字
                $("#pageInfo").text(`第 ${currentPage} 页，共 ${res.data.total} 条记录`);
            } else {
                alert('数据加载失败：' + res.msg);
            }
        },
        error: function() {
            alert('服务器连接异常，请检查后端服务');
        }
    });
}

/**
 * 3. 渲染订单表格
 * @param {Array} list - 后端返回的订单数组
 */
function renderOrderTable(list) {
    let html = '';
    if (!list || list.length === 0) {
        html = '<tr><td colspan="7" class="text-center text-muted">暂无订单数据</td></tr>';
    } else {
        list.forEach((item, index) => {
            // 计算序号 (当前页起始序号)
            const rowNum = (currentPage - 1) * pageSize + index + 1;

            html += `
                <tr>
                    <td>${rowNum}</td>
                    <td><span class="badge bg-light text-dark border">${item.orderNo}</span></td>
                    <td><i class="fa fa-user-circle text-secondary"></i> ${item.customerId}</td>
                    <td class="text-truncate" style="max-width: 200px;" title="${item.receiverAddress}">
                        ${item.receiverAddress}
                    </td>
                    <td><strong class="text-danger">￥${parseFloat(item.totalPrice).toFixed(2)}</strong></td>
                    <td><small class="text-muted">${formatDate(item.createTime)}</small></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="showOrderDetail(${item.id})">
                            <i class="fa fa-search-plus"></i> 详情
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteOrder(${item.id})">
                            <i class="fa fa-trash"></i> 删除
                        </button>
                    </td>
                </tr>`;
        });
    }
    $('#orderList').html(html);
}

/**
 * 4. 渲染分页条
 * @param {number} total - 总记录数
 */
function renderPagination(total) {
    const totalPages = Math.ceil(total / pageSize);
    let html = '';

    if (totalPages <= 0) {
        $("#pagination").html("");
        return;
    }

    // 上一页
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="loadOrderData(${currentPage - 1})">&laquo;</a>
             </li>`;

    // 动态生成页码 (如果页码过多，建议此处做省略处理，这里采用全显示)
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="loadOrderData(${i})">${i}</a>
                 </li>`;
    }

    // 下一页
    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="loadOrderData(${currentPage + 1})">&raquo;</a>
             </li>`;

    $("#pagination").html(html);
}

/**
 * 5. 查看订单详情 (含商品明细)
 * @param {number} id - 订单ID
 */
/**
 * 弹出并渲染订单详情
 */
function showOrderDetail(id) {
    $.get(`/api/order/detail/${id}`, function(res) {
        if (res.code === 200) {
            const order = res.data;
            console.log(res.data)

            // 基础信息回显
            $('#det_order_no').text(order.orderNo);
            $('#det_create_time').text(formatDate(order.createTime));
            $('#det_total_price').text('￥' + parseFloat(order.totalPrice).toFixed(2));
            $('#det_address').text(order.receiverAddress || '暂无地址');

            // 商品明细渲染
            let itemsHtml = '';
            if (order.orderItemList && order.orderItemList.length > 0) {
                order.orderItemList.forEach(item => {
                    const subtotal = (item.price * item.quantity).toFixed(2);
                    itemsHtml += `
                        <tr style="border-bottom: 1px solid #f8f9fa;">
                            <td class="ps-0">
                                <div class="fw-bold text-dark">${item.goodName}</div>
                                <div class="text-muted small">商品ID: ${item.goodId || '-'}</div>
                            </td>
                            <td class="text-center">￥${parseFloat(item.price).toFixed(2)}</td>
                            <td class="text-center text-muted">x${item.quantity}</td>
                            <td class="text-end pe-0 fw-bold text-dark">￥${subtotal}</td>
                        </tr>`;
                });
            } else {
                itemsHtml = '<tr><td colspan="4" class="text-center py-4 text-muted">未找到明细数据</td></tr>';
            }

            $('#det_items_body').html(itemsHtml);

            // 弹出模态框
            var myModal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
            myModal.show();
        }
    });
}
/**
 * 6. 删除订单
 * @param {number} id - 订单ID
 */
function deleteOrder(id) {
    if (!confirm("确定要永久删除该订单及其关联的商品记录吗？")) return;

    $.ajax({
        url: `/api/order/delete/${id}`,
        type: 'DELETE',
        success: function(res) {
            if (res.code === 200) {
                // 如果当前页只有一条数据且不是第一页，删除后自动跳回上一页
                const currentRows = $('#orderList tr').length;
                if (currentRows === 1 && currentPage > 1) {
                    loadOrderData(currentPage - 1);
                } else {
                    loadOrderData(currentPage);
                }
            } else {
                alert('删除失败：' + res.msg);
            }
        }
    });
}

/**
 * 7. 辅助函数
 */

// 重置查询
function resetOrderSearch() {
    $('#search_order_no').val('');
    $('#search_customer_id').val('');
    loadOrderData(1);
}

// 日期格式化 (YYYY-MM-DD HH:mm)
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}`;
}