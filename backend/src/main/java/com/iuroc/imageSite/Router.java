package com.iuroc.imageSite;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.SQLException;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RestController
class Router {
    @GetMapping("/api/login")
    public AjaxRes cookieLogin(HttpServletRequest request) throws SQLException {
        try (Connection connection = Database.getConnection()) {
            Cookie[] cookies = request.getCookies();
            String token = Util.getCookieValue(cookies, "token");
            if (Util.isAllEmpty(token) || !Database.checkToken(connection, token))
                return new AjaxRes().setError("通过 Cookie 自动登录失败");
            return new AjaxRes().setSuccess("通过 Cookie 自动登录成功");
        }
    }

    @PostMapping("/api/login")
    public AjaxRes formLogin(HttpServletRequest request) throws SQLException {
        try (Connection connection = Database.getConnection()) {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            if (Util.isAllEmpty(username, password))
                return new AjaxRes().setError("账号和密码不能为空");
            if (Database.checkUserInfo(connection, username, password)) {
                Database.createToken(connection, username);
                return new AjaxRes().setSuccess("通过表单登录成功");
            }
            return new AjaxRes().setError("通过表单登录失败");
        }
    }

    @PostMapping("/api/register")
    public AjaxRes register(HttpServletRequest request) throws SQLException {
        try (Connection connection = Database.getConnection()) {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            if (Database.userExists(connection, username)) {
                return new AjaxRes().setError("账号已被占用，请换一个试试");
            } else {
                Database.register(connection, username, password);
                return new AjaxRes().setSuccess("注册成功");
            }
        }
    }
}
