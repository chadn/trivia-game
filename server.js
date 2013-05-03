#!/usr/bin/env node

var express = require('express'),
    app = express(),
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

app.use('/js/', express.static(__dirname + '/js'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var users = {};

//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    socket.on('userJoin', function (data) {
        console.log('SOCKET.IO user added: '+ data.userName + ' for socket '+ socket.id);
        users[socket.id] = data.userName;
        emitUserUpdate(socket);
    });

    socket.on('userLeave', function () {
        if (!users[socket.id]) return;
        console.log('SOCKET.IO user removed: '+ users[socket.id] + ' for socket '+ socket.id);
        delete users[socket.id];
        emitUserUpdate(socket);
    });

});


function emitUserUpdate(socket) {
    var userNames = [];
    for (var val in users){
        userNames.push(users[val]);
    }
    io.sockets.emit('users', { 
        users: userNames,
        msg: userNames.length + ' Active Users: '+ userNames.join(",\n") 
    });
}
