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

    it("addPlayer() and getPlayerName()", function(done) {
        players.addPlayer({
            playerId: 'id', 
            name:'chad1'
        });
        expect( players.getPlayerName('id') ).to.be.equal('chad1');
        expect( players.getPlayerName('not exist') ).to.be.equal('');
        done();
    });


    it("removePlayer()", function(done) {
        players.addPlayer({
            playerId: 'id', 
            name:'chad1'
        });
        expect( players.getPlayerName('id') ).to.be.equal('chad1');

        players.removePlayer('id');
        expect( players.getPlayerName('id') ).to.be.equal('');
        
        done();
    });

    it("handles points: addPlayerPoints() and getPlayerPoints()", function(done) {
        players.addPlayer({
            playerId:'id', 
            name:'chad1'
        });
        expect( players.getPlayerPoints('id') ).to.be.equal(0);

        players.addPlayerPoints('id', 5);
        expect( players.getPlayerPoints('id') ).to.be.equal(5);

        players.addPlayerPoints('id', 20);
        expect( players.getPlayerPoints('id') ).to.be.equal(25);
        
        done();
    });

    it("getPlayerCount()", function(done) {
        var count = players.getPlayerCount();
        expect( count ).to.be.a('Number');
        
        players.addPlayer({
            playerId: 'id', 
            name:'chad1'
        });
        expect( players.getPlayerCount() ).to.be.equal( count + 1 );

        done();
    });

    it("resets on init", function(done) {
        players.addPlayer({
            playerId: 'id', 
            name:'chad1'
        });
        expect( players.getPlayerCount() ).to.be.at.least(1);

        players.init();
        expect( players.getPlayerCount() ).to.be.equal(0);
        
        done();
    });

    it("getPlayerData()", function(done) {
        players.init();
        players.addPlayer({
            playerId: 'id', 
            name:'chad1'
        });
        players.addPlayerPoints('id', 5);
        players.addPlayerPoints('id', 20);
        
        var pd = players.getPlayerData('id');

        expect( pd ).to.be.an('object');
        expect( pd.players[0].name ).to.be.equal( 'chad1' );
        expect( pd.players[0].points ).to.be.equal( 25 );

        done();
    });


    it("should normalize name, normalizePlayerName() via addPlayer()", function(done) {

        var names = [{
            // assigns default name based on playerCount
            name: ' ',
            normalized: 'Player_1'
        },{
            // preserves case
            name: 'chadRocks',
            normalized: 'chadRocks'
        },{
            // removes non-alpha
            name: 'hi <script bad="stuff?">',
            normalized: 'hi_script_badstuff'
        },{
            // removes more non-alpha, max string length
            name: '%3Cscript+more+bad%3D%22stuff&$$$$',
            normalized: '3Cscriptmorebad3D22st_'
        },{
            // MAX_NAME_LENGTH.  Note ends with _ if it was too long
            name: '1234567890123456789012345',
            normalized: '123456789012345678901_' // 22 
        },{
            // trims 
            name: ' chad   is  **NICE** ',
            normalized: 'chad_is_NICE'
        }]
        
        players.init();

        for (var ii=0; ii<names.length; ii++) {
            players.addPlayer({
                playerId: ii, 
                name: names[ii].name
            });
            expect( players.getPlayerName(ii) ).to.be.equal( names[ii].normalized );
        }

        done();
    });


    it("updates times: lastActive() and ", function(done) {
        players.init();
        var startMs = new Date().getTime();
        var p = players.addPlayer({
            playerId: 'id', 
            name:'chad1'
        });
        expect( p.lastWinTime ).to.be.equal( 0 );
        expect( p.createdTime ).to.be.at.least( startMs );
        expect( p.lastActiveTime ).to.be.at.least( startMs );

        players.addPlayerPoints('id', 5);
        expect( p.lastWinTime ).to.be.at.least( startMs );
        
        setTimeout(function(){
            var nowMs = new Date().getTime();
            
            players.lastActive('id');
            var p = players.getPlayer('id');
            
            expect( p.lastActiveTime ).to.be.at.least( nowMs );
            expect( p.lastActiveTime ).to.be.at.above( p.lastWinTime );

            done();
        }, 10)
    });

});

