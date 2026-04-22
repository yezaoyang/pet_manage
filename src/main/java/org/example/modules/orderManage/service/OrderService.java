package org.example.modules.orderManage.service;

import org.example.modules.orderManage.entity.Order;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public interface OrderService {
    List<Order> getOrderList(Integer offset, Integer size, String orderNo, Integer customerId);
    int getOrderCount(String orderNo, Integer customerId);
    public Order getOrderDetails(Integer id);

    public boolean deleteOrder(Integer id);
}