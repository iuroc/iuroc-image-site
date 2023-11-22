# IURoc Image

> 爱优鹏图片网

## 快速开始

1. 清理构建并安装：`mvn clean install`
2. 安装 NPM 模块：`cd web && npm install`
3. 启动后端服务：`mvn spring-boot:run`
4. 启动前端

## API 文档

### AjaxRes 类

```java
// 用法一
AjaxRes res = new AjaxRes();
res.setCode(AjaxRes.SUCCESS);
res.setMessage("响应描述");
res.setData("响应数据");
return res;
```

```java
// 用法二
AjaxRes res = new AjaxRes();
res.setSuccess("响应描述").setData("响应数据");
return res;
```

```java
// setSuccess() == setCode(AjaxRes.SUCCESS)
AjaxRes res1 = new AjaxRes().setSuccess();

// setSuccess("描述") == setCode(AjaxRes.SUCCESS).setMessage("描述")
AjaxRes res2 = new AjaxRes().setSuccess("响应描述");

// AjaxRes 类的所有成员方法均可以链式调用
AjaxRes res3 = new AjaxRes().setSuccess().setData("响应数据");

// 所有成员方法均可按需使用
AjaxRes res4 = new AjaxRes().setData("响应数据");
```