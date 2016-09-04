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
	console.log('connection');
	socket.on('sign_in',function(userdata_from){
		Email = userdata_from.email;
		Password = userdata_from.password;
		userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',Email,function(err,rows) {
			if(err){
				socket.emit('login',{
					connect_status: 2,
					pushcode: null
				});
			}else if(rows[0]==null){
				socket.emit('login',{
					connect_status: 0,
					pushcode: 'null_email'
				});
			}else{
				if(Password==rows[0].Password){
					var key = random();
					userListPool.query('UPDATE UserInfo SET isConnect=? WHERE Email = ?',[key,Email],function(err,result){
						if(!err){
							socket.emit('login',{
								connect_status: 1,
								pushcode: key
							});
						}
					});
				}else{
					socket.emit('login',{
						connect_status: 0,
						pushcode: 'wrong_password'
					});
				}			
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
