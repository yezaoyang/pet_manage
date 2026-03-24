package org.example.modules.goodManage.dao;

import org.example.modules.goodManage.entity.Good;

import java.util.List;

public interface GoodMapper {

    // 根据ID查询单个宠物商品
    Good selectById(Integer id);

    // 查询所有在售宠物商品
    List<Good> selectAllActive();

    // 插入新宠物商品
    int insert(Good good);

    // 更新宠物商品信息
    int update(Good good);

    // 根据ID删除（或逻辑删除）
    int deleteById(Integer id);

}