package org.example.modules.commentManage.service.serviceImpl;

import org.example.modules.commentManage.entity.Comment;
import org.example.modules.commentManage.dao.CommentMapper;
import org.example.modules.commentManage.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * 评价服务实现类
 */
@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public List<Comment> getCommentByGoodId(Integer goodId) {
        return commentMapper.selectByGoodId(goodId);
    }

    @Override
    public List<Comment> getCommentByOrderId(Integer orderId) {
        return commentMapper.selectByOrderId(orderId);
    }

    @Override
    public boolean addComment(Comment comment) {
        // 新增时默认状态：1-已发布（可根据业务改为0-待审核）
        if (comment.getCommentStatus() == null) {
            comment.setCommentStatus(1);
        }
        return commentMapper.insert(comment) > 0;
    }

    @Override
    public boolean deleteComment(Integer id) {
        return commentMapper.deleteById(id) > 0;
    }
}
