package com.iuroc.imageSite;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@SpringBootApplication
@RestController
class Router {

    @CrossOrigin(origins = "*")
    @GetMapping("/")
    private String index() {
        return "<a href=\"https://github.com/iuroc/iuroc-image-site\">Github</a>";
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/api/login")
    private AjaxRes cookieLogin(HttpServletRequest request) throws SQLException {
        try (Connection connection = Database.getConnection()) {
            Cookie[] cookies = request.getCookies();
            String token = Util.getCookieValue(cookies, "token");
            if (Util.isAllEmpty(token) || !Database.checkToken(connection, token))
                return new AjaxRes().setError("通过 Cookie 自动登录失败");
            return new AjaxRes().setSuccess("通过 Cookie 自动登录成功");
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/api/login")
    private AjaxRes formLogin(HttpServletRequest request, HttpServletResponse response) throws SQLException {
        try (Connection connection = Database.getConnection()) {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            if (Util.isAllEmpty(username, password))
                return new AjaxRes().setError("账号和密码不能为空");
            if (Database.checkUserInfo(connection, username, password)) {
                String newToken = Database.createToken(connection, username);
                Cookie cookie = new Cookie("token", newToken);
                cookie.setMaxAge(180 * 24 * 60 * 60);
                response.addCookie(cookie);
                return new AjaxRes().setSuccess("通过表单登录成功");
            }
            return new AjaxRes().setError("通过表单登录失败");
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/api/register")
    private AjaxRes register(HttpServletRequest request) throws SQLException {
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

    @CrossOrigin(origins = "*")
    @GetMapping("/api/imageList")
    private AjaxRes imageList(HttpServletRequest request) {
        String path = Util.getStringParam(request, "path");
        Map<String, String> pathInfo = new HashMap<>();
        String[] pathList = new String[] { "4Kdujia", "4kdongman", "4kmeinv", "4kfengjing", "4kyouxi",
                "4kyingshi", "4kqiche", "4kdongwu", "4kzongjiao", "4kbeijing", "pingban", "shoujibizhi" };
        String[] pathNameList = new String[] { "独家", "动漫", "美女", "风景", "游戏",
                "影视", "汽车", "动物", "宗教", "背景", "平板壁纸", "手机壁纸" };
        for (int i = 0; i < pathList.length; i++)
            pathInfo.put(pathList[i], pathNameList[i]);
        Map<String, Object> data = new HashMap<>();
        data.put("pathInfo", pathInfo);
        data.put("baseUrl", baseUrl);
        if (Arrays.stream(pathList).noneMatch(item -> item.equals(path)))
            return new AjaxRes().setError("输入的 path 错误").setData(data);
        int page = Util.getIntParam(request, "page", 1);
        String urlStr = String.format("%s/%s/%s", baseUrl, path,
                page <= 1 ? "" : String.format("index_%d.html", page));
        String source = Util.getSource(urlStr, "gbk");
        List<Map<String, String>> list = parseImageList(source);
        int totalPage = parseTotalPage(source);
        data.put("list", list);
        data.put("totalPage", totalPage);
        return new AjaxRes().setSuccess("获取成功")
                .setData(data);
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/api/imageInfo")
    private AjaxRes imageInfo(HttpServletRequest request) {
        String href = Util.getStringParam(request, "href");
        if (href.equals(""))
            return new AjaxRes().setError("请输入参数 href");
        String url = baseUrl + href;
        String source = Util.getSource(url, "gbk");
        Map<String, Object> data = parseImageInfo(source);
        data.put("baseUrl", baseUrl);
        return new AjaxRes().setSuccess("获取成功").setData(data);
    }

    private Map<String, Object> parseImageInfo(String source) {
        Map<String, Object> data = new HashMap<>();
        Pattern pattern = Pattern.compile("<h1>(.*?)</h1>.*?<div class=\"photo-pic\">.*?<img src=\"([^\\\"]+)",
                Pattern.DOTALL);
        Matcher matcher = pattern.matcher(source);
        if (!matcher.find())
            return data;
        String imageUrl = matcher.group(2);
        String title = matcher.group(1);
        data.put("imageUrl", imageUrl);
        data.put("title", title);
        return data;
    }

    /** 获取图片列表 */
    private List<Map<String, String>> parseImageList(String source) {
        Pattern pattern = Pattern.compile("<div class=\"wrap clearfix\">.*?<ul.*?class=\".*?clearfix.*?\">(.*?)</ul>",
                Pattern.DOTALL);
        Matcher matcher = pattern.matcher(source);
        List<Map<String, String>> outList = new ArrayList<>();
        if (!matcher.find())
            return outList;
        String ulTagSource = matcher.group(1);
        Pattern pattern2 = Pattern.compile("<a href=\"([^\"]+).*?<img src=\"([^\"]+)");
        Matcher matcher2 = pattern2.matcher(ulTagSource);
        while (matcher2.find()) {
            Map<String, String> map = new HashMap<>();
            map.put("href", matcher2.group(1));
            map.put("imageUrl", matcher2.group(2));
            outList.add(map);
        }
        return outList;
    }

    /** 获取总页码 */
    private int parseTotalPage(String source) {
        Pattern pattern = Pattern.compile("<div class=\"page\">(.*?)</div>", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(source);
        if (!matcher.find())
            return 0;
        String divTagSource = matcher.group(1);
        Pattern pattern2 = Pattern.compile("<a.*?>(\\d+)</a>");
        Matcher matcher2 = pattern2.matcher(divTagSource);
        String lastStr = "";
        while (matcher2.find())
            lastStr = matcher2.group(1);
        return Integer.valueOf(lastStr);
    }

    private String baseUrl = "https://pic.netbian.com";
}
