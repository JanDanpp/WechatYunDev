module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(11);
module.exports = __webpack_require__(12);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/
    },
    properties: {
        duration: {
            type: Number,
            value: 500
        },
        easingFunction: {
            type: String,
            value: 'default'
        },
        loop: {
            type: Boolean,
            value: true
        },
        videoList: {
            type: Array,
            value: [],
            observer: function observer() {
                var newVal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

                this._videoListChanged(newVal);
            }
        }
    },
    data: {
        nextQueue: [],
        prevQueue: [],
        curQueue: [],
        circular: false,
        _last: 1,
        _change: -1,
        _invalidUp: 0,
        _invalidDown: 0,
        _videoContexts: []
    },
    lifetimes: {
        attached: function attached() {
            this.data._videoContexts = [wx.createVideoContext('video_0', this), wx.createVideoContext('video_1', this), wx.createVideoContext('video_2', this)];
        }
    },
    methods: {
        _videoListChanged: function _videoListChanged(newVal) {
            var _this = this;

            var data = this.data;
            newVal.forEach(function (item) {
                data.nextQueue.push(item);
            });
            if (data.curQueue.length === 0) {
                this.setData({
                    curQueue: data.nextQueue.splice(0, 3)
                }, function () {
                    _this.playCurrent(1);
                });
            }
        },
        animationfinish: function animationfinish(e) {
            var _data = this.data,
                _last = _data._last,
                _change = _data._change,
                curQueue = _data.curQueue,
                prevQueue = _data.prevQueue,
                nextQueue = _data.nextQueue;

            var current = e.detail.current;
            var diff = current - _last;
            if (diff === 0) return;
            this.data._last = current;
            this.playCurrent(current);
            this.triggerEvent('change', { activeId: curQueue[current].id });
            var direction = diff === 1 || diff === -2 ? 'up' : 'down';
            if (direction === 'up') {
                if (this.data._invalidDown === 0) {
                    var change = (_change + 1) % 3;
                    var add = nextQueue.shift();
                    var remove = curQueue[change];
                    if (add) {
                        prevQueue.push(remove);
                        curQueue[change] = add;
                        this.data._change = change;
                    } else {
                        this.data._invalidUp += 1;
                    }
                } else {
                    this.data._invalidDown -= 1;
                }
            }
            if (direction === 'down') {
                if (this.data._invalidUp === 0) {
                    var _change2 = _change;
                    var _remove = curQueue[_change2];
                    var _add = prevQueue.pop();
                    if (_add) {
                        curQueue[_change2] = _add;
                        nextQueue.unshift(_remove);
                        this.data._change = (_change2 - 1 + 3) % 3;
                    } else {
                        this.data._invalidDown += 1;
                    }
                } else {
                    this.data._invalidUp -= 1;
                }
            }
            var circular = true;
            if (nextQueue.length === 0 && current !== 0) {
                circular = false;
            }
            if (prevQueue.length === 0 && current !== 2) {
                circular = false;
            }
            this.setData({
                curQueue: curQueue,
                circular: circular
            });
        },
        playCurrent: function playCurrent(current) {
            this.data._videoContexts.forEach(function (ctx, index) {
                index !== current ? ctx.pause() : ctx.play();
            });
        },
        onPlay: function onPlay(e) {
            this.trigger(e, 'play');
        },
        onPause: function onPause(e) {
            this.trigger(e, 'pause');
        },
        onEnded: function onEnded(e) {
            this.trigger(e, 'ended');
        },
        onError: function onError(e) {
            this.trigger(e, 'error');
        },
        onTimeUpdate: function onTimeUpdate(e) {
            this.trigger(e, 'timeupdate');
        },
        onWaiting: function onWaiting(e) {
            this.trigger(e, 'wait');
        },
        onProgress: function onProgress(e) {
            this.trigger(e, 'progress');
        },
        onLoadedMetaData: function onLoadedMetaData(e) {
            this.trigger(e, 'loadedmetadata');
        },
        trigger: function trigger(e, type) {
            var ext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var detail = e.detail;
            var activeId = e.target.dataset.id;
            this.triggerEvent(type, Object.assign(Object.assign(Object.assign({}, detail), { activeId: activeId }), ext));
        }
    }
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var emoji_data_1 = __webpack_require__(3);
var emoji_panel_data_1 = __webpack_require__(4);
var PADDING = 15;
var EMOTION_SIZE = 40;
var emotionMap = {};
var emotionNames = [];
emoji_data_1.default.forEach(function (item) {
    emotionMap[item.id] = item;
    emotionNames.push(item.cn);
});
var emotions = [];
emoji_panel_data_1.default.forEach(function (id) {
    return emotions.push(emotionMap[id]);
});
Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/
    },
    properties: {
        showDel: {
            type: Boolean,
            value: true
        },
        showHistory: {
            type: Boolean,
            value: true
        },
        height: {
            type: Number,
            value: 290
        }
    },
    data: {
        emojiPicture: 'http://q1b7ehu5b.bkt.clouddn.com/emoji-sprite-2.png',
        history: [],
        emotions: emotions,
        extraPadding: 0,
        _perLine: 0
    },
    lifetimes: {
        attached: function attached() {
            var data = this.data;
            var areaWidth = wx.getSystemInfoSync().windowWidth;
            data._perLine = Math.floor((areaWidth - PADDING * 2) / EMOTION_SIZE);
            var extraPadding = Math.floor((areaWidth - PADDING * 2 - data._perLine * EMOTION_SIZE) / 2);
            this.setData({ extraPadding: extraPadding });
        }
    },
    methods: {
        insertEmoji: function insertEmoji(evt) {
            var data = this.data;
            var idx = evt.currentTarget.dataset.idx;
            var emotionName = data.emotions[idx].cn;
            this.LRUCache(data.history, data._perLine, idx);
            this.setData({ history: data.history });
            this.triggerEvent('insertemoji', { emotionName: emotionName });
        },
        deleteEmoji: function deleteEmoji(evt) {
            this.triggerEvent('delemoji');
        },
        LRUCache: function LRUCache(arr, limit, data) {
            var idx = arr.indexOf(data);
            if (idx >= 0) {
                arr.splice(idx, 1);
                arr.unshift(data);
            } else if (arr.length < limit) {
                arr.push(data);
            } else if (arr.length === limit) {
                arr[limit - 1] = data;
            }
        }
    }
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [{ 'id': 0, 'cn': '[微笑]', 'hk': '[微笑]', 'us': '[Smile]', 'code': '/::)', 'web_code': '/微笑', 'style': 'smiley_0' }, { 'id': 1, 'cn': '[撇嘴]', 'hk': '[撇嘴]', 'us': '[Grimace]', 'code': '/::~', 'web_code': '/撇嘴', 'style': 'smiley_1' }, { 'id': 2, 'cn': '[色]', 'hk': '[色]', 'us': '[Drool]', 'code': '/::B', 'web_code': '/色', 'style': 'smiley_2' }, { 'id': 3, 'cn': '[发呆]', 'hk': '[發呆]', 'us': '[Scowl]', 'code': '/::|', 'web_code': '/发呆', 'style': 'smiley_3' }, { 'id': 4, 'cn': '[得意]', 'hk': '[得意]', 'us': '[CoolGuy]', 'code': '/:8-)', 'web_code': '/得意', 'style': 'smiley_4' }, { 'id': 5, 'cn': '[流泪]', 'hk': '[流淚]', 'us': '[Sob]', 'code': '/::<', 'web_code': '/流泪', 'style': 'smiley_5' }, { 'id': 6, 'cn': '[害羞]', 'hk': '[害羞]', 'us': '[Shy]', 'code': '/::$', 'web_code': '/害羞', 'style': 'smiley_6' }, { 'id': 7, 'cn': '[闭嘴]', 'hk': '[閉嘴]', 'us': '[Silent]', 'code': '/::X', 'web_code': '/闭嘴', 'style': 'smiley_7' }, { 'id': 8, 'cn': '[睡]', 'hk': '[睡]', 'us': '[Sleep]', 'code': '/::Z', 'web_code': '/睡', 'style': 'smiley_8' }, { 'id': 9, 'cn': '[大哭]', 'hk': '[大哭]', 'us': '[Cry]', 'code': '/::"(', 'web_code': '/大哭', 'style': 'smiley_9' }, { 'id': 10, 'cn': '[尴尬]', 'hk': '[尷尬]', 'us': '[Awkward]', 'code': '/::-|', 'web_code': '/尴尬', 'style': 'smiley_10' }, { 'id': 11, 'cn': '[发怒]', 'hk': '[發怒]', 'us': '[Angry]', 'code': '/::@', 'web_code': '/发怒', 'style': 'smiley_11' }, { 'id': 12, 'cn': '[调皮]', 'hk': '[調皮]', 'us': '[Tongue]', 'code': '/::P', 'web_code': '/调皮', 'style': 'smiley_12' }, { 'id': 13, 'cn': '[呲牙]', 'hk': '[呲牙]', 'us': '[Grin]', 'code': '/::D', 'web_code': '/呲牙', 'style': 'smiley_13' }, { 'id': 14, 'cn': '[惊讶]', 'hk': '[驚訝]', 'us': '[Surprise]', 'code': '/::O', 'web_code': '/惊讶', 'style': 'smiley_14' }, { 'id': 15, 'cn': '[难过]', 'hk': '[難過]', 'us': '[Frown]', 'code': '/::(', 'web_code': '/难过', 'style': 'smiley_15' }, { 'id': 16, 'cn': '[酷]', 'hk': '[酷]', 'us': '[Ruthless]', 'code': '/::+', 'web_code': '/酷', 'style': 'smiley_16' }, { 'id': 17, 'cn': '[冷汗]', 'hk': '[冷汗]', 'us': '[Blush]', 'code': '/:--b', 'web_code': '/冷汗', 'style': 'smiley_17' }, { 'id': 18, 'cn': '[抓狂]', 'hk': '[抓狂]', 'us': '[Scream]', 'code': '/::Q', 'web_code': '/抓狂', 'style': 'smiley_18' }, { 'id': 19, 'cn': '[吐]', 'hk': '[吐]', 'us': '[Puke]', 'code': '/::T', 'web_code': '/吐', 'style': 'smiley_19' }, { 'id': 20, 'cn': '[偷笑]', 'hk': '[偷笑]', 'us': '[Chuckle]', 'code': '/:,@P', 'web_code': '/偷笑', 'style': 'smiley_20' }, { 'id': 21, 'cn': '[愉快]', 'hk': '[愉快]', 'us': '[Joyful]', 'code': '/:,@-D', 'web_code': '/可爱', 'style': 'smiley_21' }, { 'id': 22, 'cn': '[白眼]', 'hk': '[白眼]', 'us': '[Slight]', 'code': '/::d', 'web_code': '/白眼', 'style': 'smiley_22' }, { 'id': 23, 'cn': '[傲慢]', 'hk': '[傲慢]', 'us': '[Smug]', 'code': '/:,@o', 'web_code': '/傲慢', 'style': 'smiley_23' }, { 'id': 24, 'cn': '[饥饿]', 'hk': '[饑餓]', 'us': '[Hungry]', 'code': '/::g', 'web_code': '/饥饿', 'style': 'smiley_24' }, { 'id': 25, 'cn': '[困]', 'hk': '[累]', 'us': '[Drowsy]', 'code': '/:|-)', 'web_code': '/困', 'style': 'smiley_25' }, { 'id': 26, 'cn': '[惊恐]', 'hk': '[驚恐]', 'us': '[Panic]', 'code': '/::!', 'web_code': '/惊恐', 'style': 'smiley_26' }, { 'id': 27, 'cn': '[流汗]', 'hk': '[流汗]', 'us': '[Sweat]', 'code': '/::L', 'web_code': '/流汗', 'style': 'smiley_27' }, { 'id': 28, 'cn': '[憨笑]', 'hk': '[大笑]', 'us': '[Laugh]', 'code': '/::>', 'web_code': '/憨笑', 'style': 'smiley_28' }, { 'id': 29, 'cn': '[悠闲]', 'hk': '[悠閑]', 'us': '[Commando]', 'code': '/::,@', 'web_code': '/大兵', 'style': 'smiley_29' }, { 'id': 30, 'cn': '[奋斗]', 'hk': '[奮鬥]', 'us': '[Determined]', 'code': '/:,@f', 'web_code': '/奋斗', 'style': 'smiley_30' }, { 'id': 31, 'cn': '[咒骂]', 'hk': '[咒罵]', 'us': '[Scold]', 'code': '/::-S', 'web_code': '/咒骂', 'style': 'smiley_31' }, { 'id': 32, 'cn': '[疑问]', 'hk': '[疑問]', 'us': '[Shocked]', 'code': '/:?', 'web_code': '/疑问', 'style': 'smiley_32' }, { 'id': 33, 'cn': '[嘘]', 'hk': '[噓]', 'us': '[Shhh]', 'code': '/:,@x', 'web_code': '/嘘', 'style': 'smiley_33' }, { 'id': 34, 'cn': '[晕]', 'hk': '[暈]', 'us': '[Dizzy]', 'code': '/:,@@', 'web_code': '/晕', 'style': 'smiley_34' }, { 'id': 35, 'cn': '[疯了]', 'hk': '[瘋了]', 'us': '[Tormented]', 'code': '/::8', 'web_code': '/折磨', 'style': 'smiley_35' }, { 'id': 36, 'cn': '[衰]', 'hk': '[衰]', 'us': '[Toasted]', 'code': '/:,@!', 'web_code': '/衰', 'style': 'smiley_36' }, { 'id': 37, 'cn': '[骷髅]', 'hk': '[骷髏頭]', 'us': '[Skull]', 'code': '/:!!!', 'web_code': '/骷髅', 'style': 'smiley_37' }, { 'id': 38, 'cn': '[敲打]', 'hk': '[敲打]', 'us': '[Hammer]', 'code': '/:xx', 'web_code': '/敲打', 'style': 'smiley_38' }, { 'id': 39, 'cn': '[再见]', 'hk': '[再見]', 'us': '[Wave]', 'code': '/:bye', 'web_code': '/再见', 'style': 'smiley_39' }, { 'id': 40, 'cn': '[擦汗]', 'hk': '[擦汗]', 'us': '[Speechless]', 'code': '/:wipe', 'web_code': '/擦汗', 'style': 'smiley_40' }, { 'id': 41, 'cn': '[抠鼻]', 'hk': '[摳鼻]', 'us': '[NosePick]', 'code': '/:dig', 'web_code': '/抠鼻', 'style': 'smiley_41' }, { 'id': 42, 'cn': '[鼓掌]', 'hk': '[鼓掌]', 'us': '[Clap]', 'code': '/:handclap', 'web_code': '/鼓掌', 'style': 'smiley_42' }, { 'id': 43, 'cn': '[糗大了]', 'hk': '[羞辱]', 'us': '[Shame]', 'code': '/:&-(', 'web_code': '/糗大了', 'style': 'smiley_43' }, { 'id': 44, 'cn': '[坏笑]', 'hk': '[壞笑]', 'us': '[Trick]', 'code': '/:B-)', 'web_code': '/坏笑', 'style': 'smiley_44' }, { 'id': 45, 'cn': '[左哼哼]', 'hk': '[左哼哼]', 'us': '[Bah！L]', 'code': '/:<@', 'web_code': '/左哼哼', 'style': 'smiley_45' }, { 'id': 46, 'cn': '[右哼哼]', 'hk': '[右哼哼]', 'us': '[Bah！R]', 'code': '/:@>', 'web_code': '/右哼哼', 'style': 'smiley_46' }, { 'id': 47, 'cn': '[哈欠]', 'hk': '[哈欠]', 'us': '[Yawn]', 'code': '/::-O', 'web_code': '/哈欠', 'style': 'smiley_47' }, { 'id': 48, 'cn': '[鄙视]', 'hk': '[鄙視]', 'us': '[Pooh-pooh]', 'code': '/:>-|', 'web_code': '/鄙视', 'style': 'smiley_48' }, { 'id': 49, 'cn': '[委屈]', 'hk': '[委屈]', 'us': '[Shrunken]', 'code': '/:P-(', 'web_code': '/委屈', 'style': 'smiley_49' }, { 'id': 50, 'cn': '[快哭了]', 'hk': '[快哭了]', 'us': '[TearingUp]', 'code': '/::"|', 'web_code': '/快哭了', 'style': 'smiley_50' }, { 'id': 51, 'cn': '[阴险]', 'hk': '[陰險]', 'us': '[Sly]', 'code': '/:X-)', 'web_code': '/阴险', 'style': 'smiley_51' }, { 'id': 52, 'cn': '[亲亲]', 'hk': '[親親]', 'us': '[Kiss]', 'code': '/::*', 'web_code': '/亲亲', 'style': 'smiley_52' }, { 'id': 53, 'cn': '[吓]', 'hk': '[嚇]', 'us': '[Wrath]', 'code': '/:@x', 'web_code': '/吓', 'style': 'smiley_53' }, { 'id': 54, 'cn': '[可怜]', 'hk': '[可憐]', 'us': '[Whimper]', 'code': '/:8*', 'web_code': '/可怜', 'style': 'smiley_54' }, { 'id': 55, 'cn': '[菜刀]', 'hk': '[菜刀]', 'us': '[Cleaver]', 'code': '/:pd', 'web_code': '/菜刀', 'style': 'smiley_55' }, { 'id': 56, 'cn': '[西瓜]', 'hk': '[西瓜]', 'us': '[Watermelon]', 'code': '/:<W>', 'web_code': '/西瓜', 'style': 'smiley_56' }, { 'id': 57, 'cn': '[啤酒]', 'hk': '[啤酒]', 'us': '[Beer]', 'code': '/:beer', 'web_code': '/啤酒', 'style': 'smiley_57' }, { 'id': 58, 'cn': '[篮球]', 'hk': '[籃球]', 'us': '[Basketball]', 'code': '/:basketb', 'web_code': '/篮球', 'style': 'smiley_58' }, { 'id': 59, 'cn': '[乒乓]', 'hk': '[乒乓]', 'us': '[PingPong]', 'code': '/:oo', 'web_code': '/乒乓', 'style': 'smiley_59' }, { 'id': 60, 'cn': '[咖啡]', 'hk': '[咖啡]', 'us': '[Coffee]', 'code': '/:coffee', 'web_code': '/咖啡', 'style': 'smiley_60' }, { 'id': 61, 'cn': '[饭]', 'hk': '[飯]', 'us': '[Rice]', 'code': '/:eat', 'web_code': '/饭', 'style': 'smiley_61' }, { 'id': 62, 'cn': '[猪头]', 'hk': '[豬頭]', 'us': '[Pig]', 'code': '/:pig', 'web_code': '/猪头', 'style': 'smiley_62' }, { 'id': 63, 'cn': '[玫瑰]', 'hk': '[玫瑰]', 'us': '[Rose]', 'code': '/:rose', 'web_code': '/玫瑰', 'style': 'smiley_63' }, { 'id': 64, 'cn': '[凋谢]', 'hk': '[枯萎]', 'us': '[Wilt]', 'code': '/:fade', 'web_code': '/凋谢', 'style': 'smiley_64' }, { 'id': 65, 'cn': '[嘴唇]', 'hk': '[嘴唇]', 'us': '[Lips]', 'code': '/:showlove', 'web_code': '/示爱', 'style': 'smiley_65' }, { 'id': 66, 'cn': '[爱心]', 'hk': '[愛心]', 'us': '[Heart]', 'code': '/:heart', 'web_code': '/爱心', 'style': 'smiley_66' }, { 'id': 67, 'cn': '[心碎]', 'hk': '[心碎]', 'us': '[BrokenHeart]', 'code': '/:break', 'web_code': '/心碎', 'style': 'smiley_67' }, { 'id': 68, 'cn': '[蛋糕]', 'hk': '[蛋糕]', 'us': '[Cake]', 'code': '/:cake', 'web_code': '/蛋糕', 'style': 'smiley_68' }, { 'id': 69, 'cn': '[闪电]', 'hk': '[閃電]', 'us': '[Lightning]', 'code': '/:li', 'web_code': '/闪电', 'style': 'smiley_69' }, { 'id': 70, 'cn': '[炸弹]', 'hk': '[炸彈]', 'us': '[Bomb]', 'code': '/:bome', 'web_code': '/炸弹', 'style': 'smiley_70' }, { 'id': 71, 'cn': '[刀]', 'hk': '[刀]', 'us': '[Dagger]', 'code': '/:kn', 'web_code': '/刀', 'style': 'smiley_71' }, { 'id': 72, 'cn': '[足球]', 'hk': '[足球]', 'us': '[Soccer]', 'code': '/:footb', 'web_code': '/足球', 'style': 'smiley_72' }, { 'id': 73, 'cn': '[瓢虫]', 'hk': '[甲蟲]', 'us': '[Ladybug]', 'code': '/:ladybug', 'web_code': '/瓢虫', 'style': 'smiley_73' }, { 'id': 74, 'cn': '[便便]', 'hk': '[便便]', 'us': '[Poop]', 'code': '/:shit', 'web_code': '/便便', 'style': 'smiley_74' }, { 'id': 75, 'cn': '[月亮]', 'hk': '[月亮]', 'us': '[Moon]', 'code': '/:moon', 'web_code': '/月亮', 'style': 'smiley_75' }, { 'id': 76, 'cn': '[太阳]', 'hk': '[太陽]', 'us': '[Sun]', 'code': '/:sun', 'web_code': '/太阳', 'style': 'smiley_76' }, { 'id': 77, 'cn': '[礼物]', 'hk': '[禮物]', 'us': '[Gift]', 'code': '/:gift', 'web_code': '/礼物', 'style': 'smiley_77' }, { 'id': 78, 'cn': '[拥抱]', 'hk': '[擁抱]', 'us': '[Hug]', 'code': '/:hug', 'web_code': '/拥抱', 'style': 'smiley_78' }, { 'id': 79, 'cn': '[强]', 'hk': '[強]', 'us': '[ThumbsUp]', 'code': '/:strong', 'web_code': '/强', 'style': 'smiley_79' }, { 'id': 80, 'cn': '[弱]', 'hk': '[弱]', 'us': '[ThumbsDown]', 'code': '/:weak', 'web_code': '/弱', 'style': 'smiley_80' }, { 'id': 81, 'cn': '[握手]', 'hk': '[握手]', 'us': '[Shake]', 'code': '/:share', 'web_code': '/握手', 'style': 'smiley_81' }, { 'id': 82, 'cn': '[胜利]', 'hk': '[勝利]', 'us': '[Peace]', 'code': '/:v', 'web_code': '/胜利', 'style': 'smiley_82' }, { 'id': 83, 'cn': '[抱拳]', 'hk': '[抱拳]', 'us': '[Fight]', 'code': '/:@)', 'web_code': '/抱拳', 'style': 'smiley_83' }, { 'id': 84, 'cn': '[勾引]', 'hk': '[勾引]', 'us': '[Beckon]', 'code': '/:jj', 'web_code': '/勾引', 'style': 'smiley_84' }, { 'id': 85, 'cn': '[拳头]', 'hk': '[拳頭]', 'us': '[Fist]', 'code': '/:@@', 'web_code': '/拳头', 'style': 'smiley_85' }, { 'id': 86, 'cn': '[差劲]', 'hk': '[差勁]', 'us': '[Pinky]', 'code': '/:bad', 'web_code': '/差劲', 'style': 'smiley_86' }, { 'id': 87, 'cn': '[爱你]', 'hk': '[愛你]', 'us': '[RockOn]', 'code': '/:lvu', 'web_code': '/爱你', 'style': 'smiley_87' }, { 'id': 88, 'cn': '[NO]', 'hk': '[NO]', 'us': '[Nuh-uh]', 'code': '/:no', 'web_code': '/NO', 'style': 'smiley_88' }, { 'id': 89, 'cn': '[OK]', 'hk': '[OK]', 'us': '[OK]', 'code': '/:ok', 'web_code': '/OK', 'style': 'smiley_89' }, { 'id': 90, 'cn': '[爱情]', 'hk': '[愛情]', 'us': '[InLove]', 'code': '/:love', 'web_code': '/爱情', 'style': 'smiley_90' }, { 'id': 91, 'cn': '[飞吻]', 'hk': '[飛吻]', 'us': '[Blowkiss]', 'code': '/:<L>', 'web_code': '/飞吻', 'style': 'smiley_91' }, { 'id': 92, 'cn': '[跳跳]', 'hk': '[跳跳]', 'us': '[Waddle]', 'code': '/:jump', 'web_code': '/跳跳', 'style': 'smiley_92' }, { 'id': 93, 'cn': '[发抖]', 'hk': '[發抖]', 'us': '[Tremble]', 'code': '/:shake', 'web_code': '/发抖', 'style': 'smiley_93' }, { 'id': 94, 'cn': '[怄火]', 'hk': '[噴火]', 'us': '[Aaagh!]', 'code': '/:<O>', 'web_code': '/怄火', 'style': 'smiley_94' }, { 'id': 95, 'cn': '[转圈]', 'hk': '[轉圈]', 'us': '[Twirl]', 'code': '/:circle', 'web_code': '/转圈', 'style': 'smiley_95' }, { 'id': 96, 'cn': '[磕头]', 'hk': '[磕頭]', 'us': '[Kotow]', 'code': '/:kotow', 'web_code': '/磕头', 'style': 'smiley_96' }, { 'id': 97, 'cn': '[回头]', 'hk': '[回頭]', 'us': '[Dramatic]', 'code': '/:turn', 'web_code': '/回头', 'style': 'smiley_97' }, { 'id': 98, 'cn': '[跳绳]', 'hk': '[跳繩]', 'us': '[JumpRope]', 'code': '/:skip', 'web_code': '/跳绳', 'style': 'smiley_98' }, { 'id': 99, 'cn': '[投降]', 'hk': '[投降]', 'us': '[Surrender]', 'code': '/:oY', 'web_code': '/挥手', 'style': 'smiley_99' }, { 'id': 100, 'cn': '[激动]', 'hk': '[激動]', 'us': '[Hooray]', 'code': '/:#-0', 'web_code': '/激动', 'style': 'smiley_100' }, { 'id': 101, 'cn': '[乱舞]', 'hk': '[亂舞]', 'us': '[Meditate]', 'code': '/:hiphot', 'web_code': '/街舞', 'style': 'smiley_101' }, { 'id': 102, 'cn': '[献吻]', 'hk': '[獻吻]', 'us': '[Smooch]', 'code': '/:kiss', 'web_code': '/献吻', 'style': 'smiley_102' }, { 'id': 103, 'cn': '[左太极]', 'hk': '[左太極]', 'us': '[TaiChi L]', 'code': '/:<&', 'web_code': '/左太极', 'style': 'smiley_103' }, { 'id': 104, 'cn': '[右太极]', 'hk': '[右太極]', 'us': '[TaiChi R]', 'code': '/:&>', 'web_code': '/右太极', 'style': 'smiley_104' }, { 'id': 204, 'cn': '[嘿哈]', 'hk': '[吼嘿]', 'us': '[Hey]', 'code': '', 'web_code': '', 'style': 'smiley_2_04' }, { 'id': 205, 'cn': '[捂脸]', 'hk': '[掩面]', 'us': '[Facepalm]', 'code': '', 'web_code': '', 'style': 'smiley_2_05' }, { 'id': 202, 'cn': '[奸笑]', 'hk': '[奸笑]', 'us': '[Smirk]', 'code': '', 'web_code': '', 'style': 'smiley_2_02' }, { 'id': 206, 'cn': '[机智]', 'hk': '[機智]', 'us': '[Smart]', 'code': '', 'web_code': '', 'style': 'smiley_2_06' }, { 'id': 212, 'cn': '[皱眉]', 'hk': '[皺眉]', 'us': '[Moue]', 'code': '', 'web_code': '', 'style': 'smiley_2_12' }, { 'id': 211, 'cn': '[耶]', 'hk': '[歐耶]', 'us': '[Yeah!]', 'code': '', 'web_code': '', 'style': 'smiley_2_11' }, { 'id': 207, 'cn': '[茶]', 'hk': '[茶]', 'us': '[Tea]', 'code': '', 'web_code': '', 'style': 'smiley_2_07' }, { 'id': 209, 'cn': '[红包]', 'hk': '[Packet]', 'us': '[Packet]', 'code': '', 'web_code': '', 'style': 'smiley_2_09' }, { 'id': 210, 'cn': '[蜡烛]', 'hk': '[蠟燭]', 'us': '[Candle]', 'code': '', 'web_code': '', 'style': 'smiley_2_10' }, { 'id': 215, 'cn': '[福]', 'hk': '[福]', 'us': '[Blessing]', 'code': '', 'web_code': '', 'style': 'smiley_2_15' }, { 'id': 214, 'cn': '[鸡]', 'hk': '[小雞]', 'us': '[Chick]', 'code': '', 'web_code': '', 'style': 'smiley_2_14' }, { 'id': 300, 'cn': '[笑脸]', 'emoji': '😄', 'hk': '', 'us': '', 'code': "\\ue415", 'web_code': '', 'style': 'smiley_u1F604' }, { 'id': 301, 'cn': '[生病]', 'emoji': '😷', 'hk': '', 'us': '', 'code': "\\ue40c", 'web_code': '', 'style': 'smiley_u1F637' }, { 'id': 302, 'cn': '[破涕为笑]', 'emoji': '😂', 'hk': '', 'us': '', 'code': "\\ue412", 'web_code': '', 'style': 'smiley_u1F602' }, { 'id': 303, 'cn': '[吐舌]', 'emoji': '😝', 'hk': '', 'us': '', 'code': "\\ue409", 'web_code': '', 'style': 'smiley_u1F61D' }, { 'id': 304, 'cn': '[脸红]', 'emoji': '😳', 'hk': '', 'us': '', 'code': "\\ue40d", 'web_code': '', 'style': 'smiley_u1F633' }, { 'id': 305, 'cn': '[恐惧]', 'emoji': '😱', 'hk': '', 'us': '', 'code': "\\ue107", 'web_code': '', 'style': 'smiley_u1F631' }, { 'id': 306, 'cn': '[失望]', 'emoji': '😔', 'hk': '', 'us': '', 'code': "\\ue403", 'web_code': '', 'style': 'smiley_u1F614' }, { 'id': 307, 'cn': '[无语]', 'emoji': '😒', 'hk': '', 'us': '', 'code': "\\ue40e", 'web_code': '', 'style': 'smiley_u1F612' }, { 'id': 308, 'cn': '[鬼魂]', 'emoji': '👻', 'hk': '', 'us': '', 'code': "\\ue11b", 'web_code': '', 'style': 'smiley_u1F47B' }, { 'id': 309, 'cn': '[合十]', 'emoji': '🙏', 'hk': '', 'us': '', 'code': "\\ue41d", 'web_code': '', 'style': 'smiley_u1F64F' }, { 'id': 310, 'cn': '[强壮]', 'emoji': '💪', 'hk': '', 'us': '', 'code': "\\ue14c", 'web_code': '', 'style': 'smiley_u1F4AA' }, { 'id': 311, 'cn': '[庆祝]', 'emoji': '🎉', 'hk': '', 'us': '', 'code': "\\ue312", 'web_code': '', 'style': 'smiley_u1F389' }, { 'id': 312, 'cn': '[礼物]', 'hk': '', 'us': '', 'code': "\\ue112", 'web_code': '', 'style': 'smiley_u1F381' }, { 'id': '17_1', 'cn': '[囧]', 'hk': '[囧]', 'us': '[Blush]', 'code': '', 'web_code': '', 'style': 'smiley_17' }, { 'id': '39_1', 'cn': '[再见]', 'hk': '[再見]', 'us': '[Bye]', 'code': '', 'web_code': '', 'style': 'smiley_39' }, { 'id': '83_1', 'cn': '[抱拳]', 'hk': '[抱拳]', 'us': '[Salute]', 'code': '', 'web_code': '', 'style': 'smiley_83' }, { 'id': '21smiley_2_1', 'cn': '[皱眉]', 'hk': '[皺眉]', 'us': '[Concerned]', 'code': '', 'web_code': '', 'style': 'smiley_2_12' }];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 60, 62, 63, 64, 65, 66, 67, 68, 70, 74, 75, 76, 78, 79, 80, 81, 82, 83, 84, 85, 89, 92, 93, 94, 95, 300, 301, 302, 303, 304, 305, 306, 307, 204, 205, 202, 206, 212, 211, 308, 309, 310, 311, 312, 209, 214];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var throttle = function throttle(func, wait, options) {
    var context = void 0;
    var args = void 0;
    var result = void 0;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function later() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/
    },
    properties: {
        list: {
            type: Array,
            value: [],
            observer: function observer(newVal) {
                var _this = this;

                if (newVal.length === 0) return;
                var data = this.data;
                var alphabet = data.list.map(function (item) {
                    return item.alpha;
                });
                this.setData({
                    alphabet: alphabet,
                    current: alphabet[0]
                }, function () {
                    _this.computedSize();
                });
            }
        },
        vibrated: {
            type: Boolean,
            value: true
        }
    },
    data: {
        windowHeight: 612,
        current: 'A',
        intoView: '',
        touching: false,
        alphabet: [],
        _tops: [],
        _anchorItemH: 0,
        _anchorItemW: 0,
        _anchorTop: 0,
        _listUpperBound: 0
    },
    lifetimes: {
        created: function created() {},
        attached: function attached() {
            this.__scrollTo = throttle(this._scrollTo, 100, {});
            this.__onScroll = throttle(this._onScroll, 100, {});

            var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
                windowHeight = _wx$getSystemInfoSync.windowHeight;

            this.setData({ windowHeight: windowHeight });
        }
    },
    methods: {
        choose: function choose(e) {
            var item = e.target.dataset.item;
            this.triggerEvent('choose', { item: item });
        },
        scrollTo: function scrollTo(e) {
            this.__scrollTo(e);
        },
        _scrollTo: function _scrollTo(e) {
            var data = this.data;
            var clientY = e.changedTouches[0].clientY;
            var index = Math.floor((clientY - data._anchorTop) / data._anchorItemH);
            var current = data.alphabet[index];
            this.setData({ current: current, intoView: current, touching: true });
            if (data.vibrated) wx.vibrateShort();
        },
        computedSize: function computedSize() {
            var data = this.data;
            var query = this.createSelectorQuery();
            query.selectAll('.index_list_item').boundingClientRect(function (rects) {
                var result = rects;
                data._tops = result.map(function (item) {
                    return item.top;
                });
            }).exec();
            query.select('.anchor-list').boundingClientRect(function (rect) {
                data._anchorItemH = rect.height / data.alphabet.length;
                data._anchorItemW = rect.width;
                data._anchorTop = rect.top;
            }).exec();
            query.select('.page-select-index').boundingClientRect(function (rect) {
                data._listUpperBound = rect.top;
            });
        },
        removeTouching: function removeTouching() {
            var _this2 = this;

            setTimeout(function () {
                _this2.setData({ touching: false });
            }, 150);
        },
        onScroll: function onScroll(e) {
            this.__onScroll(e);
        },
        _onScroll: function _onScroll(e) {
            var data = this.data;
            var _tops = data._tops,
                alphabet = data.alphabet;

            var scrollTop = e.detail.scrollTop;
            var current = '';
            if (scrollTop < _tops[0]) {
                current = alphabet[0];
            } else {
                for (var i = 0, len = _tops.length; i < len - 1; i++) {
                    if (scrollTop >= _tops[i] && scrollTop < _tops[i + 1]) {
                        current = alphabet[i];
                    }
                }
            }
            if (!current) current = alphabet[alphabet.length - 1];
            this.setData({ current: current });
        }
    }
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/,
        multipleSlots: true
    },
    properties: {
        tabs: { type: Array, value: [] },
        tabClass: { type: String, value: '' },
        swiperClass: { type: String, value: '' },
        activeClass: { type: String, value: '' },
        tabUnderlineColor: { type: String, value: '#07c160' },
        tabActiveTextColor: { type: String, value: '#000000' },
        tabInactiveTextColor: { type: String, value: '#000000' },
        tabBackgroundColor: { type: String, value: '#ffffff' },
        activeTab: { type: Number, value: 0 },
        duration: { type: Number, value: 500 }
    },
    data: {
        currentView: 0
    },
    observers: {
        activeTab: function activeTab(_activeTab) {
            var len = this.data.tabs.length;
            if (len === 0) return;
            var currentView = _activeTab - 1;
            if (currentView < 0) currentView = 0;
            if (currentView > len - 1) currentView = len - 1;
            this.setData({ currentView: currentView });
        }
    },
    lifetimes: {
        created: function created() {}
    },
    methods: {
        handleTabClick: function handleTabClick(e) {
            var index = e.currentTarget.dataset.index;
            this.setData({ activeTab: index });
            this.triggerEvent('tabclick', { index: index });
        },
        handleSwiperChange: function handleSwiperChange(e) {
            var index = e.detail.current;
            this.setData({ activeTab: index });
            this.triggerEvent('change', { index: index });
        }
    }
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/,
        multipleSlots: true
    },
    properties: {
        vtabs: { type: Array, value: [] },
        tabBarClass: { type: String, value: '' },
        activeClass: { type: String, value: '' },
        tabLineColor: { type: String, value: '#ff0000' },
        tabInactiveTextColor: { type: String, value: '#000000' },
        tabActiveTextColor: { type: String, value: '#ff0000' },
        tabInactiveBgColor: { type: String, value: '#eeeeee' },
        tabActiveBgColor: { type: String, value: '#ffffff' },
        activeTab: { type: Number, value: 0 },
        animation: { type: Boolean, value: true }
    },
    data: {
        currentView: 0,
        contentScrollTop: 0,
        _heightRecords: [],
        _contentHeight: {}
    },
    observers: {
        activeTab: function activeTab(_activeTab) {
            this.scrollTabBar(_activeTab);
        }
    },
    relations: {
        '../vtabs-content/index': {
            type: 'child',
            linked: function linked(target) {
                var _this = this;

                target.calcHeight(function (rect) {
                    _this.data._contentHeight[target.data.tabIndex] = rect.height;
                    if (_this._calcHeightTimer) {
                        clearTimeout(_this._calcHeightTimer);
                    }
                    _this._calcHeightTimer = setTimeout(function () {
                        _this.calcHeight();
                    }, 100);
                });
            },
            unlinked: function unlinked(target) {
                delete this.data._contentHeight[target.data.tabIndex];
            }
        }
    },
    lifetimes: {
        attached: function attached() {}
    },
    methods: {
        calcHeight: function calcHeight() {
            var length = this.data.vtabs.length;
            var _contentHeight = this.data._contentHeight;
            var _heightRecords = [];
            var temp = 0;
            for (var i = 0; i < length; i++) {
                _heightRecords[i] = temp + (_contentHeight[i] || 0);
                temp = _heightRecords[i];
            }
            this.data._heightRecords = _heightRecords;
        },
        scrollTabBar: function scrollTabBar(index) {
            var len = this.data.vtabs.length;
            if (len === 0) return;
            var currentView = index < 6 ? 0 : index - 5;
            if (currentView >= len) currentView = len - 1;
            this.setData({ currentView: currentView });
        },
        handleTabClick: function handleTabClick(e) {
            var _heightRecords = this.data._heightRecords;
            var index = e.currentTarget.dataset.index;
            var contentScrollTop = _heightRecords[index - 1] || 0;
            this.triggerEvent('tabclick', { index: index });
            this.setData({
                activeTab: index,
                contentScrollTop: contentScrollTop
            });
        },
        handleContentScroll: function handleContentScroll(e) {
            var _heightRecords = this.data._heightRecords;
            if (_heightRecords.length === 0) return;
            var length = this.data.vtabs.length;
            var scrollTop = e.detail.scrollTop;
            var index = 0;
            if (scrollTop >= _heightRecords[0]) {
                for (var i = 1; i < length; i++) {
                    if (scrollTop >= _heightRecords[i - 1] && scrollTop < _heightRecords[i]) {
                        index = i;
                        break;
                    }
                }
            }
            if (index !== this.data.activeTab) {
                this.triggerEvent('change', { index: index });
                this.setData({ activeTab: index });
            }
        }
    }
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },
    properties: {
        tabIndex: {
            type: Number,
            value: 0
        }
    },
    relations: {
        '../vtabs/index': {
            type: 'parent'
        }
    },
    lifetimes: {
        attached: function attached() {}
    },
    methods: {
        calcHeight: function calcHeight(callback) {
            var query = this.createSelectorQuery();
            query.select('.weui-vtabs-content__item').boundingClientRect(function (rect) {
                callback && callback(rect);
            }).exec();
        }
    }
});

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var selectQuery = __webpack_require__(10);
var target = '.weui-sticky';
Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/,
        multipleSlots: true
    },
    behaviors: [selectQuery],
    properties: {
        offsetTop: {
            type: Number,
            value: 0
        },
        zIndex: {
            type: Number,
            value: 99
        },
        disabled: {
            type: Boolean,
            value: false
        },
        container: {
            type: null
        }
    },
    data: {
        fixed: false,
        height: 0,
        _attached: false,
        _containerHeight: 0
    },
    observers: {
        disabled: function disabled(newVal) {
            if (!this._attached) return;
            newVal ? this.disconnectObserver() : this.initObserver();
        },
        container: function container(newVal) {
            if (typeof newVal !== 'function' || !this.data.height) return;
            this.observerContainer();
        }
    },
    lifetimes: {
        attached: function attached() {
            this.data._attached = true;
            if (!this.data.disabled) this.initObserver();
        },
        detached: function detached() {
            this.data._attached = false;
            this.disconnectObserver();
        }
    },
    methods: {
        getContainerRect: function getContainerRect() {
            var nodesRef = this.data.container();
            return new Promise(function (resolve) {
                return nodesRef.boundingClientRect(resolve).exec();
            });
        },
        initObserver: function initObserver() {
            var _this = this;

            this.disconnectObserver();
            this.getRect(target).then(function (rect) {
                _this.setData({
                    height: rect.height
                });
                _this.observerContent();
                _this.observerContainer();
            });
        },
        disconnectObserver: function disconnectObserver(observerName) {
            if (observerName) {
                var observer = this[observerName];
                observer && observer.disconnect();
            } else {
                this.contentObserver && this.contentObserver.disconnect();
                this.containerObserver && this.containerObserver.disconnect();
            }
        },
        observerContent: function observerContent() {
            var _this2 = this;

            var offsetTop = this.data.offsetTop;

            this.disconnectObserver('contentObserver');
            var contentObserver = this.createIntersectionObserver({
                thresholds: [1],
                initialRatio: 1
            });
            contentObserver.relativeToViewport({
                top: -offsetTop
            });
            contentObserver.observe(target, function (res) {
                if (_this2.data.disabled) return;
                _this2.setFixed(res.boundingClientRect.top);
            });
            this.contentObserver = contentObserver;
        },
        observerContainer: function observerContainer() {
            var _this3 = this;

            var _data = this.data,
                container = _data.container,
                height = _data.height,
                offsetTop = _data.offsetTop;

            if (typeof container !== 'function') return;
            this.disconnectObserver('containerObserver');
            this.getContainerRect().then(function (rect) {
                _this3.getRect(target).then(function (contentRect) {
                    var _contentTop = contentRect.top;
                    var _containerTop = rect.top;
                    var _containerHeight = rect.height;
                    var _relativeTop = _contentTop - _containerTop;
                    var containerObserver = _this3.createIntersectionObserver({
                        thresholds: [1],
                        initialRatio: 1
                    });
                    containerObserver.relativeToViewport({
                        top: _containerHeight - height - offsetTop - _relativeTop
                    });
                    containerObserver.observe(target, function (res) {
                        if (_this3.data.disabled) return;
                        _this3.setFixed(res.boundingClientRect.top);
                    });
                    _this3.data._relativeTop = _relativeTop;
                    _this3.data._containerHeight = _containerHeight;
                    _this3.containerObserver = containerObserver;
                });
            });
        },
        setFixed: function setFixed(top) {
            var _data2 = this.data,
                height = _data2.height,
                _containerHeight = _data2._containerHeight,
                _relativeTop = _data2._relativeTop,
                offsetTop = _data2.offsetTop;

            var fixed = _containerHeight && height ? top >= height + offsetTop + _relativeTop - _containerHeight && top < offsetTop : top < offsetTop;
            this.triggerEvent('scroll', {
                scrollTop: top,
                isFixed: fixed
            });
            this.setData({ fixed: fixed });
        }
    }
});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Behavior({
  methods: {
    getRect: function getRect(selector) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.createSelectorQuery().select(selector).boundingClientRect(function (rect) {
          if (rect) {
            resolve(rect);
          } else {
            reject(new Error("can not find selector: " + selector));
          }
        }).exec();
      });
    },
    getAllRects: function getAllRects(selector) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.createSelectorQuery().selectAll(selector).boundingClientRect(function (rects) {
          if (rects && rects.lenght > 0) {
            resolve(rects);
          } else {
            reject(new Error("can not find selector: " + selector));
          }
        }).exec();
      });
    }
  }
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Component({
    options: {
        addGlobalClass: true
    },
    properties: {
        space: {
            type: String,
            value: ''
        },
        decode: {
            type: Boolean,
            value: false
        },
        placement: {
            type: String,
            value: 'top'
        },
        showCopyBtn: {
            type: Boolean,
            value: false
        },
        value: {
            type: String,
            value: ''
        },
        zIndex: {
            type: Number,
            value: 99
        },
        activeBgColor: {
            type: String,
            value: '#DEDEDE'
        },
        onDocumentTap: {
            type: Object,
            value: {}
        }
    },
    observers: {
        onDocumentTap: function onDocumentTap() {
            this.setData({
                showToolTip: false
            });
        }
    },
    data: {
        showToolTip: false
    },
    methods: {
        handleLongPress: function handleLongPress() {
            if (!this.data.showCopyBtn) return;
            this.setData({
                showToolTip: true
            });
        },
        handleCopy: function handleCopy() {
            this.setData({
                showToolTip: false
            });
            wx.setClipboardData({
                data: this.data.value
            });
            this.triggerEvent('copy', {});
        },
        stopPropagation: function stopPropagation(e) {}
    }
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });

/***/ })
/******/ ]);