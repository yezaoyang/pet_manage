package org.example;

import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/client")
public class ClientPageController {

    @GetMapping(value = "/loadPage/{pageName}", produces = "text/html;charset=UTF-8")
    public String loadPage(@PathVariable String pageName, HttpServletRequest request) {
        // 1. 防御性检查：防止 pageName 包含 .. 等攻击字符
        if (pageName == null || pageName.contains("..") || pageName.contains("/")) {
            return "非法请求";
        }

        String path = "/WEB-INF/pages/client/" + pageName + ".html";

        // 2. 使用 try-with-resources 自动关闭流
        try (InputStream is = request.getServletContext().getResourceAsStream(path)) {
            if (is == null) {
                return "页面【" + pageName + "】在后厨迷路了（404）";
            }

            // 直接读取并返回
            return StreamUtils.copyToString(is, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "加载页面异常：" + e.getMessage();
        }
    }
}