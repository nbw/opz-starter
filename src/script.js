(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _midi = _interopRequireDefault(require("./midi"));

var _opzjs = _interopRequireDefault(require("opzjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var midi = new _midi["default"]();
var log = document.getElementById("log");

var handler = function handler(event) {
  var data = _opzjs["default"].decode(event.data);

  if (data.velocity > 0) {
    print("".concat(data.action, " : ").concat(data.track, " : ").concat(data.velocity, "\xA0: ").concat(JSON.stringify(data.value)));
  }
};

var print = function print(msg) {
  var item = document.createElement("li");
  item.appendChild(document.createTextNode(msg));
  log.prepend(item);
};

midi.setup();
setTimeout(function () {
  if (midi.devices.length > 0) {
    for (var deviceId in midi.devices) {
      confirm = midi.selectDevice(deviceId, handler);
      print(confirm);
    }
  } else {
    print("Couldn't detect any midi devices (check browser support)");
  }
}, 200);

},{"./midi":2,"opzjs":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Midi = /*#__PURE__*/function () {
  function Midi() {
    _classCallCheck(this, Midi);

    this.self = this;
    this.devices = [];
    this.supported = this.checkMidiSupport();
  }

  _createClass(Midi, [{
    key: "setup",
    value: function setup() {
      navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
    }
  }, {
    key: "onMIDISuccess",
    value: function onMIDISuccess(midiAccess) {
      var inputs = midiAccess.inputs.values();

      var _iterator = _createForOfIteratorHelper(midiAccess.inputs.values()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var input = _step.value;
          this.devices.push(input);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "onMIDIFailure",
    value: function onMIDIFailure() {
      console.log('Could not access your MIDI devices.');
    }
  }, {
    key: "checkMidiSupport",
    value: function checkMidiSupport() {
      if (navigator.requestMIDIAccess) {
        console.log('This browser supports WebMIDI!');
        return true;
      } else {
        console.log('WebMIDI is not supported in this browser.');
        return false;
      }
    }
  }, {
    key: "selectDevice",
    value: function selectDevice(deviceIndex, handler) {
      var device = this.devices[deviceIndex];
      device.onmidimessage = handler;
      return "Connected to \"".concat(device.name, "\"");
    }
  }]);

  return Midi;
}();

var _default = Midi;
exports["default"] = _default;

},{}],3:[function(require,module,exports){
const _MIDI = require('./opz.json');

const error = (value) => {
  console.log('[OPZ]: Untracked midi value. Please create an issue https://github.com/nbw/opz/issues');
  console.log(`[OPZ]: ${value}`);
  return value;
}

const get = (...args) => {
  let value = _MIDI;
  for (let i = 0; i < args.length; i++) {
    value = value[args[i]];
    if (!value) throw 'Untracked value';
  }
  return value;
}

const track = (input) => {
  if (input.length < 1) return null;
  return get('track', input[0]);
};

const action = (input) => {
  if (input.length < 1) return null;
  return get('action', input[0]);
};

const note = (input) => {
  if (input.length < 2) return null;
  const n = input[1];
  return {
    value: n,
    note: get('notes', n % 12)
  };
};

const dial = (input) => {
  if (input.length < 2) return null;
  const d = input[1];
  return {
    dial: (d - 1 ) % 4, // 0 - 3
    dialColor: get('dial', 'color', d % 100),
    page: Math.floor((d - 1) / 4), // 0 - 3
    pageColor: get('dial', 'page', track(input), d % 100)
  };
};

const pitch = (input) => {
  if (input.length < 3) return null;
  return {
    absolute: input[1],
    relative: input[2]
  };
}

const value = (input) => {
  if (input.length < 3) return null;

  switch(action(input)) {
    case 'keys':
      return note(input);
    case 'dial':
      return dial(input);
    case 'pitch bend':
      return pitch(input);
    default:
      return {};
  }
};

const velocity = (input) => {
  if (input.length < 3) return -1;
  return input[2];
};

const control = (input) => {
  const c = get('control', input[0]);
  return {
    track: c,
    action: c,
    velocity: velocity(input),
    value: {},
  };
}

const decode = (input) => {
  try {
    if (input.length === 1) return control(input);
    if (input.length === 2) return null;

    return {
      track: track(input),
      action: action(input),
      velocity: velocity(input),
      value: value(input),
    };
  } catch(e) {
    error(input);
  }
};

module.exports = {
  decode,
  velocity,
};

},{"./opz.json":4}],4:[function(require,module,exports){
module.exports={
  "dictionary": {
    "action": {
      "dial": "dial",
      "keys": "keys",
      "pitch": "pitch bend"
    },
    "color": {
      "blue": "blue",
      "green": "green",
      "purple": "purple",
      "red": "red",
      "white": "white",
      "yellow": "yellow"
    },
    "track": {
      "arp": "arp",
      "bass": "bass",
      "chord": "chord",
      "fx1": "fx1",
      "fx2": "fx2",
      "kick": "kick",
      "lead": "lead",
      "lights": "lights",
      "master": "master",
      "module": "module",
      "motion": "motion",
      "perc": "perc",
      "perform": "perform",
      "sample": "sample",
      "snare": "snare",
      "tape": "tape"
    },
    "clock": "clock",
    "kill": "kill",
    "start": "start",
    "stop": "stop"
  },
  "control": {
    "248": "clock",
    "250": "start",
    "252": "stop"
  },
  "action": {
    "128": "keys",
    "129": "keys",
    "130": "keys",
    "131": "keys",
    "132": "keys",
    "133": "keys",
    "134": "keys",
    "135": "keys",
    "136": "keys",
    "137": "keys",
    "138": "keys",
    "139": "keys",
    "140": "keys",
    "141": "keys",
    "142": "keys",
    "143": "keys",
    "144": "keys",
    "145": "keys",
    "146": "keys",
    "147": "keys",
    "148": "keys",
    "149": "keys",
    "150": "keys",
    "151": "keys",
    "152": "keys",
    "153": "keys",
    "154": "keys",
    "155": "keys",
    "156": "keys",
    "157": "keys",
    "158": "keys",
    "159": "keys",
    "176": "dial",
    "177": "dial",
    "178": "dial",
    "179": "dial",
    "180": "dial",
    "181": "dial",
    "182": "dial",
    "183": "dial",
    "184": "dial",
    "185": "dial",
    "186": "dial",
    "187": "dial",
    "188": "dial",
    "189": "dial",
    "190": "dial",
    "191": "dial",
    "224": "pitch bend",
    "225": "pitch bend",
    "226": "pitch bend",
    "227": "pitch bend",
    "228": "pitch bend",
    "229": "pitch bend",
    "230": "pitch bend",
    "231": "pitch bend",
    "232": "pitch bend",
    "233": "pitch bend",
    "234": "pitch bend",
    "235": "pitch bend",
    "236": "pitch bend",
    "237": "pitch bend",
    "238": "pitch bend",
    "239": "pitch bend"
  },
  "track": {
    "128": "kick",
    "129": "snare",
    "130": "perc",
    "131": "sample",
    "132": "bass",
    "133": "lead",
    "134": "arp",
    "135": "chord",
    "136": "fx1",
    "137": "fx2",
    "138": "tape",
    "139": "master",
    "140": "perform",
    "141": "module",
    "142": "lights",
    "143": "motion",
    "144": "kick",
    "145": "snare",
    "146": "perc",
    "147": "sample",
    "148": "bass",
    "149": "lead",
    "150": "arp",
    "151": "chord",
    "152": "fx1",
    "153": "fx2",
    "154": "tape",
    "155": "master",
    "156": "perform",
    "157": "module",
    "158": "lights",
    "159": "motion",
    "176": "kick",
    "177": "snare",
    "178": "perc",
    "179": "sample",
    "180": "bass",
    "181": "lead",
    "182": "arp",
    "183": "chord",
    "184": "fx1",
    "185": "fx2",
    "186": "tape",
    "187": "master",
    "188": "perform",
    "189": "lights",
    "190": "lights",
    "191": "motion",
    "224": "kick",
    "225": "snare",
    "226": "perc",
    "227": "sample",
    "228": "bass",
    "229": "lead",
    "230": "arp",
    "231": "chord",
    "232": "fx1",
    "233": "fx2",
    "234": "tape",
    "235": "master",
    "236": "perform",
    "237": "module",
    "238": "lights",
    "239": "motion"
  },
  "notes": {
    "0": "C",
    "1": "C#",
    "2": "D",
    "3": "D#",
    "4": "E",
    "5": "F",
    "6": "F#",
    "7": "G",
    "8": "G#",
    "9": "A",
    "10": "A#",
    "11": "B"
  },
  "dial": {
    "color": {
      "1": "green",
      "2": "blue",
      "3": "yellow",
      "4": "red",
      "5": "green",
      "6": "blue",
      "7": "yellow",
      "8": "red",
      "9": "green",
      "10": "blue",
      "11": "yellow",
      "12": "red",
      "13": "green",
      "14": "blue",
      "15": "yellow",
      "16": "red",
      "23": "kill"
    },
    "page": {
      "kick": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "snare": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "perc": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "sample": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "bass": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "lead": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "arp": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "blue",
        "10": "blue",
        "11": "blue",
        "12": "blue",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "chord": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "fx1": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "fx2": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "tape": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "master": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "perform": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "module": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "lights": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      },
      "motion": {
        "1": "white",
        "2": "white",
        "3": "white",
        "4": "white",
        "5": "green",
        "6": "green",
        "7": "green",
        "8": "green",
        "9": "purple",
        "10": "purple",
        "11": "purple",
        "12": "purple",
        "13": "yellow",
        "14": "yellow",
        "15": "yellow",
        "16": "yellow",
        "23": "kill"
      }
    }
  }
}

},{}]},{},[1]);
