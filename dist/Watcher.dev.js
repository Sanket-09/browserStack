"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var events = require("events");

var fs = require("fs");

var watchFile = "test.log";

var bf = require('buffer');

var TRAILING_LINES = 10;
var buffer = new Buffer.alloc(bf.constants.MAX_STRING_LENGTH);

var Watcher =
/*#__PURE__*/
function (_events$EventEmitter) {
  _inherits(Watcher, _events$EventEmitter);

  function Watcher(watchFile) {
    var _this;

    _classCallCheck(this, Watcher);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Watcher).call(this));
    _this.watchFile = watchFile;
    _this.store = [];
    return _this;
  }

  _createClass(Watcher, [{
    key: "getLogs",
    value: function getLogs() {
      return this.store;
    }
  }, {
    key: "watch",
    value: function watch(curr, prev) {
      var _this2 = this;

      var watcher = this;
      fs.open(this.watchFile, function (err, fd) {
        if (err) throw err;
        var data = '';
        var logs = [];
        fs.read(fd, buffer, 0, buffer.length, prev.size, function (err, bytesRead) {
          if (err) throw err;

          if (bytesRead > 0) {
            data = buffer.slice(0, bytesRead).toString();
            logs = data.split("\n").slice(1);
            console.log("logs read:" + logs);

            if (logs.length >= TRAILING_LINES) {
              logs.slice(-10).forEach(function (elem) {
                return _this2.store.push(elem);
              });
            } else {
              logs.forEach(function (elem) {
                if (_this2.store.length == TRAILING_LINES) {
                  console.log("queue is full");

                  _this2.store.shift();
                }

                _this2.store.push(elem);
              });
            }

            watcher.emit("process", logs);
          }
        });
      });
    }
  }, {
    key: "start",
    value: function start() {
      var _this3 = this;

      var watcher = this;
      fs.open(this.watchFile, function (err, fd) {
        if (err) throw err;
        var data = '';
        var logs = [];
        fs.read(fd, buffer, 0, buffer.length, 0, function (err, bytesRead) {
          if (err) throw err;

          if (bytesRead > 0) {
            data = buffer.slice(0, bytesRead).toString();
            logs = data.split("\n");
            _this3.store = [];
            logs.slice(-10).forEach(function (elem) {
              return _this3.store.push(elem);
            });
          }

          fs.close(fd);
        });
        fs.watchFile(_this3.watchFile, {
          "interval": 1000
        }, function (curr, prev) {
          watcher.watch(curr, prev);
        });
      });
    }
  }]);

  return Watcher;
}(events.EventEmitter);

module.exports = Watcher;