package org.example.modules.memberManage.controller;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        Object user = session.getAttribute("loginUser");

        if (user != null) {
            return true; // 已登录，放行
        }

        // --- 执行跳转逻辑 ---
        // 1. 获取项目路径 (ContextPath)，防止绝对路径失效
        String contextPath = request.getContextPath();

        // 2. 核心：重定向到登录页
        // 注意：路径一定要写对，通常是 /login.html 或 /project/login.html
        response.sendRedirect(contextPath + "/login.html");

        return false; // 拦截请求，不再向下执行
    }
}