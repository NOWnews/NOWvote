# NOWvote 議題票選網站

## 系統相關資訊

Node.js v5.6.0

mongodb v3.2.1

redis v3.0.7

## 服務項目

這個 project 一共分為幾個部分

- [NOWvote Website](#nowvote-website)

- [NOWvote Admin](#nowvote-admin)


## <a name="nowvote-website"></a>NOWvote Website

提供一般使用者使用的網站

- 啟動位置: bin/www.js
- PORT 號: 8998
- 主要程式: app.js
- 相關資料夾: /server
- 快速啟動指令: `npm run start` or `npm start`

## <a name="nowvote-admin"></a>NOWvote Admin

提供後台管理的網站

- 啟動位置: bin/admin.js
- PORT 號: 8999
- 主要程式: admin.js
- 相關資料夾: /admin
- 快速啟動指令: `npm run admin`