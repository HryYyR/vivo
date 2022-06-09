function openIO() {

  const express = require('express');
  const cors = require('cors')
  const app = express();

  app.use(cors)
  const http = require('http');
  const server = http.createServer(app);
  const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
      origin: ['http://localhost:8080', 'http://localhost:8081'],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  var online = 0;
  // 连接
  io.on('connection', (socket) => {
    online++


    // 发送信息
    socket.on('message', (msg) => {
      console.log('msg', msg);
      socket.broadcast.emit('message', msg);
    });


    // 登录
    socket.on('login', (msg) => {
      console.log('login', msg, socket.id);
      let data = {
        name: msg,
        id: socket.id
      }
      socket.emit('login', data);
    });


    // 提示有人加入
    socket.on('ToastIn', (msg) => {
      socket.broadcast.emit('ToastIn', msg);
    });


    // 返回在线人数
    socket.on('online', () => {
      socket.emit('online', online);
    });

    // 断开连接
    socket.on('disconnect', (msg) => {
      console.log(msg);
      online--
      socket.on('online', () => {
        socket.emit('online', online);
      });
    });




  });



  server.listen(3002, () => {
    console.log('socketIO,listening on *:3002');
  });

}

module.exports = {
  openIO
}
