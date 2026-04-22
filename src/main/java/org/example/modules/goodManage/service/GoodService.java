package org.example.modules.goodManage.service;

import org.example.modules.goodManage.entity.Good;
import java.util.List;

public interface GoodService {
    List<Good> getGoodList(int offset, int size, String name);
    int getGoodCount(String name);
    boolean updateGood(Good good);
    boolean deleteGood(Long id);
    boolean addGood(Good good);
    Good getById(Long id);
}