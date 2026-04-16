package org.example.modules.orderItemManage.dao;

import org.apache.ibatis.annotations.Param;
import org.example.modules.orderItemManage.entity.OrderItem;
import java.util.List;

public interface OrderItemMapper {

    /**
     * 根据订单ID查询订单明细列表
     * @param orderId 订单ID
     * @return 订单明细集合
     */
    List<OrderItem> selectByOrderId(Integer orderId);

    /**
     * 新增订单明细
     * @param orderItem 订单明细对象
     * @return 受影响行数
     */
    int insert(OrderItem orderItem);

    /**
     * 根据订单ID删除该订单的所有明细
     * @param orderId 订单ID
     * @return 受影响行数
     */
    int deleteByOrderId(Integer orderId);
}
