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
var Ssocket=null;
Sserver.listen(port);
sio.on('connection',function(socket){
	Ssocket=1;
	socket.on('disconnect',function(){
		logger.error('chat.js disconnected');
		Ssocket=0;
	});
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
		socket.emit('chat_message',{room1:poolresult[0].Room_1, room2:poolresult[0].Room_2, room3:poolresult[0].Room_3, room4:poolresult[0].Room_4, room5:poolresult[0].Room_5})
		socket.on('room',function(command){
			var ifwantchat=true;
			var timercontinues=false;
			var wantchat;
			if(!(rows[0].countRoom>4)){
			if(command==0){
				ifwantchat=false;//사용자가 장난치는걸 막음.(쿼리문 성능 관련)
				if(wantchat){
					userListPool.query('UPDATE isConnect FROM UserInfo SET isWantChat =? WHERE Email =?',[0,socket.id],function(){

					redisclient.get("isWantChatList",function(err,reply){
						var tempreply=reply.delete(reply.indexOf(socket.id));

						if(reply=null||reply==undefined){
							tempreply=new Array();
						}
						else{
							tempreply==reply;
						}
						tempreply[tempreply.length]=data.useremail
					redisclient.set("isWantChatList",data.useremail);
						wantchat=0;
					});
					userListPool.release();
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
						var tempreply=new Array();
					}
					else{
						tempreply==reply;
					}
					tempreply=tempreply.push(socket.id);
					redisclient.set("isWantChatList",tempreply);//안되면 join으로 String형태로 바꿔넣음
					timercontinues=false;
					wantchat=1;
					});
					userListPool.release();
					});
				},3000);
			}
		}
}
		if(command==2){//nowchat버튼 클릭시(지금 채팅)
			redisclient.get("isWantChatList",function(err,reply){
				var tempreply=new Array();
					function chatconnect(array){//상대방 연결 코드. 자동으로 다음 순서의 wantchat 클릭 이메일을 리턴
						if(array[0]==undefined&&!(array.length==0)){
						return chatconnect(array.shift());
					} else if(array[0]==null){

					} else if(array.length==0){
						socket.emit('chat_message',{return:"no waiting person"});
					} else{
					}
					return array;
					}
					tempreply = chatconnect(reply);
					if(!(tempreply==reply)){
						redisclient.set("isWantChatList",tempreply);
					}
						if(Ssocket){

							redisclient.get("isWantChatList",function(err,reply){
								if(err){
									logger.error('chatconnection error');
									break;
								}
									var roomname;
								if(!rows[0].Room_1 || rows[0].Room_1==null){
									userListPool.query('UPDATE isConnect FROM UserInfo SET Room_1 =? WHERE Email =? SET countRoom =?',[reply[0],socket.id,(rows[0].countRoom+1)],function(){
										userListPool.release();
									});
									rows[0].Room_1= reply[0];
									roomname="Room_1";
								}else if(!rows[0].Room_2 || rows[0].Room_2==null){
									userListPool.query('UPDATE isConnect FROM UserInfo SET Room_2 =? WHERE Email =? SET countRoom =?',[reply[0],socket.id,(rows[0].countRoom+1)],function(){
										userListPool.release();
									});
									rows[0].Room_2= reply[0];
									roomname="Room_2";

								}else if(!rows[0].Room_3 || rows[0].Room_3==null){
									userListPool.query('UPDATE isConnect FROM UserInfo SET Room_3 =? WHERE Email =? SET countRoom =?',[reply[0],socket.id,(rows[0].countRoom+1)],function(){
										userListPool.release();
									});
									rows[0].Room_3= reply[0];
									roomname="Room_3";

								}else if(!rows[0].Room_4 || rows[0].Room_4==null){
									userListPool.query('UPDATE isConnect FROM UserInfo SET Room_4 =? WHERE Email =? SET countRoom =?',[reply[0],socket.id,(rows[0].countRoom+1)],function(){
										userListPool.release();
									});
									rows[0].Room_4= reply[0];
									roomname="Room_4";

								}else if(!rows[0].Room_5 || rows[0].Room_5==null){
									userListPool.query('UPDATE isConnect FROM UserInfo SET Room_5 =? WHERE Email =? SET countRoom =?',[reply[0],socket.id,(rows[0].countRoom+1)],function(){
										userListPool.release();
									});
									rows[0].Room_5= reply[0];
									roomname="Room_5";
								}

								socket.emit('chat_message',{return:"connected",room:roomname});
								sio.emit('connect_person',{Email:socket.id,Roomname:roomname});//1:wantchat리스트에서 뽑음/2:nowchat사람

						});//
					}

			});
		}else if(command==3){//방 나가기 버튼 클릭시
			//상대방 id를 받아와서 redis에서 삭제 필요.
		}
		});
		}


	});//쿼리문괄호
	});
});
