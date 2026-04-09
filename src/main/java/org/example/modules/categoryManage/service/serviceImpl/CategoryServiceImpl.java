package org.example.modules.categoryManage.service.serviceImpl;

import org.example.modules.categoryManage.dao.CategoryMapper;
import org.example.modules.categoryManage.entity.Category;
import org.example.modules.categoryManage.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<Category> list(){
        return categoryMapper.list();
    }
    @Override
    public List<Category> getAllWithParent(int offset, int size, Integer id, String name, String level) {
        return categoryMapper.findAllWithParent(offset, size, id, name, level);
    }
    @Override
    public int count(Integer id, String name, String level) {
        return categoryMapper.countSearch(id, name, level);
    }

    @Override
    @Transactional // 涉及数据库修改，建议开启事务
    public boolean saveOrUpdate(Category category) {
        if (category.getId() == null || category.getId() <= 0) {
            // ID为空或小于等于0，执行插入
            return categoryMapper.insert(category) > 0;
        } else {
            // ID存在，执行更新
            return categoryMapper.update(category) > 0;
        }
    }

    @Override
    @Transactional
    public String deleteCategory(Integer id) {
        // 1. 安全检查：如果该分类下存在子分类，禁止删除
        int count = categoryMapper.countSubCategories(id);
        if (count > 0) {
            return "该分类下关联了 " + count + " 个子分类，无法直接删除！";
        }

        // 2. 执行删除
        int result = categoryMapper.delete(id);
        return result > 0 ? "success" : "删除失败，记录可能已被清除";
    }

    @Override
    public void removeByIds(List<Integer> ids) {
        categoryMapper.removeByIds(ids);
    }
}