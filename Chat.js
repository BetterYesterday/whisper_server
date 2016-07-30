var express = require('express');
var app = express();
var Chatserver = require('http').createServer(app);
var io = require('socket.io')(Chatserver);
var port = 20903;
//client
var cio = require('socket.io-client');
var Logger = require('logger.js');
var cport = 10901;
var csocket=cio.connect("localhost:"+cport);
var dport=10902;
var dsocket=dio.connect("localhost:"+dport);//push로 통신

var redis = require('redis');
var redisclient = redis.createClient();
var newRoomwait = new newRoomwait();

app.use(express.static(path.join(__dirname, 'public')));

csocket.on('connect',function(cdata){

});
csocket.on('disconnect',function(){

});
csocket.on('connect_person',function(data){
newRoomwait=newRoomwait.push({Email:data.Email,Roomname:data.Roomname});
});
dsocket.on('connect',function(ddata){

});
dsocket.on('disconnect',function(ddata){

});
  io.sockets.on('connection',function(socket){
    var MyRoom=new Array();
    var queryresult;
    socket.on('login',function(data){//{Email:asdf,who:Roomnum}
      socket.id=data.Email
      userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.Email,function(err,rows) {
        MyRoom[1].my=rows[0].Room_1;
        MyRoom[2].my=rows[0].Room_2;
        MyRoom[3].my=rows[0].Room_3;
        MyRoom[4].my=rows[0].Room_4;
        MyRoom[5].my=rows[0].Room_5;
          redisclient.set("MyRoomList",MyRoom);
        queryresult=rows;
        if(err){
          userListPool.release();
          break;
        }

        function autogenarray(array){//상대방 연결 코드. 자동으로 다음 순서의 wantchat 클릭 이메일을 리턴
          if(array[0]==undefined&&!(array.length==0)){
          return chatconnect(array.shift());
        } else if(array[0]==null){

        } else if(array.length==0){
          socket.emit('chat_message',{return:"no waiting person"});
        } else{
        }
        return array;
        }
        var ifpersoninfo=0;
        newRoomwait=autogenarray(newRoomwait);
        var roomname=0;
          function addElseperson(callback){//반대쪽 사람도 정보 추가하기
          var index=-1;
          if(newRoomwait.length==0){
            break;
          }
            for(var i=0;i<newRoomwait.length;i++){

              if(newRoomwait[i].Email==socket.id){
                index=i;
                ifpersoninfo=1;
                break;
              }

            userListPool.query('SELECT * FROM UserInfo WHERE Email = ?',data.Email,function(err,innerrows) {
              if(!innerrows[0].Room_1 || innerrows[0].Room_1==null){
                userListPool.query('UPDATE isConnect FROM UserInfo WHERE Email =? SET Room_1 =? SET countRoom =?',[newRoomwait[index].Email,socket.id,(innerrows[0].countRoom+1)],function(){
                  userListPool.release();
                });
                innerrows[0].Room_1= reply[0];
                roomname="Room_1";
              }else if(!innerrows[0].Room_2 || innerrows[0].Room_2==null){
                userListPool.query('UPDATE isConnect FROM UserInfo WHERE Email =? SET Room_2 =? SET countRoom =?',[newRoomwait[index].Email,socket.id,(innerrows[0].countRoom+1)],function(){
                  userListPool.release();
                });
                innerrows[0].Room_2= reply[0];
                roomname="Room_2";

              }else if(!innerrows[0].Room_3 || innerrows[0].Room_3==null){
                userListPool.query('UPDATE isConnect FROM UserInfo WHERE Email =? SET Room_3 =? SET countRoom =?',[newRoomwait[index].Email,socket.id,(innerrows[0].countRoom+1)],function(){
                  userListPool.release();
                });
                innerrows[0].Room_3= reply[0];
                roomname="Room_3";

              }else if(!innerrows[0].Room_4 || innerrows[0].Room_4==null){
                userListPool.query('UPDATE isConnect FROM UserInfo WHERE Email =? SET Room_4 =? SET countRoom =?',[newRoomwait[index].Email,socket.id,(innerrows[0].countRoom+1)],function(){
                  userListPool.release();
                });
                innerrows[0].Room_4= reply[0];
                roomname="Room_4";

              }else if(!innerrows[0].Room_5 || innerrows[0].Room_5==null){
                userListPool.query('UPDATE isConnect FROM UserInfo WHERE Email =? SET Room_5 =? SET countRoom =?',[newRoomwait[index].Email,socket.id,(innerrows[0].countRoom+1)],function(){
                  userListPool.release();
                });
                innerrows[0].Room_5= reply[0];
                roomname="Room_5";
              }
              callback;
            });
          }
          if(!ifpersoninfo){
              settimeout(function(){
                newRoomwait=autogenarray(newRoomwait);
                addElseperson();
              },1000);
          } else {
            addElseperson();
          }
        }
      });
/*
      userListPool.query('SELECT Room_* FROM UserInfo WHERE Email = ?',MyRoom[1].my,function(err,rows) {
        userListPool.release();
      });
      userListPool.query('SELECT Room_* FROM UserInfo WHERE Email = ?',MyRoom[2].my,function(err,rows) {
        userListPool.release();
      });
      userListPool.query('SELECT Room_* FROM UserInfo WHERE Email = ?',MyRoom[3].my,function(err,rows) {
        userListPool.release();
      });
      userListPool.query('SELECT Room_* FROM UserInfo WHERE Email = ?',MyRoom[4].my,function(err,rows) {
        userListPool.release();
      });
      userListPool.query('SELECT Room_* FROM UserInfo WHERE Email = ?',MyRoom[5].my,function(err,rows) {
        userListPool.release();
      });*/
    });
    socket.on('message',function(data){//Room:방(숫자로 보낼것)Message:메시지Online:상대방 온라인여부
      if(data.Online){
        io.sockets.in(MyRoom[data.Room]).emit(Message,{Message})
      }
    });
  });
function chat_sendmgr(Message,Email){
  dsocket.emit('message',{who:Email,Message:Message});
}
