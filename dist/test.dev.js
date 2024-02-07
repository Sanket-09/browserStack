"use strict";

var fs = require('fs');

var counter = 1;
fs.appendFile("test.log", Date.now() + " :" + counter.toString(), function (err) {
  if (err) throw err;
  console.log("test file initialized");
});
counter++;
setInterval(function () {
  fs.appendFile("test.log", "\n" + Date.now() + ": " + counter, function (err) {
    if (err) console.log(err);
    console.log("log updated");
  });
  counter++;
}, 1000);