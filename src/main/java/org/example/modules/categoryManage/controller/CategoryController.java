package org.example.modules.categoryManage.controller;

import org.example.modules.categoryManage.entity.Category;
import org.example.modules.categoryManage.service.CategoryService;
import org.example.modules.userManage.entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;


    @GetMapping("/list")
    public Result list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            Integer id, // 先用 String 接收，避免空字符串转 Integer 报错
            String name,
            String level
    ) {
        // 处理 ID 转换
        int offset = (page - 1) * size;

        List<Category> list = categoryService.getAllWithParent(offset, size, id, name, level);
        int total = categoryService.count(id, name, level);

        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        data.put("total", total);
        return Result.success(data);
    }

    @PostMapping("/save")
    public Result save(@RequestBody Category category) {
        Map<String, Object> map = new HashMap<>();
        boolean res = categoryService.saveOrUpdate(category);
        if(res)
        {
            return Result.success();
        }else {return Result.error("保存更新失败");
        }
    }

    @PostMapping("/delete") // 为了方便测试，使用 POST 接收 ID
    public Result delete(@RequestParam Integer id) {
        Map<String, Object> map = new HashMap<>();
        String result = categoryService.deleteCategory(id);
        if ("success".equals(result)) {
           return Result.success();
        } else {
           return Result.error(result);
        }
    }
}