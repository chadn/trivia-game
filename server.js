#!/usr/bin/env node

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mathQuestions = require('./data/mathQuestions'),
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

tq.init(mathQuestions);

app.use('/js/', express.static(__dirname + '/js'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var players = {};
var points = {};
var playerCount = 0; // count of total players joined, not active players
var winningSocket;

var nextQuestionDelayMs = 3000; // how long are players 'warned' next question is coming
var timeToAnswerMs = 7000; // how long players have to answer question
var timeToEnjoyAnswerMs = 5000; // how long players have to read answer


//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    socket.on('playerJoin', function (data) {
        console.log('SOCKET.IO player added: '+ data.playerName + ' for socket '+ socket.id);
        playerCount++;
        players[socket.id] = normalizePlayername(data.playerName);
        points[socket.id] = 0;
        emitPlayerUpdate(socket);
        if (playerCount == 1) {
            // start game!
            emitNewQuestion();
        }
    });
    socket.on('disconnect', function() { 
        console.log('SOCKET.IO player disconnect: '+ players[socket.id] + ' for socket '+ socket.id);
        if (!players[socket.id]) {
            // already disconnected
            return;
        }
        delete players[socket.id];
        emitPlayerUpdate();
    });

    socket.on('answer', function (data) { 
        console.log('SOCKET.IO player answered: "'+ data.answer + '" for question: '+ data.question);
        // TODO: handle case where player might have already answered (damn hackers)
        if (tq.isCorrect(data) && !winningSocket) {
            console.log('SOCKET.IO player correct ! =========> : "'+ data.answer + '", '+ players[socket.id] + ' for socket '+ socket.id);
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
        var q = tq.getQuestionObj(true);
        q.endTime = new Date().getTime() + timeToAnswerMs;
        
        io.sockets.emit('question', q);
        
        setTimeout(function(){
            emitAnswer();
        }, timeToAnswerMs);

    }, nextQuestionDelayMs);
    
}
function emitAnswer() {
    
    var answerData = tq.getQuestionObj();
    delete answerData.choices;
    answerData.correctAnswer = tq.getAnswer();
    answerData.endTime = new Date().getTime() + timeToEnjoyAnswerMs;
    answerData.winner = false;
    
    if (winningSocket) {
        answerData.winnerName = players[winningSocket.id];
        points[winningSocket.id] += answerData.points;
        emitPlayerUpdate();
        
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

function emitPlayerUpdate(socket) {
    var playerData = { 
        players: []
    };
    for (var val in players){
        playerData.players.push({
            points: points[val],
            name: players[val]
        });
    }
    playerData.players.sort(function(a,b) {
        return b.points - a.points || a.name > b.name;
    });
    
    if (socket) {
        socket.broadcast.emit('players', playerData); // emit to all but socket 

        playerData.msg = 'Welcome, '+ players[socket.id];
        socket.emit('players', playerData); // emit only to socket
        
    } else {
        io.sockets.emit('players', playerData); // emit to everyone (points update)
    }
}
function normalizePlayername(name) {
    //name = 'Chad 42 "rocks"  the house';
    name = name || '';
    name = name.replace(/\s+/g,'_');
    name = name.replace(/\W/g,'');
    if (name.length > MAX_NAME_LENGTH) {
        name = name.substring(0,MAX_NAME_LENGTH-2) + '_';
    }
    return name ? name : 'Player' + playerCount;
}

