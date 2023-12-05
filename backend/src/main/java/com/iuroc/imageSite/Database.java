package com.iuroc.imageSite;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        return getUsernameByToken(connection, token) != null;
    }

    public static String getUsernameByToken(Connection connection, String token) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT \"username\" FROM \"token\" WHERE \"token\" = ?");
        pStatement.setString(1, token);
        ResultSet resultSet = pStatement.executeQuery();
        if (resultSet.next())
            return resultSet.getString("username");
        return null;
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
        statement.execute("""
                CREATE TABLE IF NOT EXISTS "star" (
                    "id" INTEGER NOT NULL UNIQUE,
                    "username" TEXT NOT NULL,
                    "image_src" TEXT NOT NULL UNIQUE,
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

    public static void removeToken(Connection connection, String token) throws SQLException {
        PreparedStatement pStatement = connection.prepareStatement("DELETE FROM \"token\" WHERE \"token\" = ?");
        pStatement.setString(1, token);
        pStatement.executeUpdate();
    }

    /**
     * 收藏图片
     * 
     * @param connection 数据库连接
     * @param username   用户名
     * @param imageSrc   图片地址
     */
    public static AjaxRes addStar(Connection connection, String username, String imageSrc) throws SQLException {
        Map<String, Boolean> data = new HashMap<>();
        if (isStarExists(connection, username, imageSrc)) {
            removeStar(connection, username, imageSrc);
            data.put("hasStar", false);
            return new AjaxRes().setSuccess("取消收藏成功").setData(data);
        } else {
            PreparedStatement pStatement = connection
                    .prepareStatement("INSERT INTO \"star\" (\"username\", \"image_src\") VALUES (?, ?)");
            pStatement.setString(1, username);
            pStatement.setString(2, imageSrc);
            pStatement.executeUpdate();
            data.put("hasStar", true);
            return new AjaxRes().setSuccess("收藏成功").setData(data);
        }
    }

    public static boolean isStarExists(Connection connection, String username, String imageSrc) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT * FROM \"star\" WHERE \"username\" = ? AND \"image_src\" = ?");
        pStatement.setString(1, username);
        pStatement.setString(2, imageSrc);
        ResultSet resultSet = pStatement.executeQuery();
        return resultSet.next();
    }

    public static void removeStar(Connection connection, String username, String imageSrc) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("DELETE FROM \"star\" WHERE \"username\" = ? AND \"image_src\" = ?");
        pStatement.setString(1, username);
        pStatement.setString(2, imageSrc);
        pStatement.executeUpdate();
    }

    public static List<Star> getStarList(Connection connection, String username) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT * FROM \"star\" WHERE \"username\" = ?");
        pStatement.setString(1, username);
        ResultSet resultSet = pStatement.executeQuery();
        List<Star> starList = new ArrayList<>();
        while (resultSet.next()) {
            starList.add(new Star(
                    resultSet.getInt("id"),
                    resultSet.getString("username"),
                    resultSet.getString("image_src"),
                    resultSet.getString("create_time")));
        }
        return starList;
    }
}

class Star {
    public int id;
    public String username;
    public String imageSrc;
    public String createTime;

    public Star(int id, String username, String imageSrc, String createTime) {
        this.id = id;
        this.username = username;
        this.imageSrc = imageSrc;
        this.createTime = createTime;
    }
}