package org.example.modules.userManage.service.serviceImpl;

import org.example.modules.userManage.entity.User;
import org.example.modules.userManage.dao.UserMapper;
import org.example.modules.userManage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<User> findAll() {
        return userMapper.selectAll();
    }

    @Override
    public User findById(Integer id) {
        return userMapper.selectById(id);
    }

    @Override
    public void save(User user) {
        // 这里可以对初始密码进行 MD5 加密
        userMapper.insert(user);
    }

    @Override
    public void update(User user) {
        userMapper.update(user);
    }

    @Override
    public void delete(Integer id) {
        userMapper.deleteById(id);
    }

    @Override
    public void saveOrUpdate(User user) {
        if (user.getId() == null) {
            // 新增时设置初始创建时间
            user.setCreateTime(new Date());
            userMapper.insert(user);
        } else {
            userMapper.update(user);
        }
    }
    @Override
    public void deleteById(Integer id) {
        userMapper.deleteById(id);
    }
    @Override
    public User findByUsername(String username) {
        return userMapper.selectByUsername(username);
    }
}