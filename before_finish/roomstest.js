var io = require('socket.io-client');
var socket =  io('http://localhost:20902/login');
socket.on('connect',function(){
  socket.emit('login',{Email:'test@test.test',key:111});
});
socket.on('echo',function(data){
  socket.emit('loginecho',data+'echo~!');
});
