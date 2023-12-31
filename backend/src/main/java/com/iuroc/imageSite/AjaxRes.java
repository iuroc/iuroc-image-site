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

    /** 成功的响应码 */
    public static final int SUCCESS = 200;
    /** 失败的响应码 */
    public static final int ERROR = 0;

    public AjaxRes setSuccess(String message) {
        this.message = message;
        this.code = SUCCESS;
        return this;
    }

    public AjaxRes setSuccess() {
        return setSuccess("成功");
    }

    public AjaxRes setError() {
        return setError("失败");
    }

    public AjaxRes setError(String message) {
        this.message = message;
        this.code = ERROR;
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

}