// Setup
var express = require('express');
var app = express();
var Loginserver = require('http').createServer(app);
var io = require('socket.io')(Loginserver);
var path = require('path');
var port = 20902;
var apacheroot = "/home/ubuntu/www/html/"
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('./UserList.db');
var Logger = require('logger.js');

logger = new Logger('room.log');

Chatserver.listen(port);

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom_code
var numUsers = 0;
fs.access(apacheroot+"numUsers.txt", (fs.R_OK | fs.W_OK),	function(err){
logger.info(err ? 'no access!' : 'can read/write');
	if(err){
		fs.access(apacheroot+"numUsers.txt",fs.F_OK,function(err){
		logger.info(err ? 'no File!' : 'no Permission!');
				if(err){

				}
				else{
					
				}
		})
	}
	else{

	}
});

io.sockets.on('connection', function (socket) {
	socket.emit('new_message',{
		message: 'Login'
	});
	socket.on('Now_Chat',function(msg){
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
