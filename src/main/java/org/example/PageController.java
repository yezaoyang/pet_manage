package org.example;

import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@RestController // 注意这里改为 RestController，或者方法加 @ResponseBody
@RequestMapping("/admin")
public class PageController {

    @GetMapping(value = "/loadPage/{pageName}", produces = "text/html;charset=UTF-8")
    public String loadPage(@PathVariable String pageName, HttpServletRequest request) throws Exception {
        // 1. 获取 WEB-INF 下文件的真实流路径
        String path = "/WEB-INF/pages/" + pageName + ".html";
        InputStream is = request.getServletContext().getResourceAsStream(path);

        if (is == null) {
            return "页面不存在：" + path;
        }

        // 2. 核心：使用 UTF-8 编码将输入流直接转为字符串返回
        // 这样就彻底绕过了 Tomcat 对静态文件的错误编码读取
        String content = StreamUtils.copyToString(is, StandardCharsets.UTF_8);

        is.close();
        return content;
    }
}