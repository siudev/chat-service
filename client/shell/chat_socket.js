var SERVER_IP = '192.168.0.20';
var SERVER_PORT = 5015;

replace_ip();
display_ip();

var socket = require( 'socket.io-client' ).connect( SERVER_IP + ':' + SERVER_PORT );

socket.emit( 'req_connect' );

function replace_ip() {
	if( process.argv.length > 2 )
		SERVER_IP = process.argv[2];

	if( process.argv.length > 3 )
		SERVER_PORT = process.argv[3];
}

function display_ip() {
	process.argv.forEach( function( val, index, array ) {
		console.log( index + ': ' + val );
	} );
	
	console.log( "server ip : " + SERVER_IP );
	console.log( "server port : " + SERVER_PORT );
}

exports.register_event = function( tag, handler ) {
	socket.on( tag, handler );
}

exports.send = function( tag, data ) {
	socket.emit( tag, data );
}
