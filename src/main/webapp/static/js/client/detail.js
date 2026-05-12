$(function() {
    // 1. 获取 URL 参数中的 id
    const params = new URLSearchParams(window.location.search);
    const goodId = params.get('id');

    if (!goodId) {
        alert("商品去火星了...");
        window.location.href = "/index.html"; // 回首页
        return;
    }
    // 2. 调用后端详情接口
    fetchDetail(goodId);
});

function fetchDetail(id) {
    $.ajax({
        url: '/api/good/getById', // 对应你 Controller 里的接口
        type: 'GET',
        data: { id: id },
        success: function(res) {
            console.log(res)
            if (res.code === 200) {
                const good = res.data;
                // 3. 动态填充页面内容
                $('.product-title').text(good.name);
                $('.product-desc').text(good.description || '主人很懒，什么都没写~');
                $('.price-current').text('¥' + good.price.toFixed(2));
                $('.price-original').text('¥' + (good.price * 1.2).toFixed(2));
                $('#mainImgBox img').attr('src', good.imageUrl);

                // 记录当前 ID，给加入购物车按钮使用
                window.currentGoodId = good.id;
            } else {
                alert(res.msg);
            }
        }
    });
}
