package org.example.modules.orderManage.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.modules.orderManage.entity.Order;
import org.example.modules.orderManage.entity.OrderItem;

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
    /**
     * 插入订单主表
     * 配合 XML 中的 useGeneratedKeys 会回填 id 属性
     */
    int insertOrder(Order order);

    /**
     * 批量插入订单详情项
     * @param list 订单明细集合
     */
    int insertOrderItems(List<OrderItem> list);

    /**
     * 更新订单状态
     * @param orderNo 订单编号
     * @param status 状态值 (0:未完成, 2:已完成)
     */
    int updateStatusByNo(@Param("orderNo") String orderNo, @Param("status") Integer status);
}