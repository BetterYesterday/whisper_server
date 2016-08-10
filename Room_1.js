// Setup
var express = require('express');
var app = express();
var Roomserver = require('http').createServer(app);
var io = require('socket.io')(Roomserver);
var port = 20902;
//server connection
var Logger = require('logger.js');
var RoomConn = require('RoomListConnector.js');
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
			socket.emit('chat_message',{roomstatus:"ERR"});
			//Logger써서 에러출력
		} else if(data.userkey != rows[0].isConnect){
			socket.emit('chat_message',{roomstatus:"Canceled"});
			//로그인 실패(공격시도) -> 해당 ip 차단(일시적)
		} else{
			socket.id=userdata_from.Email;
			socket.emit('chat_message',{roomstatus:"connected"});
			socket.on('room_change',function(dmdkdk){//now:현재 방 리스트 전부(,으로 구분) status:추가?제거? room:방이름(스트링,삭제 때만 사용)
																							 //message:메시지(스트링, 개설 때만 사용)
				if(dmdkdk.status){//랜덤 방 매칭
				roomname++;
 					ssocket.emit(priority_arr[circular].Email,{roomname:roomname,message:dmdkdk.message});//푸쉬에서 룸네임을 전송 명령
	 					ssocket.emit(socket.id,{roomname:roomname});

						RoomConn.write("./Rooms/"+socket.id,now.split().push(roomname).shifter().join(),function(err){
							logger.error("write ERROR!!! "+socket.id);
							userListPool.query('UPDATE RoomCount SET LastPushedBy=now() WHERE Email = ?',[socket.id],function(){

							  userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',socket.id,function(err,rows_1) {
									rows_l.LastPushedBy
								});
							});
						});
						RoomConn.write("./Rooms/"+priority_arr[circular].Email,now.split().push(roomname).shifter().join(),function(err){
							logger.error("write ERROR!!! "+priority_arr[circular].Email);
						});
						circular++;
				}else{//방 삭제
					var temparr = dmdkdk.now.split()
					temparr[temparr.indexOf(dmdkdk.room)]=undefined;
					userListPool.query('SELECT * FROM ')
				}

			});
    }

  });
});
});
});
});
function shifter(array){//상대방 연결 코드. 자동으로 다음 순서의 wantchat 클릭 이메일을 리턴
	if(array[0]==undefined&&!(array.length==0)){
	return chatconnect(array.shift());
} else if(array[0]==null){

} else if(array.length==0){
} else{
}
return array;
}
