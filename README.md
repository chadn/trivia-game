# Trivia Game

Play: [trivia-game.jit.su](http://trivia-game.jit.su/)

## The Challenge

Using Node.js with Socket.IO build a math trivia game. This game will allow for one or more players from multiple locations to participate. A question will appear on the screen, and the first player to submit the correct answer will be awarded points. Anyone can join and leave the room.

The game should be versioned on github, hosted on nodejitsu, and backed by solid tests.

Take as much time as you need, ask as many questions as you'd like, and be as creative as you can. Most importantly, have fun with it.

## The Solution

The direction taken was to be as simple and clean as possible, to work well on smart phones and tablets as well as desktop browsers.

Server Stack:

* node.js 0.8
* express 3.0
* socket.io 0.9
* mocha 1.9


Client Stack:

* socket.io 0.9
* backbone 1.0
* underscore 1.4
* jquery 2.0
* twitter bootstrap 2.3


## Testing

mocha is the testing framework used.  To test, install:

	npm install --dev

Run tests 

	npm test

Game works on Chrome, Safari, iPad, iPhone, android ... NOT tested on IE.

# Todo

This list contains ideas. Can be generic (improve design) or specific (store client IP).

- [ ] server: pause game without stopping server
- [ ] server: add config file, so can specify different questions files
- [ ] server: create admin UI (ADVANCED): choose new questions file, reset current questions, pause/resume questions
- [ ] server/client: create shared module creates/interprets json containing question info, etc.
- [ ] client: add fun popups/animations if winner
- [ ] client: improve design
- [ ] client: add treatment to button of correct answer, like flashing green
- [x] client: add details on players (createTime, lastActiveTime)
- [x] players: store more player fields: client IP, createTime, lastActiveTime
- [ ] players: store in db. Currently a server restart loose player info
- [ ] questions: support meta info for group of questions: description, version, category
- [ ] questions: support categoy per question (default to questions category if none)

# License

(The MIT License)

Copyright (c) 2013 Chad Norwood

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/bac502d0aebcbe0184906eca3d044092 "githalytics.com")](http://githalytics.com/chadn/trivia-game)
