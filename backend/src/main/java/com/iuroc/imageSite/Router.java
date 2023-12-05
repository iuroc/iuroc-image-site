package com.iuroc.imageSite;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
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

    @GetMapping("/")
    private String index() {
        return "<a href=\"https://github.com/iuroc/iuroc-image-site\">Github</a>";
    }

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
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                response.addCookie(cookie);
                // 通过表单登录成功
                return new AjaxRes().setSuccess("登录成功");
            }
            // 通过表单登录失败
            return new AjaxRes().setError("登录失败，账号或密码错误");
        }
    }

    @GetMapping("/api/logout")
    private AjaxRes logout(HttpServletRequest request, HttpServletResponse response) throws SQLException {
        try (Connection connection = Database.getConnection()) {
            Cookie[] cookies = request.getCookies();
            String token = Util.getCookieValue(cookies, "token");
            Database.removeToken(connection, token);
            Cookie cookie = new Cookie("token", null);
            cookie.setMaxAge(0);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            response.addCookie(cookie);
            return new AjaxRes().setSuccess("退出登录成功");
        }
    }

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

    @Deprecated
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
        List<Map<String, String>> list = RouterMixin.parseImageList(source);
        int totalPage = RouterMixin.parseTotalPage(source);
        data.put("list", list);
        data.put("totalPage", totalPage);
        return new AjaxRes().setSuccess("获取成功")
                .setData(data);
    }

    @Deprecated
    @GetMapping("/api/imageInfo")
    private AjaxRes imageInfo(HttpServletRequest request) {
        String href = Util.getStringParam(request, "href");
        if (href.equals(""))
            return new AjaxRes().setError("请输入参数 href");
        String url = baseUrl + href;
        String source = Util.getSource(url, "gbk");
        Map<String, Object> data = RouterMixin.parseImageInfo(source);
        data.put("baseUrl", baseUrl);
        return new AjaxRes().setSuccess("获取成功").setData(data);
    }

    @GetMapping("/api/randomImage")
    private AjaxRes randomImage(HttpServletRequest request) throws URISyntaxException, SQLException {
        try (Connection connection = Database.getConnection()) {
            Cookie[] cookies = request.getCookies();
            String token = Util.getCookieValue(cookies, "token");
            boolean hasLogin = Util.isAllEmpty(token) || !Database.checkToken(connection, token);
            String username = hasLogin ? Database.getUsernameByToken(connection, token) : null;

            int length = RouterMixin.getFileCount("image");
            Map<String, Object> data = new HashMap<>();
            List<Map<String, Object>> imageList = new ArrayList<>();
            data.put("list", imageList);
            for (int i = 0; i < 8; i++) {
                String src = RouterMixin.makeImageSrc(length);
                boolean hasStar = hasLogin ? Database.isStarExists(connection, username, src) : false;
                Map<String, Object> item = new HashMap<>();
                item.put("src", src);
                item.put("hasStar", hasStar);
                imageList.add(item);
            }
            data.put("main", imageList.get(0));
            return new AjaxRes().setSuccess("Good").setData(data);
        }
    }

    @GetMapping("/image/{imageName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName) throws IOException {
        Resource resource = new ClassPathResource("image/" + imageName);
        if (resource.exists()) {
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/addStar")
    public AjaxRes addStar(HttpServletRequest request) throws SQLException {
        try (Connection connection = Database.getConnection()) {
            Cookie[] cookies = request.getCookies();
            String token = Util.getCookieValue(cookies, "token");
            String imageSrc = Util.getStringParam(request, "imageSrc");
            if (imageSrc.equals(""))
                return new AjaxRes().setError("参数 imageSrc 不能为空");
            if (Util.isAllEmpty(token) || !Database.checkToken(connection, token))
                return new AjaxRes().setError("请登录后执行该操作");
            String username = Database.getUsernameByToken(connection, token);
            return Database.addStar(connection, username, imageSrc);
        }
    }

    private String baseUrl = "https://pic.netbian.com";
}

class RouterMixin {

    public static String makeImageSrc(int length) {
        return String.format("/image/%d.jpg", Util.random(1, length));
    }

    public static int getFileCount(String dirPath) throws URISyntaxException {
        ClassLoader classLoader = RouterMixin.class.getClassLoader();
        URL url = classLoader.getResource(dirPath);
        URI uri = url.toURI();
        String path = uri.getPath();
        int length = new File(path).listFiles().length;
        return length;
    }

    /** 获取总页码 */
    public static int parseTotalPage(String source) {
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

    /** 获取图片列表 */
    public static List<Map<String, String>> parseImageList(String source) {
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

    public static Map<String, Object> parseImageInfo(String source) {
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
}