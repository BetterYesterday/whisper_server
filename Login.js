// Setup
var express = require('express');
var app = express();
var Loginserver = require('http').createServer(app);
var io = require('socket.io')(Loginserver);
var path = require('path');
var port = 20901;

var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('./UserList.db');

Loginserver.listen(port);

// Routing
app.use(express.static(path.join(__dirname,'public')));

// Login code
io.sockets.on('connection', function (socket) {
	socket.on('sign_in',function(useremail_from){
		socket.emit('testmessage',{
			test: useremail_from
		});
		db.all('SELECT useremail FROM UserList WHERE useremail=$id',{
			$id: useremail_from
		},function(err,rows){
			if(rows != null){
				socket.emit('login',{
					isSuccess: 1
				});
			}
			else{
				socket.emit('login',{
					isSuccess: 0
				});
			}
		});
	});
	
})
