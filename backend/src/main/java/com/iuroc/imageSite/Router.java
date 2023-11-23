package com.iuroc.imageSite;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.SQLException;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RestController
class Router {
    @RequestMapping("/api/login")
    public AjaxRes login(HttpServletRequest request) throws SQLException {
        try (Connection connection = Database.getConnection()) {
            // 两种传参模式，Cookie 传入 token，或者 POST 传入 username 和 password
            Cookie[] cookies = request.getCookies();
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String token = Util.getCookieValue(cookies, "token");
            // 登录模式：表单登录 / 自动登录
            String loginMode = request.getParameter("loginMode"); // form 或 cookie
            if (loginMode != null && loginMode.equals("form")) {
                if (Util.isAllEmpty(username, password))
                    return new AjaxRes().setError("账号和密码不能为空");
                if (Database.checkUserInfo(connection, username, password))
                    return new AjaxRes().setSuccess("通过表单登录成功");
                return new AjaxRes().setError("通过表单登录失败");
            } else {
                if (Util.isAllEmpty(token) || !Database.checkToken(connection, token))
                    return new AjaxRes().setError("通过 Cookie 自动登录失败");
                return new AjaxRes().setSuccess("通过 Cookie 自动登录成功");
            }
        }
    }
}
