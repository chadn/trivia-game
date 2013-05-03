#!/usr/bin/env node

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = 8080,
    url  = 'http://localhost:' + port + '/';

if(process.env.SUBDOMAIN){
    url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

server.listen(port);
console.log("Express server listening on port " + port);
console.log(url);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    // Emit a message to send it to the client.
    socket.emit('ping', { msg: 'Waddup, Server sees you know socket.io.' });

    // Print messages from the client.
    socket.on('pong', function (data) {
        console.log('SOCKET.IO: '+ data.msg);
    });

});