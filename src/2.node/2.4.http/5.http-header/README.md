# http 头的应用
## 1.多语言
通过服务端来实现多语言
做成多个网站
```
Accept-Language:zh-CN,zh;q=0.9,en;q=0.8
```
多语言的前端实现为i18n

## 2.断点续传、范围请求
```
Range:bytes=0-5

Content-Range: bytes 0-5/2381
```

## 3.判断内核
服务端判断`User-Agent`重定向到不同网站

## 4.referer 来源 安全 xss csrf
防盗链

服务端通过比对`referer` 和 `Request URL` 域名，判断

## 5.gzip 压缩
```
Content-Encoding: gzip // res
Accept-Encoding: gzip, deflate // req
```