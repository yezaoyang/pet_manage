package org.example.petManage.service;

import org.example.petManage.entity.Pet;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PetService {
    List<Pet> getAllActivePets();
    Pet getPetById(Integer id);
    // 涉及商城资产，必须开启事务
    @Transactional
    void update(Pet pet);
}