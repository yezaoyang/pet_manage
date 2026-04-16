package org.example.modules.orderItemManage.service.serviceImpl;

import org.example.modules.orderItemManage.entity.OrderItem;
import org.example.modules.orderItemManage.dao.OrderItemMapper;
import org.example.modules.orderItemManage.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Override
    public List<OrderItem> getOrderItemByOrderId(Integer orderId) {
        return orderItemMapper.selectByOrderId(orderId);
    }

    @Override
    public boolean addOrderItem(OrderItem orderItem) {
        return orderItemMapper.insert(orderItem) > 0;
    }

    @Override
    public boolean deleteOrderItemByOrderId(Integer orderId) {
        return orderItemMapper.deleteByOrderId(orderId) > 0;
    }
}
