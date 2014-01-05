var crypto = require( "./../common/chat_crypto" );
var server;

exports.on = function( s ) {
	server = s;
	server.register_procedure( 'connection', connection_proc );
}

function connection_proc( socket ) {
	server.register_event( socket, 'req_login', login );
	server.register_event( socket, 'req_chat', chat );
	server.register_event( socket, 'req_logout', logout );
	server.register_event( socket, 'disconnect', logout );
} 

var login = function( socket, data ) {
	socket.name = data.name; 
	server.send_all( 'ntf_login', { name:data.name } );
	socket.emit( 'res_login', { name:data.name } );
	console.log( data.name + ' has been connected. currently ' + 
		     server.all_client_count() + ' users are online.' );
}

var logout = function( socket, data ) {
	server.send_all( 'ntf_logout', { name:socket.name } );
	console.log( socket.name + ' has been disconnected.' );
}

var chat = function( socket, data ) { 
	var message = crypto.encrypt( data.message ); 
	server.send_all( 'ntf_chat', { name:data.name, message:message } );
	console.log( 'transmitted message \'' + data.name + ': ' + data.message + '\'' );
}
