// Setup
var express = require('express');
var app = express();
var Loginserver = require('http').createServer(app);
var io = require('socket.io')(Loginserver);
var path = require('path');
var port = 20910;

var mysql = require('mysql');
var userListPool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'Despair$667',
	database: 'UserList'
});
Loginserver.listen(port);
// Routing
app.use(express.static(path.join(__dirname,'public')));
// Login code
io.sockets.on('connection', function (socket) {
	socket.on('sign_in',function(userdata_from){
		Email = userdata_from.email;
		Password = userdata_from.password;
		function signin(data, callback){
			userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',Email,function(err,rows) {
				if (err) {
					callback(err,null);
				} else {
					callback(null,rows[0].Email);
					socket.emit('login',{
						connect_status: 0
				});
				}
			});
		}
		signin(data, function(err, useremail){
			if(err){
				socket.emit('login',{
					connect_status: 0
				});
			}else{
				socket.emit('login',{
					connect_status: 0
				});
				if(useremail.length>0){
					function socketinput(callback){//소켓 설정
						socket.useremail=useremail;
							socket.key=random();
							callback(socket.key);
					}
					socketinput(function(key) {
						userListPool.query('UPDATE isConnect FROM UserInfo SET isConnect =? WHERE Email =?',[key,useremail],function(err,results){
							socket.emit('login',{
								connect_status: 1,
								pushemail: useremail
							});
						});
					});
				}else if(!useremail.length){
					socket.emit('login',{
						connect_status: 0,
						pushemail: useremail
					});
				}
			}
		});
	});
});	