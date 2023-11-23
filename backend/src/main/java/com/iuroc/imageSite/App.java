package com.iuroc.imageSite;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@SpringBootApplication
@RestController
public class App {
    public static void main(String[] args) throws SQLException {

        SpringApplication.run(App.class, args);
        System.out.println("http://127.0.0.1:8080");
        new App().initTable();
    }

    /**
     * 初始化数据表
     * 
     * @throws SQLException
     */
    public void initTable() throws SQLException {
        try (Connection connection = Database.getConnection()) {
            Statement statement = connection.createStatement();
            statement.execute("""
                    CREATE TABLE IF NOT EXISTS "user" (
                        "id" INTEGER NOT NULL UNIQUE,
                        "username" TEXT NOT NULL UNIQUE,
                        "password" TEXT NOT NULL,
                        "create_time" TEXT NOT NULL,
                        PRIMARY KEY("id" AUTOINCREMENT)
                    )
                    """);
            statement.execute("""
                    CREATE TABLE IF NOT EXISTS "token" (
                        "id" INTEGER NOT NULL UNIQUE,
                        "username" TEXT NOT NULL UNIQUE,
                        "token" TEXT NOT NULL UNIQUE,
                        "create_time" TEXT NOT NULL,
                        PRIMARY KEY("id" AUTOINCREMENT)
                    )
                    """);
        }
    }

    @GetMapping("/api/login")
    public AjaxRes login(HttpServletRequest request) throws SQLException {
        Cookie[] cookies = request.getCookies();
        if (cookies == null)
            cookies = new Cookie[] {};
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
        try (Connection connection = Database.getConnection()) {
            if (Database.checkLogin(connection, username, password))
                return new AjaxRes().setSuccess("登录成功");
            else
                return new AjaxRes().setError("账号或密码错误");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
