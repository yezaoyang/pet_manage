package org.example.modules.customerManage.service;

import org.example.modules.customerManage.entity.Customer;

public interface CustomerService {
    Customer login(String username, String password);
    boolean register(Customer customer);
}