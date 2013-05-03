var mocha = require('mocha'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should();

var io = require('socket.io-client');

describe("user", function() {

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

    it("does first userJoin", function(done) {
        var userName = 'chadwick';
        client1 = io.connect("http://localhost:8080", options);

        client1.once("connect", function() {
            
            client1.once('users', function (data) {
                // client lives till disconnect, but we only want this test to run once,
                // so only call done the first time then set to null
                if (!done) return;
                
                expect(data.msg).to.contain(userName);
                expect(data.users.length).to.equal(1);
                
                if (done) done();
                done = null;
            });
            
            client1.emit('userJoin', { 
                userName: userName
            });
        });
    });

    it("does second userJoin", function(done) {
        var userName = 'norwood';
        client2 = io.connect("http://localhost:8080", options);

        client2.once("connect", function() {
            
            client2.once('users', function (data) {
                // client lives till disconnect, but we only want this test to run once,
                // so only call done the first time then set to null
                if (!done) return;

                expect(data.msg).to.contain(userName);
                expect(data.users.length).to.equal(2);
                
                if (done) done();
                done = null;
            });
            
            client2.emit('userJoin', { 
                userName: userName
            });
        });
    });

    it("does first userLeave, users count goes down by 1", function(done) {
        
        client2.once('users', function (data) {
            expect(data.users.length).to.equal(1);
            done();
        });
        
        client1.emit('userLeave');
    });

});