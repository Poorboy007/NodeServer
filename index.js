'use strict'
// 引入modules
const express = require("express")
const apicache = require("apicache")
const path = require("path")
const cache = apicache.middleware
// 引入路由
const routes = require('./routers')
//实例化
const app = express()

// 跨域设置
app.all("*", function (req, res, next) {
  if (req.path !== "/" && !req.path.includes(".")) {
    res.header("Access-Control-Allow-Credentials", true)
    // 这里获取 origin 请求头 而不是用 *
    res.header("Access-Control-Allow-Origin", req.headers["origin"] || "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("Content-Type", "application/json;charset=utf-8")
  }
  next()
})

//
const onlyStatus200 = (req, res) => res.statusCode === 200
//API缓存中间件
app.use(cache("2 minutes", onlyStatus200))
//静态目录
app.use('/static', express.static(path.resolve(__dirname, "public")))

//注册路由配置
app.use(routes)

//启动监听端口 
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log('┌───────────────────────────────────────────────┐');
  console.log('│                                               │');
  console.log('│   Serving!                                    │');
  console.log('│                                               │');
  console.log('│   - Local:            http://localhost:' + app.get('port') + '   │');
  console.log('│   - On Your Network:  http://127.0.0.1:' + app.get('port') + '   │');
  console.log('│                                               │');
  console.log('│   Express server listening on:                │');
  console.log('│                                               │');
  console.log('│   - port:               ' + server.address().port + '                  │');
  console.log('│                                               │');
  console.log('└───────────────────────────────────────────────┘');
})