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
		function signin(data, callback){
			userListPool.query('SELECT Email FROM UserInfo WHERE Email = ?',userdata_from,function(err,rows) {
				if (err) {
					callback(err,null);
				} else {
					callback(null,rows[0].Email);
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
						userListPool.query('UPDATE isConnect FROM UserInfo SET isConnect =? WHERE Email =?',[key,useremail],function{
								socket.emit('login',{
									connect_status: 1,
									pushemail: useremail,
									yourkey: key
							});
							userListPool.release();
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
	socket.on('disconnect',function(){
			if(!(!socket.username)){
			}else{
			userListPool.query('UPDATE isConnect FROM UserInfo SET isConnect =? WHERE Email =?',[0,socket.useremail]);
			}
	});
	socket.on('sign_up',function(userdata_from){
	});
	socket.on('check_email',function(useremail_from){
		function check_email(data, callback){
			userListPool.query('SELECT Email FROM UserInfo WHERE Email = ?',useremail_from,function(err,rows){
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
				socket.emit('email_check',{
					connect_status: 0
				});
			}else{
				if(useremail.length>0){
					socket.emit('email_check',{
						connect_status: 0
					});
				}else if(!useremail.length){
					socket.emit('email_check',{
						connect_status: 1,
						pushemail: useremail
					});
				}
			}
		});
	});
});
function random () {
	var RandomNumber=0;
	while(RandomNumber==0)
	RandomNumber=Math.random() * (127+128) -128;
  	return RandomNumber;
}
