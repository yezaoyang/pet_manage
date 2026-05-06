package org.example.modules.cartManage.controller;

import org.example.modules.cartManage.entity.Cart;
import org.example.modules.cartManage.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 购物车控制器
 */
@Controller
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;


    /**
     * 添加商品到购物车
     * @param customerId 用户ID
     * @param goodId 商品ID
     * @param quantity 数量
     * @return 结果JSON
     */
    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addCart(
            @RequestParam Integer customerId,
            @RequestParam Integer goodId,
            @RequestParam(defaultValue = "1") Integer quantity,
            @RequestParam Double price) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = cartService.addCart(customerId, goodId, quantity);
            result.put("success", success);
            result.put("message", success ? "添加购物车成功" : "添加购物车失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "添加购物车异常：" + e.getMessage());
        }
        return result;
    }

    /**
     * 查询用户购物车列表
     * @param customerId 用户ID
     * @return 结果JSON
     */
    @GetMapping("/list")
    @ResponseBody
    public Map<String, Object> getCartList(@RequestParam Integer customerId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Cart> cartList = cartService.getCartListByCustomerId(customerId);
            result.put("success", true);
            result.put("data", cartList);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "查询购物车异常：" + e.getMessage());
        }
        return result;
    }

    /**
     * 更新购物车商品数量
     * @param cartId 购物车ID
     * @param quantity 新数量
     * @return 结果JSON
     */
    @PostMapping("/update/quantity")
    @ResponseBody
    public Map<String, Object> updateCartQuantity(
            @RequestParam Integer cartId,
            @RequestParam Integer quantity) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = cartService.updateCartQuantity(cartId, quantity);
            result.put("success", success);
            result.put("message", success ? "更新数量成功" : "更新数量失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "更新数量异常：" + e.getMessage());
        }
        return result;
    }

    /**
     * 删除购物车项
     * @param cartId 购物车ID
     * @return 结果JSON
     */
    @PostMapping("/delete")
    @ResponseBody
    public Map<String, Object> deleteCart(@RequestParam Integer cartId) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = cartService.deleteCartById(cartId);
            result.put("success", success);
            result.put("message", success ? "删除购物车项成功" : "删除购物车项失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "删除购物车项异常：" + e.getMessage());
        }
        return result;
    }

    /**
     * 清空购物车
     * @param customerId 用户ID
     * @return 结果JSON
     */
    @PostMapping("/clear")
    @ResponseBody
    public Map<String, Object> clearCart(@RequestParam Integer customerId) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = cartService.clearCartByCustomerId(customerId);
            result.put("success", success);
            result.put("message", success ? "清空购物车成功" : "清空购物车失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "清空购物车异常：" + e.getMessage());
        }
        return result;
    }
}