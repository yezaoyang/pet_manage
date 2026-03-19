package org.example.modules.goodManage.controller;

import org.example.modules.goodManage.entity.Good;
import org.example.modules.goodManage.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 使用 @RestController 替代 @Controller
 * 这样类中所有方法都会直接返回数据给前端，不再跳转 JSP
 */
@RestController
@RequestMapping("/api/good")
@CrossOrigin(origins = "*") // 允许跨域，方便前端调试
public class GoodController {

    @Autowired
    private GoodService petService;

    // 获取所有宠物列表
    @GetMapping("/list")
    public List<Good> list() {
        return petService.getAllActivePets();
    }

    // 根据 ID 获取宠物详情
    @GetMapping("/getById")
    public Good getById(@RequestParam("id") Integer id) {
        return petService.getPetById(id);
    }

    // 删除宠物接口示例
    @PostMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        // 这里调用 service 的删除逻辑
        // petService.deleteById(id);
        return "success";
    }

    // 切换上下架状态的接口
    @PostMapping("/toggleSale")
    public String toggleSale(@RequestParam("id") Integer id, @RequestParam("status") Integer status) {
        // status: 1 为上架，0 为下架
        Good good = petService.getPetById(id);
        good.setIsOnSale(status);
        petService.update(good);
        return "success";
    }
}