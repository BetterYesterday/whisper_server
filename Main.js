// Setup
var express = require('express');
var app = express();
var Chatserver = require('http').createServer(app);
var io = require('socket.io')(Chatserver);
var path = require('path');
var port = 20900;

var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('./UserList.db');

Chatserver.listen(port);

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Manager_code
var numUsers = 0;
io.sockets.on('connection', function (socket) {
	socket.emit('new_message',{
		message: 'Login'
	});
	socket.on('receive_message',function(msg){
		socket.broadcast.emit('new_message',{
			message: msg
		});
		socket.emit('new_message',{
			message: msg
		});
	});
	socket.on('logined',function(username){

	});
});
