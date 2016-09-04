// Setup
var express = require('express');
var app = express();
var SignUpserver = require('http').createServer(app);
var io = require('socket.io')(SignUpserver);
var path = require('path');
var port = 20911;

var mysql = require('mysql');
var userListPool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'Despair$667',
	database: 'UserList'
});
SignUpserver.listen(port);
// Routing
app.use(express.static(path.join(__dirname,'public')));
// Login code
io.sockets.on('connection', function (socket) {
	console.log('connection');
	socket.on('sign_up',function(userdata_from){
		Email = userdata_from.email;
		Password = userdata_from.password;
		var check_status1;
		var check_status2;
		var check_status3;
		userListPool.query('INSERT INTO UserInfo (Email,Password,CountDuck) VALUES (?,?,30)',[Email,Password],function(err,result){
			if(err){
				check_status1 = 0;
			}else{
				check_status1 = 1;
			}
			console.log(result);
		});
		userListPool.query('INSERT INTO UserCustom (Email) VALUES (?)',Email,function(err,result){
			if(err){
				check_status2 = 0;
			}else{
				check_status2 = 1;
			}
		});
		userListPool.query('INSERT INTO RoomCount (Emailm) VALUES (?)',Email,function(err,result){
			if(err){
				check_status3 = 0;
			}else{
				check_status3 = 1;
			}
		});
		if(check_status1==0||check_status2==0||check_status3==0){
			var key = random();
			userListPool.query('UPDATE UserInfo SET isConnect = ? WHERE Email = ?',[key,Email],function(err,result){
				socket.emit('sign_up',{
					connect_status: 1,
					pushcode: key
				});
			});
		}else{
			socket.emit('sign_up',{
				connect_status: 0,
				pushcode: 'wrong'
			});
		}
	});
	socket.on('check_email',function(userdata_from){
		Email = userdata_from.email;
		userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',Email,function(err,rows){
			if(err){
				socket.emit('check_email',{
					check_status: 0,
					push_email: Email
				});
			}else if(rows[0]==null){
				socket.emit('check_email',{
					check_status: 1,
					push_email: Email
				});
			}else{
				socket.emit('check_email',{
					check_status: 0,
					push_email: Email
				});
			}
		});
	});
});
function random(){
	var RandomNumber=0;
	while(RandomNumber==0)
	RandomNumber=Math.random() * (32767-(-32768)) -32768;
  	return parseInt(RandomNumber);
}
