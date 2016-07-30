// Setup
var express = require('express');
var app = express();
var Pushserver = require('http').createServer(app);
var io = require('socket.io')(Pushserver);
var port = 20904;
//server connection
var Sserver = require('http').createServer(app);
var sio = require('socket.io')(Sserver);
var sport = 10902;
Sserver.listen(sport);
Pushserver.listen(port);

var redis = require('redis');
var redisclient = redis.createClient();

app.use(express.static(path.join(__dirname, 'public')));

sio.on('connection',function(socket){
  
});
