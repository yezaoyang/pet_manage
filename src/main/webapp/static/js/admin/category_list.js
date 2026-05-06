function initCategoryModule() {
    loadCategoryList();
}

let currentPage = 1;
const pageSize = 5; // 每页显示8条记录

function loadCategoryList(page = 1) {
    currentPage = page;
    const params = {
        page: currentPage,
        size: pageSize,
        id: $("#search_id").val(),
        name: $("#search_name").val(),
        level: $("#search_level").val()
    };

    $.get("/api/category/list", params, function(res) {
        if (res.code === 200) {
            renderTable(res.data.list);    // 渲染表格
            renderPagination(res.data.total); // 渲染分页条
            $("#pageInfo").text(`第 ${currentPage} 页，共 ${res.data.total} 条`);
        }
    });
}

function renderTable(categories) {
    let html = '';
    // 渲染表格
    categories.forEach(item => {
        let levelName="";
        switch (item.level) {
            case "1": levelName="一级大类";break;
            case "2": levelName="二级子类";break;
        }
        html += `<tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.description || ''}</td>
                    <td><span class="${item.level==="1" ? 'label label-success' : 'label label-info'}">${levelName}</span></td>
                    <td>${item.parentName || ''}</td>
                    <td>
                        <button class="btn btn-info btn-xs" onclick="editCategory(${JSON.stringify(item).replace(/"/g, '&quot;')})">编辑</button>
                        <button class="btn btn-danger btn-xs" onclick="deleteCategory(${item.id})">删除</button>
                    </td>
                </tr>`;
    });
    $("#categoryList").html(html);
}

// 简单的分页生成逻辑
function renderPagination(total) {
    const totalPages = Math.ceil(total / pageSize);
    let html = '';
    // 上一页
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="loadCategoryList(${currentPage - 1})">&laquo;</a>
             </li>`;

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="javascript:void(0)" onclick="loadCategoryList(${i})">${i}</a>
                 </li>`;
    }

    // 下一页
    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="javascript:void(0)" onclick="loadCategoryList(${currentPage + 1})">&raquo;</a>
             </li>`;

    $("#pagination").html(html);
}

function searchData() {
    loadCategoryList(1); // 搜索时回到第一页
}

function resetSearch() {
    $("#searchForm")[0].reset();
    loadCategoryList(1);
}
function saveCategory() {
    const data = {
        id: $("#cat_id").val(),
        name: $("#cat_name").val(),
        cateId: $("#cat_parent").val(),
        description: $("#cat_description").val()
    };

    $.ajax({
        url: "api/category/save",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(res) {
            if (res.code === 200) {
                $('#categoryModal').modal('hide');
                loadCategoryList();
            } else {
                alert(res.msg);
            }
        }
    });
}

