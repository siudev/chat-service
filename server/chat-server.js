var express = require('express');
var app = express();

app.configure(function() {
	app.use(express.bodyParser());
});

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

/*
app.get("/crossdomain.xml", onCrossDomainHandler)
function onCrossDomainHandler(req, res) {
	var xml = '<?xml version="1.0"?>\n';
	xml += '<!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">\n';
	xml += '<cross-domain-policy>\n';
	xml += '<allow-http-request-headers-from domain="*" headers="*" />\n';
	xml += '<allow-access-from domain="*" />\n';
	xml += '</cross-domain-policy>\n';

	req.setEncoding('utf8');
	res.writeHead(200, {'Content-Type': 'text/xml'});
	res.end(xml);
}
*/
app.get('/login', function(req, res) {
	var uid = Math.floor(Math.random() * 10) + parseInt(new Date().getTime()).toString(36).toUpperCase();
	console.log(uid);
	res.send(uid);
});

app.get('/chat', function(req, res) {
	var message = req.query.message;
	console.log('received message: ' + message);
});

app.listen(5015);
console.log("chat server is listening...");
