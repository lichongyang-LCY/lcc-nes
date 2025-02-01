var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var lcc$nes;
(function (lcc$nes) {
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var FRAMESIZE = cc.size(256, 240);
    var gfx = cc.gfx;
    var Emulator = (function (_super) {
        __extends(Emulator, _super);
        function Emulator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._rom = null;
            _this.playOnLoad = false;
            _this._prepare = false;
            _this._nes = null;
            _this._texture = null;
            _this._framebuff = null;
            _this._frameu8 = null;
            _this._frameu32 = null;
            _this._audio = null;
            return _this;
        }
        Object.defineProperty(Emulator.prototype, "rom", {
            get: function () {
                return this._rom;
            },
            set: function (value) {
                this._rom = value;
                this.setRomData(value);
            },
            enumerable: false,
            configurable: true
        });
        Emulator.prototype.onLoad = function () {
            this._audio = new lcc$nes.AudioPlayer();
            this._nes = new jsnes.NES({
                onFrame: this.setFrameBuffer.bind(this),
                onStatusUpdate: cc.log,
                sampleRate: this._audio.getSampleRate(),
                onAudioSample: this._audio.writeSample.bind(this._audio),
            });
            this._texture = new cc.Texture2D();
            this._framebuff = new ArrayBuffer(FRAMESIZE.width * FRAMESIZE.height * 4);
            this._frameu8 = new Uint8Array(this._framebuff);
            this._frameu32 = new Uint32Array(this._framebuff);
        };
        Emulator.prototype.setFrameBuffer = function (buffer) {
            var i = 0;
            for (var y = 0; y < FRAMESIZE.height; ++y) {
                for (var x = 0; x < FRAMESIZE.width; ++x) {
                    i = y * 256 + x;
                    this._frameu32[i] = 0xff000000 | buffer[i];
                }
            }
            this._texture.initWithData(this._frameu8, gfx.TEXTURE_FMT_RGBA8, FRAMESIZE.width, FRAMESIZE.height);
        };
        Emulator.prototype.getNES = function () {
            return this._nes;
        };
        Emulator.prototype.getTexture = function () {
            return this._texture;
        };
        Emulator.prototype.setRomData = function (data) {
            if (!CC_EDITOR && this._nes) {
                if (data) {
                    this._nes.loadROM(lcc$nes.Utils.ab2bs(data._buffer));
                    this._audio.start();
                    this._prepare = true;
                }
            }
        };
        Emulator.prototype.reset = function () {
            if (!CC_EDITOR && this._nes) {
                this._nes.reset();
                this._audio.stop();
                this._prepare = false;
            }
        };
        Emulator.prototype.update = function (dt) {
            if (this._nes && this._prepare) {
                this._nes.frame();
            }
        };
        Emulator.prototype.start = function () {
            if (this.playOnLoad) {
                this.setRomData(this._rom);
            }
        };
        Emulator.prototype.getState = function () {
            return this._nes.getState();
        };
        Emulator.prototype.loadState = function (s) {
            this._nes.loadState(s);
        };
        __decorate([
            property(cc.BufferAsset)
        ], Emulator.prototype, "_rom", void 0);
        __decorate([
            property({
                type: cc.BufferAsset,
                tooltip: "ROM 数据"
            })
        ], Emulator.prototype, "rom", null);
        __decorate([
            property({
                tooltip: "立即播放"
            })
        ], Emulator.prototype, "playOnLoad", void 0);
        Emulator = __decorate([
            ccclass("lcc$nes.Emulator"),
            menu("i18n:lcc-nes.menu_component/Emulator")
        ], Emulator);
        return Emulator;
    }(cc.Component));
    lcc$nes.Emulator = Emulator;
})(lcc$nes || (lcc$nes = {}));
window.lcc$nes = lcc$nes;
var lcc$nes;
(function (lcc$nes) {
    var RingBuffer = (function () {
        function RingBuffer(capacity, evictedCb) {
            this._elements = null;
            this._first = 0;
            this._last = 0;
            this._size = 0;
            this._evictedCb = null;
            this._elements = new Array(capacity || 50);
            this._first = 0;
            this._last = 0;
            this._size = 0;
            this._evictedCb = evictedCb;
        }
        RingBuffer.prototype.capacity = function () {
            return this._elements.length;
        };
        RingBuffer.prototype.size = function () {
            return this._size;
        };
        RingBuffer.prototype.isEmpty = function () {
            return this.size() === 0;
        };
        RingBuffer.prototype.isFull = function () {
            return this.size() === this.capacity();
        };
        RingBuffer.prototype.peek = function () {
            if (this.isEmpty())
                throw new Error('RingBuffer is empty');
            return this._elements[this._first];
        };
        RingBuffer.prototype.peekN = function (count) {
            if (count > this._size)
                throw new Error('Not enough elements in RingBuffer');
            var end = Math.min(this._first + count, this.capacity());
            var firstHalf = this._elements.slice(this._first, end);
            if (end < this.capacity()) {
                return firstHalf;
            }
            var secondHalf = this._elements.slice(0, count - firstHalf.length);
            return firstHalf.concat(secondHalf);
        };
        RingBuffer.prototype.deq = function () {
            var element = this.peek();
            this._size--;
            this._first = (this._first + 1) % this.capacity();
            return element;
        };
        RingBuffer.prototype.deqN = function (count) {
            var elements = this.peekN(count);
            this._size -= count;
            this._first = (this._first + count) % this.capacity();
            return elements;
        };
        RingBuffer.prototype.enq = function (element) {
            this._last = (this._first + this.size()) % this.capacity();
            var full = this.isFull();
            if (full && this._evictedCb) {
                this._evictedCb(this._elements[this._last]);
            }
            this._elements[this._last] = element;
            if (full) {
                this._first = (this._first + 1) % this.capacity();
            }
            else {
                this._size++;
            }
            return this.size();
        };
        return RingBuffer;
    }());
    lcc$nes.RingBuffer = RingBuffer;
})(lcc$nes || (lcc$nes = {}));
var lcc$nes;
(function (lcc$nes) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.ab2bs = function (ab) {
            var binary = "";
            var bytes = new Uint8Array(ab);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return binary;
        };
        return Utils;
    }());
    lcc$nes.Utils = Utils;
})(lcc$nes || (lcc$nes = {}));
var lcc$nes;
(function (lcc$nes) {
    var BUFFERSIZE = 8192;
    var AudioPlayer = (function () {
        function AudioPlayer() {
            this._buffer = null;
            this._audioCtx = null;
            this._scriptNode = null;
            this._buffer = new lcc$nes.RingBuffer(BUFFERSIZE * 2);
        }
        AudioPlayer.prototype.getSampleRate = function () {
            if (!window.AudioContext) {
                return 44100;
            }
            var myCtx = new AudioContext();
            var sampleRate = myCtx.sampleRate;
            myCtx.close();
            return sampleRate;
        };
        AudioPlayer.prototype.start = function () {
            if (!this._scriptNode) {
                if (!window.AudioContext) {
                    return;
                }
                this._audioCtx = new AudioContext();
                this._scriptNode = this._audioCtx.createScriptProcessor(1024, 0, 2);
                this._scriptNode.onaudioprocess = this.onaudioprocess.bind(this);
                this._scriptNode.connect(this._audioCtx.destination);
            }
        };
        AudioPlayer.prototype.stop = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._scriptNode) {
                                this._scriptNode.disconnect(this._audioCtx.destination);
                                this._scriptNode.onaudioprocess = null;
                                this._scriptNode = null;
                            }
                            if (!this._audioCtx) return [3, 2];
                            return [4, this._audioCtx.close()];
                        case 1:
                            _a.sent();
                            this._audioCtx = null;
                            _a.label = 2;
                        case 2: return [2];
                    }
                });
            });
        };
        AudioPlayer.prototype.writeSample = function (left, right) {
            if (this._buffer.size() / 2 >= BUFFERSIZE) {
                this._buffer.deqN(BUFFERSIZE / 2);
            }
            this._buffer.enq(left);
            this._buffer.enq(right);
        };
        ;
        AudioPlayer.prototype.onaudioprocess = function (e) {
            var left = e.outputBuffer.getChannelData(0);
            var right = e.outputBuffer.getChannelData(1);
            var size = left.length;
            try {
                var samples = this._buffer.deqN(size * 2);
            }
            catch (e) {
                var bufferSize = this._buffer.size() / 2;
                if (bufferSize > 0) {
                }
                for (var j = 0; j < size; j++) {
                    left[j] = 0;
                    right[j] = 0;
                }
                return;
            }
            for (var i = 0; i < size; i++) {
                left[i] = samples[i * 2];
                right[i] = samples[i * 2 + 1];
            }
        };
        ;
        return AudioPlayer;
    }());
    lcc$nes.AudioPlayer = AudioPlayer;
})(lcc$nes || (lcc$nes = {}));
var lcc$nes;
(function (lcc$nes) {
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, menu = _a.menu;
    var Player;
    (function (Player) {
        Player[Player["PLAYER_1"] = 1] = "PLAYER_1";
        Player[Player["PLAYER_2"] = 2] = "PLAYER_2";
    })(Player = lcc$nes.Player || (lcc$nes.Player = {}));
    var Button;
    (function (Button) {
        Button[Button["A"] = 0] = "A";
        Button[Button["B"] = 1] = "B";
        Button[Button["SELECT"] = 2] = "SELECT";
        Button[Button["START"] = 3] = "START";
        Button[Button["UP"] = 4] = "UP";
        Button[Button["DOWN"] = 5] = "DOWN";
        Button[Button["LEFT"] = 6] = "LEFT";
        Button[Button["RIGHT"] = 7] = "RIGHT";
    })(Button = lcc$nes.Button || (lcc$nes.Button = {}));
    var Keyboard;
    (function (Keyboard) {
        Keyboard[Keyboard["back"] = 0] = "back";
        Keyboard[Keyboard["menu"] = 1] = "menu";
        Keyboard[Keyboard["backspace"] = 2] = "backspace";
        Keyboard[Keyboard["tab"] = 3] = "tab";
        Keyboard[Keyboard["enter"] = 4] = "enter";
        Keyboard[Keyboard["shift"] = 5] = "shift";
        Keyboard[Keyboard["ctrl"] = 6] = "ctrl";
        Keyboard[Keyboard["alt"] = 7] = "alt";
        Keyboard[Keyboard["pause"] = 8] = "pause";
        Keyboard[Keyboard["capslock"] = 9] = "capslock";
        Keyboard[Keyboard["escape"] = 10] = "escape";
        Keyboard[Keyboard["space"] = 11] = "space";
        Keyboard[Keyboard["pageup"] = 12] = "pageup";
        Keyboard[Keyboard["pagedown"] = 13] = "pagedown";
        Keyboard[Keyboard["end"] = 14] = "end";
        Keyboard[Keyboard["home"] = 15] = "home";
        Keyboard[Keyboard["left"] = 16] = "left";
        Keyboard[Keyboard["up"] = 17] = "up";
        Keyboard[Keyboard["right"] = 18] = "right";
        Keyboard[Keyboard["down"] = 19] = "down";
        Keyboard[Keyboard["select"] = 20] = "select";
        Keyboard[Keyboard["insert"] = 21] = "insert";
        Keyboard[Keyboard["Delete"] = 22] = "Delete";
        Keyboard[Keyboard["a"] = 23] = "a";
        Keyboard[Keyboard["b"] = 24] = "b";
        Keyboard[Keyboard["c"] = 25] = "c";
        Keyboard[Keyboard["d"] = 26] = "d";
        Keyboard[Keyboard["e"] = 27] = "e";
        Keyboard[Keyboard["f"] = 28] = "f";
        Keyboard[Keyboard["g"] = 29] = "g";
        Keyboard[Keyboard["h"] = 30] = "h";
        Keyboard[Keyboard["i"] = 31] = "i";
        Keyboard[Keyboard["j"] = 32] = "j";
        Keyboard[Keyboard["k"] = 33] = "k";
        Keyboard[Keyboard["l"] = 34] = "l";
        Keyboard[Keyboard["m"] = 35] = "m";
        Keyboard[Keyboard["n"] = 36] = "n";
        Keyboard[Keyboard["o"] = 37] = "o";
        Keyboard[Keyboard["p"] = 38] = "p";
        Keyboard[Keyboard["q"] = 39] = "q";
        Keyboard[Keyboard["r"] = 40] = "r";
        Keyboard[Keyboard["s"] = 41] = "s";
        Keyboard[Keyboard["t"] = 42] = "t";
        Keyboard[Keyboard["u"] = 43] = "u";
        Keyboard[Keyboard["v"] = 44] = "v";
        Keyboard[Keyboard["w"] = 45] = "w";
        Keyboard[Keyboard["x"] = 46] = "x";
        Keyboard[Keyboard["y"] = 47] = "y";
        Keyboard[Keyboard["z"] = 48] = "z";
        Keyboard[Keyboard["num0"] = 49] = "num0";
        Keyboard[Keyboard["num1"] = 50] = "num1";
        Keyboard[Keyboard["num2"] = 51] = "num2";
        Keyboard[Keyboard["num3"] = 52] = "num3";
        Keyboard[Keyboard["num4"] = 53] = "num4";
        Keyboard[Keyboard["num5"] = 54] = "num5";
        Keyboard[Keyboard["num6"] = 55] = "num6";
        Keyboard[Keyboard["num7"] = 56] = "num7";
        Keyboard[Keyboard["num8"] = 57] = "num8";
        Keyboard[Keyboard["num9"] = 58] = "num9";
        Keyboard[Keyboard["*"] = 59] = "*";
        Keyboard[Keyboard["+"] = 60] = "+";
        Keyboard[Keyboard["-"] = 61] = "-";
        Keyboard[Keyboard["numdel"] = 62] = "numdel";
        Keyboard[Keyboard["/"] = 63] = "/";
        Keyboard[Keyboard["f1"] = 64] = "f1";
        Keyboard[Keyboard["f2"] = 65] = "f2";
        Keyboard[Keyboard["f3"] = 66] = "f3";
        Keyboard[Keyboard["f4"] = 67] = "f4";
        Keyboard[Keyboard["f5"] = 68] = "f5";
        Keyboard[Keyboard["f6"] = 69] = "f6";
        Keyboard[Keyboard["f7"] = 70] = "f7";
        Keyboard[Keyboard["f8"] = 71] = "f8";
        Keyboard[Keyboard["f9"] = 72] = "f9";
        Keyboard[Keyboard["f10"] = 73] = "f10";
        Keyboard[Keyboard["f11"] = 74] = "f11";
        Keyboard[Keyboard["f12"] = 75] = "f12";
        Keyboard[Keyboard["numlock"] = 76] = "numlock";
        Keyboard[Keyboard["scrolllock"] = 77] = "scrolllock";
        Keyboard[Keyboard[";"] = 78] = ";";
        Keyboard[Keyboard["semicolon"] = 79] = "semicolon";
        Keyboard[Keyboard["equal"] = 80] = "equal";
        Keyboard[Keyboard["="] = 81] = "=";
        Keyboard[Keyboard[","] = 82] = ",";
        Keyboard[Keyboard["comma"] = 83] = "comma";
        Keyboard[Keyboard["dash"] = 84] = "dash";
        Keyboard[Keyboard["."] = 85] = ".";
        Keyboard[Keyboard["period"] = 86] = "period";
        Keyboard[Keyboard["forwardslash"] = 87] = "forwardslash";
        Keyboard[Keyboard["grave"] = 88] = "grave";
        Keyboard[Keyboard["["] = 89] = "[";
        Keyboard[Keyboard["openbracket"] = 90] = "openbracket";
        Keyboard[Keyboard["backslash"] = 91] = "backslash";
        Keyboard[Keyboard["]"] = 92] = "]";
        Keyboard[Keyboard["closebracket"] = 93] = "closebracket";
        Keyboard[Keyboard["quote"] = 94] = "quote";
        Keyboard[Keyboard["dpadLeft"] = 95] = "dpadLeft";
        Keyboard[Keyboard["dpadRight"] = 96] = "dpadRight";
        Keyboard[Keyboard["dpadUp"] = 97] = "dpadUp";
        Keyboard[Keyboard["dpadDown"] = 98] = "dpadDown";
        Keyboard[Keyboard["dpadCenter"] = 99] = "dpadCenter";
    })(Keyboard = lcc$nes.Keyboard || (lcc$nes.Keyboard = {}));
    var KeyboardList = [
        'back',
        'menu',
        'backspace',
        'tab',
        'enter',
        'shift',
        'ctrl',
        'alt',
        'pause',
        'capslock',
        'escape',
        'space',
        'pageup',
        'pagedown',
        'end',
        'home',
        'left',
        'up',
        'right',
        'down',
        'select',
        'insert',
        'Delete',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        'num0',
        'num1',
        'num2',
        'num3',
        'num4',
        'num5',
        'num6',
        'num7',
        'num8',
        'num9',
        '*',
        '+',
        '-',
        'numdel',
        '/',
        'f1',
        'f2',
        'f3',
        'f4',
        'f5',
        'f6',
        'f7',
        'f8',
        'f9',
        'f10',
        'f11',
        'f12',
        'numlock',
        'scrolllock',
        ';',
        'semicolon',
        'equal',
        '=',
        ',',
        'comma',
        'dash',
        '.',
        'period',
        'forwardslash',
        'grave',
        '[',
        'openbracket',
        'backslash',
        ']',
        'closebracket',
        'quote',
        'dpadLeft',
        'dpadRight',
        'dpadUp',
        'dpadDown',
        'dpadCenter',
    ];
    function getKeyCode(key) {
        return cc.macro.KEY[KeyboardList[key]];
    }
    lcc$nes.getKeyCode = getKeyCode;
    var ButtonMap = (function () {
        function ButtonMap() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.button = Button.A;
            this.key = Keyboard.w;
            this.button = args[0] || Button.A;
            this.key = args[1] || Keyboard.w;
        }
        __decorate([
            property({
                type: cc.Enum(Button),
                tooltip: "游戏按钮",
                readonly: true,
            })
        ], ButtonMap.prototype, "button", void 0);
        __decorate([
            property({
                type: cc.Enum(Keyboard),
                tooltip: "键盘按键"
            })
        ], ButtonMap.prototype, "key", void 0);
        ButtonMap = __decorate([
            ccclass("lcc$nes.ButtonMap")
        ], ButtonMap);
        return ButtonMap;
    }());
    lcc$nes.ButtonMap = ButtonMap;
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.player = Player.PLAYER_1;
            _this._buttons = [
                new ButtonMap(Button.A, Keyboard.j),
                new ButtonMap(Button.B, Keyboard.k),
                new ButtonMap(Button.SELECT, Keyboard.f),
                new ButtonMap(Button.START, Keyboard.h),
                new ButtonMap(Button.UP, Keyboard.w),
                new ButtonMap(Button.DOWN, Keyboard.s),
                new ButtonMap(Button.LEFT, Keyboard.a),
                new ButtonMap(Button.RIGHT, Keyboard.d)
            ];
            _this._nes = null;
            _this._keymap = null;
            return _this;
        }
        Object.defineProperty(Controller.prototype, "buttons", {
            get: function () {
                return this._buttons;
            },
            set: function (value) {
                if (this._buttons != value) {
                    this._buttons = value;
                    this.updateButtonMap();
                }
            },
            enumerable: false,
            configurable: true
        });
        Controller.prototype.onLoad = function () {
            this._nes = this.getComponent(lcc$nes.Emulator).getNES();
            this.updateButtonMap();
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            this.node.on("nes_button_event", this.onNodeButtonEvent, this);
        };
        Controller.prototype.onDestroy = function () {
            cc.systemEvent.targetOff(this);
            this.node.targetOff(this);
        };
        Controller.prototype.onNodeButtonEvent = function (player, button, down) {
            if (player == this.player) {
                this.onButtonEvent(button, down);
            }
        };
        Controller.prototype.onButtonEvent = function (button, down) {
            if (down) {
                this._nes.buttonDown(this.player, button);
            }
            else {
                this._nes.buttonUp(this.player, button);
            }
        };
        Controller.prototype.onKeyDown = function (event) {
            var button = this._keymap[event.keyCode];
            if (button != null) {
                this.onButtonEvent(button, true);
            }
        };
        Controller.prototype.onKeyUp = function (event) {
            var button = this._keymap[event.keyCode];
            if (button != null) {
                this.onButtonEvent(button, false);
            }
        };
        Controller.prototype.updateButtonMap = function () {
            this._keymap = {};
            for (var _i = 0, _a = this._buttons; _i < _a.length; _i++) {
                var b = _a[_i];
                this._keymap[getKeyCode(b.key)] = b.button;
            }
        };
        __decorate([
            property({
                type: cc.Enum(Player),
                tooltip: "玩家序号"
            })
        ], Controller.prototype, "player", void 0);
        __decorate([
            property([ButtonMap])
        ], Controller.prototype, "_buttons", void 0);
        __decorate([
            property({
                type: [ButtonMap],
                tooltip: "按键映射表"
            })
        ], Controller.prototype, "buttons", null);
        Controller = __decorate([
            ccclass("lcc$nes.Controller"),
            requireComponent(lcc$nes.Emulator),
            menu("i18n:lcc-nes.menu_component/Controller")
        ], Controller);
        return Controller;
    }(cc.Component));
    lcc$nes.Controller = Controller;
})(lcc$nes || (lcc$nes = {}));
var lcc$nes;
(function (lcc$nes) {
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, menu = _a.menu;
    var DisplaySprites = (function (_super) {
        __extends(DisplaySprites, _super);
        function DisplaySprites() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._sprites = [];
            _this._emulator = null;
            return _this;
        }
        Object.defineProperty(DisplaySprites.prototype, "sprites", {
            get: function () {
                return this._sprites;
            },
            set: function (value) {
                if (this._sprites != value) {
                    this._sprites = value;
                    this.setDisplaySprites(value);
                }
            },
            enumerable: false,
            configurable: true
        });
        DisplaySprites.prototype.onLoad = function () {
            this._emulator = this.getComponent(lcc$nes.Emulator);
            this.setDisplaySprites(this.sprites);
        };
        DisplaySprites.prototype.setDisplaySprites = function (sprites) {
            if (sprites && sprites.length > 0) {
                var spriteFrame = new cc.SpriteFrame(this._emulator.getTexture());
                for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
                    var sp_1 = sprites_1[_i];
                    sp_1.spriteFrame = spriteFrame;
                }
            }
        };
        __decorate([
            property([cc.Sprite])
        ], DisplaySprites.prototype, "_sprites", void 0);
        __decorate([
            property({
                type: [cc.Sprite],
                tooltip: "展示的Sprite数组"
            })
        ], DisplaySprites.prototype, "sprites", null);
        DisplaySprites = __decorate([
            ccclass("lcc$nes.DisplaySprites"),
            requireComponent(lcc$nes.Emulator),
            menu("i18n:lcc-nes.menu_component/DisplaySprites")
        ], DisplaySprites);
        return DisplaySprites;
    }(cc.Component));
    lcc$nes.DisplaySprites = DisplaySprites;
})(lcc$nes || (lcc$nes = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZyYW1ld29yay9zcmMvbmVzL0VtdWxhdG9yLnRzIiwiZnJhbWV3b3JrL3NyYy9GcmFtZXdvcmsudHMiLCJmcmFtZXdvcmsvc3JjL2NvbW1vbi9SaW5nQnVmZmVyLnRzIiwiZnJhbWV3b3JrL3NyYy9jb21tb24vVXRpbHMudHMiLCJmcmFtZXdvcmsvc3JjL25lcy9BdWRpb1BsYXllci50cyIsImZyYW1ld29yay9zcmMvbmVzL0NvbnRyb2xsZXIudHMiLCJmcmFtZXdvcmsvc3JjL25lcy9EaXNwbGF5U3ByaXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTyxPQUFPLENBaUxiO0FBakxELFdBQU8sT0FBTztJQUVSLElBQUEsS0FBNkIsRUFBRSxDQUFDLFVBQVUsRUFBekMsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFBLEVBQUUsSUFBSSxVQUFrQixDQUFDO0lBVWpELElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO0lBR25DLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFJakI7UUFBOEIsNEJBQVk7UUFBMUM7WUFBQSxxRUE0SkM7WUF6SkcsVUFBSSxHQUFtQixJQUFJLENBQUM7WUFnQi9CLGdCQUFVLEdBQVcsS0FBSyxDQUFDO1lBS2hCLGNBQVEsR0FBVyxLQUFLLENBQUM7WUFLekIsVUFBSSxHQUFPLElBQUksQ0FBQztZQUtoQixjQUFRLEdBQWdCLElBQUksQ0FBQztZQUs3QixnQkFBVSxHQUFlLElBQUksQ0FBQztZQUs5QixjQUFRLEdBQWMsSUFBSSxDQUFDO1lBSzlCLGVBQVMsR0FBZSxJQUFJLENBQUM7WUFLN0IsWUFBTSxHQUFlLElBQUksQ0FBQzs7UUFzR25DLENBQUM7UUFwSkEsc0JBQUkseUJBQUc7aUJBQVA7Z0JBQ0MsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2xCLENBQUM7aUJBQ0QsVUFBUSxLQUFvQjtnQkFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ2xCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsQ0FBQzs7O1dBSkg7UUFnREUseUJBQU0sR0FBTjtZQUNGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxRQUFBLFdBQVcsRUFBRSxDQUFDO1lBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN6QixPQUFPLEVBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN4QyxjQUFjLEVBQUcsRUFBRSxDQUFDLEdBQUc7Z0JBQ3ZCLFVBQVUsRUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtnQkFDeEMsYUFBYSxFQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ3pELENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDMUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEQsQ0FBQztRQUtPLGlDQUFjLEdBQXRCLFVBQXVCLE1BQWtCO1lBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO2dCQUN2QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDdEMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUVoQixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzlDO2FBQ0o7WUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RyxDQUFDO1FBS00seUJBQU0sR0FBYjtZQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixDQUFDO1FBS00sNkJBQVUsR0FBakI7WUFDSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDekIsQ0FBQztRQUtPLDZCQUFVLEdBQWxCLFVBQW1CLElBQW1CO1lBQ3hDLElBQUcsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksRUFBQztnQkFDMUIsSUFBRyxJQUFJLEVBQUM7b0JBRVAsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBQSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM3QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztpQkFDckI7YUFDRDtRQUNGLENBQUM7UUFLTSx3QkFBSyxHQUFaO1lBQ0MsSUFBRyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFDO2dCQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQzthQUN0QjtRQUNGLENBQUM7UUFFRSx5QkFBTSxHQUFOLFVBQU8sRUFBRTtZQUNMLElBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFDO2dCQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3JCO1FBQ0wsQ0FBQztRQUVELHdCQUFLLEdBQUw7WUFDSSxJQUFHLElBQUksQ0FBQyxVQUFVLEVBQUM7Z0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDOUI7UUFDUixDQUFDO1FBTU0sMkJBQVEsR0FBZjtZQUNDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3QixDQUFDO1FBTU0sNEJBQVMsR0FBaEIsVUFBaUIsQ0FBQztZQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBdEpFO1lBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7OENBQ0c7UUFLL0I7WUFKQyxRQUFRLENBQUM7Z0JBQ1QsSUFBSSxFQUFHLEVBQUUsQ0FBQyxXQUFXO2dCQUNyQixPQUFPLEVBQUcsUUFBUTthQUNsQixDQUFDOzJDQUdEO1FBU0Q7WUFIQyxRQUFRLENBQUM7Z0JBQ1QsT0FBTyxFQUFDLE1BQU07YUFDZCxDQUFDO29EQUN5QjtRQW5CZixRQUFRO1lBRnBCLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztZQUMzQixJQUFJLENBQUMsc0NBQXNDLENBQUM7V0FDaEMsUUFBUSxDQTRKcEI7UUFBRCxlQUFDO0tBNUpELEFBNEpDLENBNUo2QixFQUFFLENBQUMsU0FBUyxHQTRKekM7SUE1SlksZ0JBQVEsV0E0SnBCLENBQUE7QUFFRCxDQUFDLEVBakxNLE9BQU8sS0FBUCxPQUFPLFFBaUxiO0FDaExELE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FDRHpCLElBQU8sT0FBTyxDQWdLYjtBQWhLRCxXQUFPLE9BQU87SUFLZDtRQW1CQyxvQkFBWSxRQUFlLEVBQUUsU0FBbUI7WUFqQnhDLGNBQVMsR0FBUyxJQUFJLENBQUM7WUFDdkIsV0FBTSxHQUFVLENBQUMsQ0FBQztZQUNsQixVQUFLLEdBQVUsQ0FBQyxDQUFDO1lBQ2pCLFVBQUssR0FBVSxDQUFDLENBQUM7WUFDakIsZUFBVSxHQUFZLElBQUksQ0FBQztZQWNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7UUFDN0IsQ0FBQztRQVFNLDZCQUFRLEdBQWY7WUFDQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQzlCLENBQUM7UUFRTSx5QkFBSSxHQUFYO1lBQ0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ25CLENBQUM7UUFRTSw0QkFBTyxHQUFkO1lBQ0MsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFRTSwyQkFBTSxHQUFiO1lBQ0MsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hDLENBQUM7UUFTTSx5QkFBSSxHQUFYO1lBQ0MsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUMzRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFTTSwwQkFBSyxHQUFaLFVBQWEsS0FBWTtZQUN4QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFFN0UsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN6RCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFDeEIsT0FBTyxTQUFTLENBQUM7YUFDbkI7WUFDRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuRSxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckMsQ0FBQztRQVNNLHdCQUFHLEdBQVY7WUFDQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFMUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRWxELE9BQU8sT0FBTyxDQUFDO1FBQ2hCLENBQUM7UUFTTSx5QkFBSSxHQUFYLFVBQVksS0FBWTtZQUN2QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRWpDLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUV0RCxPQUFPLFFBQVEsQ0FBQztRQUNqQixDQUFDO1FBU00sd0JBQUcsR0FBVixVQUFXLE9BQVc7WUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzNELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtZQUN4QixJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDN0M7WUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7WUFFckMsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2FBQ25EO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNkO1lBRUQsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUNGLGlCQUFDO0lBQUQsQ0F6SkEsQUF5SkMsSUFBQTtJQXpKWSxrQkFBVSxhQXlKdEIsQ0FBQTtBQUVELENBQUMsRUFoS00sT0FBTyxLQUFQLE9BQU8sUUFnS2I7QUNoS0QsSUFBTyxPQUFPLENBaUJiO0FBakJELFdBQU8sT0FBTztJQUVkO1FBQUE7UUFhQSxDQUFDO1FBVE8sV0FBSyxHQUFaLFVBQWEsRUFBYztZQUMxQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDL0IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUM5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoQyxNQUFNLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUNELE9BQU8sTUFBTSxDQUFDO1FBQ2YsQ0FBQztRQUNGLFlBQUM7SUFBRCxDQWJBLEFBYUMsSUFBQTtJQWJZLGFBQUssUUFhakIsQ0FBQTtBQUVELENBQUMsRUFqQk0sT0FBTyxLQUFQLE9BQU8sUUFpQmI7QUNqQkQsSUFBTyxPQUFPLENBbUdiO0FBbkdELFdBQU8sT0FBTztJQUVkLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQztJQUt4QjtRQVVDO1lBTFEsWUFBTyxHQUFjLElBQUksQ0FBQztZQUUxQixjQUFTLEdBQWdCLElBQUksQ0FBQztZQUM5QixnQkFBVyxHQUF1QixJQUFJLENBQUM7WUFHOUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQUEsVUFBVSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBRUQsbUNBQWEsR0FBYjtZQUNDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO2dCQUN0QixPQUFPLEtBQUssQ0FBQzthQUNWO1lBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUMvQixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2xDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNkLE9BQU8sVUFBVSxDQUFDO1FBQ25CLENBQUM7UUFFRCwyQkFBSyxHQUFMO1lBQ0MsSUFBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUM7Z0JBRXBCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO29CQUN6QixPQUFPO2lCQUNQO2dCQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BFLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3JEO1FBQ0YsQ0FBQztRQUVLLDBCQUFJLEdBQVY7Ozs7OzRCQUNDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQ0FDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQ0FDeEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2dDQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs2QkFDMUI7aUNBQ0csSUFBSSxDQUFDLFNBQVMsRUFBZCxjQUFjOzRCQUNmLFdBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBQTs7NEJBQTVCLFNBQTRCLENBQUM7NEJBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOzs7Ozs7U0FFekI7UUFFRCxpQ0FBVyxHQUFYLFVBQVksSUFBSSxFQUFFLEtBQUs7WUFDdEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxVQUFVLEVBQUU7Z0JBRXhDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNwQztZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFBQSxDQUFDO1FBRUYsb0NBQWMsR0FBZCxVQUFlLENBQUM7WUFDZixJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBT3ZCLElBQUk7Z0JBQ0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzVDO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBS1gsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtpQkFFbkI7Z0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDWixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNiO2dCQUNELE9BQU87YUFDUDtZQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEM7UUFDRixDQUFDO1FBQUEsQ0FBQztRQUNILGtCQUFDO0lBQUQsQ0ExRkEsQUEwRkMsSUFBQTtJQTFGWSxtQkFBVyxjQTBGdkIsQ0FBQTtBQUVELENBQUMsRUFuR00sT0FBTyxLQUFQLE9BQU8sUUFtR2I7QUNsR0QsSUFBTyxPQUFPLENBZ1liO0FBaFlELFdBQU8sT0FBTztJQUVSLElBQUEsS0FBK0MsRUFBRSxDQUFDLFVBQVUsRUFBM0QsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFBLEVBQUUsZ0JBQWdCLHNCQUFBLEVBQUUsSUFBSSxVQUFrQixDQUFDO0lBS25FLElBQVksTUFHWDtJQUhELFdBQVksTUFBTTtRQUNkLDJDQUFZLENBQUE7UUFDWiwyQ0FBWSxDQUFBO0lBQ2hCLENBQUMsRUFIVyxNQUFNLEdBQU4sY0FBTSxLQUFOLGNBQU0sUUFHakI7SUFLRCxJQUFZLE1BU1g7SUFURCxXQUFZLE1BQU07UUFDZCw2QkFBVyxDQUFBO1FBQ1gsNkJBQVcsQ0FBQTtRQUNYLHVDQUFXLENBQUE7UUFDWCxxQ0FBVyxDQUFBO1FBQ1gsK0JBQVcsQ0FBQTtRQUNYLG1DQUFXLENBQUE7UUFDWCxtQ0FBVyxDQUFBO1FBQ1gscUNBQVcsQ0FBQTtJQUNmLENBQUMsRUFUVyxNQUFNLEdBQU4sY0FBTSxLQUFOLGNBQU0sUUFTakI7SUFLRCxJQUFZLFFBcUdYO0lBckdELFdBQVksUUFBUTtRQUNoQix1Q0FBUSxDQUFBO1FBQ1IsdUNBQUksQ0FBQTtRQUNKLGlEQUFTLENBQUE7UUFDVCxxQ0FBRyxDQUFBO1FBQ0gseUNBQUssQ0FBQTtRQUNMLHlDQUFLLENBQUE7UUFDTCx1Q0FBSSxDQUFBO1FBQ0oscUNBQUcsQ0FBQTtRQUNILHlDQUFLLENBQUE7UUFDTCwrQ0FBUSxDQUFBO1FBQ1IsNENBQU0sQ0FBQTtRQUNOLDBDQUFLLENBQUE7UUFDTCw0Q0FBTSxDQUFBO1FBQ04sZ0RBQVEsQ0FBQTtRQUNSLHNDQUFHLENBQUE7UUFDSCx3Q0FBSSxDQUFBO1FBQ0osd0NBQUksQ0FBQTtRQUNKLG9DQUFFLENBQUE7UUFDRiwwQ0FBSyxDQUFBO1FBQ0wsd0NBQUksQ0FBQTtRQUNKLDRDQUFNLENBQUE7UUFDTiw0Q0FBTSxDQUFBO1FBQ04sNENBQU0sQ0FBQTtRQUNOLGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsa0NBQUMsQ0FBQTtRQUNELGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsa0NBQUMsQ0FBQTtRQUNELGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsa0NBQUMsQ0FBQTtRQUNELGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsa0NBQUMsQ0FBQTtRQUNELGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsa0NBQUMsQ0FBQTtRQUNELGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsa0NBQUMsQ0FBQTtRQUNELGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsa0NBQUMsQ0FBQTtRQUNELGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsa0NBQUMsQ0FBQTtRQUNELGtDQUFDLENBQUE7UUFDRCxrQ0FBQyxDQUFBO1FBQ0Qsd0NBQUksQ0FBQTtRQUNKLHdDQUFJLENBQUE7UUFDSix3Q0FBSSxDQUFBO1FBQ0osd0NBQUksQ0FBQTtRQUNKLHdDQUFJLENBQUE7UUFDSix3Q0FBSSxDQUFBO1FBQ0osd0NBQUksQ0FBQTtRQUNKLHdDQUFJLENBQUE7UUFDSix3Q0FBSSxDQUFBO1FBQ0osd0NBQUksQ0FBQTtRQUNKLGtDQUFHLENBQUE7UUFDSCxrQ0FBRyxDQUFBO1FBQ0gsa0NBQUcsQ0FBQTtRQUNILDRDQUFNLENBQUE7UUFDTixrQ0FBRyxDQUFBO1FBQ0gsb0NBQUUsQ0FBQTtRQUNGLG9DQUFFLENBQUE7UUFDRixvQ0FBRSxDQUFBO1FBQ0Ysb0NBQUUsQ0FBQTtRQUNGLG9DQUFFLENBQUE7UUFDRixvQ0FBRSxDQUFBO1FBQ0Ysb0NBQUUsQ0FBQTtRQUNGLG9DQUFFLENBQUE7UUFDRixvQ0FBRSxDQUFBO1FBQ0Ysc0NBQUcsQ0FBQTtRQUNILHNDQUFHLENBQUE7UUFDSCxzQ0FBRyxDQUFBO1FBQ0gsOENBQU8sQ0FBQTtRQUNQLG9EQUFVLENBQUE7UUFDVixrQ0FBRyxDQUFBO1FBQ0gsa0RBQVMsQ0FBQTtRQUNULDBDQUFLLENBQUE7UUFDTCxrQ0FBRyxDQUFBO1FBQ0gsa0NBQUcsQ0FBQTtRQUNILDBDQUFLLENBQUE7UUFDTCx3Q0FBSSxDQUFBO1FBQ0osa0NBQUcsQ0FBQTtRQUNILDRDQUFNLENBQUE7UUFDTix3REFBWSxDQUFBO1FBQ1osMENBQUssQ0FBQTtRQUNMLGtDQUFHLENBQUE7UUFDSCxzREFBVyxDQUFBO1FBQ1gsa0RBQVMsQ0FBQTtRQUNULGtDQUFHLENBQUE7UUFDSCx3REFBWSxDQUFBO1FBQ1osMENBQUssQ0FBQTtRQUNMLGdEQUFRLENBQUE7UUFDUixrREFBUyxDQUFBO1FBQ1QsNENBQU0sQ0FBQTtRQUNOLGdEQUFRLENBQUE7UUFDUixvREFBVSxDQUFBO0lBQ2QsQ0FBQyxFQXJHVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQXFHbkI7SUFLRCxJQUFNLFlBQVksR0FBRztRQUNqQixNQUFNO1FBQ04sTUFBTTtRQUNOLFdBQVc7UUFDWCxLQUFLO1FBQ0wsT0FBTztRQUNQLE9BQU87UUFDUCxNQUFNO1FBQ04sS0FBSztRQUNMLE9BQU87UUFDUCxVQUFVO1FBQ1YsUUFBUTtRQUNSLE9BQU87UUFDUCxRQUFRO1FBQ1IsVUFBVTtRQUNWLEtBQUs7UUFDTCxNQUFNO1FBQ04sTUFBTTtRQUNOLElBQUk7UUFDSixPQUFPO1FBQ1AsTUFBTTtRQUNOLFFBQVE7UUFDUixRQUFRO1FBQ1IsUUFBUTtRQUNSLEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILEdBQUc7UUFDSCxHQUFHO1FBQ0gsTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLE1BQU07UUFDTixNQUFNO1FBQ04sTUFBTTtRQUNOLEdBQUc7UUFDSCxHQUFHO1FBQ0gsR0FBRztRQUNILFFBQVE7UUFDUixHQUFHO1FBQ0gsSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osSUFBSTtRQUNKLElBQUk7UUFDSixJQUFJO1FBQ0osS0FBSztRQUNMLEtBQUs7UUFDTCxLQUFLO1FBQ0wsU0FBUztRQUNULFlBQVk7UUFDWixHQUFHO1FBQ0gsV0FBVztRQUNYLE9BQU87UUFDUCxHQUFHO1FBQ0gsR0FBRztRQUNILE9BQU87UUFDUCxNQUFNO1FBQ04sR0FBRztRQUNILFFBQVE7UUFDUixjQUFjO1FBQ2QsT0FBTztRQUNQLEdBQUc7UUFDSCxhQUFhO1FBQ2IsV0FBVztRQUNYLEdBQUc7UUFDSCxjQUFjO1FBQ2QsT0FBTztRQUNQLFVBQVU7UUFDVixXQUFXO1FBQ1gsUUFBUTtRQUNSLFVBQVU7UUFDVixZQUFZO0tBQ2YsQ0FBQTtJQU1ELFNBQWdCLFVBQVUsQ0FBQyxHQUFZO1FBQ25DLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUZlLGtCQUFVLGFBRXpCLENBQUE7SUFHRDtRQWNJO1lBQVksY0FBYTtpQkFBYixVQUFhLEVBQWIscUJBQWEsRUFBYixJQUFhO2dCQUFiLHlCQUFhOztZQVJ6QixXQUFNLEdBQVUsTUFBTSxDQUFDLENBQUMsQ0FBQztZQU16QixRQUFHLEdBQWEsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUd2QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQVhEO1lBTEMsUUFBUSxDQUFDO2dCQUNOLElBQUksRUFBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDdEIsT0FBTyxFQUFHLE1BQU07Z0JBQ2hCLFFBQVEsRUFBRyxJQUFJO2FBQ2xCLENBQUM7aURBQ3VCO1FBTXpCO1lBSkMsUUFBUSxDQUFDO2dCQUNOLElBQUksRUFBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDeEIsT0FBTyxFQUFHLE1BQU07YUFDbkIsQ0FBQzs4Q0FDeUI7UUFabEIsU0FBUztZQURyQixPQUFPLENBQUMsbUJBQW1CLENBQUM7V0FDaEIsU0FBUyxDQWtCckI7UUFBRCxnQkFBQztLQWxCRCxBQWtCQyxJQUFBO0lBbEJZLGlCQUFTLFlBa0JyQixDQUFBO0lBS0Q7UUFBZ0MsOEJBQVk7UUFBNUM7WUFBQSxxRUFnSEM7WUExR0csWUFBTSxHQUFVLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFHaEMsY0FBUSxHQUFlO2dCQUNuQixJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUMxQyxDQUFDO1lBa0JNLFVBQUksR0FBTyxJQUFJLENBQUM7WUFLaEIsYUFBTyxHQUF5QixJQUFJLENBQUM7O1FBdUVqRCxDQUFDO1FBekZHLHNCQUFJLCtCQUFPO2lCQUFYO2dCQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN6QixDQUFDO2lCQUNELFVBQVksS0FBaUI7Z0JBQy9CLElBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLEVBQUM7b0JBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO29CQUN0QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7aUJBQ3ZCO1lBQ0MsQ0FBQzs7O1dBTkE7UUFvQkQsMkJBQU0sR0FBTjtZQUNGLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFBLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUVELDhCQUFTLEdBQVQ7WUFDSSxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBUU8sc0NBQWlCLEdBQXpCLFVBQTBCLE1BQWEsRUFBRSxNQUFhLEVBQUUsSUFBWTtZQUNoRSxJQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFDO2dCQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNwQztRQUNMLENBQUM7UUFLRCxrQ0FBYSxHQUFiLFVBQWMsTUFBYSxFQUFFLElBQVk7WUFDM0MsSUFBRyxJQUFJLEVBQUM7Z0JBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQzthQUMxQztpQkFBSTtnQkFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3hDO1FBQ0MsQ0FBQztRQUtPLDhCQUFTLEdBQWpCLFVBQWtCLEtBQTRCO1lBQzFDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLElBQUcsTUFBTSxJQUFJLElBQUksRUFBQztnQkFDdkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDM0I7UUFDTCxDQUFDO1FBS08sNEJBQU8sR0FBZixVQUFnQixLQUE0QjtZQUN4QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN6QyxJQUFHLE1BQU0sSUFBSSxJQUFJLEVBQUM7Z0JBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzVCO1FBQ0wsQ0FBQztRQUtPLG9DQUFlLEdBQXZCO1lBQ0ksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEIsS0FBYyxVQUFhLEVBQWIsS0FBQSxJQUFJLENBQUMsUUFBUSxFQUFiLGNBQWEsRUFBYixJQUFhLEVBQUM7Z0JBQXZCLElBQUksQ0FBQyxTQUFBO2dCQUNOLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7YUFDOUM7UUFDTCxDQUFDO1FBdkdEO1lBSkMsUUFBUSxDQUFDO2dCQUNOLElBQUksRUFBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDdEIsT0FBTyxFQUFHLE1BQU07YUFDbkIsQ0FBQztrREFDOEI7UUFHaEM7WUFEQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztvREFVcEI7UUFLRjtZQUpDLFFBQVEsQ0FBQztnQkFDTixJQUFJLEVBQUcsQ0FBQyxTQUFTLENBQUM7Z0JBQ2xCLE9BQU8sRUFBRyxPQUFPO2FBQ3BCLENBQUM7aURBR0Q7UUF6QlEsVUFBVTtZQUh0QixPQUFPLENBQUMsb0JBQW9CLENBQUM7WUFDN0IsZ0JBQWdCLENBQUMsUUFBQSxRQUFRLENBQUM7WUFDMUIsSUFBSSxDQUFDLHdDQUF3QyxDQUFDO1dBQ2xDLFVBQVUsQ0FnSHRCO1FBQUQsaUJBQUM7S0FoSEQsQUFnSEMsQ0FoSCtCLEVBQUUsQ0FBQyxTQUFTLEdBZ0gzQztJQWhIWSxrQkFBVSxhQWdIdEIsQ0FBQTtBQUVELENBQUMsRUFoWU0sT0FBTyxLQUFQLE9BQU8sUUFnWWI7QUNoWUQsSUFBTyxPQUFPLENBcURiO0FBckRELFdBQU8sT0FBTztJQUVSLElBQUEsS0FBK0MsRUFBRSxDQUFDLFVBQVUsRUFBM0QsT0FBTyxhQUFBLEVBQUUsUUFBUSxjQUFBLEVBQUUsZ0JBQWdCLHNCQUFBLEVBQUUsSUFBSSxVQUFrQixDQUFDO0lBS25FO1FBQW9DLGtDQUFZO1FBQWhEO1lBQUEscUVBNENDO1lBekNHLGNBQVEsR0FBZ0IsRUFBRSxDQUFDO1lBa0JuQixlQUFTLEdBQVksSUFBSSxDQUFDOztRQXVCdEMsQ0FBQztRQXBDQSxzQkFBSSxtQ0FBTztpQkFBWDtnQkFDQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDdEIsQ0FBQztpQkFDRCxVQUFZLEtBQWlCO2dCQUM1QixJQUFHLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxFQUFDO29CQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztvQkFDdEIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUM5QjtZQUNDLENBQUM7OztXQU5IO1FBZUUsK0JBQU0sR0FBTjtZQUNJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFBLFFBQVEsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQU1PLDBDQUFpQixHQUF6QixVQUEwQixPQUFtQjtZQUN6QyxJQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQztnQkFDN0IsSUFBSSxXQUFXLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztnQkFDbEUsS0FBYyxVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU8sRUFBQztvQkFBbEIsSUFBSSxJQUFFLGdCQUFBO29CQUNOLElBQUUsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO2lCQUNoQzthQUNKO1FBQ0wsQ0FBQztRQXRDRDtZQURDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3REFDSztRQUs5QjtZQUpDLFFBQVEsQ0FBQztnQkFDVCxJQUFJLEVBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDO2dCQUNsQixPQUFPLEVBQUcsYUFBYTthQUN2QixDQUFDO3FEQUdEO1FBVlcsY0FBYztZQUgxQixPQUFPLENBQUMsd0JBQXdCLENBQUM7WUFDakMsZ0JBQWdCLENBQUMsUUFBQSxRQUFRLENBQUM7WUFDMUIsSUFBSSxDQUFDLDRDQUE0QyxDQUFDO1dBQ3RDLGNBQWMsQ0E0QzFCO1FBQUQscUJBQUM7S0E1Q0QsQUE0Q0MsQ0E1Q21DLEVBQUUsQ0FBQyxTQUFTLEdBNEMvQztJQTVDWSxzQkFBYyxpQkE0QzFCLENBQUE7QUFFRCxDQUFDLEVBckRNLE9BQU8sS0FBUCxPQUFPLFFBcURiIiwiZmlsZSI6ImxjYy1uZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxubW9kdWxlIGxjYyRuZXMge1xyXG5cclxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5LCBtZW51IH0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuLyoqXHJcbiAqIGpzbmVz5bqTXHJcbiAqL1xyXG5kZWNsYXJlIGxldCBqc25lczphbnk7XHJcblxyXG4vKipcclxuICog5bin5aSn5bCPXHJcbiAqL1xyXG5jb25zdCBGUkFNRVNJWkUgPSBjYy5zaXplKDI1NiwyNDApO1xyXG5cclxuLy9AdHMtaWdub3JlXHJcbmxldCBnZnggPSBjYy5nZng7XHJcblxyXG5AY2NjbGFzcyhcImxjYyRuZXMuRW11bGF0b3JcIilcclxuQG1lbnUoXCJpMThuOmxjYy1uZXMubWVudV9jb21wb25lbnQvRW11bGF0b3JcIilcclxuZXhwb3J0IGNsYXNzIEVtdWxhdG9yIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoY2MuQnVmZmVyQXNzZXQpXHJcbiAgICBfcm9tOiBjYy5CdWZmZXJBc3NldCA9IG51bGw7XHJcblx0QHByb3BlcnR5KHtcclxuXHRcdHR5cGUgOiBjYy5CdWZmZXJBc3NldCxcclxuXHRcdHRvb2x0aXAgOiBcIlJPTSDmlbDmja5cIlxyXG5cdH0pXHJcblx0Z2V0IHJvbSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3JvbTtcclxuXHR9XHJcblx0c2V0IHJvbSh2YWx1ZTpjYy5CdWZmZXJBc3NldCl7XHJcblx0XHR0aGlzLl9yb20gPSB2YWx1ZTtcclxuXHRcdHRoaXMuc2V0Um9tRGF0YSh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG5cdEBwcm9wZXJ0eSh7XHJcblx0XHR0b29sdGlwOlwi56uL5Y2z5pKt5pS+XCJcclxuXHR9KVxyXG5cdHBsYXlPbkxvYWQ6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YeG5aSH5aW9XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX3ByZXBhcmU6Ym9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTkVTIOWvueixoVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9uZXM6YW55ID0gbnVsbDtcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDnurnnkIblr7nosaFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfdGV4dHVyZTpjYy5UZXh0dXJlMkQgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog57q555CG57yT5YayXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2ZyYW1lYnVmZjpBcnJheUJ1ZmZlciA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnvJPlhrIgVWludDjop4blm75cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZnJhbWV1ODpVaW50OEFycmF5ID0gbnVsbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOe8k+WGsiBVaW50MzLop4blm75cclxuICAgICAqL1xyXG5cdHByaXZhdGUgX2ZyYW1ldTMyOlVpbnQzMkFycmF5ID0gbnVsbDtcclxuXHRcclxuXHQvKipcclxuXHQgKiDpn7PpopHmkq3mlL7lmahcclxuXHQgKi9cclxuXHRwcml2YXRlIF9hdWRpbzpBdWRpb1BsYXllciA9IG51bGw7XHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuXHRcdHRoaXMuX2F1ZGlvID0gbmV3IEF1ZGlvUGxheWVyKCk7XHJcblx0XHR0aGlzLl9uZXMgPSBuZXcganNuZXMuTkVTKHtcclxuXHRcdFx0b25GcmFtZSA6IHRoaXMuc2V0RnJhbWVCdWZmZXIuYmluZCh0aGlzKSxcclxuXHRcdFx0b25TdGF0dXNVcGRhdGUgOiBjYy5sb2csXHJcblx0XHRcdHNhbXBsZVJhdGUgOiB0aGlzLl9hdWRpby5nZXRTYW1wbGVSYXRlKCksXHJcblx0XHRcdG9uQXVkaW9TYW1wbGUgOiB0aGlzLl9hdWRpby53cml0ZVNhbXBsZS5iaW5kKHRoaXMuX2F1ZGlvKSxcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5fdGV4dHVyZSA9IG5ldyBjYy5UZXh0dXJlMkQoKTtcclxuXHRcdHRoaXMuX2ZyYW1lYnVmZiA9IG5ldyBBcnJheUJ1ZmZlcihGUkFNRVNJWkUud2lkdGggKiBGUkFNRVNJWkUuaGVpZ2h0ICogNCk7XHJcblx0XHR0aGlzLl9mcmFtZXU4ID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fZnJhbWVidWZmKTtcclxuXHRcdHRoaXMuX2ZyYW1ldTMyID0gbmV3IFVpbnQzMkFycmF5KHRoaXMuX2ZyYW1lYnVmZik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7luKfnvJPlhrJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzZXRGcmFtZUJ1ZmZlcihidWZmZXI6QXJyYXlCdWZmZXIpe1xyXG4gICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IEZSQU1FU0laRS5oZWlnaHQ7ICsreSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IEZSQU1FU0laRS53aWR0aDsgKyt4KSB7XHJcbiAgICAgICAgICAgICAgICBpID0geSAqIDI1NiArIHg7XHJcbiAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHBpeGVsIGZyb20gTkVTIEJHUiB0byBjYW52YXMgQUJHUlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnJhbWV1MzJbaV0gPSAweGZmMDAwMDAwIHwgYnVmZmVyW2ldOyAvLyBGdWxsIGFscGhhXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX3RleHR1cmUuaW5pdFdpdGhEYXRhKHRoaXMuX2ZyYW1ldTgsIGdmeC5URVhUVVJFX0ZNVF9SR0JBOCwgRlJBTUVTSVpFLndpZHRoLCBGUkFNRVNJWkUuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+W+l05FU+WvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TkVTKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25lcztcclxuICAgIH1cclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflvpfnurnnkIblr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFRleHR1cmUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiuvue9rlJPTeaVsOaNrlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHNldFJvbURhdGEoZGF0YTpjYy5CdWZmZXJBc3NldCl7XHJcblx0XHRpZighQ0NfRURJVE9SICYmIHRoaXMuX25lcyl7XHJcblx0XHRcdGlmKGRhdGEpe1xyXG5cdFx0XHRcdC8vIEB0cy1pZ25vcmVcclxuXHRcdFx0XHR0aGlzLl9uZXMubG9hZFJPTShVdGlscy5hYjJicyhkYXRhLl9idWZmZXIpKTtcclxuXHRcdFx0XHR0aGlzLl9hdWRpby5zdGFydCgpO1xyXG5cdFx0XHRcdHRoaXMuX3ByZXBhcmUgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdC8qKlxyXG5cdCAqIOmHjee9rlxyXG5cdCAqL1xyXG5cdHB1YmxpYyByZXNldCgpe1xyXG5cdFx0aWYoIUNDX0VESVRPUiAmJiB0aGlzLl9uZXMpe1xyXG5cdFx0XHR0aGlzLl9uZXMucmVzZXQoKTtcclxuXHRcdFx0dGhpcy5fYXVkaW8uc3RvcCgpO1xyXG5cdFx0XHR0aGlzLl9wcmVwYXJlID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG4gICAgXHJcbiAgICB1cGRhdGUoZHQpe1xyXG4gICAgICAgIGlmKHRoaXMuX25lcyAmJiB0aGlzLl9wcmVwYXJlKXtcclxuICAgICAgICAgICAgdGhpcy5fbmVzLmZyYW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cdFxyXG4gICAgc3RhcnQgKCkge1xyXG4gICAgICAgIGlmKHRoaXMucGxheU9uTG9hZCl7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0Um9tRGF0YSh0aGlzLl9yb20pO1xyXG4gICAgICAgIH1cclxuXHR9XHJcblx0XHJcblx0LyoqXHJcblx0ICog6I635b6X54q25oCBXHJcblx0ICogQHJldHVybnMg5a2Y5qGjSlNPTuaVsOaNrlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRTdGF0ZSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX25lcy5nZXRTdGF0ZSgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICog5Yqg6L2954q25oCBXHJcblx0ICogQHBhcmFtIGpzb24g5a2Y5qGjSlNPTuaVsOaNrlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBsb2FkU3RhdGUocyl7XHJcblx0XHR0aGlzLl9uZXMubG9hZFN0YXRlKHMpO1xyXG5cdH1cclxuICAgIFxyXG4gICAgLy8gdXBkYXRlIChkdCkge31cclxufVxyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoID0gXCIuL25lcy9FbXVsYXRvci50c1wiIC8+XHJcblxyXG53aW5kb3cubGNjJG5lcyA9IGxjYyRuZXM7XHJcbiIsIlxyXG5tb2R1bGUgbGNjJG5lcyB7XHJcblxyXG4vKipcclxuICog546v5b2i57yT5Yay5Yy6XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmluZ0J1ZmZlciAge1xyXG5cdFxyXG5cdHByaXZhdGUgX2VsZW1lbnRzOmFueVtdID0gbnVsbDtcclxuXHRwcml2YXRlIF9maXJzdDpudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX2xhc3Q6bnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9zaXplOm51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfZXZpY3RlZENiOkZ1bmN0aW9uID0gbnVsbDtcclxuXHJcblx0LyoqXHJcblx0ICogSW5pdGlhbGl6ZXMgYSBuZXcgZW1wdHkgYFJpbmdCdWZmZXJgIHdpdGggdGhlIGdpdmVuIGBjYXBhY2l0eWAsIHdoZW4gbm9cclxuXHQgKiB2YWx1ZSBpcyBwcm92aWRlZCB1c2VzIHRoZSBkZWZhdWx0IGNhcGFjaXR5ICg1MCkuXHJcblx0ICpcclxuXHQgKiBJZiBwcm92aWRlZCwgYGV2aWN0ZWRDYmAgZ2V0cyBydW4gd2l0aCBhbnkgZXZpY3RlZCBlbGVtZW50cy5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB7TnVtYmVyfVxyXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259XHJcblx0ICogQHJldHVybiB7UmluZ0J1ZmZlcn1cclxuXHQgKiBAYXBpIHB1YmxpY1xyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKGNhcGFjaXR5Om51bWJlciwgZXZpY3RlZENiPzpGdW5jdGlvbil7XHJcblx0XHR0aGlzLl9lbGVtZW50cyA9IG5ldyBBcnJheShjYXBhY2l0eSB8fCA1MCk7XHJcblx0XHR0aGlzLl9maXJzdCA9IDA7XHJcblx0XHR0aGlzLl9sYXN0ID0gMDtcclxuXHRcdHRoaXMuX3NpemUgPSAwO1xyXG5cdFx0dGhpcy5fZXZpY3RlZENiID0gZXZpY3RlZENiO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgY2FwYWNpdHkgb2YgdGhlIHJpbmcgYnVmZmVyLlxyXG5cdCAqXHJcblx0ICogQHJldHVybiB7TnVtYmVyfVxyXG5cdCAqIEBhcGkgcHVibGljXHJcblx0ICovXHJcblx0cHVibGljIGNhcGFjaXR5KCl7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudHMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgc2l6ZSBvZiB0aGUgcXVldWUuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcblx0ICogQGFwaSBwdWJsaWNcclxuXHQgKi9cclxuXHRwdWJsaWMgc2l6ZSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NpemU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIHJpbmcgYnVmZmVyIGlzIGVtcHR5IG9yIG5vdC5cclxuXHQgKlxyXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XHJcblx0ICogQGFwaSBwdWJsaWNcclxuXHQgKi9cclxuXHRwdWJsaWMgaXNFbXB0eSgpe1xyXG5cdFx0cmV0dXJuIHRoaXMuc2l6ZSgpID09PSAwO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB3aGV0aGVyIHRoZSByaW5nIGJ1ZmZlciBpcyBmdWxsIG9yIG5vdC5cclxuXHQgKlxyXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XHJcblx0ICogQGFwaSBwdWJsaWNcclxuXHQgKi9cclxuXHRwdWJsaWMgaXNGdWxsKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5zaXplKCkgPT09IHRoaXMuY2FwYWNpdHkoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFBlZWtzIGF0IHRoZSB0b3AgZWxlbWVudCBvZiB0aGUgcXVldWUuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtPYmplY3R9XHJcblx0ICogQHRocm93cyB7RXJyb3J9IHdoZW4gdGhlIHJpbmcgYnVmZmVyIGlzIGVtcHR5LlxyXG5cdCAqIEBhcGkgcHVibGljXHJcblx0ICovXHJcblx0cHVibGljIHBlZWsoKXtcclxuXHRcdGlmICh0aGlzLmlzRW1wdHkoKSkgdGhyb3cgbmV3IEVycm9yKCdSaW5nQnVmZmVyIGlzIGVtcHR5Jyk7XHJcblx0XHRyZXR1cm4gdGhpcy5fZWxlbWVudHNbdGhpcy5fZmlyc3RdO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUGVla3MgYXQgbXVsdGlwbGUgZWxlbWVudHMgaW4gdGhlIHF1ZXVlLlxyXG5cdCAqXHJcblx0ICogQHJldHVybiB7QXJyYXl9XHJcblx0ICogQHRocm93cyB7RXJyb3J9IHdoZW4gdGhlcmUgYXJlIG5vdCBlbm91Z2ggZWxlbWVudHMgaW4gdGhlIGJ1ZmZlci5cclxuXHQgKiBAYXBpIHB1YmxpY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBwZWVrTihjb3VudDpudW1iZXIpe1xyXG5cdFx0aWYgKGNvdW50ID4gdGhpcy5fc2l6ZSkgdGhyb3cgbmV3IEVycm9yKCdOb3QgZW5vdWdoIGVsZW1lbnRzIGluIFJpbmdCdWZmZXInKTtcclxuXHJcblx0XHRsZXQgZW5kID0gTWF0aC5taW4odGhpcy5fZmlyc3QgKyBjb3VudCwgdGhpcy5jYXBhY2l0eSgpKTtcclxuXHRcdGxldCBmaXJzdEhhbGYgPSB0aGlzLl9lbGVtZW50cy5zbGljZSh0aGlzLl9maXJzdCwgZW5kKTtcclxuXHRcdGlmIChlbmQgPCB0aGlzLmNhcGFjaXR5KCkpIHtcclxuXHRcdCAgXHRyZXR1cm4gZmlyc3RIYWxmO1xyXG5cdFx0fVxyXG5cdFx0bGV0IHNlY29uZEhhbGYgPSB0aGlzLl9lbGVtZW50cy5zbGljZSgwLCBjb3VudCAtIGZpcnN0SGFsZi5sZW5ndGgpO1xyXG5cdFx0cmV0dXJuIGZpcnN0SGFsZi5jb25jYXQoc2Vjb25kSGFsZik7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEZXF1ZXVlcyB0aGUgdG9wIGVsZW1lbnQgb2YgdGhlIHF1ZXVlLlxyXG5cdCAqXHJcblx0ICogQHJldHVybiB7T2JqZWN0fVxyXG5cdCAqIEB0aHJvd3Mge0Vycm9yfSB3aGVuIHRoZSByaW5nIGJ1ZmZlciBpcyBlbXB0eS5cclxuXHQgKiBAYXBpIHB1YmxpY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBkZXEoKXtcclxuXHRcdGxldCBlbGVtZW50ID0gdGhpcy5wZWVrKCk7XHJcblxyXG5cdFx0dGhpcy5fc2l6ZS0tO1xyXG5cdFx0dGhpcy5fZmlyc3QgPSAodGhpcy5fZmlyc3QgKyAxKSAlIHRoaXMuY2FwYWNpdHkoKTtcclxuXHQgIFxyXG5cdFx0cmV0dXJuIGVsZW1lbnQ7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBEZXF1ZXVlcyBtdWx0aXBsZSBlbGVtZW50cyBvZiB0aGUgcXVldWUuXHJcblx0ICpcclxuXHQgKiBAcmV0dXJuIHtBcnJheX1cclxuXHQgKiBAdGhyb3dzIHtFcnJvcn0gd2hlbiB0aGVyZSBhcmUgbm90IGVub3VnaCBlbGVtZW50cyBpbiB0aGUgYnVmZmVyLlxyXG5cdCAqIEBhcGkgcHVibGljXHJcblx0ICovXHJcblx0cHVibGljIGRlcU4oY291bnQ6bnVtYmVyKXtcclxuXHRcdGxldCBlbGVtZW50cyA9IHRoaXMucGVla04oY291bnQpO1xyXG5cclxuXHRcdHRoaXMuX3NpemUgLT0gY291bnQ7XHJcblx0XHR0aGlzLl9maXJzdCA9ICh0aGlzLl9maXJzdCArIGNvdW50KSAlIHRoaXMuY2FwYWNpdHkoKTtcclxuXHQgIFxyXG5cdFx0cmV0dXJuIGVsZW1lbnRzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRW5xdWV1ZXMgdGhlIGBlbGVtZW50YCBhdCB0aGUgZW5kIG9mIHRoZSByaW5nIGJ1ZmZlciBhbmQgcmV0dXJucyBpdHMgbmV3IHNpemUuXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxyXG5cdCAqIEByZXR1cm4ge051bWJlcn1cclxuXHQgKiBAYXBpIHB1YmxpY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBlbnEoZWxlbWVudDphbnkpe1xyXG5cdFx0dGhpcy5fbGFzdCA9ICh0aGlzLl9maXJzdCArIHRoaXMuc2l6ZSgpKSAlIHRoaXMuY2FwYWNpdHkoKTtcclxuXHRcdGxldCBmdWxsID0gdGhpcy5pc0Z1bGwoKVxyXG5cdFx0aWYgKGZ1bGwgJiYgdGhpcy5fZXZpY3RlZENiKSB7XHJcblx0XHQgIHRoaXMuX2V2aWN0ZWRDYih0aGlzLl9lbGVtZW50c1t0aGlzLl9sYXN0XSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9lbGVtZW50c1t0aGlzLl9sYXN0XSA9IGVsZW1lbnQ7XHJcblx0ICBcclxuXHRcdGlmIChmdWxsKSB7XHJcblx0XHQgIHRoaXMuX2ZpcnN0ID0gKHRoaXMuX2ZpcnN0ICsgMSkgJSB0aGlzLmNhcGFjaXR5KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0ICB0aGlzLl9zaXplKys7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB0aGlzLnNpemUoKTtcclxuXHR9XHJcbn1cclxuXHJcbn1cclxuIiwiXHJcbm1vZHVsZSBsY2MkbmVzIHtcclxuXHJcbmV4cG9ydCBjbGFzcyBVdGlscyB7XHJcblx0LyoqXHJcblx0ICogQXJyYXlCdWZmZXIg6L2sIGJpbmFyeSBzdHJpbmdcclxuXHQgKi9cclxuXHRzdGF0aWMgYWIyYnMoYWI6QXJyYXlCdWZmZXIpe1xyXG5cdFx0bGV0IGJpbmFyeSA9IFwiXCI7XHJcblx0XHRsZXQgYnl0ZXMgPSBuZXcgVWludDhBcnJheShhYik7XHJcblx0XHRsZXQgbGVuZ3RoID0gYnl0ZXMuYnl0ZUxlbmd0aDtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0YmluYXJ5ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGJpbmFyeTtcclxuXHR9XHJcbn1cclxuXHJcbn1cclxuIiwiXHJcbm1vZHVsZSBsY2MkbmVzIHtcclxuXHJcbmNvbnN0IEJVRkZFUlNJWkUgPSA4MTkyO1xyXG5cclxuLyoqXHJcbiAqIOmfs+mikeaSreaUvuWZqFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEF1ZGlvUGxheWVyIHtcclxuXHJcblx0LyoqXHJcblx0ICog57yT5Yay5Yy6XHJcblx0ICovXHJcblx0cHJpdmF0ZSBfYnVmZmVyOlJpbmdCdWZmZXIgPSBudWxsO1xyXG5cclxuXHRwcml2YXRlIF9hdWRpb0N0eDpBdWRpb0NvbnRleHQgPSBudWxsO1xyXG5cdHByaXZhdGUgX3NjcmlwdE5vZGU6U2NyaXB0UHJvY2Vzc29yTm9kZSA9IG51bGw7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLl9idWZmZXIgPSBuZXcgUmluZ0J1ZmZlcihCVUZGRVJTSVpFICogMik7XHJcblx0fVxyXG5cdFxyXG5cdGdldFNhbXBsZVJhdGUoKSB7XHJcblx0XHRpZiAoIXdpbmRvdy5BdWRpb0NvbnRleHQpIHtcclxuXHRcdCAgICByZXR1cm4gNDQxMDA7XHJcbiAgICAgICAgfVxyXG5cdFx0bGV0IG15Q3R4ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xyXG5cdFx0bGV0IHNhbXBsZVJhdGUgPSBteUN0eC5zYW1wbGVSYXRlO1xyXG5cdFx0bXlDdHguY2xvc2UoKTtcclxuXHRcdHJldHVybiBzYW1wbGVSYXRlO1xyXG5cdH1cclxuICAgIFxyXG5cdHN0YXJ0KCkge1xyXG5cdFx0aWYoIXRoaXMuX3NjcmlwdE5vZGUpe1xyXG5cdFx0XHQvLyBBdWRpbyBpcyBub3Qgc3VwcG9ydGVkXHJcblx0XHRcdGlmICghd2luZG93LkF1ZGlvQ29udGV4dCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLl9hdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuXHRcdFx0dGhpcy5fc2NyaXB0Tm9kZSA9IHRoaXMuX2F1ZGlvQ3R4LmNyZWF0ZVNjcmlwdFByb2Nlc3NvcigxMDI0LCAwLCAyKTtcclxuXHRcdFx0dGhpcy5fc2NyaXB0Tm9kZS5vbmF1ZGlvcHJvY2VzcyA9IHRoaXMub25hdWRpb3Byb2Nlc3MuYmluZCh0aGlzKTtcclxuXHRcdFx0dGhpcy5fc2NyaXB0Tm9kZS5jb25uZWN0KHRoaXMuX2F1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0YXN5bmMgc3RvcCgpIHtcclxuXHRcdGlmICh0aGlzLl9zY3JpcHROb2RlKSB7XHJcblx0XHQgIFx0dGhpcy5fc2NyaXB0Tm9kZS5kaXNjb25uZWN0KHRoaXMuX2F1ZGlvQ3R4LmRlc3RpbmF0aW9uKTtcclxuXHRcdCAgXHR0aGlzLl9zY3JpcHROb2RlLm9uYXVkaW9wcm9jZXNzID0gbnVsbDtcclxuXHRcdCAgXHR0aGlzLl9zY3JpcHROb2RlID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLl9hdWRpb0N0eCkge1xyXG5cdFx0ICBcdGF3YWl0IHRoaXMuX2F1ZGlvQ3R4LmNsb3NlKCk7XHJcblx0XHQgIFx0dGhpcy5fYXVkaW9DdHggPSBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0d3JpdGVTYW1wbGUobGVmdCwgcmlnaHQpIHtcclxuXHRcdGlmICh0aGlzLl9idWZmZXIuc2l6ZSgpIC8gMiA+PSBCVUZGRVJTSVpFKSB7XHJcblx0XHQgIFx0Ly9jb25zb2xlLmxvZyhgQnVmZmVyIG92ZXJydW5gKTtcclxuXHRcdCAgXHR0aGlzLl9idWZmZXIuZGVxTihCVUZGRVJTSVpFIC8gMik7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9idWZmZXIuZW5xKGxlZnQpO1xyXG5cdFx0dGhpcy5fYnVmZmVyLmVucShyaWdodCk7XHJcblx0fTtcclxuXHRcclxuXHRvbmF1ZGlvcHJvY2VzcyhlKSB7XHJcblx0XHR2YXIgbGVmdCA9IGUub3V0cHV0QnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xyXG5cdFx0dmFyIHJpZ2h0ID0gZS5vdXRwdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMSk7XHJcblx0XHR2YXIgc2l6ZSA9IGxlZnQubGVuZ3RoO1xyXG5cdFx0XHJcblx0XHQvLyBXZSdyZSBnb2luZyB0byBidWZmZXIgdW5kZXJydW4uIEF0dGVtcHQgdG8gZmlsbCB0aGUgYnVmZmVyLlxyXG5cdFx0Ly9pZiAodGhpcy5fYnVmZmVyLnNpemUoKSA8IHNpemUgKiAyICYmIHRoaXMub25CdWZmZXJVbmRlcnJ1bikge1xyXG5cdFx0Ly8gIFx0dGhpcy5vbkJ1ZmZlclVuZGVycnVuKHRoaXMuX2J1ZmZlci5zaXplKCksIHNpemUgKiAyKTtcclxuXHRcdC8vfVxyXG5cdFx0XHJcblx0XHR0cnkge1xyXG5cdFx0ICBcdHZhciBzYW1wbGVzID0gdGhpcy5fYnVmZmVyLmRlcU4oc2l6ZSAqIDIpO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvLyBvbkJ1ZmZlclVuZGVycnVuIGZhaWxlZCB0byBmaWxsIHRoZSBidWZmZXIsIHNvIGhhbmRsZSBhIHJlYWwgYnVmZmVyXHJcblx0XHRcdC8vIHVuZGVycnVuXHJcblx0XHRcclxuXHRcdFx0Ly8gaWdub3JlIGVtcHR5IGJ1ZmZlcnMuLi4gYXNzdW1lIGF1ZGlvIGhhcyBqdXN0IHN0b3BwZWRcclxuXHRcdFx0dmFyIGJ1ZmZlclNpemUgPSB0aGlzLl9idWZmZXIuc2l6ZSgpIC8gMjtcclxuXHRcdFx0aWYgKGJ1ZmZlclNpemUgPiAwKSB7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhgQnVmZmVyIHVuZGVycnVuIChuZWVkZWQgJHtzaXplfSwgZ290ICR7YnVmZmVyU2l6ZX0pYCk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcclxuXHRcdFx0XHRsZWZ0W2pdID0gMDtcclxuXHRcdFx0XHRyaWdodFtqXSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuXHRcdCAgXHRsZWZ0W2ldID0gc2FtcGxlc1tpICogMl07XHJcblx0XHQgIFx0cmlnaHRbaV0gPSBzYW1wbGVzW2kgKiAyICsgMV07XHJcblx0XHR9XHJcblx0fTtcclxufVxyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoID0gXCIuL0VtdWxhdG9yLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBsY2MkbmVzIHtcclxuXHJcbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eSwgcmVxdWlyZUNvbXBvbmVudCwgbWVudSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbi8qKlxyXG4gKiDnjqnlrrbluo/lj7dcclxuICovXHJcbmV4cG9ydCBlbnVtIFBsYXllciB7XHJcbiAgICBQTEFZRVJfMSA9IDEsXHJcbiAgICBQTEFZRVJfMiA9IDIsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLjmiI/mjInpkq5cclxuICovXHJcbmV4cG9ydCBlbnVtIEJ1dHRvbiB7XHJcbiAgICBBICAgICAgID0gMCxcclxuICAgIEIgICAgICAgPSAxLFxyXG4gICAgU0VMRUNUICA9IDIsXHJcbiAgICBTVEFSVCAgID0gMyxcclxuICAgIFVQICAgICAgPSA0LFxyXG4gICAgRE9XTiAgICA9IDUsXHJcbiAgICBMRUZUICAgID0gNixcclxuICAgIFJJR0hUICAgPSA3LFxyXG59XHJcblxyXG4vKipcclxuICog6ZSu55uY5oyJ6ZSuXHJcbiAqL1xyXG5leHBvcnQgZW51bSBLZXlib2FyZCB7XHJcbiAgICBiYWNrID0gMCxcclxuICAgIG1lbnUsXHJcbiAgICBiYWNrc3BhY2UsXHJcbiAgICB0YWIsXHJcbiAgICBlbnRlcixcclxuICAgIHNoaWZ0LFxyXG4gICAgY3RybCxcclxuICAgIGFsdCxcclxuICAgIHBhdXNlLFxyXG4gICAgY2Fwc2xvY2ssXHJcbiAgICBlc2NhcGUsXHJcbiAgICBzcGFjZSxcclxuICAgIHBhZ2V1cCxcclxuICAgIHBhZ2Vkb3duLFxyXG4gICAgZW5kLFxyXG4gICAgaG9tZSxcclxuICAgIGxlZnQsXHJcbiAgICB1cCxcclxuICAgIHJpZ2h0LFxyXG4gICAgZG93bixcclxuICAgIHNlbGVjdCxcclxuICAgIGluc2VydCxcclxuICAgIERlbGV0ZSxcclxuICAgIGEsXHJcbiAgICBiLFxyXG4gICAgYyxcclxuICAgIGQsXHJcbiAgICBlLFxyXG4gICAgZixcclxuICAgIGcsXHJcbiAgICBoLFxyXG4gICAgaSxcclxuICAgIGosXHJcbiAgICBrLFxyXG4gICAgbCxcclxuICAgIG0sXHJcbiAgICBuLFxyXG4gICAgbyxcclxuICAgIHAsXHJcbiAgICBxLFxyXG4gICAgcixcclxuICAgIHMsXHJcbiAgICB0LFxyXG4gICAgdSxcclxuICAgIHYsXHJcbiAgICB3LFxyXG4gICAgeCxcclxuICAgIHksXHJcbiAgICB6LFxyXG4gICAgbnVtMCxcclxuICAgIG51bTEsXHJcbiAgICBudW0yLFxyXG4gICAgbnVtMyxcclxuICAgIG51bTQsXHJcbiAgICBudW01LFxyXG4gICAgbnVtNixcclxuICAgIG51bTcsXHJcbiAgICBudW04LFxyXG4gICAgbnVtOSxcclxuICAgICcqJyxcclxuICAgICcrJyxcclxuICAgICctJyxcclxuICAgIG51bWRlbCxcclxuICAgICcvJyxcclxuICAgIGYxLFxyXG4gICAgZjIsXHJcbiAgICBmMyxcclxuICAgIGY0LFxyXG4gICAgZjUsXHJcbiAgICBmNixcclxuICAgIGY3LFxyXG4gICAgZjgsXHJcbiAgICBmOSxcclxuICAgIGYxMCxcclxuICAgIGYxMSxcclxuICAgIGYxMixcclxuICAgIG51bWxvY2ssXHJcbiAgICBzY3JvbGxsb2NrLFxyXG4gICAgJzsnLFxyXG4gICAgc2VtaWNvbG9uLFxyXG4gICAgZXF1YWwsXHJcbiAgICAnPScsXHJcbiAgICAnLCcsXHJcbiAgICBjb21tYSxcclxuICAgIGRhc2gsXHJcbiAgICAnLicsXHJcbiAgICBwZXJpb2QsXHJcbiAgICBmb3J3YXJkc2xhc2gsXHJcbiAgICBncmF2ZSxcclxuICAgICdbJyxcclxuICAgIG9wZW5icmFja2V0LFxyXG4gICAgYmFja3NsYXNoLFxyXG4gICAgJ10nLFxyXG4gICAgY2xvc2VicmFja2V0LFxyXG4gICAgcXVvdGUsXHJcbiAgICBkcGFkTGVmdCxcclxuICAgIGRwYWRSaWdodCxcclxuICAgIGRwYWRVcCxcclxuICAgIGRwYWREb3duLFxyXG4gICAgZHBhZENlbnRlcixcclxufVxyXG5cclxuLyoqXHJcbiAqIOmUruebmOaMiemUruihqOmUrlxyXG4gKi9cclxuY29uc3QgS2V5Ym9hcmRMaXN0ID0gW1xyXG4gICAgJ2JhY2snLFxyXG4gICAgJ21lbnUnLFxyXG4gICAgJ2JhY2tzcGFjZScsXHJcbiAgICAndGFiJyxcclxuICAgICdlbnRlcicsXHJcbiAgICAnc2hpZnQnLFxyXG4gICAgJ2N0cmwnLFxyXG4gICAgJ2FsdCcsXHJcbiAgICAncGF1c2UnLFxyXG4gICAgJ2NhcHNsb2NrJyxcclxuICAgICdlc2NhcGUnLFxyXG4gICAgJ3NwYWNlJyxcclxuICAgICdwYWdldXAnLFxyXG4gICAgJ3BhZ2Vkb3duJyxcclxuICAgICdlbmQnLFxyXG4gICAgJ2hvbWUnLFxyXG4gICAgJ2xlZnQnLFxyXG4gICAgJ3VwJyxcclxuICAgICdyaWdodCcsXHJcbiAgICAnZG93bicsXHJcbiAgICAnc2VsZWN0JyxcclxuICAgICdpbnNlcnQnLFxyXG4gICAgJ0RlbGV0ZScsXHJcbiAgICAnYScsXHJcbiAgICAnYicsXHJcbiAgICAnYycsXHJcbiAgICAnZCcsXHJcbiAgICAnZScsXHJcbiAgICAnZicsXHJcbiAgICAnZycsXHJcbiAgICAnaCcsXHJcbiAgICAnaScsXHJcbiAgICAnaicsXHJcbiAgICAnaycsXHJcbiAgICAnbCcsXHJcbiAgICAnbScsXHJcbiAgICAnbicsXHJcbiAgICAnbycsXHJcbiAgICAncCcsXHJcbiAgICAncScsXHJcbiAgICAncicsXHJcbiAgICAncycsXHJcbiAgICAndCcsXHJcbiAgICAndScsXHJcbiAgICAndicsXHJcbiAgICAndycsXHJcbiAgICAneCcsXHJcbiAgICAneScsXHJcbiAgICAneicsXHJcbiAgICAnbnVtMCcsXHJcbiAgICAnbnVtMScsXHJcbiAgICAnbnVtMicsXHJcbiAgICAnbnVtMycsXHJcbiAgICAnbnVtNCcsXHJcbiAgICAnbnVtNScsXHJcbiAgICAnbnVtNicsXHJcbiAgICAnbnVtNycsXHJcbiAgICAnbnVtOCcsXHJcbiAgICAnbnVtOScsXHJcbiAgICAnKicsXHJcbiAgICAnKycsXHJcbiAgICAnLScsXHJcbiAgICAnbnVtZGVsJyxcclxuICAgICcvJyxcclxuICAgICdmMScsXHJcbiAgICAnZjInLFxyXG4gICAgJ2YzJyxcclxuICAgICdmNCcsXHJcbiAgICAnZjUnLFxyXG4gICAgJ2Y2JyxcclxuICAgICdmNycsXHJcbiAgICAnZjgnLFxyXG4gICAgJ2Y5JyxcclxuICAgICdmMTAnLFxyXG4gICAgJ2YxMScsXHJcbiAgICAnZjEyJyxcclxuICAgICdudW1sb2NrJyxcclxuICAgICdzY3JvbGxsb2NrJyxcclxuICAgICc7JyxcclxuICAgICdzZW1pY29sb24nLFxyXG4gICAgJ2VxdWFsJyxcclxuICAgICc9JyxcclxuICAgICcsJyxcclxuICAgICdjb21tYScsXHJcbiAgICAnZGFzaCcsXHJcbiAgICAnLicsXHJcbiAgICAncGVyaW9kJyxcclxuICAgICdmb3J3YXJkc2xhc2gnLFxyXG4gICAgJ2dyYXZlJyxcclxuICAgICdbJyxcclxuICAgICdvcGVuYnJhY2tldCcsXHJcbiAgICAnYmFja3NsYXNoJyxcclxuICAgICddJyxcclxuICAgICdjbG9zZWJyYWNrZXQnLFxyXG4gICAgJ3F1b3RlJyxcclxuICAgICdkcGFkTGVmdCcsXHJcbiAgICAnZHBhZFJpZ2h0JyxcclxuICAgICdkcGFkVXAnLFxyXG4gICAgJ2RwYWREb3duJyxcclxuICAgICdkcGFkQ2VudGVyJyxcclxuXVxyXG5cclxuLyoqXHJcbiAqIOiOt+W+l+aMiemUrueggVxyXG4gKiBAcGFyYW0ga2V5IFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEtleUNvZGUoa2V5OktleWJvYXJkKXtcclxuICAgIHJldHVybiBjYy5tYWNyby5LRVlbS2V5Ym9hcmRMaXN0W2tleV1dO1xyXG59XHJcblxyXG5AY2NjbGFzcyhcImxjYyRuZXMuQnV0dG9uTWFwXCIpXHJcbmV4cG9ydCBjbGFzcyBCdXR0b25NYXAge1xyXG4gICAgQHByb3BlcnR5KHtcclxuICAgICAgICB0eXBlIDogY2MuRW51bShCdXR0b24pLFxyXG4gICAgICAgIHRvb2x0aXAgOiBcIua4uOaIj+aMiemSrlwiLFxyXG4gICAgICAgIHJlYWRvbmx5IDogdHJ1ZSxcclxuICAgIH0pXHJcbiAgICBidXR0b246QnV0dG9uID0gQnV0dG9uLkE7XHJcblxyXG4gICAgQHByb3BlcnR5KHtcclxuICAgICAgICB0eXBlIDogY2MuRW51bShLZXlib2FyZCksXHJcbiAgICAgICAgdG9vbHRpcCA6IFwi6ZSu55uY5oyJ6ZSuXCJcclxuICAgIH0pXHJcbiAgICBrZXk6IEtleWJvYXJkID0gS2V5Ym9hcmQudztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzOmFueVtdKXtcclxuICAgICAgICB0aGlzLmJ1dHRvbiA9IGFyZ3NbMF0gfHwgQnV0dG9uLkE7XHJcbiAgICAgICAgdGhpcy5rZXkgPSBhcmdzWzFdIHx8IEtleWJvYXJkLnc7XHJcbiAgICB9XHJcbn1cclxuXHJcbkBjY2NsYXNzKFwibGNjJG5lcy5Db250cm9sbGVyXCIpXHJcbkByZXF1aXJlQ29tcG9uZW50KEVtdWxhdG9yKVxyXG5AbWVudShcImkxOG46bGNjLW5lcy5tZW51X2NvbXBvbmVudC9Db250cm9sbGVyXCIpXHJcbmV4cG9ydCBjbGFzcyBDb250cm9sbGVyIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHR5cGUgOiBjYy5FbnVtKFBsYXllciksXHJcbiAgICAgICAgdG9vbHRpcCA6IFwi546p5a625bqP5Y+3XCJcclxuICAgIH0pXHJcbiAgICBwbGF5ZXI6UGxheWVyID0gUGxheWVyLlBMQVlFUl8xO1xyXG5cclxuICAgIEBwcm9wZXJ0eShbQnV0dG9uTWFwXSlcclxuICAgIF9idXR0b25zOkJ1dHRvbk1hcFtdID0gW1xyXG4gICAgICAgIG5ldyBCdXR0b25NYXAoQnV0dG9uLkEsIEtleWJvYXJkLmopLFxyXG4gICAgICAgIG5ldyBCdXR0b25NYXAoQnV0dG9uLkIsIEtleWJvYXJkLmspLFxyXG4gICAgICAgIG5ldyBCdXR0b25NYXAoQnV0dG9uLlNFTEVDVCwgS2V5Ym9hcmQuZiksXHJcbiAgICAgICAgbmV3IEJ1dHRvbk1hcChCdXR0b24uU1RBUlQsIEtleWJvYXJkLmgpLFxyXG4gICAgICAgIG5ldyBCdXR0b25NYXAoQnV0dG9uLlVQLCBLZXlib2FyZC53KSxcclxuICAgICAgICBuZXcgQnV0dG9uTWFwKEJ1dHRvbi5ET1dOLCBLZXlib2FyZC5zKSxcclxuICAgICAgICBuZXcgQnV0dG9uTWFwKEJ1dHRvbi5MRUZULCBLZXlib2FyZC5hKSxcclxuICAgICAgICBuZXcgQnV0dG9uTWFwKEJ1dHRvbi5SSUdIVCwgS2V5Ym9hcmQuZClcclxuICAgIF07XHJcbiAgICBAcHJvcGVydHkoe1xyXG4gICAgICAgIHR5cGUgOiBbQnV0dG9uTWFwXSxcclxuICAgICAgICB0b29sdGlwIDogXCLmjInplK7mmKDlsITooahcIlxyXG4gICAgfSlcclxuICAgIGdldCBidXR0b25zKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1dHRvbnM7XHJcbiAgICB9IFxyXG4gICAgc2V0IGJ1dHRvbnModmFsdWU6QnV0dG9uTWFwW10pe1xyXG5cdFx0aWYodGhpcy5fYnV0dG9ucyAhPSB2YWx1ZSl7XHJcblx0XHRcdHRoaXMuX2J1dHRvbnMgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy51cGRhdGVCdXR0b25NYXAoKTtcclxuXHRcdH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE5FUyDlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfbmVzOmFueSA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDplK7nm5jmmKDlsIRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfa2V5bWFwOntba2V5Om51bWJlcl06bnVtYmVyfSA9IG51bGw7XHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuXHRcdHRoaXMuX25lcyA9IHRoaXMuZ2V0Q29tcG9uZW50KEVtdWxhdG9yKS5nZXRORVMoKTtcclxuXHRcdHRoaXMudXBkYXRlQnV0dG9uTWFwKCk7XHJcblx0XHRjYy5zeXN0ZW1FdmVudC5vbihjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sIHRoaXMub25LZXlEb3duLCB0aGlzKTtcclxuXHRcdGNjLnN5c3RlbUV2ZW50Lm9uKGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfVVAsIHRoaXMub25LZXlVcCwgdGhpcyk7XHJcblx0XHR0aGlzLm5vZGUub24oXCJuZXNfYnV0dG9uX2V2ZW50XCIsIHRoaXMub25Ob2RlQnV0dG9uRXZlbnQsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50LnRhcmdldE9mZih0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUudGFyZ2V0T2ZmKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6IqC54K55oyJ6ZKu5LqL5Lu2XHJcbiAgICAgKiBAcGFyYW0gcGxheWVyIFxyXG4gICAgICogQHBhcmFtIGJ1dHRvbiBcclxuICAgICAqIEBwYXJhbSBkb3duIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIG9uTm9kZUJ1dHRvbkV2ZW50KHBsYXllcjpQbGF5ZXIsIGJ1dHRvbjpCdXR0b24sIGRvd246Ym9vbGVhbil7XHJcbiAgICAgICAgaWYocGxheWVyID09IHRoaXMucGxheWVyKXtcclxuICAgICAgICAgICAgdGhpcy5vbkJ1dHRvbkV2ZW50KGJ1dHRvbiwgZG93bik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5oyJ6ZKu5LqL5Lu2XHJcbiAgICAgKi9cclxuICAgIG9uQnV0dG9uRXZlbnQoYnV0dG9uOkJ1dHRvbiwgZG93bjpib29sZWFuKXtcclxuXHRcdGlmKGRvd24pe1xyXG5cdFx0XHR0aGlzLl9uZXMuYnV0dG9uRG93bih0aGlzLnBsYXllciwgYnV0dG9uKTtcclxuXHRcdH1lbHNle1xyXG5cdFx0XHR0aGlzLl9uZXMuYnV0dG9uVXAodGhpcy5wbGF5ZXIsIGJ1dHRvbik7XHJcblx0XHR9XHJcbiAgICB9XHJcblx0XHJcbiAgICAvKipcclxuICAgICAqIOW9k+aMiemSruaMieS4i1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIG9uS2V5RG93bihldmVudDpjYy5FdmVudC5FdmVudEtleWJvYXJkKXtcclxuICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5fa2V5bWFwW2V2ZW50LmtleUNvZGVdO1xyXG4gICAgICAgIGlmKGJ1dHRvbiAhPSBudWxsKXtcclxuXHRcdFx0dGhpcy5vbkJ1dHRvbkV2ZW50KGJ1dHRvbiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5oyJ6ZKu5pS+5byAXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb25LZXlVcChldmVudDpjYy5FdmVudC5FdmVudEtleWJvYXJkKXtcclxuICAgICAgICBsZXQgYnV0dG9uID0gdGhpcy5fa2V5bWFwW2V2ZW50LmtleUNvZGVdO1xyXG4gICAgICAgIGlmKGJ1dHRvbiAhPSBudWxsKXtcclxuXHRcdFx0dGhpcy5vbkJ1dHRvbkV2ZW50KGJ1dHRvbiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOabtOaWsOaMiemSruaYoOWwhFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHVwZGF0ZUJ1dHRvbk1hcCgpe1xyXG4gICAgICAgIHRoaXMuX2tleW1hcCA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGIgb2YgdGhpcy5fYnV0dG9ucyl7XHJcbiAgICAgICAgICAgIHRoaXMuX2tleW1hcFtnZXRLZXlDb2RlKGIua2V5KV0gPSBiLmJ1dHRvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIChkdCkge31cclxufVxyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoID0gXCIuL0VtdWxhdG9yLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBsY2MkbmVzIHtcclxuXHJcbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eSwgcmVxdWlyZUNvbXBvbmVudCwgbWVudSB9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzKFwibGNjJG5lcy5EaXNwbGF5U3ByaXRlc1wiKVxyXG5AcmVxdWlyZUNvbXBvbmVudChFbXVsYXRvcilcclxuQG1lbnUoXCJpMThuOmxjYy1uZXMubWVudV9jb21wb25lbnQvRGlzcGxheVNwcml0ZXNcIilcclxuZXhwb3J0IGNsYXNzIERpc3BsYXlTcHJpdGVzIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoW2NjLlNwcml0ZV0pXHJcbiAgICBfc3ByaXRlczogY2MuU3ByaXRlW10gPSBbXTtcclxuXHRAcHJvcGVydHkoe1xyXG5cdFx0dHlwZSA6IFtjYy5TcHJpdGVdLFxyXG5cdFx0dG9vbHRpcCA6IFwi5bGV56S655qEU3ByaXRl5pWw57uEXCJcclxuXHR9KVxyXG5cdGdldCBzcHJpdGVzKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5fc3ByaXRlcztcclxuXHR9XHJcblx0c2V0IHNwcml0ZXModmFsdWU6Y2MuU3ByaXRlW10pe1xyXG5cdFx0aWYodGhpcy5fc3ByaXRlcyAhPSB2YWx1ZSl7XHJcblx0XHRcdHRoaXMuX3Nwcml0ZXMgPSB2YWx1ZTtcclxuXHRcdFx0dGhpcy5zZXREaXNwbGF5U3ByaXRlcyh2YWx1ZSk7XHJcblx0XHR9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmqKHmi5/lmahcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfZW11bGF0b3I6RW11bGF0b3IgPSBudWxsO1xyXG5cclxuICAgIC8vIExJRkUtQ1lDTEUgQ0FMTEJBQ0tTOlxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgdGhpcy5fZW11bGF0b3IgPSB0aGlzLmdldENvbXBvbmVudChFbXVsYXRvcik7XHJcbiAgICAgICAgdGhpcy5zZXREaXNwbGF5U3ByaXRlcyh0aGlzLnNwcml0ZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6K6+572u5bGV56S6U3ByaXRl5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gc3ByaXRlcyBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzZXREaXNwbGF5U3ByaXRlcyhzcHJpdGVzOmNjLlNwcml0ZVtdKXtcclxuICAgICAgICBpZihzcHJpdGVzICYmIHNwcml0ZXMubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZSh0aGlzLl9lbXVsYXRvci5nZXRUZXh0dXJlKCkpO1xyXG4gICAgICAgICAgICBmb3IobGV0IHNwIG9mIHNwcml0ZXMpe1xyXG4gICAgICAgICAgICAgICAgc3Auc3ByaXRlRnJhbWUgPSBzcHJpdGVGcmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gdXBkYXRlIChkdCkge31cclxufVxyXG5cclxufVxyXG4iXX0=
