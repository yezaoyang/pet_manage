package org.example.modules.goodManage.service;

import org.example.modules.goodManage.entity.Good;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GoodService {
    List<Good> getAllActivePets();
    Good getPetById(Integer id);
    // 涉及商城资产，必须开启事务
    @Transactional
    void update(Good good);
}