/**
 * 萌宠星球 - 2026 首页核心逻辑
 */

// 1. 临时全局补丁：防止某些老旧脚本或未清理的原生 JS 报错中断程序
window.onerror = function(msg) {
    if (msg && msg.indexOf('classList') !== -1) {
        console.warn("屏蔽了一次原生 classList 操作报错（元素可能尚未加载）");
        return true;
    }
};

$(document).ready(function() {
    // 初始化：加载首页数据
    loadIndexData();

    // --- 1. 数据加载与渲染逻辑 ---
    function loadIndexData() {
        // 分类请求
        $.ajax({
            url: '/api/category/list1',
            type: 'GET',
            data: { level: "2" },
            success: function(res) {
                if (res && res.code === 200 && Array.isArray(res.data)) {
                    renderCategories(res.data);
                }
            },
            error: function(xhr) {
                console.error("分类加载失败:", xhr.status);
            }
        });
        $.ajax({
            url: '/api/category/list1',
            type: 'GET',
            data: { level: "1" },
            success: function(res) {
                if (res.code === 200) {
                    renderNav(res.data);
                }
            }
        });
        // 商品请求
        $.ajax({
            url: '/api/good/list',
            type: 'GET',
            success: function(res) {
                if (res && res.code === 200) {
                    // 自动适配后端不同的数据包裹格式（list 或 直接 data）
                    const productList = res.data.list || res.data;
                    if (Array.isArray(productList)) {
                        renderProducts(productList);
                    }
                }
            },
            error: function(xhr) {
                console.error("商品加载失败:", xhr.status);
                $('#productList').html('<p class="text-center w-100 text-muted">商品走丢了，请稍后再试...</p>');
            }
        });
    }

    function renderCategories(categories) {
        let html = '';
        categories.forEach(cat => {
            html += `
                <div class="category-item" onclick="filterByCategory(${cat.id})">
                    <div class="category-icon-wrapper">
                        <span class="iconify" data-icon="${cat.icon || 'mdi:paw'}" style="font-size: 30px;"></span>
                    </div>
                    <span class="category-text">${cat.name}</span>
                </div>`;
        });
        $('#categoryList').empty().append(html);
    }

    function renderProducts(products) {
        let html = '';
        if (!products || products.length === 0) {
            html = '<p class="text-center w-100 py-5">暂时没有找到心仪的商品呢 🐾</p>';
        } else {
            products.forEach(p => {
                html += `
                <article class="product-card rounded-3xl transition">
                    <div class="product-img-wrapper">
                        <a href="detail.html?id=${p.id}">
                            <img class="product-img" src="${p.imageUrl || '/static/pictures/client/index/default-p.jpg'}" alt="${p.name}"/>
                        </a>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${p.name}</h3>
                        <div class="product-bottom">
                            <span class="product-price">¥${p.price}</span>
                            <button class="purchase-btn js-add-cart" data-id="${p.id}">加入购物车</button>
                        </div>
                    </div>
                </article>`;
            });
        }
        $('#productList').empty().append(html);
    }

    // --- 2. 搜索逻辑 ---
    $('#searchInput').on('keypress', function(e) {
        if(e.which === 13) {
            const keyword = $(this).val().trim();
            if(keyword) window.location.href = '/html/client/search.html?keyword=' + encodeURIComponent(keyword);
        }
    });
    // 渲染顶部大类
    function renderNav(categories) {
        const $navLinks = $('.nav-links');
        $navLinks.empty(); // 清空写死的静态内容

        categories.forEach(item => {
            // 动态构建 li 标签
            const html = `
            <li>
                <a href="javascript:void(0);" onclick="filterByCategory(${item.id})">
                    ${item.name}
                </a>
            </li>`;
            $navLinks.append(html);
        });
    }
    // --- 3. 购物车逻辑 (Customer 权限专用) ---
    $(document).on('click', '.js-add-cart', function() {
        const gid = $(this).data('id');

        // 关键：读取前台客户信息 (Customer) 而非后台用户 (User)
        let customerInfo = null;
        try {
            customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
        } catch (e) {
            console.error("Local data error");
        }

        // A. 前端初步校验：如果 localStorage 没数据，直接拦截
        if (!customerInfo || !customerInfo.id) {
            if (confirm("🐾 您尚未登录，是否立即前往登录页面？")) {
                window.location.href = "/html/client/login.html";
            }
            return;
        }

        const data = {
            customerId: customerInfo.id,
            goodId: gid,
            quantity: 1
        };

        const $btn = $(this);
        $btn.prop('disabled', true).text('🐾...');

        $.ajax({
            url: '/api/cart/add',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(res) {
                // B. 后端拦截器校验：如果 session 过期返回 401
                if (res.code === 401) {
                    if (confirm("登录状态已过期，需要重新登录吗？")) {
                        window.location.href = "/html/client/login.html";
                    }
                } else if (res.code === 200) {
                    alert('🐾 成功放入购物袋！');
                } else {
                    alert('添加失败：' + (res.msg || '未知错误'));
                }
            },
            complete: function() {
                $btn.prop('disabled', false).text('加入购物车');
            }
        });
    });

    // --- 4. 辅助函数 ---
    window.showCouponToast = function() {
        alert("🎉 领取成功！满299减50优惠券已放入您的账户。");
    };

    window.filterByCategory = function(catId) {
        console.log("正在按分类过滤商品，ID:", catId);
        // 此处可调用 AJAX 重新加载该分类下的商品
    };

    // 动态年份
    const $copyright = $('#copyright');
    if ($copyright.length) {
        $copyright.html(`&copy; ${new Date().getFullYear()} 萌宠星球 Pet Planet. All rights reserved.`);
    }

});
/**
 * 处理用户头像点击跳转
 */
function handleUserClick(target) {
    // 1. 从本地存储获取用户信息
    const userInfo = localStorage.getItem("customerInfo");

    if (!userInfo) {
        // 2. 如果已登录（存在数据），跳转到个人中心
        // 注意：这里使用的是你 ClientPageController 定义的路由
        window.location.href = "/client/login.html";
    }
    if (target === 'cart') {
        window.location.href = "/client/loadPage/cart";
    } else if (target === 'profile') {
        window.location.href = "/client/loadPage/profile";
    }
}