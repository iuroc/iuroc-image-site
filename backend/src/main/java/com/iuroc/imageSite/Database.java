package com.iuroc.imageSite;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

class Database {
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection("jdbc:sqlite:data.db");
    }

    /**
     * 校验登录信息
     * 
     * @param connection
     * @param username
     * @param password
     * @return
     * @throws SQLException
     */
    public static boolean checkLogin(Connection connection, String username, String password) throws SQLException {
        PreparedStatement pStatement = connection
                .prepareStatement("SELECT * FROM \"user\" WHERE \"username\" = ? AND \"password\" = ?");
        pStatement.setString(1, username);
        pStatement.setString(2, password);
        ResultSet resultSet = pStatement.executeQuery();
        System.out.println(username);
        System.out.println(password);
        System.out.println(resultSet.next());
        // return resultSet.next();
        return true;
    }
}
