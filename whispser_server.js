var express = require('express');
var app = express();
var path = require('path');
//express관련

var Roomserver = require('http').createServer(app);
var io = require('socket.io')(Roomserver);
var port = 20902;
Roomserver.listen(port);
//서버 관련

var mysql = require('mysql');
var userListPool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'Despair$667',
	database: 'UserList'
});
//sql 관련

require('date-utils');
var dt = new Date();
//시간 관련

var Logger = require('./logger.js');
Llogger = new Logger('./roomLogin.log');
Rlogger = new Logger('./room.log');
Plogger = new Logger('./push.log');
Clogger = new Logger('./chat.log');
//로그 관련


// Routing
app.use(express.static(path.join(__dirname, 'public')));


var timerid=new Array();

var roomname =1;
var circular=0;
var priority_arr = new Array();
setInterval(function(){
	userListPool.query('SELECT * FROM RoomCount ORDER BY Point ASC',function(err,rows){//우선순위 받아옴(작은것부터(오름차순))
		for(circular=0;rows[circular].Point<0;circular++){

		}
		priority_arr=rows;
	});
}, 60000);


io.of('/login').on('connection',function(socket){
	socket.on('login',function(data){
		console.log(data.Email+'\n');
		userListPool.query('SELECT isConnect FROM UserInfo WHERE Email = ? ',data.Email,function(err,key){
			if(err){
				Llogger.error('RoomLogin query failed : '+data.Email+'\n'+err);
			}
			console.log(key[0].isConnect);
			if(key[0].isConnect==data.key){
				userListPool.query('UPDATE UserInfo SET Lastkey=? WHERE Email = ?',[key[0].isConnect,data.Email],function(err){
					if(err){
						Llogger.error('RoomLogin query failed : '+data.Email+'\n'+err);
					}
					Llogger.info('Login Succeed : '+data.Email);
					socket.emit('stat',true);
				});
			}else{
				socket.emit('stat',false);
				Llogger.info('RoomLogin failed : '+data.Email);
			}
		});
	});
	socket.emit('loginecho',"echo!!");
	socket.on('echo',function(data){
		Llogger.info('loginecho : '+data);
	});
});

io.of('/room').on('connection',function(socket){//반드시 data에는 Email이 들어가야 함.
	userListPool.query('SELECT isConnect, Lastkey FROM UserInfo WHERE Email = ?',data.Email,function(err,stat){
		if(err){
			Rlogger.error('Room query failed : '+data.Email+'\n'+err);
		}
		socket.on('newroom',function(data){//입력: Email 출력:roomname
			if(stat[0].isConnect==stat[0].Lastkey){
				socket.emit('stat',"connected!");
				roomname++;
				userListPool.query('UPDATE RoomCount SET Point=date_format(now(),"%Y%m%d%H%i%s") WHERE Email = ?',[socket.id],function(err){
					if(err){
						Rlogger.error('Room query failed : '+err);
						socket.emit('newroom',roomname);//서버에도 저장 필요!
					}					
				});
					/*userListPool.query('UPDATE RoomCount SET Point=date_format(now(),"%Y%m%d%H%i%s") WHERE Email = ?',[priority_arr[circular].Email],function(err){
						if(err){
							Rlogger.error('Room query failed : '+err);
						}
					});*/
					//상대방에게 보내는 코드 필요!!
				circular++;
			}else{
				socket.emit('stat',false);//재접속 요구
			}
			console.log(data);
		});
		socket.on('postpone',function(data){//입력:Email,time(0입력하면 취소됨),출력:true or false
			if(stat[0].isConnect==stat[0].Lastkey){//연결되어 있는지 확인
				var j=-1;
				for(var i=0;i<timerid.length;i++){//사용자의 이전 지연 기록이 존재하는지 확인(나중에 mysql으로 대체)
					if(timerid[i].Email==data){
						j=i;
						break;
					}
				}
				if(j==-1){//이전 연기기록 없음//
					userListPool.query('SELECT Point FROM RoomCount WHERE Email = ?',[socket.id],function(err,rows,data,j){
						if(err){
							Rlogger.error('Room query failed : '+err);
						}
						j=timerid.length;
						userListPool.query('UPDATE RoomCount SET Point=? WHERE Email = ?',[timerid[j].point,data.Email],function(err1,rows1,data,j){
							if(err1){
								Rlogger.error('Room query failed : '+err1);
							}
							timerid[j].Email = rows1.Email;
							timerid[j].point=rows1.time;
							socket.emit('stat',true);
						});
						timerid[j].timer = setTimeout(function(data,j){
							userListPool.query('UPDATE RoomCount SET Point=? WHERE Email = ?',[timerid[j].point,timerid[j].Email],function(){
								timerid[j].point=-data.time;
								timerid[j].timer=null;
								if(err1){
									Rlogger.error('Room query failed : '+err1);
								}
							});
						},data.time);
					});
				}else{//이전 연기기록 있음
					userListPool.query('SELECT Point FROM RoomCount WHERE Email = ?',[socket.id],function(err,rows,data,j){
						if(err){
							Rlogger.error('Room query failed : '+err);
						}
						userListPool.query('UPDATE RoomCount SET Point=? WHERE Email = ?',[timerid[j].point,data.Email],function(err1,rows1,data,j){
							if(err1){
								Rlogger.error('Room query failed : '+err1);
							}
							timerid[j].Email = rows1.Email;
							timerid[j].point=rows1.time;
							if(!(timerid[j].timer==null||timerid[j].timer==undefined)){
								clearTimeout(timerid[j].timer);
							}
							socket.emit('stat',true);
						});
						timerid[j].timer = setTimeout(function(data,j){
							userListPool.query('UPDATE RoomCount SET Point=? WHERE Email = ?',[timerid[j].point,timerid[j].Email],function(){
								timerid[j].point=-data.time;
								timerid[j].timer=null;
									if(err1){
										Rlogger.error('Room query failed : '+err1);
									}
								});
						},data.time);
					});
				}
			}
		});
		socket.on('roomdel',function(data){
			if(stat[0].isConnect==stat[0].Lastkey){//연결되어 있는지 확인
				//차후 서버 디비 추가하면 삭제코드 추가
			}
			socket.on('stat',true);
		});
		socket.emit('roomecho',"echo!!");
		socket.on('echo',function(data){
			console.log('roomecho : '+data);
		});
	});
});

io.of('/chat').on('connection',function(socket){
	socket.emit('message',"echo!!");
	socket.on('join',function(data){//Email,room
		//차후 디비 추가하고, 체크 코드를 추가
		socket.join(data.room);
	});
	socket.on('message',function(data){//room,message,time
		console.log(data);
		data.time=dt.toFormat('YYYY-MM-DD HH24:MI:SS');
		socket.to(data.room).emit('message',data);
	});
	socket.on('echo',function(data){
		console.log('chatecho : '+data);
	});
});

io.of('/sign_in').on('connection',function(socket){	
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

io.of('/sign_up').on('connection',function(socket){
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

function shifter(array){//상대방 연결 코드. 자동으로 다음 순서의 wantchat 클릭 이메일을 리턴
	if(array[0]==undefined&&!(array.length==0)){
	return chatconnect(array.shift());
} else if(array[0]==null){

} else if(array.length==0){
} else{
}
return array;
}

function random(){
	var RandomNumber=0;
	while(RandomNumber==0)
	RandomNumber=Math.random() * (32767-(-32768)) -32768;
  	return parseInt(RandomNumber);
}