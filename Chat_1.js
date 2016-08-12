var express = require('express');
var app = express();
var Chatserver = require('http').createServer(app);
var io = require('socket.io')(Chatserver);
var port = 20903;
//client
var cio = require('socket.io-client');
var Logger = require('logger.js');
var RoomConn = require('RoomListConnector.js');
var cport = 10901;
var csocket=cio.connect("localhost:"+cport);

var redis = require('redis');
var redisclient = redis.createClient();
var newRoomwait = new newRoomwait();

app.use(express.static(path.join(__dirname, 'public')));
