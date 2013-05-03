var mocha = require('mocha'),
    chai = require('chai'),
    should = chai.should();

var io = require('socket.io-client');

describe("echo", function() {

    var server, options = {
        transports: ['websocket'],
        'force new connection': true
    };

    beforeEach(function(done) {
        // start the server
        server = require('../server').server;

        done();
    });

    it("echos message", function(done) {
        var client = io.connect("http://localhost:8080", options);

        client.once("connect", function() {
            client.once("echo", function(message) {
                message.should.equal("Hello World");

                client.disconnect();
                done();
            });

            client.emit("echo", "Hello World");
        });
    });

});