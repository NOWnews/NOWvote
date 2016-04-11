## 系統部署

### 系統相關資訊(系統必須安裝項目)

Node.js v5.10.1

mongodb v3.2.4

redis v3.4.1


### Update Ubuntu Packges

`$ sudo apt-get -y update && sudo apt-get -y upgrade`

### Install Git

`$ sudo apt-get install git`

### Install MongoDB

#### 安裝 mongodb 請參考以下連結

`https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/`

照著文件上的安裝步驟，就可以成功啟動 mongo

####啟動指令

`$ mongo`

如果出現這個錯誤

`Failed global initialization: BadValue Invalid or no user locale set. Please ensure LANG and/or LC_* environment variables are set correctly.`

我們可以先 `$ export LC_ALL=C`

然後再 `$ mongo` 就可以正常啟動了

### Install Redis

####安裝 Redis

`$ sudo apt-get install redis-server`

設定檔在 `/etc/redis/redis.conf`

可以用 `$ redis-cli` 看一下 Redis 是否有正常啟動

### Install Node.js

####建議使用 nvm 進行安裝，相關文件如下

`https://github.com/creationix/nvm`

####安裝 nvm

`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash`

or

`wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash`

如果找不到 nvm 這個指令，記得要 `source ~/.bashrc`

####下載 Node.js

`$ nvm install 5`

####設定每次都會載入的 Node

`$ nvm alias default node`

####安裝 Node.js 底層套件

`$ npm install -g node-gyp pm2`

pm2 最主要是用來進行 node.js app process 管理

### 要生成 ssh-keygen 請參考這篇

`https://git-scm.com/book/be/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key`

### Clone Project

`$ git clone git@gitlab.com:nownews/NOWvote.git`

## 啟動 NOWvote

### 編譯與安裝檔案

安裝 Node.js 套件

`$ npm install`

下載靜態檔案

`$ ./node_modules/bower/bin/bower install`

Build 靜態檔案

`$ npm run deploy-static`

### 服務項目

這個 project 一共分為幾個部分

- [NOWvote Website](#nowvote-website)

- [NOWvote Admin](#nowvote-admin)


### <a name="nowvote-website"></a>NOWvote Website

提供一般使用者使用的網站

- 啟動位置: bin/www.js
- PORT 號: 8998
- 主要程式: app.js
- 相關資料夾: /server
- 快速啟動指令(開發時使用): `$ npm run start` or `$ npm start`
- gulp 編譯(開發時使用): `$ npm run server-gulp`
- 啟動指令(正式環境): `$ pm2 start bin/www.js --name "vote"`

### <a name="nowvote-admin"></a>NOWvote Admin

提供後台管理的網站

- 啟動位置: bin/admin.js
- PORT 號: 8999
- 主要程式: admin.js
- 相關資料夾: /admin
- 快速啟動指令(開發時使用): `$ npm run admin`
- gulp 編譯(開發時使用): `$ npm run admin-gulp`
- 啟動指令(正式環境): `$ pm2 start bin/admin.js --name "admin"`

## Redis 共用 method

- cache.set(key, value, expire)
  - key: 存入 redis 的 key 值
  - value: 存入 redis 的值
  - expire: 過期時間(ms)，預設 3600ms

- cache.get(key)
  - key: 取得 redis 資料的 key 值

- cache.getCategory()
  - 取得 redis 裡面的 menu

- cache.getBanner()
  - 取得 redis 裡面的 banner

- cache.updateRedisByKey(key)
  - key: 目前能代入 `banner`, `category`，更新相對應的資料

## Libs 共用 method

- libs.hashPwd(password)
  - password: 要 hash 的密碼

- libs.moveFile(source, target)
  - source: 檔案原本的位置
  - target: 欲搬移檔案的位置，目前會幫你自動取名字

- libs.checkExt(req.file)
  - req.file: 傳入的檔案資訊
