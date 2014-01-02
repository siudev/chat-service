chat-service
============

## Quick Start

 The quickest and perhaps the only way to use this is simple like below:

 Don't forget to install dependencies in each folder:

	$ (cd server && npm install)
    $ (cd client/shell && npm install)

 Start the server:

	$ nohup node server/chat-server.js >> server/output.log &

 Test with the shell client:

	$ node client/shell/test-client.js 
