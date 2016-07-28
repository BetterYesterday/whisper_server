var express = require('express');
var app = express();
var Chatserver = require('http').createServer(app);
var io = require('socket.io')(Chatserver);
var port = 20902;
var Servertoserver = require('http').createServer(app);
var sio = require('socket.io')(Servertoserver);
var sport = 10902;

Servertoserver.listen(sport);
Roomserver.listen(port);
sio.sockets.on('connection',function(Serversocket){
  io.sockets.on('connection', function (socket) {//소켓 연결

  });
});
