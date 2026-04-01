function initCategoryModule() {
    loadCategoryList();
}

var currentPage = 1;
var pageSize = 5; // 每页显示8条记录
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
            case "3": levelName="三级子类";break;
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
        level: $("#cat_level").val(),
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
var setting = {
    view: { dblClickExpand: false, selectedMulti: false },
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "cateId",
            rootPId: 0
        },
        key: { name: "name" }
    },
    callback: { onClick: onTreeClick }
};

// 点击树节点的逻辑
function onTreeClick(e, treeId, treeNode) {
    // 1. 获取选中节点的名称和ID
    $("#parent_name").val(treeNode.name);
    $("#cat_parent").val(treeNode.id);
console.log(treeNode)
    // 2. 核心逻辑：计算当前“新增分类”的级别
    // 如果选中的是父类，那么当前新增的子类级别 = 父类级别 + 1
    let parentLevel = treeNode.level; // 这里的 level 是数据库带出来的字段

    // 注意：如果数据库存的是 1, 2... 而不是从0开始，请根据你的业务逻辑加减
    // 由于数据库的level被tree自带的level覆盖，所以用tree的默认父级为0来计算
    let currentLevel = parseInt(parentLevel) + 2;

    $("#cat_level").val(currentLevel); // 存入隐藏域


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
 function editCategory(item) {
     console.log(item)
    $("#modalTitle").text("编辑分类");
    $("#categoryForm")[0].reset(); // 先重置表单

    // 1. 基本字段回显
    $("#cat_id").val(item.id);
    $("#cat_name").val(item.name);
    $("#cat_description").val(item.description);

    // 2. 层级和父级回显
    // 注意：编辑时，level 通常保持不变，不需要像新增那样 +2
    $("#cat_level").val(item.level);
    $("#cat_parent").val(item.cateId || 0);
    $("#parent_name").val(item.parentName || (item.cateId == 0 ? "顶级分类" : "无"));

    // 3. 初始化树（确保下拉树可用）
    initCategoryTree();

    // 4. 显示弹窗
    $("#categoryModal").modal("show");
};