package com.iuroc.imageSite;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

class Database {
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:data.db");
    }

    public static boolean checkUserInfo(Connection connection, String username, String password) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT * FROM \"user\" WHERE \"username\" = ? AND \"password\" = ?");
        pStatement.setString(1, username);
        pStatement.setString(2, password);
        ResultSet resultSet = pStatement.executeQuery();
        return resultSet.next();
    }

    public static boolean checkToken(Connection connection, String token) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT * FROM \"token\" WHERE \"token\" = ?");
        pStatement.setString(1, token);
        ResultSet resultSet = pStatement.executeQuery();
        System.out.println(resultSet);
        return resultSet.next();
    }

    /**
     * 初始化数据表
     * 
     * @throws SQLException
     */
    public static void initTable() throws SQLException {
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
}
