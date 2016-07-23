// Setup
var express = require('express');
var app = express();
var Loginserver = require('http').createServer(app);
var io = require('socket.io')(Loginserver);
var path = require('path');
var port = 20902;
var apacheroot = "/home/ubuntu/www/html/"

var Logger = require('logger.js');

var redis = require('redis');
var redisclient = redis.createClient();

var mysql = require('mysql');
var userListPool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'Despair$667',
	database: 'UserList'
});

logger = new Logger('room.log');

Chatserver.listen(port);

// Routing
app.use(express.static(path.join(__dirname, 'public')));
/*
// Chatroom_code
var numUsers = 0;
fs.access(apacheroot+"numUsers.txt", (fs.R_OK | fs.W_OK),	function(err){
logger.info("numusers.txt"+(err ? 'no access!' : 'can read/write'));
	if(err){
		fs.access(apacheroot+"numUsers.txt",fs.F_OK,function(err){
		logger.info("numusers.txt"+(err ? 'no File!' : 'no Permission!'));
				if(err){
					fs.writeFile(apacheroot+"numUsers.txt", '0', function(err){
  					if (err) throw err;
						logger.info('It\'s saved!');
					});
				}
				else{
							fs.chmodSync(apacheroot+"numUsers.txt", 777);
				}
		})
	}
	else{
		fs.readFile(apacheroot+"numUsers.txt",function(err,data){
			numUsers = data;
			//numusers를 받아온뒤에 실행
	}
});
*/
/*
1. 상대의 접속여부를 체크
2. 메시지를 상대방에게 그대로 전송 및 서버에 저장
3. 상대방 숫자아이디를 db에 저장했다가 접속 시 상대방에게 접속 정보를 송신
4. 상대방이 비접속 시 아무짓도 하지 않음.
5. 닉네임을 db에 저장/변경 사항이 있을 시 알려줌
6. 지금 채팅하고 싶습니다 버튼
7. 언제든 채팅해도 괜찮습니다 버튼

*/
io.sockets.on('connection', function (socket) {//소켓 연결
	var people = new Array();
	//on:메시지 받기
	//emit:메시지 전송
	socket.emit('new_message',{message:'Room_Connected'});
	var data;
	socket.on('sign_in',function(userdata_from){
		data = {
		useremail: userdata_from[0],
		userkey: userdata_from[1]
	}
	userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.useremail,function(err,rows) {
		if (err||!rows[0].isConnect) {
			Logger.
		} else {
		}
		userListPool.release();
	});
	socket.set('username',contents,function(err){});
	socket.set('key',data.userkey,function(err){});

	socket.on('people',function(msg){//
		socket.broadcast.emit('people',{message: msg});
	});
		//반대편 사람과 연결
	});
});
})
