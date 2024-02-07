"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var events = require("events");

var watchFile = "modified.log";

var fs = require("fs");

var LAST_LINE = 10;

var Watcher =
/*#__PURE__*/
function (_events$EventEmitter) {
  _inherits(Watcher, _events$EventEmitter);

  function Watcher(watchFile) {
    var _this;

    _classCallCheck(this, Watcher);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Watcher).call(this));
    _this.watchFile = watchFile;
    _this.logsStore = [];
    return _this;
  }

  _createClass(Watcher, [{
    key: "getLogFiles",
    value: function getLogFiles() {
      return this.logsStore;
    }
  }, {
    key: "watch",
    value: function watch(current, previous) {
      var watcher = this;
      fs.readFile(this.watchFile, "utf-8", function (e, data) {
        if (e) throw e;
        var logs = data.split("\n").slice(1);
        watcher.updateStore(logs);
        watcher.emit("process", logs);
      });
    }
  }, {
    key: "updateStore",
    value: function updateStore(logs) {
      if (logs.length >= LAST_LINE) {
        this.logsStore = logs.slice(-LAST_LINE); // extracts last 10 lines
      } else {
        var _this$logsStore;

        (_this$logsStore = this.logsStore).push.apply(_this$logsStore, _toConsumableArray(logs));

        if (this.logsStore.length > LAST_LINE) {
          this.logsStore = this.logsStore.slice(-LAST_LINE);
        }
      }
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      var watcher = this;
      fs.readFile(this.watchFile, "utf-8", function (e, data) {
        if (e) throw e;
        var logs = data.split("\n");
        watcher.updateStore(logs);
        fs.watchFile(_this2.watchFile, {
          interval: 1000
        }, function (current, previous) {
          watcher.watch(current, previous);
        });
      });
    }
  }]);

  return Watcher;
}(events.EventEmitter);

module.exports = Watcher;