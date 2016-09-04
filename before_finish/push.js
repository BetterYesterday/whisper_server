// Setup
var express = require('express');
var app = express();
var Pushserver = require('http').createServer(app);
var io = require('socket.io')(Pushserver);
var port = 20904;
var path = require('path');
//server connection
Pushserver.listen(port);
var cio = require('socket.io-client');
var cport = 10901;
var csocket=cio.connect("localhost:"+cport);//room과 통신
var dio = require('socket.io-client');
var dport=10902;
var dsocket=dio.connect("localhost:"+dport);//chat과 통신


app.use(express.static(path.join(__dirname, 'public')));

csocket.on('connect',function(data){//전부 포함,
});

csocket.on('connect_person',function(data){
});//{Email:socket.id,Numname:roomname.num,Codename:roomname.codename,who:reply[0]}
dsocket.on('connect',function(data){

});
dsocket.on('disconnect',function(data){

});
var v = new Array();
io.sockets.on('connection',function(socket){
  socket.on('login',function(data){//Email,pushkey,roomarr
    if(!data.roomarr.length){
      for(var i=0;i<data.roomarr.length;i++){
        socket.join(data.roomarr[i]);
      }
    }
    csocket.on(socket.id,function(cdata){//새로운 방 만들기 첫메시지
      socket.emit('newmessage',{roomname:cdata.roomname,message:cdata.message,Isend:cdata.Isend});
    });

  });
});
dsocket.on("message",function(ddata){//방에 메시지 보내기
  io.to(ddata.roomname).emit('message',{roomname:cdata.roomname,message:cdata.message,Isend:false});

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
