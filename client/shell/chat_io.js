var state_list = {}
var state;
 
exports.change_state = function( new_state ) {
	state = new_state;
}

exports.register_state = function( name, handler ) {
	state_list[ name ] = handler;
} 

exports.run = function() {
	process.stdin.resume();
	process.stdin.setEncoding( 'utf8' );
	process.stdin.on( 'data', run_state );
	process.stdin.on( 'end', function() {} );
}

function run_state( input ) {
	var state_handler = state_list[ state ];
	if( state_handler == null ) return;

	state_handler( input );
}

exports.write = function( msg ) {
	process.stdout.write( msg );
}
