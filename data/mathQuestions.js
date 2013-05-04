
// WHEN CREATING QUESTIONS AND ANSWERS ...
// The correct answer must be the first choice (keepin' it simple).
// Choices will be presented in random order.
// points is optional, defaults to 10 if not specified.
var mathQuestions = [{
    points: 10,
    question: "Which number is NOT a prime number?",
    choices: [
        '141',
        '37',
        '613',
        '23'
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
    question: "When was Pythagoras alive?",
    choices: [
        '500 BC',
        '800 BC',
        '400 BC',
        '200 BC'
    ]
},{
    question: "Chad's car used 12 gallons of gasoline on a 420 mile trip. How many miles per gallon (mpg) did the car get?",
    choices: [
        '35 mpg',
        '25 mpg',
        '30 mpg',
        '40 mpg'
    ]
}];

if (typeof module == 'object') {
    module.exports = mathQuestions;    
}
