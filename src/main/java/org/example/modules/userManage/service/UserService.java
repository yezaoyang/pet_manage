package org.example.modules.userManage.service;

import org.example.modules.userManage.entity.User;
import java.util.List;

public interface UserService {
    List<User> findAll();
    User findById(Integer id);
    void save(User user);
    void update(User user);
    void delete(Integer id);
    void saveOrUpdate(User user);
    void deleteById(Integer id);
    User findByUsername(String username);
}
