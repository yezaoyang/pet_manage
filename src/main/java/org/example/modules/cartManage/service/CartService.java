package org.example.modules.cartManage.service;

import org.example.modules.cartManage.entity.Cart;

import java.util.List;

/**
 * 购物车服务接口
 */
public interface CartService {
    /**
     * 添加商品到购物车（已存在则更新数量，不存在则新增）
     * @param customerId 用户ID
     * @param goodId 商品ID
     * @param quantity 数量
     * @return 操作结果
     */
    boolean addCart(Integer customerId, Integer goodId, Integer quantity);

    /**
     * 根据用户ID查询购物车列表
     * @param customerId 用户ID
     * @return 购物车列表
     */
    List<Cart> getCartListByCustomerId(Integer customerId);

    /**
     * 更新购物车商品数量
     * @param id 购物车ID
     * @param quantity 新数量
     * @return 操作结果
     */
    boolean updateCartQuantity(Integer id, Integer quantity);

    /**
     * 删除购物车项
     * @param id 购物车ID
     * @return 操作结果
     */
    boolean deleteCartById(Integer id);

    /**
     * 清空用户购物车
     * @param customerId 用户ID
     * @return 操作结果
     */
    boolean clearCartByCustomerId(Integer customerId);
}
