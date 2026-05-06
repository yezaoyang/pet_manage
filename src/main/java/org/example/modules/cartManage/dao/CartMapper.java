package org.example.modules.cartManage.dao;

import org.example.modules.cartManage.entity.Cart;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 购物车Mapper接口
 */
public interface CartMapper {
    /**
     * 新增购物车项
     * @param cart 购物车对象
     * @return 受影响行数
     */
    int insertCart(Cart cart);

    /**
     * 根据用户ID和商品ID查询购物车项
     * @param userId 用户ID
     * @param goodsId 商品ID
     * @return 购物车项
     */
    Cart selectCartByUserIdAndGoodsId(@Param("userId") Integer userId, @Param("goodsId") Integer goodsId);

    /**
     * 根据ID更新购物车商品数量
     * @param id 购物车ID
     * @param quantity 新数量
     * @return 受影响行数
     */
    int updateQuantityById(@Param("id") Integer id, @Param("quantity") Integer quantity);

    /**
     * 根据用户ID查询购物车列表
     * @param userId 用户ID
     * @return 购物车列表
     */
    List<Cart> selectCartListByUserId(Integer userId);

    /**
     * 根据ID删除购物车项
     * @param id 购物车ID
     * @return 受影响行数
     */
    int deleteCartById(Integer id);

    /**
     * 清空用户购物车
     * @param userId 用户ID
     * @return 受影响行数
     */
    int deleteCartByUserId(Integer userId);
}