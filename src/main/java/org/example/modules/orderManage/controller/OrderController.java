package org.example.modules.orderManage.controller;

import org.example.modules.orderManage.entity.Order;
import org.example.modules.orderManage.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 获取订单列表
     */
    @GetMapping("/list")
    public Map<String, Object> getList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(required = false) String orderNo,
            @RequestParam(required = false) Integer customerId
    ) {
        // 1. 手动计算偏移量 (逻辑与分类管理一致)
        int offset = (page - 1) * size;

        // 2. 调用 Service 获取当前页数据和总条数
        List<Order> list = orderService.getOrderList(offset, size, orderNo, customerId);
        int total = orderService.getOrderCount(orderNo, customerId);

        // 3. 封装返回结果
        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        data.put("total", total);

        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("msg", "查询成功");
        result.put("data", data);
        return result;
    }

    /**
     * 获取订单详情（包含明细）
     */
    @GetMapping("/detail/{id}")
    public Map<String, Object> getDetail(@PathVariable Integer id) {
        Order order = orderService.getOrderDetails(id);
        Map<String, Object> result = new HashMap<>();
        if (order != null) {
            result.put("code", 200);
            result.put("data", order);
        } else {
            result.put("code", 404);
            result.put("msg", "未找到该订单");
        }
        return result;
    }

    /**
     * 删除订单
     */
    @DeleteMapping("/delete/{id}")
    public Map<String, Object> delete(@PathVariable Integer id) {
        boolean success = orderService.deleteOrder(id);
        Map<String, Object> result = new HashMap<>();
        if (success) {
            result.put("code", 200);
            result.put("msg", "删除成功");
        } else {
            result.put("code", 500);
            result.put("msg", "删除失败");
        }
        return result;
    }
}