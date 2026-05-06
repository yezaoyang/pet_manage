package org.example.modules.orderManage.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.modules.orderManage.entity.Order;
import java.util.List;

@Mapper
public interface OrderMapper {
    List<Order> selectOrderList(@Param("offset") Integer offset,
                                @Param("size") Integer size,
                                @Param("orderNo") String orderNo,
                                @Param("customerId") Integer customerId);

    int selectOrderCount(@Param("orderNo") String orderNo,
                         @Param("customerId") Integer customerId);
    // 根据ID获取订单及明细（详情查看）
    Order selectOrderById(Integer id);

    // 删除订单
    int deleteOrderById(Integer id);
}