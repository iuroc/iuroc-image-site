package com.iuroc.imageSite;

/** Ajax 响应数据 */
class AjaxRes {
    /** 状态码 */
    private int code = 200;
    /** 响应描述 */
    private String message = "";
    /** 响应数据 */
    private Object data;

    public AjaxRes setCode(int code) {
        this.code = code;
        return this;
    }

    public AjaxRes() {

    }

    public AjaxRes(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public AjaxRes(String message) {
        this.message = message;
    }

    public AjaxRes(String message, Object data) {
        this.message = message;
        this.data = data;
    }

    public AjaxRes(int code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /** 成功的响应码 */
    public static final int SUCCESS = 200;
    /** 失败的响应码 */
    public static final int ERROR = 0;

    public AjaxRes setSuccess(String message) {
        this.message = message;
        this.code = AjaxRes.SUCCESS;
        return this;
    }

    public AjaxRes setSuccess() {
        this.code = AjaxRes.SUCCESS;
        return this;
    }

    public AjaxRes setError() {
        this.code = AjaxRes.ERROR;
        return this;
    }

    public AjaxRes setError(String message) {
        this.message = message;
        return this;
    }

    public AjaxRes setMessage(String message) {
        this.message = message;
        return this;
    }

    public AjaxRes setData(Object data) {
        this.data = data;
        return this;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public Object getData() {
        return data;
    }

    public static int getSuccess() {
        return SUCCESS;
    }

    public static int getError() {
        return ERROR;
    }

}