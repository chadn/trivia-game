$(document).ready(function(){
    var socket;
    
    function joinTrivia(userName) {
        socket = io.connect();
        console.log('io.connect socket:', socket);
        
        socket.on('users', function (data) {
            console.log('users updated, data:', data);
            $('.userMsg').html(data.msg);
            updateUserStatus(data.users);
        });

        socket.on('question', function (data) {
            console.log('received question: ', data);
            if ($('#leave').css('display') == 'none') {
                return;
            }
            updateQuestionHtml(data);
        });
        socket.emit('userJoin', { 
            userName: userName
        });
    }
    function leaveTrivia() {
        window.location = self.location;
        location.reload( true ); 
    }
    
    function updateUserStatus(users) {
        console.log('updateUserStatus', users);
        var html = users.map(function(u){
            return '<li>'+ u.name + ' points: '+ u.points +'</li>';
        }).join('');
        $('#status').html(users.length + " Active User"
            + (users.length == 1 ? '' : 's')
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
        var userName = $('#join input').val();
        $('.userName').html(userName);
        $('#join').hide();
        $('#leave').show();
        joinTrivia(userName);
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
