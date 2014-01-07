#!/bin/env node

var PORT = 5015;

var server = require( "http" ).createServer(),
	io = require( 'socket.io' ).listen( server, { "log level" : 1 } );


server.listen( PORT, function() {
	console.log( "Chat server is listening on " + 
		     server.address().address + ":" + server.address().port );
} );

server.on( 'error', function( e ) {
	if( e.code == 'EADDRINUSE' ) {
		console.log( 'Chat server port is already used.' );
		process.exit( 1 );
	}
} );

exports.register_procedure = function( name, procedure ) {
	io.sockets.on( name, procedure ); 
}

exports.register_event = function( socket, name, handler ) {
	socket.on( name, function( data ) { handler( socket, data ); } ); 
}

exports.send_all = function( tag, data ) {
	io.sockets.emit( tag, data );
}

exports.send = function( socket, tag, data ) {
	io.sockets.in( socket.room ).emit( tag, data );
}

exports.send_private = function( name, tag, data ) {
	for( var n in io.sockets.sockets ){
		if( io.sockets.sockets[n].username == name ){
			io.sockets.sockets[n].emit(tag, data);
			return true;
		}
	}
	
	return false;
	
	
}

exports.all_client_count = function() {
	return io.sockets.clients().length;
}

exports.rooms = function() {
	return io.sockets.manager.rooms;
}



