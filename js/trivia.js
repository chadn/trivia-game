window.onload = function () {
  // Connect to socket.io
  var socket = io.connect();

  // React to a received message
  socket.on('ping', function (data) {

    // Modify the DOM to show the message
    document.getElementById("msg").innerHTML = data.msg;

    // Send a message back to the server
    socket.emit('pong', {
      msg: "The web browser also knows socket.io."
    });
  });
};
