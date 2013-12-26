#!/bin/env node

var SERVER_IP = '192.168.0.20';
var SERVER_PORT = 5015;

replaceIP();

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
		socket.emit('req_chat', { name:name, message:input.trim() });
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


