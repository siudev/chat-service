var crypto = require( "./../../common/chat_crypto" );
var socket;
var name = '';

exports.create = function( sock ) {
	socket = sock;
	socket.register_event( 'res_login', res_login );
	socket.register_event( 'ntf_login', ntf_login );
	socket.register_event( 'ntf_logout', ntf_logout );
	socket.register_event( 'ntf_chat', ntf_chat );
	socket.register_event( 'disconnect', disconnect );
}
 
exports.run = function() {
	process.stdout.write( 'name: ' );
	process.stdin.resume();
	process.stdin.setEncoding( 'utf8' );
	process.stdin.on( 'data', function( input ) {
		if( name == '' ) {
			socket.send( 'req_login', { name:input.trim() } ); 
		} else {
			socket.send( 'req_chat', { name:name, message:input.trim() } );
		}
	} );
	process.stdin.on( 'end', function() {} );
}

function res_login( data ) {
	name = data.name;
}

function ntf_login( data ) { 
	console.log( data.name + ' is connected.' );
}

function ntf_logout( data ) {
	console.log( data.name + ' is disconnected.' );
}

function ntf_chat( data ) {
	var message = crypto.decrypt( data.message );
	process.stdout.write( data.name + ': ' + message + '\n' );
}

function disconnect() {
	socket.send( 'req_logout', { name:name } );
}
