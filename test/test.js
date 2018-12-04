let BigInterval = require('biginterval');
let interval = 6000;

let myBigInterval = new BigInterval(function (message) {
  console.log(message);
}, interval, 'Hello world!');

let myBigInterval2 = new BigInterval();
myBigInterval2.set(function (message) {
  console.log(message);
}, interval, 'Hello world!');

setTimeout(function () {
  myBigInterval.clear();
  myBigInterval2.clear();
}, 7000);
