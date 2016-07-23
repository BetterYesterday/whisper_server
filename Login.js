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

/*connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});*/

// Routing
app.use(express.static(path.join(__dirname,'public')));

// Login code
io.sockets.on('connection', function (socket) {
	socket.on('sign_in',function(userdata_from){
		var data = {
			useremail: userdata_from[0],
			userpassword: userdata_from[1]
		}
		function findEmail(data, callback){
			userListPool.query('SELECT Email FROM UserInfo WHERE Email = ?',data.useremail,function(err,rows) {
				if (err) {
					callback(err,null);
				} else {
					callback(null,rows[0].Email);
				}
				userListPool.release();
			});
		}
		var connect_status
		findEmail(data, function(err, useremail){
			if (err) {
				socket.emit('login',{
					connect_status: 0
				});
			} else {
				if(contents.length>0){
					function socketinput(callback){
							socket.username=useremail;
								socket.key=random();
								callback(socket.key);

					}
					socketinput(function(key){

							userListPool.query('UPDATE isConnect FROM UserInfo SET isConnect =? WHERE Email =?',[key,useremail],function{
									socket.emit('login',{
										connect_status: 1,
										pushemail: useremail
										yourkey: key
								});
							});
					});



				} else if(contents.length == 0) {
					socket.emit('login',{
						connect_status: 0,
						pushemail: contents
					});
				}
				//userListPool.
			}
		});
	});
	socket.on('disconnect',function(){
		socket.get('username',function(err,username){
			if(!(!username)){
			}
			else{
			userListPool.query('UPDATE isConnect FROM UserInfo SET isConnect =? WHERE Email =?',[0,useremail]);
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
