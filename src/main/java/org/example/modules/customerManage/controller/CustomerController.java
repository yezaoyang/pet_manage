package org.example.modules.customerManage.controller;
import org.example.modules.customerManage.entity.Customer;
import org.example.modules.customerManage.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping("/login")
    public Map<String, Object> login(String username, String password, HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        Customer customer = customerService.login(username, password);

        if (customer != null) {
            // 登录成功，存入 Session
            session.setAttribute("customer", customer);
            result.put("code", 200);
            result.put("msg", "登录成功");
            result.put("data", customer);
        } else {
            result.put("code", 500);
            result.put("msg", "用户名或密码错误");
        }
        return result;
    }

    @PostMapping("/register")
    public Map<String, Object> register(Customer customer) {
        Map<String, Object> result = new HashMap<>();
        boolean success = customerService.register(customer);

        if (success) {
            result.put("code", 200);
            result.put("msg", "注册成功");
        } else {
            result.put("code", 500);
            result.put("msg", "注册失败，用户名可能已存在");
        }
        return result;
    }
}