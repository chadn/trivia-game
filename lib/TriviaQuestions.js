/* 
 * TriviaQuestions.js 
 * 
 * Stores and gets new questions at random
 */

function TriviaQuestions() {
    if ( !(this instanceof TriviaQuestions) ) {
        return new TriviaQuestions();
    }
    this.init();
}


TriviaQuestions.prototype.init = function() {
    
    // WHEN CREATING QUESTIONS AND ANSWERS ...
    // The correct answer must be the first choice (keep it simple).
    // Choices will be presented in random order.
    // points is optional, defaults to 10 if not specified.
    this.questions = [{
        points: 10,
        question: "Which number is NOT a prime number?",
        choices: [
            '141',
            '37',
            '613',
            '23'
        ]
    },{
        points: 10,
        question: "When was Pythagoras alive?",
        choices: [
            '500 BC',
            '800 BC',
            '400 BC',
            '200 BC'
        ]
    },{
        points: 20,
        question: "What is the smallest number into which 8, 18, and 28 all divide?",
        choices: [
            '504',
            '252',
            '28',
            '2'
        ]
    },{
        points: 20,
        question: "Katie's car used 19.5 gallons of gasoline on a 318 mile trip. How many miles per gallon (mpg) did the car get?",
        choices: [
            '16.3 mpg',
            '17.5 mpg',
            '15.5 mpg',
            '14.3 mpg'
        ]
    }];
    
}

/*
 * Returns a question at random from question list, similar to pulling a card randomly from deck of cards.
 * Like a deck of cards, once all questions are returned, original questions are shuffled and reused.
 * @param {Boolean} newQuestion fetches a new question if true, else returns last question again
 * @return {Object} question object
 */
TriviaQuestions.prototype.getQuestion = function(newQuestion) {
    if (!newQuestion) {
        return this.q || {comment:'no newQuestion yet'};
    }
    if (this.questions.length == 0) {
        this.init();
    }
    var index = Math.floor(Math.random() * this.questions.length);
    
    // remove question from the list so it won't be asked again
    // until all questions have been used up.
    this.q = this.questions.splice(index, 1)[0];
    
    // set answer 
    this.answer = this.q.choices[0];

    // set default points
    this.points = this.points || 10;
    
    // randomize choices - not using array.sort cuz its not really random
    this.q.choices = randomizeArray(this.q.choices);
    
    return this.q;
}

TriviaQuestions.prototype.getAnswer = function() {
    return this.answer;
}
TriviaQuestions.prototype.isCorrect = function(data) {
    console.log('isCorrect?', data.answer, data.question, this.q, data.answer == this.answer, data.question == this.q);
    return this.answer && data.answer == this.answer && data.question == this.q.question;
}

function randomizeArray(arr) {
    var n = arr.length;
    var tmpArr = [];
    var indx;
    for (var ii = 0; ii < n-1; ii++) {
        indx = Math.floor(Math.random() * arr.length);
        tmpArr.push(arr.splice(indx,1)[0]);
    }
    // Push the remaining item onto tempArr
    tmpArr.push(arr[0]);
    return tmpArr;
}

module.exports = TriviaQuestions();