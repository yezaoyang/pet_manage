package org.example.modules.categoryManage.service;

import org.example.modules.categoryManage.entity.Category;
import java.util.List;

public interface CategoryService {

    /**
     * 获取所有分类（包含父类名称信息）
     */
    List<Category> getAllWithParent(int offset, int size, Integer id, String name, String level);

    /**
     * 保存或更新分类
     * @param category 分类实体
     * @return 是否成功
     */
    boolean saveOrUpdate(Category category);

    /**
     * 删除分类（含业务逻辑检查）
     * @param id 分类ID
     * @return 返回操作结果消息，成功返回 "success"
     */
    String deleteCategory(Integer id);

    int count(Integer id, String name, String level);
}