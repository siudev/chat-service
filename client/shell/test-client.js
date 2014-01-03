#!/bin/env node

var SERVER_IP = '192.168.0.20';
var SERVER_PORT = 5015;

var ENCRYPT_KEY='sUi$Dev_20@14*(SuIdEV)';

replaceIP();

var crypto=require('crypto');
var socket = require('socket.io-client').connect(SERVER_IP + ':' + SERVER_PORT);
var name = '';

process.stdout.write('name: ');

socket.on('res_login', function(data) {
	name = data.name;
});

socket.on('ntf_login', function(data) {
	console.log(data.name + ' is connected.');
});

socket.on('ntf_logout', function(data) {
	console.log(name + ' is disconnected.');
});

socket.on('ntf_chat', function(data) {
	process.stdout.write(data.name + ': ' + data.message + '\n');
});

socket.on('disconnect', function() {
	socket.emit('req_logout', { name:name });
});

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(input) {
	if (name == '') {
		socket.emit('req_login', { name:input.trim() });
	} else {
		socket.emit('req_chat', { name:name, message:encrypt(input.trim()) });
	}
});

process.stdin.on('end', function() {
});

function replaceIP() {
	console.log("replaceIP", process.argv[2]);
	if(process.argv[2] != null) {
		SERVER_IP = process.argv[2];
		console.log("Target SERVER_IP has changed :", SERVER_IP);
	}
	process.argv.forEach(function (val, index, array) {
		console.log(index + ': ' + val);
	});
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

