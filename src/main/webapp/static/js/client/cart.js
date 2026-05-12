    // 4. 初始化加载数据
    $(function() {
        const userInfo = JSON.parse(localStorage.getItem("customerInfo"));
        if (!userInfo) {
            alert("请先登录");
            window.location.href = "/client/loadPage/login.html";
            return;
        }
        loadCartData(userInfo.id);
    });

    // 5. 动态加载购物车数据 (调用你之前写的 list 接口)
    function loadCartData(customerId) {
        $.ajax({
            url: '/api/cart/list',
            type: 'GET',
            data: { customerId: customerId },
            success: function(res) {
                if (res.code === 200) {
                    renderCart(res.data);
                } else {
                    alert("加载失败：" + res.msg);
                }
            }
        });
    }

    // 6. 渲染列表逻辑
function renderCart(list) {
    const $container = $('#cartListContainer');
    $container.empty();
    let total = 0;

    if (list.length === 0) {
        $container.html('<p style="text-align: center; padding: 50px;">购物车空空如也，快去选购吧！</p>');
        return;
    }

    list.forEach(item => {
    // 假设 item 关联了 good 实体
    const price = item.goodId ? item.price : 0;
    const name = item.goodName ? item.goodName : '未知商品';
    const img = item.goodImageUrl ? item.goodImageUrl : '/static/pictures/placeholder.jpg';

    total += (price * item.quantity);

    const html = `
                <div class="cart-item" data-id="${item.id}">
                    <input type="checkbox" checked class="item-check">
                    <img src="${img}" class="item-img">
                    <div class="item-info">
                        <div class="item-name">${name}</div>
                        <div class="item-spec">数量：${item.quantity}</div>
                    </div>
                    <div class="item-price-qty">
                        <div>
                            <span class="price">¥${price.toFixed(2)}</span>
                            <div class="qty-selector">
                                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                                <input type="text" class="qty-input" value="${item.quantity}" readonly>
                                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>`;
    $container.append(html);
});

    $('#totalPrice, #subtotal').text('¥' + total.toFixed(2));
    $('#cartCount').text(list.length);
}

    // 7. 修改数量逻辑 (调用你写的 update/quantity 接口)
    function changeQty(cartId, change) {
    // 先简单实现，生产环境应做防抖或即时 Loading
    const $input = $(`.cart-item[data-id="${cartId}"] .qty-input`);
    let newQty = parseInt($input.val()) + change;
    if (newQty < 1) return;

    $.ajax({
    url: '/api/cart/update/quantity',
    type: 'POST',
    data: { cartId: cartId, quantity: newQty },
    success: function(res) {
    if (res.code === 200) {
    const userInfo = JSON.parse(localStorage.getItem("customerInfo"));
    loadCartData(userInfo.id); // 重新加载刷新总价
}
}
});
}

    // 8. 交互：支付切换
    $('.pay-btn').click(function() {
    $('.pay-btn').removeClass('active');
    $(this).addClass('active');
});

    /**
     * 第一步：点击“立即结账”按钮触发
     */
    function submitOrder() {
        const selectedItems = getSelectedCartItems();

        if (selectedItems.length === 0) {
            alert("请先勾选要结算的宝贝哦 🐾");
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem("customerInfo") || "{}");
        if (!userInfo.id) {
            alert("登录信息已失效，请重新登录");
            window.location.href = "/client/loadPage/login";
            return;
        }
        console.log(userInfo)
        // 填充模态框默认值
        $('#modalTotalPrice').text($('#totalPrice').text());
        $('#orderReceiverName').val(userInfo.name || "");
        $('#orderReceiverPhone').val(userInfo.phone || "");
        $('#orderReceiverAddress').val(userInfo.address || "");

        // 显示模态框
        $('#orderConfirmModal').show();
    }

    /**
     * 第二步：在模态框点击“确认下单”
     * 将 Order 实体（含 List<OrderItem>）发送至后端
     */
    function confirmAndPay() {
        const userInfo = JSON.parse(localStorage.getItem("customerInfo"));
        const totalPrice = parseFloat($('#totalPrice').text().replace('¥', ''));

        // 基础校验
        const address = $('#orderReceiverAddress').val();
        const phone = $('#orderReceiverPhone').val();
        if (!address || !phone) {
            alert("请填写完整的收货信息");
            return;
        }

        // 构造 Order 实体对象，字段名需与 Java Order 类一致
        const orderData = {
            customerId: userInfo.id,
            totalPrice: totalPrice,
            receiverAddress: address,
            status: 0, // 初始状态：未支付
            // 关键：字段名需与 Order 类中的 List<OrderItem> 变量名一致
            orderItemList: getSelectedCartItems().map(item => ({
                goodId: item.id,
                goodName:item.goodName,
                quantity: item.qty,
                price: item.price // 对应 OrderItem 中的价格
            }))
        };

        // 1. 发起下单请求
        $.ajax({
            url: '/api/order/submit',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData),
            success: function(res) {
                if (res.code === 200) {
                    const orderNo = res.data; // 后端返回生成的订单号
                    $('#orderConfirmModal').hide();

                    // 2. 模拟支付弹窗
                    processPayment(orderNo, totalPrice);
                } else {
                    alert("下单失败：" + res.msg);
                }
            },
            error: function() {
                alert("网络异常，下单失败");
            }
        });
    }

    /**
     * 第三步：支付流程处理
     */
    /**
     * 第三步：支付流程处理
     */
    function processPayment(orderNo, totalPrice) {
        const isPay = confirm(`订单已生成！\n订单号：${orderNo}\n应付金额：¥${totalPrice}\n\n点击【确定】模拟支付成功\n点击【取消】稍后支付`);

        // 状态定义：2 为已完成，0 为待支付
        const finalStatus = isPay ? 2 : 0;
        const msg = isPay ? "支付成功！您的宝贝很快就会发货 🐾" : "订单已保存，请尽快完成支付。";

        const userInfo = JSON.parse(localStorage.getItem("customerInfo") || "{}");

        // 1. 更新订单状态
        $.post('/api/order/updateStatus', {
            orderNo: orderNo,
            status: finalStatus
        }, function(res) {
            if (res.code === 200) {

                // 2. 如果支付成功，则执行清空购物车操作
                if (isPay && userInfo.id) {
                    $.post('/api/cart/clear', { customerId: userInfo.id }, function(clearRes) {
                        if (clearRes.code === 200) {
                            console.log("购物车已自动清空");
                            alert(msg);
                            window.location.href = "/html/client/index.html";
                        } else {
                            // 即使清空失败，也弹窗告知支付成功
                            alert(msg + " (购物车同步失败)");
                            window.location.href = "/html/client/index.html";
                        }
                    });
                } else {
                    // 3. 如果是稍后支付，直接跳转至个人中心
                    alert(msg);
                    window.location.href = "/client/loadPage/profile";
                }
            }
        });
    }
    /**
     * 辅助函数：抓取页面上被勾选的商品行数据
     */
    function getSelectedCartItems() {
        const items = [];
        // 假设你的动态生成代码中，给每个 cart-item 绑定了 data-id 和相关类名
        $('.item-check:checked').each(function() {
            const $row = $(this).closest('.cart-item');
            items.push({
                id: $row.data('id'),
                goodName: $row.find('.item-name').text().trim(),
                qty: parseInt($row.find('.qty-input').val()),
                price: parseFloat($row.find('.price').text().replace('¥', ''))
            });
        });
        return items;
    }