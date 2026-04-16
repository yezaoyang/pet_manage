package org.example.modules.cartManage.service.serviceImpl;

import org.example.modules.cartManage.entity.Cart;
import org.example.modules.cartManage.dao.CartMapper;
import org.example.modules.cartManage.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * 购物车服务实现类
 */
@Service
@Transactional
public  class CartServiceImpl implements CartService {

    @Autowired
    private CartMapper cartMapper;

    @Override
    public boolean addCart(Integer customerId, Integer goodId, Integer quantity) {
        // 1. 查询该用户是否已添加该商品到购物车
        Cart existCart = cartMapper.selectCartByUserIdAndGoodsId(customerId, goodId);
        if (existCart != null) {
            // 2. 已存在则更新数量（原数量+新数量）
            int newQuantity = existCart.getQuantity() + quantity;
            return cartMapper.updateQuantityById(existCart.getId(), newQuantity) > 0;
        } else {
            // 3. 不存在则新增
            Cart cart = new Cart(customerId, goodId, quantity);
            return cartMapper.insertCart(cart) > 0;
        }
    }

    @Override
    public List<Cart> getCartListByCustomerId(Integer customerId) {
        return cartMapper.selectCartListByUserId(customerId);
    }

    @Override
    public boolean updateCartQuantity(Integer cartId, Integer quantity) {
        // 数量校验（至少1件）
        if (quantity < 1) {
            return false;
        }
        return cartMapper.updateQuantityById(cartId, quantity) > 0;
    }

    @Override
    public boolean deleteCartById(Integer cartId) {
        return cartMapper.deleteCartById(cartId) > 0;
    }

    @Override
    public boolean clearCartByCustomerId(Integer customerId) {
        return cartMapper.deleteCartByUserId(customerId) > 0;
    }
}