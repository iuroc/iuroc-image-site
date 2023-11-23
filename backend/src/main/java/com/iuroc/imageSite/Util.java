package com.iuroc.imageSite;

import jakarta.servlet.http.Cookie;

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

}
