package org.example.modules.userManage.entity;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String username;
    private String password; // 注意：实际开发中返回前端时应过滤掉密码，或设为 @JsonIgnore
    private String email;

    /**
     * 角色：1-超级管理员，2-普通管理员
     */
    private Integer role;

    /**
     * 创建时间
     * pattern 定制 JSON 序列化后的格式
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;

    // --- 无参构造函数 ---
    public User() {}

    // --- Getters and Setters ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getRole() { return role; }
    public void setRole(Integer role) { this.role = role; }

    public Date getCreateTime() { return createTime; }
    public void setCreateTime(Date createTime) { this.createTime = createTime; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + "'" +
                ", email='" + email + "'" +
                ", role=" + role +
                ", createTime=" + createTime +
                '}';
    }
}
