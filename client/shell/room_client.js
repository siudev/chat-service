var crypto = require( "./../../common/chat_crypto" );
var io = require( "./chat_io" );

var socket;
var username = '';
var roomlist = {};

exports.create = function( sock ) {
	socket = sock;
	socket.register_event( 'res_connect', res_connect );
	socket.register_event( 'res_login', res_login );
	socket.register_event( 'res_roomlist', res_roomlist );
	socket.register_event( 'ntf_joinroom', ntf_joinroom );
	socket.register_event( 'ntf_leaveroom', ntf_leaveroom );
	socket.register_event( 'ntf_chat', ntf_chat );
}
 
function res_connect( data ) {
	io.write( 'input user name : ' );
	io.change_state( 'connect_server' );
}

function res_login( data ) {
	username = data.username;
	io.write( username + ' is login\n' );
	socket.send( 'req_roomlist' );
}

function res_roomlist( data ) {
	io.write( '---- room list ----\n' );
	var index = 0;
	var rooms = data.rooms;
	for( var key in rooms ) {
		if( index == 0 )
			io.write( index + ' : create new room\n' ); 
		else {
			var name = key.replace( '/', '' );	
			io.write( index + ' : ' + name  + '\n' );
			roomlist[ index ] = name; 
		}
		++index;
	}
	io.write( '-------------------\n' );

	io.write( 'input room number : ' );
	io.change_state( 'display_roomlist' );
}


function ntf_joinroom( data ) { 
	io.write( data.username + ' join room.\n' );
	io.change_state( 'join_room' );
}

function ntf_leaveroom( data ) {
	io.write( data.username + ' leave room.\n' );
}

function ntf_chat( data ) {
	var message = crypto.decrypt( data.message );
	io.write( data.username + ' : ' + message + '\n' );
}


exports.run = function() {
	io.register_state( 'connect_server', connect_server_state );
	io.register_state( 'display_roomlist', display_roomlist_state );
	io.register_state( 'join_room', joinroom_state );
	io.run();
}

function connect_server_state( input ) {
	socket.send( 'req_login', { username:input.trim() } );
}

function display_roomlist_state( input ) {
	input = input.trim();
	var room = roomlist[ input ];
	if( input != 0 && room == null ) {
		io.write( 'Invalid input. Please re-enter.\n' );
		io.write( 'Input room number : ' );
		return;
	}
	socket.send( 'req_joinroom', { room:room } );
}

function joinroom_state( input ) {
	socket.send( 'req_chat', { message:input.trim() } );	
}
