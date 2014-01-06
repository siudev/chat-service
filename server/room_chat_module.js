var crypto = require( "./../common/chat_crypto" );
var server;

exports.on = function( s ) {
	server = s;
	server.register_procedure( 'connection', connection_proc );
}

function connection_proc( socket ) {
	server.register_event( socket, 'req_connect', req_connect );
	server.register_event( socket, 'req_login', req_login );
	server.register_event( socket, 'req_roomlist', req_roomlist );
	server.register_event( socket, 'req_joinroom', req_joinroom );
	server.register_event( socket, 'req_leaveroom', req_leaveroom );
	server.register_event( socket, 'req_chat', req_chat );
	server.register_event( socket, 'disconnect', req_leaveroom );
} 

function req_connect( socket, data ) {
	socket.emit( 'res_connect' );
}

function req_login( socket, data ) {
	socket.username = data.username;
	socket.emit( 'res_login', { username:data.username } );
	console.log( data.username + ' is login. currently ' + 
		     server.all_client_count() + ' users are online.' );
}

function req_roomlist( socket, data ) {
	socket.emit( 'res_roomlist', { rooms:server.rooms() } );
}

function req_joinroom( socket, data ) {
	var room_name = data.room;
	if( data.room == null )
		data.room = socket.username + '\'s room'; 
	socket.join( data.room );
	socket.room = data.room;
	server.send( socket, 'ntf_joinroom', { username:socket.username } );
	console.log( socket.username + ' has been joined to ' + data.room  );
}

function req_leaveroom( socket, data ) {
	server.send( socket, 'ntf_leaveroom', { username:socket.username } );
	socket.leave( socket.room );
	console.log( socket.username + ' has been left from ' + data.room );
}

function req_chat( socket, data ) { 
	var message = crypto.encrypt( data.message );
	server.send( socket, 'ntf_chat', 
		     { username:socket.username, message:message } );
	console.log( socket.room + ' transmitted message -> \'' + 
		     socket.username + ' : ' + data.message + '\'' );
}
