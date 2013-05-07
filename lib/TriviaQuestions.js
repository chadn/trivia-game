/* 
 * TriviaQuestions.js 
 * 
 * Stores and gets new questions at random
 */

function TriviaQuestions() {
    if ( !(this instanceof TriviaQuestions) ) {
        return new TriviaQuestions();
    }
    this.init([{
        question: 'What is 1 + 1?',
        choices: ['2', '11', 'blue', 'me and you']
    }]);
}

/*
 * initializes TriviaQuestions.
 *
 * @param {Array} questions: array of questions objects, see below
 */

TriviaQuestions.prototype.init = function(questions) {
    // questions: array of questions objects, 
    // where a question object contains:
    //   question: string 
    //   choices: array of strings, where first is correct answer
    //   points: integer (optional)

    if (questions) {
        this.questions = questions;
    }
    this.unasked = [];
    for (var ii = 0; ii < this.questions.length; ii++) {
        this.unasked.push(ii);
    }
};

/*
 * Returns a question object, to be called after a generate*Question()
 *
 * @return {Object} question object
 */
TriviaQuestions.prototype.getQuestionObj = function() {
    return this.qo || {comment:'no newQuestion yet'};
}

/*
 * Returns a question at random from generateStoredQuestionObj() or 
 * from generateMultiplyQuestionObj
 *
 * @return {Object} question object
 */
TriviaQuestions.prototype.generateQuestionObj = function() {
    // half the time return a random generated multiplaction question
    if (true 
        && Math.random() < 0.5) {
        return this.generateMultiplyQuestionObj();
    }
    return this.generateStoredQuestionObj()
};

/*
 * Returns a question at random from unasked questions, similar to pulling a card randomly from deck of cards.
 * Like a deck of cards, once all questions are asked, original questions are shuffled and reused.
 *
 * @param {Boolean} newQuestion fetches a new question if true, else returns last question again
 * @return {Object} question object
 */
TriviaQuestions.prototype.generateStoredQuestionObj = function() {
    console.log('generateStoredQuestionObj');
    
    if (this.unasked.length === 0) {
        this.init();
    }
    var unaskedIndx = Math.floor(Math.random() * this.unasked.length);
    
    // remove question number from the unasked list so it won't be asked again,
    // at least until all questions have been used up.
    var qn = this.unasked.splice(unaskedIndx, 1)[0];

    // set answer 
    this.correctAnswer = this.questions[qn].choices[0];
    
    // create new question object with default points and random choices
    this.qo = {
        question: this.questions[qn].question,
        choices: randomizeArray(this.questions[qn].choices),
        points: this.questions[qn].points || 10
    };

    return this.qo;
};


/*
 * Returns a multiplication question generated at random
 *
 * @return {Object} question object
 */
TriviaQuestions.prototype.generateMultiplyQuestionObj = function() {
    var a;
    console.log('generateMultiplyQuestionObj');
    
    // create new question object with default points and one choices
    this.qo = {
        question: randomNumber(100) +' * '+ randomNumber(100),
        points: 10
    };
    this.correctAnswer = eval(this.qo.question);
    this.qo.choices = [this.correctAnswer];
    
    // generate random numbers near correctAnswer, but avoid duplicates.
    for (;this.qo.choices.length < 5;) {
        a = randomNumber({ pct:50, num:this.correctAnswer });
        console.log('generateMultiplyQuestionObj N', a, this.qo.choices.length);
        if (this.qo.choices.indexOf(a) === -1) {
            this.qo.choices.push(a);
        }
    }
    return this.qo;
};


/*
 * Returns correct answer to last question fetched via getQuestionObj()
 *
 * @return {String} correct answer to last getQuestionObj()
 */
TriviaQuestions.prototype.getAnswer = function() {
    return this.correctAnswer;
};

/*
 * Used to validate players answer
 *
 * @param {Object} data must contain question string and answer string
 * @return {Boolean} true if data matches last question
 */
TriviaQuestions.prototype.isCorrect = function(data) {
    return this.correctAnswer && data.answer == this.correctAnswer && data.question === this.qo.question;
};

/*
 * Returns a random number from 0 to N-1.  e.g. if N=3, will return 0, 1, or 2 ...
 * or if N is object, return random number that is within N.pct of N.num
 *
 * @param {Number|Object} if  ...
 * @return {Number} random number from 0 to N-1, inclusive.
 */
function randomNumber(N) {
    if (typeof N === 'number') {
        return Math.floor(Math.random() * N);
        
    } else if (typeof N === 'object') {
        return Math.floor(N.num * (1 + (randomNumber(N.pct*2) - N.pct)/100) );
    }
}

/*
 * Returns a clone of origArray randomly sorted, since array.sort() is not always random
 *
 * @param {Object} origArray is array
 * @return {Object} clone of origArray, sorted randomly
 */
function randomizeArray(origArray) {
    var arr = origArray.slice(0); // clone array so we can splice
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