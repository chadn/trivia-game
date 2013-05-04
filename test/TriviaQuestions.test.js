var mocha = require('mocha'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should();


describe("TriviaQuestions", function() {
    var tq;
    var questions = [{
        question: 'What is 1 + 1?',
        choices: ['2', '11', 'blue', 'me and you']
    },{
        question: 'What is the first letter?',
        points: 5,
        choices: ['a', 'c', 'd', 'e']
    }];

    // copy answers for validating
    var qa = {
        q0: questions[0].question,
        q1: questions[1].question,
        a0: questions[0].choices[0],
        a1: questions[1].choices[0]
    };

    function validPoints(qo) {
        if (qo.question === qa.q0) {
            return qo.points === 10;
        } else if (qo.question === qa.q1) {
            return qo.points === 5;
        }
    }

    function validateQA (qo) {
        var data = {
            question: qo.question
        };
        if (qo.question === qa.q0) {
            data.answer = qa.a0;
        } else if (qo.question === qa.q1) {
            data.answer = qa.a1;
        }
        return data;
    }

    beforeEach(function(done) {
        tq = require('../lib/TriviaQuestions.js');
        tq.init(questions);
        done();
    });


    it("initializes", function(done) {
        expect( tq ).to.be.an('object');
        done();
    });

    it("has correct typeof for question and answer", function(done) {
        tq.getQuestionObj(true);
        tq.getQuestionObj(true);
        var qo = tq.getQuestionObj(true);

        expect( qo ).to.be.an('object');
        expect( qo.question ).to.be.a('string');
        expect( qo.choices ).to.be.an('array');
        expect( qo.choices.length ).to.be.equal(4);
        expect( qo.points ).to.be.a('number');

        expect( tq.getAnswer() ).to.be.a('string');

        done();
    });

    it("assigns default points", function(done) {
        var qo1 = tq.getQuestionObj(true);
        expect( validPoints(qo1) ).to.be.true;

        var qo2 = tq.getQuestionObj(true);
        expect( validPoints(qo2) ).to.be.true;
        
        done();
    });

    it("asks all questions before repeating", function(done) {
        var qo1 = tq.getQuestionObj(true);
        var qo2 = tq.getQuestionObj(true);

        expect( qo1.question ).to.not.be.equal( qo2.question );

        done();
    });

    it("correctly does getAnswer() and isCorrect()", function(done) {
        var qo = tq.getQuestionObj(true);
        var data = validateQA(qo);
        
        expect( tq.getAnswer() ).to.be.equal( data.answer );
        expect( tq.isCorrect(data) ).to.be.equal( true );

        done();
    });

});