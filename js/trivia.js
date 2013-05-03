$(document).ready(function(){
    var userName;
    var socket = io.connect();
    
    socket.on('users', function (data) {
      console.log('users updated, data:', data);
    });
    socket.on('users', function (data) {
      $('#question').html(data.msg);
    });
    
    $('#join button').on('click',function(){
        userName = $('#join input').val();
        socket.emit('userJoin', { 
            userName: userName
        });
        
        // update html 
        $('.userName').html(userName);
        $('#join').hide();
        $('#leave').show();
    });
    
    $('#leave button').on('click',function(){
        socket.emit('userLeave');
        // update html 
        $('#leave').hide();
        $('#join').show();
        
    });
    
});
