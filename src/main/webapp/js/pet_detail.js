let currentPet = null;

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');

    if (petId) {
        fetchPetDetail(petId);
    }

    // 绑定上下架切换
    $('#btnToggleSale').click(function() {
        toggleSaleStatus();
    });

    // 绑定修改定价（演示用，弹出输入框）
    $('#btnEditPrice').click(function() {
        const newPrice = prompt("请输入新的商城定价：", currentPet.price);
        if (newPrice && !isNaN(newPrice)) {
            updatePrice(newPrice);
        }
    });
});

function fetchPetDetail(id) {
    $.get(`../api/pet/getById?id=${id}`, function(data) {
        currentPet = data;
        renderPage();
    });
}

function renderPage() {
    // 基础文字映射
    $('#petName').text(currentPet.name);
    $('#petBreed').text(currentPet.breed);
    $('#petPrice').text(parseFloat(currentPet.price).toFixed(2));
    $('#petAvatar').attr('src', currentPet.avatar || '../images/default.jpg');
    $('#petDescription').text(currentPet.description);
    $('#petStock').text(currentPet.stock || 1);
    $('#adoptStatus').text(currentPet.adoptStatus);
    $('#petHealth').text(currentPet.healthStatus);

    // 商城状态 UI 变换
    const isOnSale = currentPet.isOnSale === 1;
    const banner = $('#saleStatusBanner');
    const btn = $('#btnToggleSale');

    if (isOnSale) {
        banner.html('<span class="badge bg-success"><span class="status-dot bg-white"></span>商城销售中</span>');
        btn.removeClass('btn-primary').addClass('btn-danger').find('span').text('下架商品');
    } else {
        banner.html('<span class="badge bg-secondary">已下架</span>');
        btn.removeClass('btn-danger').addClass('btn-primary').find('span').text('立即上架');
    }
}

function updatePrice(id, newPrice) {
    const data = {
        id: id,
        price: newPrice // 后端 update 方法会自动处理这个关键字字段
    };
    sendUpdate(data);
}

function toggleSale(id, status) {
    const data = {
        id: id,
        isOnSale: status // 1为上架，0为下架
    };
    sendUpdate(data);
}

function sendUpdate(jsonData) {
    $.ajax({
        url: '../api/pet/update',
        type: 'POST',
        contentType: 'application/json', // 既然传的是对象，建议用 JSON 格式
        data: JSON.stringify(jsonData),
        success: function(res) {
            alert("商城服务端同步成功！");
            location.reload(); // 刷新页面看最新状态
        }
    });
}
