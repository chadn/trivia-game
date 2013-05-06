var mocha = require('mocha'),
    chai = require('chai'),
    players = require('../lib/Players.js'),
    expect = chai.expect,
    should = chai.should();


describe("Players", function() {

    it("initializes", function(done) {
        expect( players ).to.be.an('object');
        done();
    });

    it("addPlayer()", function(done) {
        players.addPlayer({
            socketId:1, 
            name:'chad1'
        });
        expect( players.getPlayerName(1) ).to.be.equal('chad1');
        done();
    });

    it("removePlayer()", function(done) {
        players.addPlayer({
            socketId:1, 
            name:'chad1'
        });
        expect( players.getPlayerName(1) ).to.be.equal('chad1');

        players.removePlayer(1);
        expect( players.getPlayerName(1) ).to.be.equal(undefined);
        
        done();
    });

    it("getPlayerCount()", function(done) {
        players.addPlayer({
            socketId:1, 
            name:'chad1'
        });
        expect( players.getPlayerName(1) ).to.be.equal('chad1');

        players.removePlayer(1);
        expect( players.getPlayerName(1) ).to.be.equal(undefined);
        
        done();
    });


});


/*

Players.prototype.getPlayerPoints = function(socketId) {
    return this.points[socketId];
}
Players.prototype.addPlayerPoints = function(socketId, points) {
    this.points[socketId] += points;
    return this.points[socketId];
}

Players.prototype.getPlayerCount = function() {
    return this.playerCount;
}

Players.prototype.getPlayerData = function() {
    var playerData = { 
        players: []
    };
    for (var socketId in this.players){
        playerData.players.push({
            points: this.points[socketId],
            name: this.players[socketId]
        });
    }
    playerData.players.sort(function(a,b) {
        return b.points - a.points || a.name > b.name;
    });
    return this.playerData = playerData;
}


Players.prototype.normalizePlayerName = function(name) {
*/