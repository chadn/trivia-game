var mocha = require('mocha'),
    chai = require('chai'),
    PORT = process.env.PORT || 8080,
    url  = 'http://localhost:' + PORT + '/',
    expect = chai.expect,
    should = chai.should();

var io = require('socket.io-client');

describe("belly-challeng socket.io interaction with players", function() {

    var server, client1, client2;
    var options = {
        transports: ['websocket'],
        'force new connection': true
    };

    before(function(done) {
        // start the server
        server = require('../server').server;
        done();
    });

    after(function(done) {
        client1.disconnect();
        client2.disconnect();
        done();
    });

    it("does first playerJoin", function(done) {
        var playerName = 'chadwick';
        client1 = io.connect(url, options);

        client1.once("connect", function() {
            
            client1.once('players', function (data) {
                // client lives till disconnect, but we only want this test to run once,
                // so only call done the first time then set to null
                if (!done) return;
                
                expect(data.msg).to.contain(playerName);
                expect(data.players.length).to.equal(1);
                
                if (done) done();
                done = null;
            });
            
            client1.emit('playerJoin', { 
                playerName: playerName
            });
        });
    });

    it("does second playerJoin", function(done) {
        var playerName = 'norwood';
        client2 = io.connect(url, options);

        client2.once("connect", function() {
            
            client2.once('players', function (data) {
                // client lives till disconnect, but we only want this test to run once,
                // so only call done the first time then set to null
                if (!done) return;

                expect(data.msg).to.contain(playerName);
                expect(data.players.length).to.equal(2);
                
                if (done) done();
                done = null;
            });
            
            client2.emit('playerJoin', { 
                playerName: playerName
            });
        });
    });

    it("does a disconnect, players count goes down by 1", function(done) {
        
        client2.once('players', function (data) {
            expect(data.players.length).to.equal(1);
            done();
        });
        
        client1.disconnect();
    });

});