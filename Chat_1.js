//요걸로 쓰기

var express = require('express');
var app = express();
var Chatserver = require('http').createServer(app);
var io = require('socket.io')(Chatserver);
var port = 20903;
var sio = require('socket.io')(Sserver);
var sport = 10902;
var Logger = require('logger.js');
var path = require('path');

Sserver.listen(sport);
Chatserver.listen(port);

var redis = require('redis');
var redisclient = redis.createClient();
var newRoomwait = new newRoomwait();

app.use(express.static(path.join(__dirname, 'public')));
sio.sockets.on('connection',function(ssocket){
io.sockets.on('connection',function(socket){
  socket.on('login',function(data){//Email,key,
    socket.id = data.Email
    socket.on('send',function(ahrdkvk){//roomname,message
      ssocket.emit("message",{roomname:ahrdkvk.roomname,message:ahrdkvk.message});
    });
  });
});

});
