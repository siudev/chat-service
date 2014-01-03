#!/bin/env node

var PORT = 5015;

var ENCRYPT_KEY='sUi$Dev_20@14*(SuIdEV)';

var crypto=require('crypto');
var server = require("http").createServer(),
	io = require('socket.io').listen(server, {"log level" : 1});
server.listen(PORT, function(){
	console.log("Chat server is listening on " + server.address().address + ":" + server.address().port);
});
server.on('error', function(e) {
	if (e.code == 'EADDRINUSE') {
		console.log('Chat server port is already used.');
		process.exit(1);
	}
});


var conn_count = 0;
var dicSocketName = {};

io.sockets.on('connection', function(socket) {
	socket.on('req_login', function(data) {
		login(socket, data.name);
	});

	socket.on('req_chat', function(data) {
		chat(socket, data.message);
	});

	socket.on('req_logout', function(data) {
		logout(socket);
	});
	socket.on('disconnect', function() {
		logout(socket);
	});
});

var login = function(socket, name) {
	if(dicSocketName[socket.id] != null) {
		return;
	}
	dicSocketName[socket.id] = { name:name };
	conn_count++;

	io.sockets.emit('ntf_login', { name:name });
	socket.emit('res_login', { name:name });
	console.log(name + ' has been connected. currently ' + conn_count + ' users are online.');
}

var logout = function(socket) {
	if(dicSocketName[socket.id] == null) {
		return;
	}
	var name = dicSocketName[socket.id].name;
	dicSocketName[socket.id] = null;
	conn_count--;

	io.sockets.emit('ntf_logout', { name:name });
	console.log(name + ' has been disconnected.');
}

var chat = function(socket, message) {
	if(dicSocketName[socket.id] == null) {
		return;
	}
	var name = dicSocketName[socket.id].name;
	var chat_text=decrypt(message);

	io.sockets.emit('ntf_chat', { name:name, message:chat_text });
	console.log('transmitted message \'' + name + ': ' + chat_text + '\'');
}

function encrypt(text){
  var cipher = crypto.createCipher('aes-256-cbc',ENCRYPT_KEY)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher('aes-256-cbc',ENCRYPT_KEY)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

