const Koa = require('koa');
const Router = require('koa-router')
const static = require('koa-static')
const fs = require('fs');
const app = new Koa();
const router = new Router();
const path = require('path');
const {
  queryData,
  upData,
  insertOneData,
  deleteData,
  Baseurl
} = require('./ADB/index.js');
const {openIO} =require('./websocket/socket')
openIO()
// 数据库
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

// cors
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  await next();
});




// 获取数据
router.get('/', async (ctx, next) => {
  let res = fs.readFileSync('../static/data.json', 'utf-8', (err, data) => {
    if (err) {
      throw err
    }
    return data
  })
  ctx.body = res

})

// 注册
router.get('/register', async (ctx, next) => {
  // 获取用户传过来的值
  let Data = {
    name: ctx.request.query.name,
    pass: ctx.request.query.pass
  }

  // 查询账户是否存在
  WhereStr = {
    name: ctx.request.query.name
  }
  const callback = await queryData(url, 'admin', 'vivo', WhereStr).then(res => {
    if (res.length != 0) {
      ctx.response.status = 226
      return "用户名已被注册！"
    } else {
      let insertBack = insertOneData(url, 'admin', 'vivo', Data).then(res => {
        ctx.response.status = 200
        return "注册成功！"
      })
      return insertBack
    }
  })
  ctx.body = {
    msg: callback,
    status: ctx.response.status
  }
  // if (callback) {
  //   ctx.body = callback
  // }

})

//登录
router.get('/login', async (ctx, next) => {
  // 获取用户传过来的值
  let Data = {
    name: ctx.request.query.name,
    pass: ctx.request.query.pass
  }
  let callback = await queryData(url, 'admin', 'vivo', Data).then(res => {
    console.log(res.length);
    if (res.length != 0) {
      ctx.response.status = 200
      return "登陆成功！"
    }
    ctx.response.status = 226
    return "密码错误！"
  })


  ctx.body = {
    msg: callback,
    status: ctx.response.status
  }
})

app.use(router.routes())
app.listen(3000);








