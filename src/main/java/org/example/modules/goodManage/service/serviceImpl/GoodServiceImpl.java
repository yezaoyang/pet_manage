package org.example.modules.goodManage.service.serviceImpl;

import org.example.modules.goodManage.dao.GoodMapper;
import org.example.modules.goodManage.entity.Good;
import org.example.modules.goodManage.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GoodServiceImpl implements GoodService {
    @Autowired
    private GoodMapper goodMapper;

    @Override
    public List<Good> getGoodList(int offset, int size, String name) {
        return goodMapper.selectGoodList(offset, size, name);
    }

    @Override
    public int getGoodCount(String name) {
        return goodMapper.selectGoodCount(name);
    }

    @Override
    public boolean deleteGood(Long id) {
        return goodMapper.deleteById(id) > 0;
    }

    @Override
    public boolean addGood(Good good) {
        // 可以在这里设置一些默认值
        if (good.getIsOnSale() == null) {
            good.setIsOnSale(1); // 默认上架
        }
        return goodMapper.insert(good) > 0;
    }

    @Override
    public boolean updateGood(Good good) {
        return goodMapper.update(good) > 0;
    }

    @Override
    public Good getById(Long id) {
        return goodMapper.selectById(id);
    }
}