package org.example.modules.boardManage.dao;

import org.apache.ibatis.annotations.Mapper;
import org.example.modules.boardManage.entity.AdminStatisticsVO;

@Mapper
public interface AdminMapper {
    /**
     * 从数据库执行聚合查询，获取首页四个核心指标
     */
    AdminStatisticsVO getDashboardStats();
}
