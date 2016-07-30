// Setup
var express = require('express');
var app = express();
var Loginserver = require('http').createServer(app);
var io = require('socket.io')(Loginserver);
var path = require('path');
var port = 20901;

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
			userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',
				Email,function(err,rows) {
				if (err) {
					callback(err,null);
				} else {
					if (rows[0].Password === Password){
						callback(null,rows[0].Email);
					} else {
						socket.emit('login',{
							connect_status: 0,
							pushemail: 'wrong'
						});
					}
				}
				userListPool.release();
			});
		}
		var connect_status = 0;
		signin(data, function(err, useremail){
			if(err){
				socket.emit('login',{
					connect_status: 0
				});
			}else{
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
								pushemail: useremail,
								clientkey: key
							});
							userListPool.release();
						});
					});
				}else if(!useremail.length){
					socket.emit('login',{
						connect_status: 0,
						pushemail: useremail,
						clientkey: 128
					});
				}
			}
		});
	});
	socket.on('sign_up',function(userdata_from){
		Email = userdata_from.email;
		Password = userdata_from.password;
		function sign_up(data,callback){
			userListPool.query('INSERT INTO UserInfo (Email, Password, isConnect, countDuck, countRoom) VALUES (?, ?, 0, 0)',
				[Email,Password],function(err,results){
				if (err) {
					throw err;
					socket.emit('sign_up',{
						connect_status: 0
					});
				} else {
					socket.emit('sign_up',{
						connect_status: 1
					});
					userListPool.query('UPDATE isConnect FROM UserInfo SET isConnect =? WHERE Email =?',
						[key,Email],function(err,results){
						socket.emit('login',{
							connect_status: 1,
							pushemail: Email,
							yourkey: key
						});
						userListPool.release();
					})
				}
				userListPool.release();
			});
		}
	});
	socket.on('check_email',function(useremail_from){
		function check_email(data, callback){
			userListPool.query('SELECT Email FROM UserInfo WHERE Email = ?',
				useremail_from,function(err,rows){
				if(err){
					callback(err,null);
				}else{
					callback(null,rows[0].Email);
				}
				userListPool.release();
			});
		}
		check_email(data, function(err, useremail){
			if(err){
				socket.emit('check_email',{
					connect_status: 0
				});
			}else{
				if(useremail.length>0){
					socket.emit('check_email',{
						connect_status: 0
					});
				}else if(!useremail.length){
					socket.emit('check_email',{
						connect_status: 1,
						pushemail: useremail
					});
				}
			}
		});
	});
	socket.on('disconnect',function(){
		if(!(!socket.username)){
		}else{ userListPool.query('UPDATE isConnect FROM UserInfo SET isConnect =? WHERE Email =?',[0,socket.useremail],function(err,rows){
				userListPool.release();
			});
		}
	});
});
function random () {
	var RandomNumber=0;
	while(RandomNumber==0)
	RandomNumber=Math.random() * (127+128) -128;
  	return RandomNumber;
}
