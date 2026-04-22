package org.example.modules.orderManage.service.serviceImpl;

import org.example.modules.orderManage.entity.Order;
import org.example.modules.orderManage.dao.OrderMapper;
import org.example.modules.orderManage.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    /**
     * 获取订单分页列表
     * @param orderNo 订单编号（支持模糊搜索）
     * @param customerId 顾客ID
     * @return 订单对象列表
     */
    @Override
    public List<Order> getOrderList(Integer offset, Integer size, String orderNo, Integer customerId) {
        return orderMapper.selectOrderList(offset, size, orderNo, customerId);
    }

    @Override
    public int getOrderCount(String orderNo, Integer customerId) {
        return orderMapper.selectOrderCount(orderNo, customerId);
    }

    /**
     * 获取订单详情（包含明细列表）
     * @param id 订单主键ID
     * @return 完整的订单对象
     */
    @Override
    public Order getOrderDetails(Integer id) {
        if (id == null) {
            return null;
        }
        return orderMapper.selectOrderById(id);
    }

    /**
     * 删除订单及其关联的明细
     * 使用 @Transactional 保证主表和从表要么同时删成功，要么同时失败
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteOrder(Integer id) {
        // 1. 如果数据库没有设置级联删除，通常需要先删除明细表（order_item）
        // 这里假设你在 Mapper 中实现了对应的删除方法
        // orderMapper.deleteItemsByOrderId(id);

        // 2. 删除订单主表
        int rows = orderMapper.deleteOrderById(id);

        return rows > 0;
    }
}