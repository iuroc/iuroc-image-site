package com.iuroc.imageSite;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

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

    /** 校验 Token */
    public static boolean checkToken(Connection connection, String token) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT * FROM \"token\" WHERE \"token\" = ?");
        pStatement.setString(1, token);
        ResultSet resultSet = pStatement.executeQuery();
        return resultSet.next();
    }

    /**
     * 初始化数据表
     * 
     * @throws SQLException
     */
    public static void initTable(Connection connection) throws SQLException {
        Statement statement = connection.createStatement();
        statement.execute("""
                CREATE TABLE IF NOT EXISTS "user" (
                    "id" INTEGER NOT NULL UNIQUE,
                    "username" TEXT NOT NULL UNIQUE,
                    "password" TEXT NOT NULL,
                    "create_time" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY("id" AUTOINCREMENT)
                )
                """);
        statement.execute("""
                CREATE TABLE IF NOT EXISTS "token" (
                    "id" INTEGER NOT NULL UNIQUE,
                    "username" TEXT NOT NULL,
                    "token" TEXT NOT NULL UNIQUE,
                    "create_time" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY("id" AUTOINCREMENT)
                )
                """);
    }

    /** 创建新的 Token 记录 */
    public static String createToken(Connection connection, String username) throws SQLException {
        // 最多允许同时 5 个登录
        int maxActiveToken = 5;
        String newToken = UUID.randomUUID().toString();
        int userTokenCount = getUserTokenCount(connection, username);
        if (userTokenCount == maxActiveToken) {
            replaceEarliestToken(connection, username, newToken);
        } else {
            PreparedStatement pStatement = connection
                    .prepareStatement("INSERT INTO \"token\" (\"username\", \"token\") VALUES (?, ?)");
            pStatement.setString(1, username);
            pStatement.setString(2, newToken);
            pStatement.executeUpdate();
        }
        return newToken;
    }

    /** 获取用户当前的同时登录数量 */
    public static int getUserTokenCount(Connection connection, String username) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT COUNT(*) FROM \"token\" WHERE \"username\" = ?");
        pStatement.setString(1, username);
        ResultSet resultSet = pStatement.executeQuery();
        return resultSet.getInt("COUNT(*)");
    }

    /** 获取用户最早的 Token */
    public static String getEarliestToken(Connection connection, String username) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement(
                        "SELECT \"token\" FROM \"token\" WHERE \"username\" = ? ORDER BY create_time ASC LIMIT 1");
        pStatement.setString(1, username);
        ResultSet resultSet = pStatement.executeQuery();
        String earliestToken = resultSet.getString("token");
        return earliestToken;
    }

    /** 将最早的 Token 替换为新的 Token */
    public static void replaceEarliestToken(Connection connection, String username, String newToken)
            throws SQLException {
        String earliestToken = getEarliestToken(connection, username);
        PreparedStatement pStatement = connection
                .prepareStatement("UPDATE \"token\" SET \"token\" = ?, \"create_time\" = ? WHERE \"token\" = ?");
        pStatement.setString(1, newToken);
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String datetimeString = now.format(formatter);
        pStatement.setString(2, datetimeString);
        pStatement.setString(3, earliestToken);
        pStatement.executeUpdate();
    }

    /** 判断用户是否存在 */
    public static boolean userExists(Connection connection, String username) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT * FROM \"user\" WHERE \"username\" = ?");
        pStatement.setString(1, username);
        ResultSet resultSet = pStatement.executeQuery();
        return resultSet.next();
    }

    /** 注册账号 */
    public static void register(Connection connection, String username, String password) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("INSERT INTO \"user\" (\"username\", \"password\") VALUES (?, ?)");
        pStatement.setString(1, username);
        pStatement.setString(2, password);
        pStatement.executeUpdate();
    }
}
