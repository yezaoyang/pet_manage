package org.example.modules.boardManage.service.impl;


import org.example.modules.boardManage.dao.AdminMapper;
import org.example.modules.boardManage.entity.AdminStatisticsVO;
import org.example.modules.boardManage.service.AdminStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

@Service
public class AdminStatisticsServiceImpl implements AdminStatisticsService {

    @Autowired
    private AdminMapper adminMapper;

    @Override
    public AdminStatisticsVO getDashboardStats() {
        AdminStatisticsVO stats = adminMapper.getDashboardStats();

        // 防御性编程：确保返回给前端的数据不为 null
        if (stats == null) {
            stats = new AdminStatisticsVO();
            stats.setPendingOrders(0);
            stats.setMonthlyRevenue(BigDecimal.ZERO);
            stats.setTotalCustomers(0);
            stats.setStockWarningCount(0);
        }
        return stats;
    }
}
