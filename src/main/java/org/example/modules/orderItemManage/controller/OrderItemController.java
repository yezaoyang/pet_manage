package org.example.modules.orderItemManage.controller;

import org.example.modules.orderItemManage.entity.OrderItem;
import org.example.modules.orderItemManage.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/orderItem")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    /**
     * 根据订单ID查询订单明细
     * @param orderId 订单ID
     * @return 明细列表
     */
    @GetMapping("/list/{orderId}")
    @ResponseBody
    public Map<String, Object> getOrderItemList(@PathVariable Integer orderId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<OrderItem> itemList = orderItemService.getOrderItemByOrderId(orderId);
            result.put("success", true);
            result.put("data", itemList);
            result.put("message", "查询成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "查询失败：" + e.getMessage());
        }
        return result;
    }

    /**
     * 新增订单明细
     * @param orderItem 订单明细对象
     * @return 操作结果
     */
    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addOrderItem(@RequestBody OrderItem orderItem) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = orderItemService.addOrderItem(orderItem);
            result.put("success", success);
            result.put("message", success ? "新增成功" : "新增失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "新增失败：" + e.getMessage());
        }
        return result;
    }

    /**
     * 根据订单ID删除该订单的所有明细
     * @param orderId 订单ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{orderId}")
    @ResponseBody
    public Map<String, Object> deleteOrderItem(@PathVariable Integer orderId) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = orderItemService.deleteOrderItemByOrderId(orderId);
            result.put("success", success);
            result.put("message", success ? "删除成功" : "删除失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "删除失败：" + e.getMessage());
        }
        return result;
    }
}
