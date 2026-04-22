package org.example.modules.goodManage.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.modules.goodManage.entity.Good;
import java.util.List;

@Mapper
public interface GoodMapper {
    // 分页查询
    List<Good> selectGoodList(@Param("offset") int offset,
                              @Param("size") int size,
                              @Param("name") String name);

    // 查询总数
    int selectGoodCount(@Param("name") String name);

    // 根据ID查询
    Good selectById(Long id);

    // 更新商品（包含上下架）
    int update(Good good);

    // 删除
    int deleteById(Long id);

    // 新增
    int insert(Good good);
}