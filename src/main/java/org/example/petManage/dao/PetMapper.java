package org.example.petManage.dao;

import org.example.petManage.entity.Pet;
import java.util.List;

public interface PetMapper {

    // 根据ID查询单个宠物
    Pet selectById(Integer id);

    // 查询所有在售宠物
    List<Pet> selectAllActive();

    // 插入新宠物
    int insert(Pet pet);

    // 更新宠物信息
    int update(Pet pet);

    // 根据ID删除（或逻辑删除）
    int deleteById(Integer id);

}