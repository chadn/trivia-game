#!/usr/bin/env node

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    mathQuestions = require('./data/mathQuestions'),
    tq = require('./lib/TriviaQuestions.js'),
    players = require('./lib/Players.js'),
    CMDKEY = process.env.CMDKEY || '',
    PORT = process.env.PORT || 8080,
    url  = 'http://localhost:' + PORT + '/';

if (process.env.SUBDOMAIN) {
    url = 'http://' + process.env.SUBDOMAIN + '.jit.su/';
}

server.listen(PORT);
console.log("Express server listening on port " + PORT);
console.log(url);

tq.init(mathQuestions);
players.init();

app.use('/css/', express.static(__dirname + '/css'));
app.use('/js/', express.static(__dirname + '/js'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.set('log level', 2); // 1 == warn, 2 == info, 3 == debug

var nextQuestionDelayMs = 5000; //5secs // how long are players 'warned' next question is coming
var timeToAnswerMs = 10000; // 10secs // how long players have to answer question 
var timeToEnjoyAnswerMs = 5000; //5secs // how long players have to read answer
var running = false;
emitNewQuestion();
console.log('Game paused, to start, join as "' + CMDKEY +'resume"');


//Socket.io emits this event when a connection is made.
io.sockets.on('connection', function (socket) {

    socket.on('playerJoin', function (data) {
        var ip = socket.handshake.address.address;
        
        // handle special admin cmds
        if (CMDKEY && handleCmd(data.playerName, ip)) {
            socket.emit('players', {msg:'CMD SUCCESS'}); // emit only to socket
            data.playerName = 'HIDDEN';
        }
        var p = players.addPlayer({
            playerId: socket.id,
            clientIp: ip,
            name: data.playerName
        });
        console.log('SOCKET.IO player added: '+ p.name + ' from '+ ip + ' for socket '+ socket.id);
        emitPlayerUpdate(socket);
    });

    socket.on('disconnect', function() {
        var pname = players.getPlayerName(socket.id);
        console.log('SOCKET.IO player disconnect: '+ pname + ' for socket '+ socket.id);
        if (!pname) {
            // already disconnected
            return;
        }
        players.removePlayer(socket.id);
        emitPlayerUpdate();
    });

    socket.on('answer', function (data) { 
        players.lastActive(socket.id);
        var msg = 'SOCKET.IO answer ';
        
        if (data.playerName === 'HIDDEN') {
            msg += 'HIDDEN ';
        
        } else if (tq.isCorrect(data) && !players.winningSocket) {
            msg = 'winner!!!!';
            players.winningSocket = socket;
        
        } else {
            msg = 'not winner';
            // TODO: handle case where player might have already answered (damn hackers)    
        }
        console.log(msg + ' "'+ data.answer + '" by '+ players.getPlayerName(socket.id) + ' socket '+ socket.id);
    });

});

/*
 * Handles special cmds.
 *
 * @param {String} playerName
 * @return {Boolean} true if playerName was a valid cmd, false if it is not
 */
function handleCmd(playerName, ip) {
    if (!(CMDKEY && playerName.substr(0,CMDKEY.length) == CMDKEY)) {
        return false;
    }
    var cmd = playerName.substr(CMDKEY.length);
    
    if (cmd.match(/^p/i)) {
        running = false; // pause
        console.log('SOCKET.IO handleCmd('+ cmd +', '+ ip +') pausing..');
        return true;

    } else if (cmd.match(/^r/i)) {
        running = true; // resume
        console.log('SOCKET.IO handleCmd('+ cmd +', '+ ip +') resuming..');
        return true;
        
    } else {
        return false;
    }
    
}
function emitNewQuestion() {
    if (!running) {
        setTimeout(function(){
            emitNewQuestion();
        }, 1000);
        return;
    }
    players.winningSocket = null;

    io.sockets.emit('question', {
        totalTime: nextQuestionDelayMs,
        endTime: new Date().getTime() + nextQuestionDelayMs,
        choices: [],
        question:'Next Question ...'
    });

    setTimeout(function(){
        var q = tq.generateQuestionObj();
        q.endTime = new Date().getTime() + timeToAnswerMs;
        q.totalTime = timeToAnswerMs;
        
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
    answerData.totalTime = timeToEnjoyAnswerMs;
    answerData.winner = false;
    
    if (players.winningSocket) {
        answerData.winnerName = players.getPlayerName(players.winningSocket.id);
        players.addPlayerPoints(players.winningSocket.id, answerData.points);
        
        emitPlayerUpdate(); // send update because points changed
        
        players.winningSocket.broadcast.emit('question', answerData); // emit to all but winner 

        answerData.winner = true;
        players.winningSocket.emit('question', answerData); // emit only to winner
        
    } else {
        io.sockets.emit('question', answerData); // emit to everyone (no winner)
    }
    
    setTimeout(function(){
        emitNewQuestion();
    }, timeToEnjoyAnswerMs);
}

function emitPlayerUpdate(socket) {
    var playerData = players.getPlayerData();
    if (socket) {
        socket.broadcast.emit('players', playerData); // emit to all but socket 

        playerData.msg = 'Welcome, '+ players.getPlayerName(socket.id);
        socket.emit('players', playerData); // emit only to socket
        
    } else {
        io.sockets.emit('players', playerData); // emit to everyone (points update)
    }
}

