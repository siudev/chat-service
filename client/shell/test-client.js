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

socket.on('pvt_chat', function(data) {
	process.stdout.write('from '+data.name + ': ' + data.message + '\n');
});

socket.on('res_pvt_chat', function(data) {
	process.stdout.write('to '+data.name + ': ' + data.message + '\n');
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
		
		emitChat(input.trim());
	}
});

process.stdin.on('end', function() {
});



function createChatCommand(separator, commandArray, func, description)
{
	this.separator = separator;
	this.commandArray = commandArray;
	this.func = func;
	this.description = description;
}


var chatCommandArray = new Array();
chatCommandArray.push( new createChatCommand( "/", [ "?", "help"], commandHelp, "" ));
chatCommandArray.push( new createChatCommand( "/", [ "dice", "roll", "random" ], commandDice, "/dice, /dice 100" ));
chatCommandArray.push( new createChatCommand( "/", [ "w", "whisper" ], commandWhisper, "/w [name] [msg]" ));

function emitChat(text)
{
	var t = text[0];
	var command = null;
	for( var i = 0 ; i < chatCommandArray.length; i++)
	{
		command = chatCommandArray[i];
		if( t == command.separator )
		{
			var c = text.split(' ')[0].substr(1);
			for( var j = 0; j < command.commandArray.length; j++)
			{
				if( command.commandArray[j] == c)
				{
					var v = text.substr( c.length+2);
					command.func.apply( this, [v] );

					return;
				}
			}
		}
		
	}

	socket.emit('req_chat', { name:name, message:( encrypt(text)) });

}

function commandHelp(data)
{
	var c = null;
	for( var i = 0; i < chatCommandArray.length; i++){
		c = chatCommandArray[i];
		var command = '';
		for( var j = 0; j < c.commandArray.length; j++ ){
			command = command+c.separator+c.commandArray[j]+",";
		}
		command = command.substr(0,command.length-1);
		console.log( "- command : "+command+"  ,  ex : "+c.description);

	}
}

function commandDice(data)
{
	var dice = Number(data);
	if( isNaN(dice) || dice <= 0 ){
		dice = 100;
	}

	var text = name+' rolled a '+ Math.floor(Math.random()*dice)+' of '+dice;
	socket.emit('req_chat', { name:name, message:( encrypt(text)) });
	
		
}

function commandWhisper(data)
{
	var wName = data.split(' ')[0];
	var msg = data.substr( wName.length+1);

	if( wName == '' || msg == '' || wName == name) return;

	socket.emit('req_whisperChat', { name:wName, message:( encrypt(msg)) });
}


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
