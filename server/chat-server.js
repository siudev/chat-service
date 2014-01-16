#!/bin/env node

var server = require( "./server" );
var chat = require( "./room_chat_module" );

chat.on( server );

