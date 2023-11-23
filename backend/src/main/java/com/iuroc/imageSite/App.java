package com.iuroc.imageSite;

import java.sql.SQLException;
import org.springframework.boot.SpringApplication;

public class App {
    public static void main(String[] args) throws SQLException {
        SpringApplication.run(Router.class, args);
        System.out.println("http://127.0.0.1:8080");
        Database.initTable();
    }
}
