$(document).ready(function(){
    var socket;
    
    function joinTrivia(playerName) {
        socket = io.connect();
        console.log('io.connect socket:', socket);
        
        socket.on('players', function (data) {
            console.log('players updated, data:', data);
            $('.playerMsg').html(data.msg);
            updatePlayerStatus(data.players);
        });

        socket.on('question', function (data) {
            console.log('received question: ', data);
            if ($('#leave').css('display') == 'none') {
                return;
            }
            updateQuestionHtml(data);
        });
        socket.emit('playerJoin', { 
            playerName: playerName
        });
    }
    function leaveTrivia() {
        window.location = self.location;
        location.reload( true ); 
    }
    
    function updatePlayerStatus(players) {
        console.log('updatePlayerStatus', players);
        var html = players.map(function(u){
            return '<li>'+ u.name + ' points: '+ u.points +'</li>';
        }).join('');
        $('#status').html(players.length + " Active Player"
            + (players.length == 1 ? '' : 's')
            + "<ol>"+ html + "</ol>");
    }
    
    function updateQuestionHtml(data) {
        var choicesHtml = '';
        if (data.choices) {
            for (var ii=0; ii < data.choices.length; ii++) {
                choicesHtml += '<li>' + data.choices[ii] + '</li>';
            }
        }
        var answerHtml = '';
        if ('winner' in data) {
            answerHtml += 'Correct Answer: ' + data.correctAnswer;
            if (data.winner) {
                answerHtml += '<br>YOU WON!! You were first to answer correctly.';
            } else {
                if (data.correctAnswer == $('#choices .selected').html()){
                    answerHtml += '<br>Sorry. You were not the first to answer.';
                } else {
                    answerHtml += '<br>Sorry. You didn\'t guess correctly.';
                }
                if (data.winnerName) {
                    answerHtml += '<br>Winner was ' + data.winnerName;
                } else {
                    answerHtml += '<br>Nobody won that one.';
                }
            }
        } else {
            $('#choices').html(choicesHtml);
        }
        $('#answer').html(answerHtml);
        $('#question').html(data.question || '');
    }
    
    $('#join button').on('click', function() {
        var playerName = $('#join input').val();
        $('.playerName').html(playerName);
        $('#join').hide();
        $('#leave').show();
        joinTrivia(playerName);
    });
    
    $('#leave button').on('click',function(){
        $('#leave').hide();
        $('#join').show();
        //$('#status').html('');
        updateQuestionHtml({});
        leaveTrivia();
    });
    $('#choices').on('click', 'li', function(){
        $(this).addClass('selected');
        console.log('clicked: ', $(this).html(), this);
        socket.emit('answer', { 
            answer: $(this).html(),
            question: $('#question').html()
        });
    });  
    
});
