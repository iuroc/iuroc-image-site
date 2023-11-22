package com.iuroc.imageSite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@SpringBootApplication
@RestController
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @GetMapping("/api/login")
    public AjaxRes login(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String username = "", password = "";
        for (Cookie cookie : cookies) {
            String name = cookie.getName();
            switch (name) {
                case "username":
                    username = cookie.getValue();
                    break;
                case "password":
                    password = cookie.getValue();
                    break;
            }
        }
        if (username == "" || password == "")
            return new AjaxRes().setError("账号或密码不能为空");
        return new AjaxRes().setSuccess("登录成功");
    }
}
