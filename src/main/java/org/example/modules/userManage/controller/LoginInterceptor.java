package org.example.modules.userManage.controller;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        String uri = request.getRequestURI(); // 获取用户访问的地址
        // 强制所有通过拦截器的响应都支持 UTF-8
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");



        // 情况 B：如果是访问后台相关的接口或页面 (假设路径包含 /admin/ 或 /api/admin/)
        if (uri.contains("/admin/") || uri.contains("/api/good/")) {
            Object user = session.getAttribute("loginUser");
            if (user == null) {
                return handleUnauthenticated(request, response, "/login.html");
            }
            return true;
        }
        // 针对前台 API 的拦截逻辑
//        if (uri.contains("/api/cart/") || uri.contains("/client/")) {
//            Object customer = session.getAttribute("customerInfo");
//            if (customer == null) {
//                // 必须在获取 writer 之前设置编码
//                response.setContentType("text/html;charset=UTF-8");
//                response.setCharacterEncoding("UTF-8");
//
//                if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
//                    response.getWriter().write("{\"code\":401, \"msg\":\"请先登录\"}");
//                } else {
//                    response.sendRedirect(request.getContextPath() + "/html/client/login.html");
//                }
//                return false;
//            }
//        }

        return true; // 其他路径（如首页）默认放行
    }

    // 提取公共的拦截处理方法
    private boolean handleUnauthenticated(HttpServletRequest request, HttpServletResponse response, String redirectPath) throws Exception {
        String requestedWith = request.getHeader("X-Requested-With");
        if ("XMLHttpRequest".equals(requestedWith)) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"code\":401, \"msg\":\"Not logged in\"}");
        } else {
            // 加上 ContextPath 保证路径正确
            response.sendRedirect(request.getContextPath() + redirectPath);
        }
        return false;
    }
}