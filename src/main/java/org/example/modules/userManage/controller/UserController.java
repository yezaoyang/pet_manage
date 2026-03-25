package org.example.modules.userManage.controller;
import org.example.modules.userManage.entity.Result;
import org.example.modules.userManage.entity.User;
import org.example.modules.userManage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;


@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    // 1. 查询用户列表 (所有管理员可见 - 只读权限)
    @GetMapping("/list")
    public Result list() {
        return Result.success(userService.findAll());
    }

    // 2. 新增或修改管理员 (仅 role=1 可操作)
    @PostMapping("/save")
    public Result save(@RequestBody User user, HttpSession session) {
        User currentUser = (User) session.getAttribute("loginUser");

        // 权限校验：如果不是超级管理员(1)，拒绝操作
        if (currentUser.getRole() != 1) {
            return Result.error("权限不足：只有超级管理员可以编辑账号");
        }

        userService.saveOrUpdate(user);
        return Result.success();
    }

    // 3. 删除管理员 (仅 role=1 可操作)
    @PostMapping("/delete")
    public Result delete(Integer id, HttpSession session) {
        User currentUser = (User) session.getAttribute("loginUser");

        if (currentUser.getRole() != 1) {
            return Result.error("权限不足：无法删除");
        }

        userService.deleteById(id);
        return Result.success();
    }
    @PostMapping("/login")
    public Result login(@RequestBody User loginParam, HttpSession session) {
        // 1. 基础校验
        if (loginParam.getUsername() == null || loginParam.getPassword() == null) {
            return Result.error("用户名或密码不能为空");
        }

        // 2. 数据库查询
        User user = userService.findByUsername(loginParam.getUsername());

        // 3. 逻辑验证
        if (user == null) {
            return Result.error("账号不存在");
        }

        if (!user.getPassword().equals(loginParam.getPassword())) {
            return Result.error("密码错误");
        }

        // 4. 登录成功：存入 Session
        // 注意：将完整的用户对象存入，方便后续 Interceptor 校验 role
        session.setAttribute("loginUser", user);

        // 5. 返回脱敏后的用户信息（不返回密码）
        user.setPassword(null);
        return Result.success(user);
    }

    @PostMapping("/logout")
    public Result logout(HttpSession session) {
        session.invalidate(); // 销毁当前会话
        return Result.success("退出成功");
    }

}
