    // 4. 初始化加载数据
$(function() {
    const userInfo = JSON.parse(localStorage.getItem("customerInfo"));
    if (!userInfo) {
    alert("请先登录");
    window.location.href = "/client/loadPage/login";
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

    function submitOrder() {
    alert("正在为您生成订单...");
    // 此处可扩展：window.location.href = "/client/loadPage/checkout";
}
