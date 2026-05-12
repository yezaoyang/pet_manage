package org.example.modules.boardManage.entity;

import java.math.BigDecimal;

public class AdminStatisticsVO {
    private Integer pendingOrders;    // 未完成订单
    private BigDecimal monthlyRevenue; // 本月销售额
    private Integer totalCustomers;    // 会员总数
    private Integer stockWarningCount; // 库存告急数

    public Integer getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Integer pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public BigDecimal getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(BigDecimal monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public Integer getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Integer totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Integer getStockWarningCount() {
        return stockWarningCount;
    }

    public void setStockWarningCount(Integer stockWarningCount) {
        this.stockWarningCount = stockWarningCount;
    }
}