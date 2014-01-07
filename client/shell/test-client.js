#!/bin/env node

var socket = require( "./chat_socket" );
var client = require( "./room_client" );

client.create( socket );
client.run();
