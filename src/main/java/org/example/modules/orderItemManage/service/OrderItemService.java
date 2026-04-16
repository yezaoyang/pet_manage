package org.example.modules.orderItemManage.service;

import org.example.modules.orderItemManage.entity.OrderItem;
import java.util.List;

public interface OrderItemService {

    /**
     * 根据订单ID查询订单明细
     * @param orderId 订单ID
     * @return 订单明细列表
     */
    List<OrderItem> getOrderItemByOrderId(Integer orderId);

    /**
     * 新增订单明细
     * @param orderItem 订单明细对象
     * @return 操作是否成功
     */
    boolean addOrderItem(OrderItem orderItem);

    /**
     * 根据订单ID删除该订单的所有明细
     * @param orderId 订单ID
     * @return 操作是否成功
     */
    boolean deleteOrderItemByOrderId(Integer orderId);
}
