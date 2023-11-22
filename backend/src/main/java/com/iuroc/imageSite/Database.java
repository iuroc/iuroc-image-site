package com.iuroc.imageSite;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

class Database {
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:data.db");
    }
}
