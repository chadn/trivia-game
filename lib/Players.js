var MAX_NAME_LENGTH = 22;

/*
 * Keeps track of players, including names, points, etc.
 *
 * @return {Object} players object
 */
function Players() {
    if ( !(this instanceof Players) ) {
        return new Players();
    }
    this.init();
}


/*
 * Initializes players, can be called anytime to reset all player info.
 */
Players.prototype.init = function() {
    this.players = {};
    this.points = {};
    this.playerCount = 0; // count of total players joined, not active players
    this.activePlayerCount = 0; // count of players currently connected
    this.winningSocket = null;
}


/*
 * Adds a player. Only name and id required
 *
 * @param {Object} player data, must contain 'name' and 'playerId'. 
 *        if playerId is a duplicate of existing player, old player name is replaced.
 */
Players.prototype.addPlayer = function(player) {
    this.playerCount++;
    this.players[player.playerId] = this.normalizePlayerName(player.name) || 'Player_' + this.playerCount;
    this.points[player.playerId] = 0;
}


/*
 * Removes player. 
 *
 * @param {String|Number} playerId is unique id of player
 */
Players.prototype.removePlayer = function(playerId) {
    delete this.players[playerId];
}


/*
 * Gets player name
 *
 * @param {String|Number} playerId is unique id of player
 * @return {String} name of player
 */
Players.prototype.getPlayerName = function(playerId) {
    return this.players[playerId];
}


/*
 * Gets points of player
 *
 * @param {String|Number} playerId is unique id of player
 * @return {Number} points of player
 */
Players.prototype.getPlayerPoints = function(playerId) {
    return this.points[playerId];
}


/*
 * Adds points to a player
 *
 * @param {String|Number} playerId is unique id of player
 * @param {Number} points to add
 * @return {Number} points of player after adding
 */
Players.prototype.addPlayerPoints = function(playerId, points) {
    this.points[playerId] += points;
    return this.points[playerId];
}


/*
 * Returns total number of players added.
 *
 * @return {Number} total number of players added
 */
Players.prototype.getPlayerCount = function() {
    return this.playerCount;
}


/*
 * Used to validate players answer
 
 *
 * @param {Object} data must contain question string and answer string
 * @return {Boolean} true if data matches last question
 */
Players.prototype.getPlayerData = function() {
    var playerData = { 
        players: []
    };
    for (var playerId in this.players){
        playerData.players.push({
            points: this.points[playerId],
            name: this.players[playerId]
        });
    }
    playerData.players.sort(function(a,b) {
        return b.points - a.points || a.name > b.name;
    });
    return this.playerData = playerData;
}


/*
 * Used to normalize players name. Only alphanumeric and _ are allowed,
 * and strings are limited to MAX_NAME_LENGTH
 *
 * @param {String} name to normalize
 * @return {Boolean} true if data matches last question
 */
Players.prototype.normalizePlayerName = function(name) {
    //name = 'Chad 42 "rocks"  the house';
    name = name || '';
    name = name.trim().replace(/\s+/g,'_');
    name = name.replace(/\W/g,'');
    if (name.length > MAX_NAME_LENGTH) {
        name = name.substring(0,MAX_NAME_LENGTH-1) + '_';
    }
    return name;
}


module.exports = Players();