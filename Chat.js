var express = require('express');
var app = express();
var Chatserver = require('http').createServer(app);
var io = require('socket.io')(Chatserver);
var port = 20903;
//client
var cio = require('socket.io-client');
var Logger = require('logger.js');
var cport = 10901;
var csocket=io.connect("localhost:"+cport);

socket.on('connect'function(data){
  
});
