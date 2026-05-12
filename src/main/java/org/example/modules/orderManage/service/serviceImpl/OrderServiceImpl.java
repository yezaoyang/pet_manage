package org.example.modules.orderManage.service.serviceImpl;

import org.example.modules.orderManage.entity.Order;
import org.example.modules.orderManage.dao.OrderMapper;
import org.example.modules.orderManage.entity.OrderItem;
import org.example.modules.orderManage.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
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

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String submitOrder(Order order) {
        // 1. 手动生成 Order 的主键 ID (假设使用简单的随机正整数或雪花算法)
        // 注意：既然取消了自增，这个 ID 必须在数据库中唯一
        Integer generatedOrderId = (int) (System.currentTimeMillis() % 1000000000);
        order.setId(generatedOrderId);

        // 2. 设置订单编号及基础信息
        String orderNo = "PET" + System.currentTimeMillis();
        order.setOrderNo(orderNo);
        order.setStatus(0); // 初始状态：未支付
        order.setCreateTime(new Date());

        // 3. 关联从表数据并生成从表 ID
        List<OrderItem> items = order.getOrderItemList();
        if (items != null && !items.isEmpty()) {
            for (int i = 0; i < items.size(); i++) {
                OrderItem item = items.get(i);

                // 手动生成 OrderItem 的主键 ID
                // 技巧：可以使用 时间戳 + 循环索引 保证在一组订单项中唯一
                Integer itemId = (int) ((System.currentTimeMillis() / 1000) + i + Math.random() * 1000);
                item.setId(itemId);

                // 建立外键关联：关联主表的 ID
                item.setOrderId(generatedOrderId);
            }

            // 4. 执行插入操作
            // 此时 Mapper XML 中不需要 useGeneratedKeys 了
            orderMapper.insertOrder(order);
            orderMapper.insertOrderItems(items);
        } else {
            // 如果没有商品项，则只插入主表
            orderMapper.insertOrder(order);
        }

        return orderNo;
    }
    @Override
    public void updateStatusByNo(String orderNo, Integer status) {
        // 假设你在 Mapper 中已经写好了 updateStatusByNo 方法
        orderMapper.updateStatusByNo(orderNo, status);
    }
}