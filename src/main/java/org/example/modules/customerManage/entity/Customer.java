package org.example.modules.customerManage.entity;

import org.example.modules.cartManage.entity.Cart;
import org.example.modules.orderManage.entity.Order;

import java.math.BigDecimal;
import java.util.List;

public class Customer {
    // 自身属性
    private Integer id;
    private String name;
    private String password;
    private String phone;
    private String address;
    private BigDecimal balance;
    private Integer status;
    // 高频核心关联：用户的订单、购物车
    private List<Order> orderList;
    private List<Cart> cartList;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public List<Order> getOrderList() {
        return orderList;
    }

    public void setOrderList(List<Order> orderList) {
        this.orderList = orderList;
    }

    public List<Cart> getCartList() {
        return cartList;
    }

    public void setCartList(List<Cart> cartList) {
        this.cartList = cartList;
    }
    // getter/setter
}
