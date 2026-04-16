package org.example.modules.commentManage.service;

import org.example.modules.commentManage.entity.Comment;
import java.util.List;

/**
 * 评价服务接口
 */
public interface CommentService {

    /**
     * 根据商品ID查询评价列表
     * @param goodId 商品ID
     * @return 评价集合
     */
    List<Comment> getCommentByGoodId(Integer goodId);

    /**
     * 根据订单ID查询评价
     * @param orderId 订单ID
     * @return 评价集合
     */
    List<Comment> getCommentByOrderId(Integer orderId);

    /**
     * 新增评价
     * @param comment 评价对象
     * @return 操作是否成功
     */
    boolean addComment(Comment comment);

    /**
     * 删除评价
     * @param id 评价ID
     * @return 操作是否成功
     */
    boolean deleteComment(Integer id);
}
