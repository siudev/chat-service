#!/bin/env node

var SERVER_IP = '192.168.0.20';
var SERVER_PORT = 5015;

var is_empty = function(val) {
	return (val == undefined || val == null || val.length <= 0) ? true : false;
};

var send = function(protocol, params, callback) {
	var curl = require('node-curl');
	var url = SERVER_IP + ':' + SERVER_PORT + '/' + protocol;
	if (!is_empty(params)) {
		var tail = Object.keys(params).map(function(k) {
			return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
		}).join('&');
		url += '?' + tail;
	}
	console.log('target url: ' + url);
	curl(url, function(err, res) {
		if (err)
			callback(err);
		else {
			callback(null, this.body);
		}
	});
}

var login = function() {
	send('login', '', function(err, res) {
		if (err)
			console.log(err.code + ': ' + err.message);
		else {
			console.log('id: ' + res);
		}
	});
}

login();

/*
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
	process.stdout.write('data: ' + chunk);
});

process.stdin.on('end', function() {
	process.stdout.write('end');
});
*/
