# Laravel-element

[参考](https://panjiachen.github.io/vue-element-admin-site/zh/guide/)

## 环境

- nodejs, npm

## 安装

- `git clone https://panliang:228618@gitee.com/paddy_technology/admin-desktop.git`
- `cp .env.development.example .env.development`, 修改 `VUE_APP_BASE_API` 接口地址
- `npm install` 或者 `npm install --registry=https://registry.npm.taobao.org`
- 本地环境 `npm run dev`
- 测试环境 `npm run build:stage`
- 生成环境 `npm run build:prod`

## Nginx

```
location / {
  root  /home/testhadoop/www/html;
  index index.html index.htm;
  try_files $uri $uri/ /index.html;
}
```
## TODO

1. 重写文件上传组件
