package org.example.modules.cartManage.controller;

import org.example.modules.cartManage.entity.Cart;
import org.example.modules.cartManage.service.CartService;
import org.example.modules.userManage.entity.Result; // 引入你的 Result 类
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 使用 RestController 替代 Controller + ResponseBody
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * 添加商品到购物车
     * 注意：如果前端发的是 JSON，请保留 @RequestBody；如果发的是 Form Data，请去掉它。
     */
    @PostMapping("/add")
    public Result<Void> addCart(@RequestBody Cart cart) {
        try {
            boolean success = cartService.addCart(cart.getCustomerId(), cart.getGoodId(), cart.getQuantity());
            return success ? Result.success() : Result.error("添加购物车失败");
        } catch (Exception e) {
            return Result.error("添加异常：" + e.getMessage());
        }
    }

    /**
     * 查询用户购物车列表
     */
    @GetMapping("/list")
    public Result<List<Cart>> getCartList(@RequestParam Integer customerId) {
        try {
            List<Cart> cartList = cartService.getCartListByCustomerId(customerId);
            return Result.success(cartList);
        } catch (Exception e) {
            return Result.error("查询异常：" + e.getMessage());
        }
    }

    /**
     * 更新购物车商品数量
     */
    @PostMapping("/update/quantity")
    public Result<Void> updateCartQuantity(@RequestParam Integer cartId, @RequestParam Integer quantity) {
        try {
            boolean success = cartService.updateCartQuantity(cartId, quantity);
            return success ? Result.success() : Result.error("更新数量失败");
        } catch (Exception e) {
            return Result.error("更新异常：" + e.getMessage());
        }
    }

    /**
     * 删除购物车项
     */
    @PostMapping("/delete")
    public Result<Void> deleteCart(@RequestParam Integer cartId) {
        try {
            boolean success = cartService.deleteCartById(cartId);
            return success ? Result.success() : Result.error("删除失败");
        } catch (Exception e) {
            return Result.error("删除异常：" + e.getMessage());
        }
    }

    /**
     * 清空购物车
     */
    @PostMapping("/clear")
    public Result<Void> clearCart(@RequestParam Integer customerId) {
        try {
            boolean success = cartService.clearCartByCustomerId(customerId);
            return success ? Result.success() : Result.error("清空失败");
        } catch (Exception e) {
            return Result.error("清空异常：" + e.getMessage());
        }
    }
}