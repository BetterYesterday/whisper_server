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

csocket.on('connect',function(cdata){//전부 포함,
});

csocket.on('connect_person',function(data){
});//{Email:socket.id,Numname:roomname.num,Codename:roomname.codename,who:reply[0]}
dsocket.on('connect',function(ddata){

});
dsocket.on('disconnect',function(ddata){

});
io.sockets.on('connection',function(socket){
  socket.on('login')
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
