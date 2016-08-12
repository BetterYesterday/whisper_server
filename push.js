// Setup
var express = require('express');
var app = express();
var Pushserver = require('http').createServer(app);
var io = require('socket.io')(Pushserver);
var port = 20904;
//server connection
Pushserver.listen(port);
var cport = 10901;
var csocket=cio.connect("localhost:"+cport);//room과 통신
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
io.sockets.on('connection',function(socket){
  socket.on('login',function(data){
    csocket.on(socket.id,function(cdata){//새로운 방 만들기 첫메시지
      socket.emit()
    });
    csocket.on(socket.id,function(ddata){//방에 메시지 보내기

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
