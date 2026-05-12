package org.example.modules.boardManage.controller;


import org.example.modules.boardManage.entity.AdminStatisticsVO;
import org.example.modules.boardManage.service.AdminStatisticsService;
import org.example.modules.userManage.entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/statistics")
public class AdminStatisticsController {

    @Autowired
    private AdminStatisticsService adminStatisticsService;

    @GetMapping("/dashboard")
    public Result getDashboard() {
        try {
            AdminStatisticsVO stats = adminStatisticsService.getDashboardStats();
            return Result.success(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("加载后台统计数据异常");
        }
    }
}