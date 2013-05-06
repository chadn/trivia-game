var MAX_NAME_LENGTH = 21;

function Players() {
    if ( !(this instanceof Players) ) {
        return new Players();
    }
    this.init();
}

Players.prototype.init = function() {
    this.players = {};
    this.points = {};
    this.playerCount = 0; // count of total players joined, not active players
    this.activePlayerCount = 0; // count of players currently connected
    this.winningSocket = null;
}



Players.prototype.addPlayer = function(player) {
    this.players[player.socketId] = this.normalizePlayerName(player.name);
    this.points[player.socketId] = 0;
    this.playerCount++;
}


Players.prototype.removePlayer = function(socketId) {
    delete this.players[socketId];
}


Players.prototype.getPlayerName = function(socketId) {
    return this.players[socketId];
}
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
    //name = 'Chad 42 "rocks"  the house';
    name = name || '';
    name = name.replace(/\s+/g,'_');
    name = name.replace(/\W/g,'');
    if (name.length > MAX_NAME_LENGTH) {
        name = name.substring(0,MAX_NAME_LENGTH-2) + '_';
    }
    return name ? name : 'Player' + this.playerCount;
}


module.exports = Players();