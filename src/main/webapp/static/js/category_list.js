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
// 下拉框树展示
const setting = {
    view: { dblClickExpand: false, selectedMulti: false },
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "cateId", // 对应你后端的 parentId 字段
            rootPId: 0
        },
        key: { name: "name" }
    },
    callback: { onClick: onTreeClick }
};

// 点击树节点的逻辑
function onTreeClick(e, treeId, treeNode) {
    $("#parent_name").val(treeNode.name);
    $("#cat_parent").val(treeNode.id);
    hideMenu();
}

// 展现/隐藏菜单
function showMenu() {
    $("#menuContent").slideDown("fast");
    $("body").bind("mousedown", onBodyDown);
}
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "parent_name" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}
function clearParent() {
    $("#parent_name").val("");
    $("#cat_parent").val(0);
}
window.initCategoryTree = function() {
    $.get("/api/category/listAll", function(res) {
        if (res.code === 200) {
            const processedData = res.data.map(item => ({
                ...item,
                id: Number(item.id),
                cateId: Number(item.cateId)
            }));
            // zTree 支持简单数组格式，只要有 id 和 parentId 就能自动成树
            $.fn.zTree.init($("#treeDemo"), setting, processedData);
            // 自动展开所有节点（方便调试看子类出没出来）
            const treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            treeObj.expandAll(true);
        }
    });
};
// 在打开新增弹窗时调用
 function showAddCategoryModal() {
    $("#modalTitle").text("新增分类");
    $("#categoryForm")[0].reset();
    $("#cat_id").val("");

    // 清除 Select2 的选中状态
    $("#cat_parent").val(null).trigger('change');

    // 初始化/刷新下拉列表
     initCategoryTree();

    $("#categoryModal").modal("show");
};
