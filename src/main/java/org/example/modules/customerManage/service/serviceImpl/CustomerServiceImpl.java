package org.example.modules.customerManage.service.serviceImpl;

import org.example.modules.customerManage.dao.CustomerMapper;
import org.example.modules.customerManage.entity.Customer;
import org.example.modules.customerManage.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerMapper customerMapper;

    @Override
    public Customer login(String username, String password) {
        Customer customer = customerMapper.selectByUsername(username);
        // 校验密码（实际项目建议使用 MD5 加密后对比）
        if (customer != null && customer.getPassword().equals(password)) {
            return customer;
        }
        return null;
    }

    @Override
    public boolean register(Customer customer) {
        // 1. 检查用户名是否已存在
        if (customerMapper.selectByUsername(customer.getName()) != null) {
            return false;
        }
        // 2. 执行插入
        return customerMapper.insert(customer) > 0;
    }
}
