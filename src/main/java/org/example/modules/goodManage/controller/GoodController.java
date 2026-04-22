package org.example.modules.goodManage.controller;

import org.example.modules.goodManage.entity.Good;
import org.example.modules.goodManage.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/good")
public class GoodController {

    @Autowired
    private GoodService goodService;

    @GetMapping("/list")
    public Map<String, Object> list(@RequestParam(defaultValue = "1") int page,
                                    @RequestParam(defaultValue = "5") int size,
                                    @RequestParam(required = false) String name) {
        int offset = (page - 1) * size;
        Map<String, Object> data = new HashMap<>();
        data.put("list", goodService.getGoodList(offset, size, name));
        data.put("total", goodService.getGoodCount(name));

        Map<String, Object> res = new HashMap<>();
        res.put("code", 200);
        res.put("data", data);
        return res;
    }

    @PostMapping("/toggleSale")
    public Map<String, Object> toggleSale(@RequestParam Long id, @RequestParam Integer status) {
        Good good = new Good();
        good.setId(id);
        good.setIsOnSale(status);
        boolean success = goodService.updateGood(good);

        Map<String, Object> res = new HashMap<>();
        res.put("code", success ? 200 : 500);
        res.put("msg", success ? "操作成功" : "操作失败");
        return res;
    }

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        boolean success = goodService.deleteGood(id);
        Map<String, Object> res = new HashMap<>();
        res.put("code", success ? 200 : 500);
        return res;
    }

    @PostMapping("/add")
    public Map<String, Object> add(@RequestBody Good good) {
        boolean success = goodService.addGood(good);
        Map<String, Object> res = new HashMap<>();
        res.put("code", success ? 200 : 500);
        res.put("msg", success ? "新增成功" : "新增失败");
        return res;
    }

    @PostMapping("/update")
    public Map<String, Object> update(@RequestBody Good good) {
        boolean success = goodService.updateGood(good);
        Map<String, Object> res = new HashMap<>();
        res.put("code", success ? 200 : 500);
        res.put("msg", success ? "修改成功" : "修改失败");
        return res;
    }

    @GetMapping("/getById")
    public Good getById(@RequestParam Long id) {
        // 直接返回对象，前端 jQuery 会自动解析
        return goodService.getById(id);
    }
}