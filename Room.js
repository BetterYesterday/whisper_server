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
redisclient.on('error',function(err){
	console.log('Error'+err);
});
var people = new Array();
io.sockets.on('connection', function (socket) {//소켓 연결
	//on:메시지 받기
	//emit:메시지 전송
	socket.emit('chat_message',{message:'Room_Connected'});
	var data;
	socket.on('sign_in',function(userdata_from){
		data = {
		useremail: userdata_from[0],
		userkey: userdata_from[1]
	}
	userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.useremail,function(err,rows) {
		var poolresult=rows;//이거 필요한지?(테스트해봐야)
	userListPool.release();
		if (err||!rows[0].isConnect) {
			//Logger써서 에러출력
		} else if(data.userkey != rows[0].isConnect){
			//로그인 실패(공격시도) -> 해당 ip 차단(일시적)
		} else{
		socket.id = data.useremail;
		socket.key = data.userkey;
		socket.emit('chat_message',{connect_status:1, duck:poolresult[0].countDuck,roomcount:poolresult[0].countRoom});
		socket.emit('room_person',{room1:poolresult[0].Room_1, room2:poolresult[0].Room_2, room3:poolresult[0].Room_3, room4:poolresult[0].Room_4, room5:poolresult[0].Room_5})
		socket.on('room',function(command){
			var ifwantchat=true;
			var timercontinues=false;
			var wantchat;
			if(command==0){
				ifwantchat=false;//사용자가 장난치는걸 막음.(쿼리문 성능 관련)
				if(wantchat){
					userListPool.query('UPDATE isConnect FROM UserInfo SET isWantChat =? WHERE Email =?',[0,socket.id],function(){
					redisclient.get("isWantChatList",function(err,reply){
						var tempreply=new Array();
						tempreply=reply.delete(reply.indexOf(socket.id));

					/*	var tempreply;
						if(reply=null||reply==undefined){
							tempreply=new Array();
						}
						else{
							tempreply==reply;
						}
						tempreply[tempreply.length]=data.useremail
					redisclient.set("isWantChatList",data.useremail);*/
						wantchat=0;
					});
					});
				}
			}
			if(command==1){//wantchat박스 활성화(언제든 괜찮)
				ifwantchat=true;
				if(!timercontinues){//타이머 진행 중 중복 실행을 막음
					timercontinues=true;
				settimeout(function(){
					if(!ifwantchat){
						break;
					}
					userListPool.query('UPDATE isConnect FROM UserInfo SET isWantChat =? WHERE Email =?',[1,socket.id],function(){
					redisclient.get("isWantChatList",function(err,reply){
						if(reply=null||reply==undefined){
						tempreply=new Array();
					}
					else{
						tempreply==reply;
					}
					tempreply=tempreply.push(socket.id);
					redisclient.set("isWantChatList",tempreply);//안되면 join으로 String형태로 바꿔넣음
					timercontinues=false;
					wantchat=1;
					});
					});
				},3000);
			}
		}else if(command==2){//nowchat버튼 클릭시(지금 채팅)

		}
		});
		if(poolresult[0].Room_1){

		}if(poolresult[0].Room_2){

		}if(poolresult[0].Room_3){

		}if(poolresult[0].Room_4){

		}if(poolresult[0].Room_5){

		}
		socket.on('chat_message',function(Message){//{to:누구 message:내용}
			redisclient.
		});
		}
	});
		//반대편 사람과 연결
	});
});
