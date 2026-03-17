package org.example.petManage.service.serviceImpl;

import org.example.petManage.dao.PetMapper;
import org.example.petManage.entity.Pet;
import org.example.petManage.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetMapper petMapper;

    @Override
    public List<Pet> getAllActivePets() {
        // 这里可以添加业务逻辑，比如：只展示库存大于0的宠物
        return petMapper.selectAllActive();
    }

    @Override
    public Pet getPetById(Integer id) {
        return petMapper.selectById(id);
    }

    @Transactional
    @Override
    public void update(Pet pet) {
        // 1. 安全守卫：必须有 ID
        if (pet.getId() == null) {
            throw new RuntimeException("操作异常：未检测到商品ID");
        }

        // 2. 价格保护逻辑 (针对 price 关键字对应的业务)
        if (pet.getPrice() != null) {
            // 规则：单价不得低于 0
            if (pet.getPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("商城警告：商品定价不能为负数");
            }
        }

        // 3. 自动下架逻辑 (针对库存联动)
        if (pet.getStock() != null && pet.getStock() <= 0) {
            // 如果库存归零，系统强制修正状态
            pet.setIsOnSale(0);      // 自动下架
            pet.setAdoptStatus("Sold"); // 标记为已售罄
        }

        // 4. 上架合法性检查
        if (Integer.valueOf(1).equals(pet.getIsOnSale())) {
            // 模拟检查：如果上架，必须有价格
            // 此处可以根据需求查询当前数据库，若没定价则抛出异常阻止上架
        }

        // 5. 执行数据库更新
        int count = petMapper.update(pet);

        if (count == 0) {
            throw new RuntimeException("系统提示：商品不存在或数据未发生变更");
        }
    }
}