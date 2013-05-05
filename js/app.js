/*global Backbone */
var app = app || {};

$(function(){

    app.QuestionModel = Backbone.Model.extend({});

    app.question = new app.QuestionModel();


    // AppView is top-level piece of UI
    app.AppView = Backbone.View.extend({
    
        // bind to existing html
        el: $('#container'),
    
        events:{
            "click #leave": "leaveBtnClick",
            "keypress #join input"  : "joinOnEnter",
            "click #join button": "joinBtnClick"
        },

        initialize: function() {
            this.$input = this.$('#join input');
            this.$players = this.$('#players ol');
            this.questionView = new app.QuestionView();
        },
    
        render: function() {
            // nothing changes on re-rendering
        },

        renderPlayers: function(players) {
            var that = this;
            this.$players.html('');
            _.each(players, function(player) { 
                var view = new app.PlayerView({ model: player });
                that.$players.append(view.render().el);
            });
        },

        renderQuestionAnswers: function(data) {
            if (data.choices) {
                // don't re-render questions unless data contains choices
                app.question.set(data);
            }
            if (app.question.get('question')) {
                // handle initial case where player joins and receives answers before a question
                new app.AnswerView({ model: data });
            }
        },

        leaveBtnClick: function() {
            // close socket connection by reloading tab
            window.location = self.location;
            location.reload( true ); 
        },

        joinOnEnter: function(e) {
            if (e.keyCode == 13) this.joinBtnClick();
        },

        joinBtnClick: function() {
            console.log('joinBtnClick:', this);
            var that = this;
            var playerName = this.$input.val();
            $('#join').hide();
            $('#leave').show();

            this.socket = app.socket = io.connect();
            console.log('io.connect socket:', this.socket);

            this.socket.on('players', function (data) {
                console.log('players updated, data:', data);
                $('.playerMsg').html(data.msg);
                that.renderPlayers(data.players);
            });

            this.socket.on('question', function (data) {
                console.log('received question, data: ', data);
                that.renderQuestionAnswers(data);
            });

            this.socket.emit('playerJoin', { 
                playerName: playerName
            });
        }

    });


    app.PlayerView = Backbone.View.extend({
    
        tagName: 'li',
    
        // Cache the template function for a single player.
        template: _.template($('#playerTemplate').html()),

        render: function() {
            console.log('app.PlayerView render', this.model);
            this.$el.html(this.template(this.model));
            return this;
        }
    });


    app.QuestionView = Backbone.View.extend({

        model: app.question,

        el: $('#questionContainer'),

        template: _.template($('#questionTemplate').html()),

        events:{
            "click li": "answerClick"
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function() {
            console.log('---- app.QuestionView render', this.model.toJSON() );
            this.$el.html(this.template( this.model.toJSON() ));
        },

        answerClick: function(evt) {
            var $el = this.$el.find(evt.target);
            console.log('--- answerClick: chose:', $el.html() );

            if (this.$el.find('.myChoice').length > 0) {
                console.log('answerClick: already chose:', this.$el.find('.myChoice').html() );
                return;
            }

            $el.addClass('myChoice');
            app.socket.emit('answer', { 
                answer: $el.html(),
                question: this.model.get('question')
            });
        }
    });


    app.AnswerView = Backbone.View.extend({

        el: $('#answerContainer'),

        template: _.template($('#answerTemplate').html()),

        initialize: function() {
            this.model.myChoice = $('#questionContainer .myChoice').html() || '';
            this.render();
        },

        render: function() {
            console.log('app.AnswerView render', this.model);
            this.$el.html(this.template(this.model));
        }
    });


    var App = new app.AppView;
});
