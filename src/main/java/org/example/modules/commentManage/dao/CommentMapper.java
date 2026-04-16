package org.example.modules.commentManage.dao;

import org.apache.ibatis.annotations.Param;
import org.example.modules.commentManage.entity.Comment;
import java.util.List;

/**
 * 评价Mapper接口
 */
public interface CommentMapper {

    /**
     * 根据商品ID查询评价列表（需求1）
     * @param goodId 商品ID
     * @return 评价集合（默认只查已发布状态）
     */
    List<Comment> selectByGoodId(@Param("goodId") Integer goodId);

    /**
     * 根据订单ID查询评价（需求2）
     * @param orderId 订单ID
     * @return 评价集合（一个订单对应一条评价）
     */
    List<Comment> selectByOrderId(@Param("orderId") Integer orderId);

    /**
     * 新增评价（需求3）
     * @param comment 评价对象
     * @return 受影响行数
     */
    int insert(Comment comment);

    /**
     * 删除评价（需求4：按评价ID删除，支持逻辑删除/物理删除）
     * @param id 评价ID
     * @return 受影响行数
     */
    int deleteById(Integer id);
}
