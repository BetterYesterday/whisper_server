//Setup
var express = require('express');
var app = express();
var Settingserver = require('http').createServer(app);
var io = require('socket.io')(Settingserver);
var path = require('path');
var port = 20912;

var mysql = require('mysql');
var userListPool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'Despair$667',
        database: 'UserList'
});
Settingserver.listen(port);
// Routing
app.use(express.static(path.join(__dirname,'public')));
// Login code
io.sockets.on('connection', function (socket) {
        console.log('connection');
	socket.on('mod_profile',function(userdata_from){
		Email = userdata_from.email;
		text1 = userdata_from.text1;
		text2 = userdata_from.text2;
		text3 = userdata_from.text3;
		text4 = userdata_from.text4;
		text5 = userdata_from.text5;
		userListPool.query('UPDATE UserCustom Set 
	});
});
