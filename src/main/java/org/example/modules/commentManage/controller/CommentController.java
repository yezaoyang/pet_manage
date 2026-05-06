package org.example.modules.commentManage.controller;

import org.example.modules.commentManage.entity.Comment;
import org.example.modules.commentManage.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 评价控制器
 */
@Controller
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    /**
     * 1. 根据商品ID查询评价列表
     * @param goodId 商品ID
     * @return 评价数据
     */
    @GetMapping("/list/good/{goodId}")
    @ResponseBody
    public Map<String, Object> getCommentByGoodId(@PathVariable Integer goodId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Comment> commentList = commentService.getCommentByGoodId(goodId);
            result.put("success", true);
            result.put("data", commentList);
            result.put("message", "查询成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "查询失败：" + e.getMessage());
        }
        return result;
    }

    /**
     * 2. 根据订单ID查询评价
     * @param orderId 订单ID
     * @return 评价数据
     */
    @GetMapping("/list/order/{orderId}")
    @ResponseBody
    public Map<String, Object> getCommentByOrderId(@PathVariable Integer orderId) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Comment> commentList = commentService.getCommentByOrderId(orderId);
            result.put("success", true);
            result.put("data", commentList);
            result.put("message", "查询成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "查询失败：" + e.getMessage());
        }
        return result;
    }

    /**
     * 3. 新增评价
     * @param comment 评价对象（JSON格式入参）
     * @return 操作结果
     */
    @PostMapping("/add")
    @ResponseBody
    public Map<String, Object> addComment(@RequestBody Comment comment) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = commentService.addComment(comment);
            result.put("success", success);
            result.put("message", success ? "评价发布成功" : "评价发布失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "评价发布失败：" + e.getMessage());
        }
        return result;
    }

    /**
     * 4. 删除评价
     * @param id 评价ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    @ResponseBody
    public Map<String, Object> deleteComment(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = commentService.deleteComment(id);
            result.put("success", success);
            result.put("message", success ? "删除成功" : "删除失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "删除失败：" + e.getMessage());
        }
        return result;
    }
}
