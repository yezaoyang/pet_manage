var currentPage = 1;
var pageSize = 5;

$(document).ready(function() {
    loadGoodData(1);
});

/**
 * 加载商品分页数据
 */
function loadGoodData(page = 1) {
    currentPage = page;
    const params = {
        page: currentPage,
        size: pageSize,
        name: $("#search_name").val()
    };

    $.ajax({
        url: "/api/good/list",
        type: "GET",
        data: params,
        success: function(res) {
            if (res.code === 200) {
                renderTable(res.data.list);
                renderPagination(res.data.total);
                $("#pageInfo").text(`第 ${currentPage} 页，共 ${res.data.total} 条记录`);
            }
        }
    });
}

/**
 * 渲染表格行
 */
function renderTable(list) {
    let html = '';
    if (!list || list.length === 0) {
        html = '<tr><td colspan="8" class="text-center">没有找到相关商品</td></tr>';
    } else {
        list.forEach((item, index) => {
            // 1. 计算当前行的序号
            const startIndex = (currentPage - 1) * pageSize + index + 1;

            const statusBadge = item.isOnSale === 1
                ? `<span class="badge bg-success" style="cursor:pointer" onclick="changeStatus(${item.id}, 0)">已上架</span>`
                : `<span class="badge bg-secondary" style="cursor:pointer" onclick="changeStatus(${item.id}, 1)">已下架</span>`;

            const stockClass = item.stock < 10 ? 'stock-warning' : '';
            const placeholderUrl = `https://placehold.co/200x200?text=${encodeURIComponent(item.name)}`;

            // 2. 拼接 HTML，确保第一个 <td> 是序号
            html += `
                <tr>
                    <td>${startIndex}</td> 
                    <td>
                        <div class="good-img-container">
                            <img src="${item.imageUrl ? item.imageUrl : placeholderUrl}" 
                                 class="good-img" 
                                 onerror="this.src='https://placehold.co/200x200?text=No+Image'">
                        </div>
                    </td>
                    <td><strong>${item.name}</strong><br><small class="text-muted">${item.description || ''}</small></td>
                    <td><span class="text-info">${item.categoryName || '未分类'}</span></td>
                    <td class="price-text">￥${parseFloat(item.price).toFixed(2)}</td>
                    <td class="${stockClass}">${item.stock}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-outline-primary btn-xs" onclick="editGood(${item.id})">
                            <i class="fa fa-edit"></i> 编辑
                        </button>
                        <button class="btn btn-outline-danger btn-xs ml-1" onclick="deleteGood(${item.id})">
                            <i class="fa fa-trash"></i> 删除
                        </button>
                    </td>
                </tr>`;
        });
    }
    $("#goodList").html(html);
}
/**
 * 渲染分页条
 */
function renderPagination(total) {
    const totalPages = Math.ceil(total / pageSize);
    let html = '';

    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="loadGoodData(${currentPage - 1})">&laquo;</a>
             </li>`;

    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="loadGoodData(${i})">${i}</a>
                 </li>`;
    }

    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="loadGoodData(${currentPage + 1})">&raquo;</a>
             </li>`;

    $("#pagination").html(html);
}

/**
 * 切换上下架状态
 */
function changeStatus(id, newStatus) {
    const action = newStatus === 1 ? '上架' : '下架';
    $.post("/api/good/toggleSale", { id: id, status: newStatus }, function(res) {
        if (res.code === 200) {
            loadGoodData(currentPage); // 刷新当前页
        } else {
            alert("操作失败：" + res.msg);
        }
    });
}

/**
 * 删除商品
 */
function deleteGood(id) {
    if (confirm("确定要删除该商品吗？此操作不可恢复！")) {
        $.ajax({
            url: `/api/good/delete/${id}`,
            type: "DELETE",
            success: function(res) {
                if (res.code === 200) {
                    loadGoodData(currentPage);
                }
            }
        });
    }
}

function resetSearch() {
    $("#search_name").val("");
    loadGoodData(1);
}

/**
 * 弹出新增窗口
 */
function showAddModal() {
    $("#modalTitle").text("新增商品");
    $("#goodForm")[0].reset();
    $("#good_id").val(""); // 清空ID，表示新增
    initCategorySelect();  // 加载分类下拉框
    new bootstrap.Modal(document.getElementById('goodModal')).show();
}


/**
 * 弹出编辑窗口
 */
function editGood(id) {
    $("#modalTitle").text("编辑商品");

    // 1. 先加载分类列表
    initCategorySelect(function() {
        // 2. 分类加载成功的回调里，再去获取商品详情
        $.get(`/api/good/getById`, { id: id }, function(item) {
            if (item) {
                $("#good_id").val(item.id);
                $("#good_name").val(item.name);
                $("#good_price").val(item.price);
                $("#good_stock").val(item.stock);
                $("#good_status").val(item.isOnSale);
                $("#good_image").val(item.imageUrl);
                $("#good_description").val(item.description);

                // 这行代码现在能生效了，因为 option 已经渲染完毕
                $("#good_category").val(item.categoryId);

                // 3. 最后显示弹窗
                new bootstrap.Modal(document.getElementById('goodModal')).show();
            } else {
                alert("获取商品详情失败");
            }
        });
    });
}

/**
 * 加载分类下拉列表
 */
function initCategorySelect(callback) {
    $.get("/api/category/listAll", function(res) {
        if (res.code === 200) {
            let options = '<option value="">-- 请选择分类 --</option>';
            res.data.forEach(cat => {
                options += `<option value="${cat.id}">${cat.name}</option>`;
            });
            $("#good_category").html(options);

            // 关键点：如果传入了回调函数（比如回显数据），则执行它
            if (callback) callback();
        } else {
            console.error("分类加载失败: " + res.msg);
        }
    });
}

/**
 * 保存商品（新增与编辑公用）
 */
function saveGood() {
    // 组装数据对象
    const data = {
        id: $("#good_id").val() || null,
        name: $("#good_name").val(),
        categoryId: $("#good_category").val(),
        price: $("#good_price").val(),
        stock: $("#good_stock").val(),
        isOnSale: $("#good_status").val(),
        imageUrl: $("#good_image").val(),
        description: $("#good_description").val()
    };

    if (!data.name || !data.categoryId) {
        alert("请填写完整商品名称和分类！");
        return;
    }

    // 调用保存接口（后端 Service 的 updateGood / addGood）
    // 注意：建议后端 Controller 增加一个统一的 /save 接口，或者根据 ID 是否为空走不同路径
    const url = data.id ? "/api/good/update" : "/api/good/add";

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(res) {
            if (res.code === 200) {
                bootstrap.Modal.getInstance(document.getElementById('goodModal')).hide();
                loadGoodData(currentPage); // 刷新列表
            } else {
                alert("保存失败：" + res.msg);
            }
        }
    });
}