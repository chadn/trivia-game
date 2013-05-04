#!/usr/bin/env node

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    tq = require('./lib/TriviaQuestions.js'),
    MAX_NAME_LENGTH = 21;
    PORT = 8080,
    url  = 'http://localhost:' + PORT + '/';

if (process.env.SUBDOMAIN) {
    url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

server.listen(PORT);
console.log("Express server listening on port " + PORT);
console.log(url);
for (var nn=0; nn<100;nn++){
    console.log(tq.getQuestion(true));    
}

app.use('/js/', express.static(__dirname + '/js'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var users = {};
var points = {};
var userCount = 0; // count of total users joined, not active users
var winningSocket;

var nextQuestionDelayMs = 3000; // how long are users 'warned' next question is coming
var timeToAnswerMs = 7000; // how long users have to answer question
var timeToEnjoyAnswerMs = 5000; // how long users have to read answer


//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    socket.on('userJoin', function (data) {
        console.log('SOCKET.IO user added: '+ data.userName + ' for socket '+ socket.id);
        userCount++;
        users[socket.id] = normalizeUsername(data.userName);
        points[socket.id] = 0;
        emitUserUpdate(socket);
        if (userCount == 1) {
            // start game!
            emitNewQuestion();
        }
    });
    socket.on('disconnect', function() { 
        console.log('SOCKET.IO user disconnect: '+ users[socket.id] + ' for socket '+ socket.id);
        if (!users[socket.id]) {
            // already disconnected
            return;
        }
        delete users[socket.id];
        emitUserUpdate();
    });

    socket.on('answer', function (data) { 
        console.log('SOCKET.IO user answered: "'+ data.answer + '" for question: '+ data.question);
        // TODO: handle case where user might have already answered (damn hackers)
        if (tq.isCorrect(data) && !winningSocket) {
            console.log('SOCKET.IO user correct ! =========> : "'+ data.answer + '", '+ users[socket.id] + ' for socket '+ socket.id);
            winningSocket = socket;
        }
    });

});

function emitNewQuestion() {
    winningSocket = null;

    io.sockets.emit('question', {
        endTime: new Date().getTime() + nextQuestionDelayMs,
        question:'Next Question ...'
    });

    setTimeout(function(){
        var q = tq.getQuestion(true);
        q.endTime = new Date().getTime() + timeToAnswerMs;
        
        io.sockets.emit('question', q);
        
        setTimeout(function(){
            emitAnswer();
        }, timeToAnswerMs);

    }, nextQuestionDelayMs);
    
}
function emitAnswer() {
    
    var answerData = tq.getQuestion();
    delete answerData.choices;
    answerData.correctAnswer = tq.getAnswer();
    answerData.endTime = new Date().getTime() + timeToEnjoyAnswerMs;
    answerData.winner = false;
    
    if (winningSocket) {
        answerData.winnerName = users[winningSocket.id];
        points[winningSocket.id] += answerData.points;
        emitUserUpdate();
        
        winningSocket.broadcast.emit('question', answerData); // emit to all but winner 

        answerData.winner = true;
        winningSocket.emit('question', answerData); // emit only to winner
        
    } else {
        io.sockets.emit('question', answerData); // emit to everyone (no winner)
    }
    
    setTimeout(function(){
        emitNewQuestion();
    }, timeToEnjoyAnswerMs);
}

function emitUserUpdate(socket) {
    var userData = { 
        users: [],
    };
    for (var val in users){
        userData.users.push({
            points: points[val],
            name: users[val]
        });
    }
    userData.users.sort(function(a,b) {
        return b.points - a.points || a.name > b.name;
    });
    
    if (socket) {
        socket.broadcast.emit('users', userData); // emit to all but socket 

        userData.msg = 'Welcome, '+ users[socket.id];
        socket.emit('users', userData); // emit only to socket
        
    } else {
        io.sockets.emit('users', userData); // emit to everyone (points update)
    }
}
function normalizeUsername(name) {
    //name = 'Chad 42 "rocks"  the house';
    name = name || '';
    name = name.replace(/\s+/g,'_');
    name = name.replace(/\W/g,'');
    if (name.length > MAX_NAME_LENGTH) {
        name = name.substring(0,MAX_NAME_LENGTH-2) + '_';
    }
    return name ? name : 'Player' + userCount;
}

