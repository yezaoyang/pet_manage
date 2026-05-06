package org.example.modules.userManage.dao;

import org.apache.ibatis.annotations.Param;
import org.example.modules.userManage.entity.User;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface UserMapper {
    List<User> selectAll();
    User selectById(Integer id);
    void insert(User user);
    void update(User user);
    void deleteById(Integer id);
    User selectByUsername(String username);
    void removeByIds(List<Integer> ids);
}