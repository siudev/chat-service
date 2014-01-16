
var chatCommandArray;

function init()
{
	chatCommandArray = new Array();
	addCommand( "/", [ "?", "help"], "----------------------", showHelp  );
}

function commandData(separator, commandArray, description, handler )
{
	this.separator = separator;
	this.commandArray = commandArray;
	this.handler = handler;
	this.description = description;
}

exports.addCommand = addCommand;
function addCommand(separator, commandArray, description , handler )
{
	chatCommandArray.push( new commandData( separator, commandArray, description, handler ));
}


exports.isCommand = function( text)
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
					command.handler.apply( this, [v] );

					return true;
				}
			}
		}
		
	}

	return false;

}


function showHelp(data)
{
	var c = null;
	for( var i = 0; i < chatCommandArray.length; i++){
		c = chatCommandArray[i];
		var command = '';
		for( var j = 0; j < c.commandArray.length; j++ ){
			command = command+c.separator+c.commandArray[j]+",";
		}
		command = command.substr(0,command.length-1);
		console.log( "- command : "+command+"  ,  "+c.description);

	}
}



init();

