// Setup
var express = require('express');
var app = express();
var Roomserver = require('http').createServer(app);
var io = require('socket.io')(Roomserver);
var port = 20902;
//server connection
var Sserver = require('http').createServer(app);
var sio = require('socket.io')(Sserver);
var sport = 10901;
Sserver.listen(sport);

var redis = require('redis');
var redisclient = redis.createClient();

var mysql = require('mysql');
var userListPool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'Despair$667',
	database: 'UserList'
});
//chat.js는 채팅방 들어가있을때만 연결됨.따라서 메시지 수신은 여기서 해야함.

logger = new Logger('room.log');

Roomserver.listen(port);

// Routing
app.use(express.static(path.join(__dirname, 'public')));

redisclient.on('error',function(err){
	console.log('Error'+err);
	logger.error('redis error');
});
var roomname=0;
var circular=0;
var priority_arr=new Array();
setInterval(function(){
	userListPool.query('SELECT * FROM RoomCount ORDER BY Point ASC;'function(err,rows){//우선순위 받아옴
		priority_arr=rows;
	});
}, 60000);
Sserver.listen(sport);
sio.on('connection',function(ssocket){//Push에 연결
	ssocket.on('disconnect',function(){
		logger.error('push.js disconnected');
	});

io.sockets.on('connection', function (socket) {//소켓 연결
	//on:메시지 받기
	//emit:메시지 전송
	socket.emit('chat_message',{message:'Room_Connected'});

	socket.on('sign_in',function(userdata_from){//Email,key
  userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.useremail,function(err,rows) {
    if (err||!rows[0].isConnect) {
			socket.emit('chat_message',{roomstatus:"E"});
			//Logger써서 에러출력
		} else if(data.userkey != rows[0].isConnect){
			socket.emit('chat_message',{roomstatus:"Canceled"});
			//로그인 실패(공격시도) -> 해당 ip 차단(일시적)
		} else{
			socket.id=userdata_from.Email;
			socket.emit('chat_message',{roomstatus:"connected"});
			socket.on('room_change',function(dmdkdk){//now:현재 방 리스트 전부 status:추가?제거? room:방이름
				if(dmdkdk.status){//랜덤 방 매칭
				roomname++;
 					ssocket.emit(priority_arr[circular].Email,roomname);
	 					ssocket.emit(socket.id,roomname);

					userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.useremail,function(err,rows) {});
					userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.useremail,function(err,rows) {});
					userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.useremail,function(err,rows) {});

				}else{//방 삭제

					userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.useremail,function(err,rows) {});
				}

			});
    }

  });
});
});
});
});
