package com.iuroc.imageSite;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

class Util {
    public static String getCookieValue(Cookie[] cookies, String name) {
        if (cookies != null)
            for (Cookie cookie : cookies)
                if (cookie.getName().equals(name))
                    return cookie.getValue();
        return null;
    }

    /** 是否全部为 null 或空字符串 */
    public static boolean isAllEmpty(Object... args) {
        for (Object item : args)
            if (item != null && !item.equals(""))
                return false;
        return true;
    }

    /**
     * 获取请求参数中的数字
     * 
     * @param request      请求对象
     * @param key          参数名称
     * @param defaultValue 默认参数值
     * @return 参数值
     */
    public static int getIntParam(HttpServletRequest request, String key, int defaultValue) {
        try {
            return Integer.valueOf(request.getParameter(key));
        } catch (NumberFormatException error) {
            return defaultValue;
        }
    }

    /**
     * 获取请求参数中的字符串
     * 
     * @param request      请求对象
     * @param key          参数名称
     * @param defaultValue 默认参数值
     * @return 参数值
     */
    public static String getStringParam(HttpServletRequest request, String key, String defaultValue) {
        String value = request.getParameter(key);
        return isAllEmpty(value) ? defaultValue : value;
    }

    /**
     * 获取请求参数中的字符串，值为空时返回空字符串
     * 
     * @param request 请求对象
     * @param key     参数名称
     * @return 参数值
     */
    public static String getStringParam(HttpServletRequest request, String key) {
        return getStringParam(request, key, "");
    }

    /** 获取 HTTP 响应，默认 utf-8 编码 */
    public static String getSource(String urlStr) {
        return getSource(urlStr, "utf-8");
    }

    /** 获取 HTTP 响应，并设置编码 */
    public static String getSource(String urlStr, String charset) {
        try {
            URL url = new URL(urlStr);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            InputStream inputStream = connection.getInputStream();
            Reader reader = new InputStreamReader(inputStream, charset);
            BufferedReader bufferedReader = new BufferedReader(reader);
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                response.append(line);
            }
            return response.toString();
        } catch (MalformedURLException error) {
            error.printStackTrace();
        } catch (IOException error) {
            error.printStackTrace();
        }
        return "";
    }
}
