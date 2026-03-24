package org.example.modules.goodManage.service.serviceImpl;

import org.example.modules.goodManage.dao.GoodMapper;
import org.example.modules.goodManage.entity.Good;
import org.example.modules.goodManage.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

import java.util.List;

@Service
public class GoodServiceImpl implements GoodService {

    @Autowired
    private GoodMapper goodMapper;

    @Override
    public List<Good> getAllActivePets() {
        // 这里可以添加业务逻辑，比如：只展示库存大于0的宠物
        return goodMapper.selectAllActive();
    }

    @Override
    public Good getPetById(Integer id) {
        return goodMapper.selectById(id);
    }

    @Transactional
    @Override
    public void update(Good good) {
        // 1. 安全守卫：必须有 ID
        if (good.getId() == null) {
            throw new RuntimeException("操作异常：未检测到商品ID");
        }

        // 2. 价格保护逻辑 (针对 price 关键字对应的业务)
        if (good.getPrice() != null) {
            // 规则：单价不得低于 0
            if (good.getPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("商城警告：商品定价不能为负数");
            }
        }

        // 3. 自动下架逻辑 (针对库存联动)
        if (good.getStock() != null && good.getStock() <= 0) {
            // 如果库存归零，系统强制修正状态
            good.setIsOnSale(0);      // 自动下架
            good.setAdoptStatus("Sold"); // 标记为已售罄
        }

        // 4. 上架合法性检查
        if (Integer.valueOf(1).equals(good.getIsOnSale())) {
            // 模拟检查：如果上架，必须有价格
            // 此处可以根据需求查询当前数据库，若没定价则抛出异常阻止上架
        }

        // 5. 执行数据库更新
        int count = goodMapper.update(good);

        if (count == 0) {
            throw new RuntimeException("系统提示：商品不存在或数据未发生变更");
        }
    }
}