package org.example.modules.boardManage.service;


import org.example.modules.boardManage.entity.AdminStatisticsVO;

public interface AdminStatisticsService {
    /**
     * 获取汇总后的仪表盘数据
     */
    AdminStatisticsVO getDashboardStats();
}