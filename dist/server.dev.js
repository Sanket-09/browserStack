"use strict";

var express = require('express');

var app = express();

var http = require('http').Server(app);

var io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
});

var path = require('path');

var _require = require('child_process'),
    exec = _require.exec;

var Watcher = require('./watcher');

var monitor = new Watcher("test.log");
monitor.start();
var scriptPath = './generate_dummy_logs.sh'; // Execute the shell script to generate dummy logs
// exec(`sh ${scriptPath}`, (error, stdout, stderr) => {
//     if (error) {
//         console.error(`Error executing shell script: ${error}`);
//         return;
//     }
//     console.log(`Shell script output: ${stdout}`);
//     console.error(`Shell script errors: ${stderr}`);
// });
// // Initialize the log watcher with the new file name
// let logWatcher = new LogWatcher("generate_dummy_logs_sh");
// logWatcher.start();

app.get('/log', function (req, res) {
  console.log("request received");
  var alters = {
    root: path.join(__dirname)
  };
  var fileName = 'index.html';
  res.sendFile(fileName, alters, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});
io.on('connection', function (socket) {
  console.log("new connection established:" + socket.id);
  monitor.on("process", function process(data) {
    socket.emit("updated-log", data);
  });
  var data = monitor.getLogs();
  socket.emit("initial-logs", data);
});
http.listen(3000, function () {
  console.log('listening on localhost:3000');
});