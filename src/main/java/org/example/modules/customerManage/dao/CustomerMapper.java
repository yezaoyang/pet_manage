package org.example.modules.customerManage.dao;
import org.example.modules.customerManage.entity.Customer;
import org.apache.ibatis.annotations.Param;

public interface CustomerMapper {
    // 根据用户名查询客户（用于登录验证和注册查重）
    Customer selectByUsername(@Param("name") String name);

    // 插入新客户（用于注册）
    int insert(Customer customer);
}