package org.example.modules.categoryManage.dao;

import org.apache.ibatis.annotations.Param;
import org.example.modules.categoryManage.entity.Category;
import java.util.List;

public interface CategoryMapper {
    List<Category> findAllWithParent(
            @Param("offset") int offset,
            @Param("size") int size,
            @Param("id") Integer id,
            @Param("name") String name,
            @Param("level") String level
    );
    int insert(Category category);
    int update(Category category);
    int delete(Integer id);
    // 检查是否有子分类（删除前的安全检查）
    int countSubCategories(Integer id);
    int countSearch(
            @Param("id") Integer id,
            @Param("name") String name,
            @Param("level") String level
    );}