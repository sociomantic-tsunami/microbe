(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.µ = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _dom = require('./dom');

var _dom2 = _interopRequireDefault(_dom);

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _observe = require('./observe');

var _observe2 = _interopRequireDefault(_observe);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

var _pseudo = require('./pseudo');

var _pseudo2 = _interopRequireDefault(_pseudo);

exports['default'] = _core2['default'];
module.exports = exports['default'];

},{"./core":18,"./dom":19,"./events":20,"./http":21,"./init":22,"./observe":23,"./pseudo":24}],2:[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events')

	// Export Domain
	var domain = {}
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter()

		function emitError(e) {
			d.emit('error', e)
		}

		d.add = function(emitter){
			emitter.on('error', emitError)
		}
		d.remove = function(emitter){
			emitter.removeListener('error', emitError)
		}
		d.bind = function(fn){
			return function(){
				var args = Array.prototype.slice.call(arguments)
				try {
					fn.apply(null, args)
				}
				catch (err){
					emitError(err)
				}
			}
		}
		d.intercept = function(fn){
			return function(err){
				if ( err ) {
					emitError(err)
				}
				else {
					var args = Array.prototype.slice.call(arguments, 1)
					try {
						fn.apply(null, args)
					}
					catch (err){
						emitError(err)
					}
				}
			}
		}
		d.run = function(fn){
			try {
				fn()
			}
			catch (err) {
				emitError(err)
			}
			return this
		};
		d.dispose = function(){
			this.removeAllListeners()
			return this
		};
		d.enter = d.exit = function(){
			return this
		}
		return d
	};
	return domain
}).call(this)
},{"events":3}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (global){
//    Copyright 2012 Kap IT (http://www.kapit.fr/)
//
//    Licensed under the Apache License, Version 2.0 (the 'License');
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an 'AS IS' BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//    Author : François de Campredon (http://francois.de-campredon.fr/),

// Object.observe Shim
// ===================

// *See [The harmony proposal page](http://wiki.ecmascript.org/doku.php?id=harmony:observe)*

(function (global) {
    'use strict';

    // Utilities
    // ---------

    // setImmediate shim used to deliver changes records asynchronously
    // use setImmediate if available
    var setImmediate = global.setImmediate || global.msSetImmediate,
        clearImmediate = global.clearImmediate || global.msClearImmediate;
    if (!setImmediate) {
        // fallback on setTimeout if not
        setImmediate = function (func, args) {
            return setTimeout(func, 0, args);
        };
        clearImmediate = function (id) {
            clearTimeout(id);
        };
    }


    // WeakMap
    // -------

    var PrivateMap;
    if (typeof WeakMap !== 'undefined')  {
        //use weakmap if defined
        PrivateMap = WeakMap;
    } else {
        //else use ses like shim of WeakMap
        /* jshint -W016 */
        var HIDDEN_PREFIX = '__weakmap:' + (Math.random() * 1e9 >>> 0),
            counter = new Date().getTime() % 1e9,
            mascot = {};

        PrivateMap = function () {
            this.name = HIDDEN_PREFIX + (Math.random() * 1e9 >>> 0) + (counter++ + '__');
        };

        PrivateMap.prototype = {
            has: function (key) {
                return key && key.hasOwnProperty(this.name);
            },

            get: function (key) {
                var value = key && key[this.name];
                return value === mascot ? undefined : value;
            },

            set: function (key, value) {
                Object.defineProperty(key, this.name, {
                    value : typeof value === 'undefined' ? mascot : value,
                    enumerable: false,
                    writable : true,
                    configurable: true
                });
            },

            'delete': function (key) {
                return delete key[this.name];
            }
        };


        var getOwnPropertyName = Object.getOwnPropertyNames;
        Object.defineProperty(Object, 'getOwnPropertyNames', {
            value: function fakeGetOwnPropertyNames(obj) {
                return getOwnPropertyName(obj).filter(function (name) {
                    return name.substr(0, HIDDEN_PREFIX.length) !== HIDDEN_PREFIX;
                });
            },
            writable: true,
            enumerable: false,
            configurable: true
        });
    }


    // Internal Properties
    // -------------------

    // An ordered list used to provide a deterministic ordering in which callbacks are called.
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#observercallbacks)
    var observerCallbacks = [];

    // This object is used as the prototype of all the notifiers that are returned by Object.getNotifier(O).
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#notifierprototype)
    var NotifierPrototype = Object.create(Object.prototype);

    // Used to store immediate uid reference
    var changeDeliveryImmediateUid;

    // Used to schedule a call to _deliverAllChangeRecords
    function setUpChangesDelivery() {
        clearImmediate(changeDeliveryImmediateUid);
        changeDeliveryImmediateUid = setImmediate(_deliverAllChangeRecords);
    }

    Object.defineProperty(NotifierPrototype, 'notify', {
        value: function notify(changeRecord) {
            var notifier = this;
            if (Object(notifier) !== notifier) {
                throw new TypeError('this must be an Object, given ' + notifier);
            }
            if (!notifier.__target) {
                return;
            }
            if (Object(changeRecord) !== changeRecord) {
                throw new TypeError('changeRecord must be an Object, given ' + changeRecord);
            }


            var type = changeRecord.type;
            if (typeof type !== 'string') {
                throw new TypeError('changeRecord.type must be a string, given ' + type);
            }

            var changeObservers = changeObserversMap.get(notifier);
            if (!changeObservers || changeObservers.length === 0) {
                return;
            }
            var target = notifier.__target,
                newRecord = Object.create(Object.prototype, {
                    'object': {
                        value: target,
                        writable : false,
                        enumerable : true,
                        configurable: false
                    }
                });
            for (var prop in changeRecord) {
                if (prop !== 'object') {
                    var value = changeRecord[prop];
                    Object.defineProperty(newRecord, prop, {
                        value: value,
                        writable : false,
                        enumerable : true,
                        configurable: false
                    });
                }
            }
            Object.preventExtensions(newRecord);
            _enqueueChangeRecord(notifier.__target, newRecord);
        },
        writable: true,
        enumerable: false,
        configurable : true
    });

    Object.defineProperty(NotifierPrototype, 'performChange', {
        value: function performChange(changeType, changeFn) {
            var notifier = this;
            if (Object(notifier) !== notifier) {
                throw new TypeError('this must be an Object, given ' + notifier);
            }
            if (!notifier.__target) {
                return;
            }
            if (typeof changeType !== 'string') {
                throw new TypeError('changeType must be a string given ' + notifier);
            }
            if (typeof changeFn !== 'function') {
                throw new TypeError('changeFn must be a function, given ' + changeFn);
            }

            _beginChange(notifier.__target, changeType);
            var error, changeRecord;
            try {
                changeRecord = changeFn.call(undefined);
            } catch (e) {
                error = e;
            }
            _endChange(notifier.__target, changeType);
            if (typeof error !== 'undefined') {
                throw error;
            }

            var changeObservers = changeObserversMap.get(notifier);
            if (changeObservers.length === 0) {
                return;
            }

            var target = notifier.__target,
                newRecord = Object.create(Object.prototype, {
                    'object': {
                        value: target,
                        writable : false,
                        enumerable : true,
                        configurable: false
                    },
                    'type': {
                        value: changeType,
                        writable : false,
                        enumerable : true,
                        configurable: false
                    }
                });
            if (typeof changeRecord !== 'undefined') {
                for (var prop in changeRecord) {
                    if (prop !== 'object' && prop !== 'type') {
                        var value = changeRecord[prop];
                        Object.defineProperty(newRecord, prop, {
                            value: value,
                            writable : false,
                            enumerable : true,
                            configurable: false
                        });
                    }
                }
            }

            Object.preventExtensions(newRecord);
            _enqueueChangeRecord(notifier.__target, newRecord);

        },
        writable: true,
        enumerable: false,
        configurable : true
    });

    // Implementation of the internal algorithm 'BeginChange'
    // described in the proposal.
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#beginchange)
    function _beginChange(object, changeType) {
        var notifier = Object.getNotifier(object),
            activeChanges = activeChangesMap.get(notifier),
            changeCount = activeChangesMap.get(notifier)[changeType];
        activeChanges[changeType] = typeof changeCount === 'undefined' ? 1 : changeCount + 1;
    }

    // Implementation of the internal algorithm 'EndChange'
    // described in the proposal.
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#endchange)
    function _endChange(object, changeType) {
        var notifier = Object.getNotifier(object),
            activeChanges = activeChangesMap.get(notifier),
            changeCount = activeChangesMap.get(notifier)[changeType];
        activeChanges[changeType] = changeCount > 0 ? changeCount - 1 : 0;
    }

    // Implementation of the internal algorithm 'ShouldDeliverToObserver'
    // described in the proposal.
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#shoulddelivertoobserver)
    function _shouldDeliverToObserver(activeChanges, acceptList, changeType) {
        var doesAccept = false;
        if (acceptList) {
            for (var i = 0, l = acceptList.length; i < l; i++) {
                var accept = acceptList[i];
                if (activeChanges[accept] > 0) {
                    return false;
                }
                if (accept === changeType) {
                    doesAccept = true;
                }
            }
        }
        return doesAccept;
    }


    // Map used to store corresponding notifier to an object
    var notifierMap = new PrivateMap(),
        changeObserversMap = new PrivateMap(),
        activeChangesMap = new PrivateMap();

    // Implementation of the internal algorithm 'GetNotifier'
    // described in the proposal.
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#getnotifier)
    function _getNotifier(target) {
        if (!notifierMap.has(target)) {
            var notifier = Object.create(NotifierPrototype);
            // we does not really need to hide this, since anyway the host object is accessible from outside of the
            // implementation. we just make it unwritable
            Object.defineProperty(notifier, '__target', { value : target });
            changeObserversMap.set(notifier, []);
            activeChangesMap.set(notifier, {});
            notifierMap.set(target, notifier);
        }
        return notifierMap.get(target);
    }



    // map used to store reference to a list of pending changeRecords
    // in observer callback.
    var pendingChangesMap = new PrivateMap();

    // Implementation of the internal algorithm 'EnqueueChangeRecord'
    // described in the proposal.
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#enqueuechangerecord)
    function _enqueueChangeRecord(object, changeRecord) {
        var notifier = Object.getNotifier(object),
            changeType = changeRecord.type,
            activeChanges = activeChangesMap.get(notifier),
            changeObservers = changeObserversMap.get(notifier);

        for (var i = 0, l = changeObservers.length; i < l; i++) {
            var observerRecord = changeObservers[i],
                acceptList = observerRecord.accept;
            if (_shouldDeliverToObserver(activeChanges, acceptList, changeType)) {
                var observer = observerRecord.callback,
                    pendingChangeRecords = [];
                if (!pendingChangesMap.has(observer))  {
                    pendingChangesMap.set(observer, pendingChangeRecords);
                } else {
                    pendingChangeRecords = pendingChangesMap.get(observer);
                }
                pendingChangeRecords.push(changeRecord);
            }
        }
        setUpChangesDelivery();
    }

    // map used to store a count of associated notifier to a function
    var attachedNotifierCountMap = new PrivateMap();

    // Remove reference all reference to an observer callback,
    // if this one is not used anymore.
    // In the proposal the ObserverCallBack has a weak reference over observers,
    // Without this possibility we need to clean this list to avoid memory leak
    function _cleanObserver(observer) {
        if (!attachedNotifierCountMap.get(observer) && !pendingChangesMap.has(observer)) {
            attachedNotifierCountMap.delete(observer);
            var index = observerCallbacks.indexOf(observer);
            if (index !== -1) {
                observerCallbacks.splice(index, 1);
            }
        }
    }

    // Implementation of the internal algorithm 'DeliverChangeRecords'
    // described in the proposal.
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#deliverchangerecords)
    function _deliverChangeRecords(observer) {
        var pendingChangeRecords = pendingChangesMap.get(observer);
        pendingChangesMap.delete(observer);
        if (!pendingChangeRecords || pendingChangeRecords.length === 0) {
            return false;
        }
        try {
            observer.call(undefined, pendingChangeRecords);
        }
        catch (e) { }

        _cleanObserver(observer);
        return true;
    }

    // Implementation of the internal algorithm 'DeliverAllChangeRecords'
    // described in the proposal.
    // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_internals#deliverallchangerecords)
    function _deliverAllChangeRecords() {
        var observers = observerCallbacks.slice();
        var anyWorkDone = false;
        for (var i = 0, l = observers.length; i < l; i++) {
            var observer = observers[i];
            if (_deliverChangeRecords(observer)) {
                anyWorkDone = true;
            }
        }
        return anyWorkDone;
    }


    Object.defineProperties(Object, {
        // Implementation of the public api 'Object.observe'
        // described in the proposal.
        // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_public_api#object.observe)
        'observe': {
            value: function observe(target, callback, accept) {
                if (Object(target) !== target) {
                    throw new TypeError('target must be an Object, given ' + target);
                }
                if (typeof callback !== 'function') {
                    throw new TypeError('observer must be a function, given ' + callback);
                }
                if (Object.isFrozen(callback)) {
                    throw new TypeError('observer cannot be frozen');
                }

                var acceptList;
                if (typeof accept === 'undefined') {
                    acceptList = ['add', 'update', 'delete', 'reconfigure', 'setPrototype', 'preventExtensions'];
                } else {
                    if (Object(accept) !== accept) {
                        throw new TypeError('accept must be an object, given ' + accept);
                    }
                    var len = accept.length;
                    if (typeof len !== 'number' || len >>> 0 !== len || len < 1) {
                        throw new TypeError('the \'length\' property of accept must be a positive integer, given ' + len);
                    }

                    var nextIndex = 0;
                    acceptList = [];
                    while (nextIndex < len) {
                        var next = accept[nextIndex];
                        if (typeof next !== 'string') {
                            throw new TypeError('accept must contains only string, given' + next);
                        }
                        acceptList.push(next);
                        nextIndex++;
                    }
                }


                var notifier = _getNotifier(target),
                    changeObservers = changeObserversMap.get(notifier);

                for (var i = 0, l = changeObservers.length; i < l; i++) {
                    if (changeObservers[i].callback === callback) {
                        changeObservers[i].accept = acceptList;
                        return target;
                    }
                }

                changeObservers.push({
                    callback: callback,
                    accept: acceptList
                });

                if (observerCallbacks.indexOf(callback) === -1)  {
                    observerCallbacks.push(callback);
                }
                if (!attachedNotifierCountMap.has(callback)) {
                    attachedNotifierCountMap.set(callback, 1);
                } else {
                    attachedNotifierCountMap.set(callback, attachedNotifierCountMap.get(callback) + 1);
                }
                return target;
            },
            writable: true,
            configurable: true
        },

        // Implementation of the public api 'Object.unobseve'
        // described in the proposal.
        // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_public_api#object.unobseve)
        'unobserve': {
            value: function unobserve(target, callback) {
                if (Object(target) !== target) {
                    throw new TypeError('target must be an Object, given ' + target);
                }
                if (typeof callback !== 'function') {
                    throw new TypeError('observer must be a function, given ' + callback);
                }
                var notifier = _getNotifier(target),
                    changeObservers = changeObserversMap.get(notifier);
                for (var i = 0, l = changeObservers.length; i < l; i++) {
                    if (changeObservers[i].callback === callback) {
                        changeObservers.splice(i, 1);
                        attachedNotifierCountMap.set(callback, attachedNotifierCountMap.get(callback) - 1);
                        _cleanObserver(callback);
                        break;
                    }
                }
                return target;
            },
            writable: true,
            configurable: true
        },

        // Implementation of the public api 'Object.deliverChangeRecords'
        // described in the proposal.
        // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_public_api#object.deliverchangerecords)
        'deliverChangeRecords': {
            value: function deliverChangeRecords(observer) {
                if (typeof observer !== 'function') {
                    throw new TypeError('callback must be a function, given ' + observer);
                }
                while (_deliverChangeRecords(observer)) {}
            },
            writable: true,
            configurable: true
        },

        // Implementation of the public api 'Object.getNotifier'
        // described in the proposal.
        // [Corresponding Section in ECMAScript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:observe_public_api#object.getnotifier)
        'getNotifier': {
            value: function getNotifier(target) {
                if (Object(target) !== target) {
                    throw new TypeError('target must be an Object, given ' + target);
                }
                if (Object.isFrozen(target)) {
                    return null;
                }
                return _getNotifier(target);
            },
            writable: true,
            configurable: true
        }

    });

})(typeof global !== 'undefined' ? global : this);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
//    Copyright 2012 Kap IT (http://www.kapit.fr/)
//
//    Licensed under the Apache License, Version 2.0 (the 'License');
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
//
//        http://www.apache.org/licenses/LICENSE-2.0
//
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an 'AS IS' BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.
//    Author : François de Campredon (http://francois.de-campredon.fr/),

// ObjectUtils
// ===========

(function (global) {
    'use strict';

    /**
     * @namespace
     */
    var ObserveUtils;
    if (typeof exports !== 'undefined') {
        ObserveUtils = exports;
    } else {
        ObserveUtils = global.ObserveUtils = {};
    }

    // Utilities
    // ---------


    // borrowing some array methods
    var arrSlice = Function.call.bind(Array.prototype.slice),
        arrMap = Function.call.bind(Array.prototype.map);

    // return true if the given property descriptor contains accessor
    function isAccessorDescriptor(desc) {
        if (typeof desc === 'undefined') {
            return false;
        }
        return ('get' in desc || 'set' in desc);
    }



    // getPropertyDescriptor shim
    // copied from [es6-shim](https://github.com/paulmillr/es6-shim)
    function getPropertyDescriptor(target, name) {
        var pd = Object.getOwnPropertyDescriptor(target, name),
            proto = Object.getPrototypeOf(target);
        while (typeof pd === 'undefined' && proto !== null) {
            pd = Object.getOwnPropertyDescriptor(proto, name);
            proto = Object.getPrototypeOf(proto);
        }
        return pd;
    }



    // egal shim
    // copied from [the ecmascript wiki](http://wiki.ecmascript.org/doku.php?id=harmony:egal)
    function sameValue(x, y) {
        if (x === y) {
            // 0 === -0, but they are not identical
            return x !== 0 || 1 / x === 1 / y;
        }

        // NaN !== NaN, but they are identical.
        // NaNs are the only non-reflexive value, i.e., if x !== x,
        // then x is a NaN.
        // isNaN is broken: it converts its argument to number, so
        // isNaN('foo') => true
        return x !== x && y !== y;
    }

    // cast a value as number, and test if the obtained result
    // is a positive finite integer, throw an error otherwise
    function isPositiveFiniteInteger(value, errorMessage) {
        value = Number(value);
        if (isNaN(value) || !isFinite(value) || value < 0 || value % 1 !== 0) {
            throw new RangeError(errorMessage.replace('$', value));
        }
        return value;
    }

    // defineObservableProperties Implementation
    // ------------------------------------------

    // Uid generation helper
    var uidCounter = 0;

    // Define a property on an object that will call the Notifier.notify method when updated
    function defineObservableProperty(target, property, originalValue) {

        //we store the value in an non-enumerable property with generated unique name
        var internalPropName = '_' + (uidCounter++) + property;

        if (target.hasOwnProperty(property)) {
            Object.defineProperty(target, internalPropName, {
                value: originalValue,
                writable: true,
                enumerable: false,
                configurable: true
            });
        }

        //then we create accessor method for our 'hidden' property,
        // that dispatch changesRecords when the value is updated
        Object.defineProperty(target, property, {
            get: function () {
                return this[internalPropName];
            },
            set: function (value) {
                if (!sameValue(value, this[internalPropName])) {
                    var oldValue = this[internalPropName];
                    Object.defineProperty(this, internalPropName, {
                        value: value,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    });
                    var notifier = Object.getNotifier(this);
                    notifier.notify({ type: 'update', name: property, oldValue: oldValue });
                }
            },
            enumerable: true,
            configurable: true
        });
    }


    // call defineObservableProperty for each property name passed as 'rest argument'

    /**
     * Define observable properties on the given object an return it.
     *
     * @param {Object} target
     * @param {...string} properties
     * @returns {Object}
     */
    ObserveUtils.defineObservableProperties = function defineObservableProperties(target, properties) {
        if (Object(target) !== target) {
            throw new TypeError('target must be an Object, given ' + target);
        }
        properties = arrSlice(arguments, 1);
        while (properties.length > 0) {
            var property = properties.shift(),
                descriptor = getPropertyDescriptor(target, property);

            if (!descriptor || !isAccessorDescriptor(descriptor)) {
                var originalValue = descriptor && descriptor.value;
                defineObservableProperty(target, property, originalValue);
            }
        }
        return target;
    };



    // List Implementation
    // ------------------------------------------

    /**
     *
     * @param length
     * @returns {*}
     * @constructor
     * @function
     */
    function List(length) {
        if (arguments.length === 0) {
            length = 0;
        }

        // in this case we create a list with a given length
        if (arguments.length <= 1 && typeof length === 'number') {
            if (this instanceof List) {
                this.length = length;
            }
            else {
                return new List(length);
            }
        }
        else {
            //here we create a list with initial values
            if (!(this instanceof List)) {
                return List.fromArray(arrSlice(arguments));
            }
            else {
                for (var i = 0, l = arguments.length ; i < l ; i++) {
                    this[i] = arguments[i];
                }
                this.length = arguments.length;
            }
        }
    }

    /**
     * Observe a list
     * @param {List} list
     * @param {function} observer
     */
    List.observe = function observe(list, observer) {
        Object.observe(list, observer, ['add', 'update', 'delete', 'splice']);
    };


    /**
     * Unobserve a list
     * @param {List} list
     * @param {function} observer
     */
    List.unobserve = function unobserve(list, observer) {
        Object.unobserve(list, observer);
    };

    /**
     * Create a list from a given array
     * @param array
     * @returns {List}
     */
    List.fromArray = function fromArray(array) {
        if (!Array.isArray(array)) {
            throw new Error();
        }

        var list = new List();
        for (var i = 0, l = array.length ; i < l ; i++) {
            list[i] = array[i];
        }
        list.length = array.length;
        return list;
    };

    Object.defineProperties(List.prototype, {
        /**
         * hidden value holder for the length property
         * @private
         */
        '_length' : {
            value : 0,
            enumerable: false,
            configurable: true,
            writable: true
        },
        /**
         * the length of the list
         * @property {number} length
         */
        'length' : {
            get : function () {
                return this._length;
            },
            set : function (value) {
                value = isPositiveFiniteInteger(value, 'Invalid  list length : $');
                var notifier = Object.getNotifier(this),
                    oldValue = this._length,
                    removed = [],
                    self = this;
                if (value !== oldValue) {
                    notifier.performChange('splice', function () {
                        Object.defineProperty(self, '_length', {
                            value : value,
                            enumerable: false,
                            configurable: true,
                            writable: true
                        });

                        var returnValue;
                        if (oldValue > value) {
                            //delete values if the length have been decreased
                            for (var i = value; i < oldValue; i++) {
                                removed.push(self[i]);
                                self.delete(i);
                            }
                            returnValue = {
                                index : value,
                                removed : removed,
                                addedCount: 0
                            };
                        } else {
                            returnValue = {
                                index : oldValue,
                                removed : removed,
                                addedCount: value - oldValue
                            };
                        }
                        notifier.notify({ type: 'update', name: 'length', oldValue: oldValue });

                        return returnValue;
                    });
                }

            },
            enumerable: true,
            configurable : true
        }
    });

    /**
     * Returns an Array copy of the list
     * @returns {Array}
     */
    List.prototype.toArray = function toArray() {
        return arrSlice(this);
    };

    /**
     * Returns an string representation of the list
     * @returns {string}
     */
    List.prototype.toString = function toString() {
        return this.toArray().toString();
    };


    /**
     * Returns an json representation of the list
     * @returns {string}
     */
    List.prototype.toJSON = function toJSON() {
        return this.toArray();
    };

    /**
     * set the givent value at the specified index.
     * @param {number} index
     * @param {*} value
     * @return {*}
     */
    List.prototype.set = function set(index, value) {
        index = isPositiveFiniteInteger(index, 'Invalid index : $');

        var notifier = Object.getNotifier(this),
            len = this.length,
            self = this;
        if (index >= len) {
            notifier.performChange('splice', function () {
                self[index] = value;
                notifier.notify({ type: 'add', name: index});
                Object.defineProperty(self, '_length', {
                    value : index + 1,
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
                notifier.notify({ type: 'update', name: 'length', oldValue: len });

                return {
                    index : len,
                    removed : [],
                    addedCount: self.length - len
                };
            });
        }
        else if (!sameValue(value, this[index])) {
            var oldValue = this[index];
            this[index] = value;
            notifier.notify({ type: 'update', name: index, oldValue: oldValue });
        }
        return value;
    };

    /**
     * delete the value at the specified index.
     * @param {number} index
     * @return {boolean}
     */
    List.prototype.delete = function del(index) {
        index = isPositiveFiniteInteger(index, 'Invalid index : $');
        if (this.hasOwnProperty(index)) {
            var oldValue = this[index];
            if (delete this[index]) {
                var notifier = Object.getNotifier(this);
                notifier.notify({ type: 'delete', name: index, oldValue: oldValue });
                return true;
            }
        }
        return false;
    };

    /**
     * create a new list resulting of the concatenation of all the List and array
     * passed as parameter with the addition of other values passed as parameter
     * @param {...*} args
     * @return {List}
     */
    List.prototype.concat = function concat(args) {
        args = arrMap(arguments, function (item) {
            return (item instanceof List) ?  item.toArray() : item;
        });
        return List.fromArray(Array.prototype.concat.apply(this.toArray(), args));
    };

    /**
     * Joins all elements of a List into a string.
     * @param {string} [separator]
     * @return {string}
     */
    List.prototype.join = function join(separator) {
        return this.toArray().join(separator);
    };


    /**
     * Removes the last element from a List and returns that element.
     * @return {*}
     */
    List.prototype.pop = function pop() {
        if (Object(this) !== this) {
            throw new TypeError('this mus be an object given : ' + this);
        }
        var len = isPositiveFiniteInteger(this.length, 'this must have a finite integer property \'length\', given : $');
        if (len === 0) {
            return void(0);
        } else {
            var newLen = len - 1,
                element = this[newLen],
                notifier =  Object.getNotifier(this),
                self = this;
            notifier.performChange('splice', function () {
                delete self[newLen];
                notifier.notify({ type: 'delete', name: newLen, oldValue: element });
                Object.defineProperty(self, '_length', {
                    value : newLen,
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
                notifier.notify({ type: 'update', name: 'length', oldValue: len });

                return {
                    index : newLen,
                    removed : [element],
                    addedCount: 0
                };
            });


            return element;
        }
    };

    /**
     * Mutates a List by appending the given elements and returning the new length of the array.
     * @param {...*} items
     * @return {number}
     */
    List.prototype.push = function push() {
        if (arguments.length > 0) {
            var argumentsLength = arguments.length,
                elements = arguments,
                len = this.length,
                notifier = Object.getNotifier(this),
                self = this,
                i, index;
            notifier.performChange('splice', function () {
                for (i = 0; i < argumentsLength; i++) {
                    index =  len + i;
                    // avoid the usage of the set function and manually
                    // set the value and notify the changes to avoid the notification of
                    // multiple length modification
                    self[index] = elements[i];
                    notifier.notify({
                        type : 'add',
                        name : index
                    });
                }
                Object.defineProperty(self, '_length', {
                    value : len + argumentsLength,
                    enumerable: false,
                    configurable: true,
                    writable: true
                });
                notifier.notify({ type: 'update', name: 'length', oldValue: len });
                return {
                    index : len,
                    removed : [],
                    addedCount: argumentsLength
                };
            });
        }
        return this.length;
    };

    /**
     * Reverses a List in place.  The first List element becomes the last and the last becomes the first.
     * @return {List}
     */
    List.prototype.reverse = function reverse() {
        var copy = this.toArray(),
            arr = copy.slice().reverse();

        for (var i = 0, l = arr.length; i < l; i++) {
            this.set(i, arr[i]);
        }

        return this;
    };

    /**
     * Removes the first element from a List and returns that element. This method changes the length of the List.
     * @return {*}
     */
    List.prototype.shift = function () {
        if (this.length === 0) {
            return void(0);
        }

        var arr = this.toArray(),
            element = arr.shift(),
            notifier = Object.getNotifier(this),
            self = this, len = this.length;
        notifier.performChange('splice', function () {
            for (var i = 0, l = arr.length; i < l; i++) {
                self.set(i, arr[i]);
            }
            self.delete(len - 1);

            Object.defineProperty(self, '_length', {
                value : len - 1,
                enumerable: false,
                configurable: true,
                writable: true
            });
            notifier.notify({ type: 'update', name: 'length', oldValue: len });

            return {
                index : 0,
                removed : [element],
                addedCount: 0
            };
        });


        return element;
    };

    /**
     * Returns a shallow copy of a portion of an List.
     * @param {number} [start]
     * @param {number} [end]
     * @return {List}
     */
    List.prototype.slice = function (start, end) {
        return List.fromArray(this.toArray().slice(start, end));
    };

    /**
     * Sorts the elements of a List in place and returns the List.
     * @param {function} [compareFn]
     * @return {List}
     */
    List.prototype.sort = function (compareFn) {
        var copy = this.toArray(),
            arr = copy.slice().sort(compareFn);
        for (var i = 0, l = arr.length; i < l; i++) {
            this.set(i, arr[i]);
        }
        return this;
    };

    /**
     * Changes the content of a List, adding new elements while removing old elements.
     * @return {List}
     */
    List.prototype.splice = function () {
        var returnValue = [],
            argumentsLength = arguments.length;

        if (argumentsLength > 0) {
            var arr = this.toArray(),
                notifier = Object.getNotifier(this),
                len = this.length,
                self = this,
                index = arguments[0],
                i, l;

            returnValue = Array.prototype.splice.apply(arr, arguments);
            notifier.performChange('splice', function () {
                for (i = 0, l = arr.length; i < l; i++) {
                    var oldValue = self[i];
                    if (!sameValue(oldValue, arr[i])) {
                        self[i] = arr[i];
                        notifier.notify(
                            i >= len ?
                                {type : 'add', name : i}:
                                {type : 'update', name : i, oldValue : oldValue}
                        );
                    }
                }


                if (len !== arr.length) {
                    if (len > arr.length) {
                        //delete values if the length have been decreased
                        for (i = arr.length; i < len; i++) {
                            self.delete(i);
                        }
                    }

                    Object.defineProperty(self, '_length', {
                        value : arr.length,
                        enumerable: false,
                        configurable: true,
                        writable: true
                    });
                    notifier.notify({ type: 'update', name: 'length', oldValue: len });
                }
                return {
                    index : index,
                    removed : returnValue,
                    addedCount: argumentsLength >= 2 ? argumentsLength - 2 : 0
                };
            });

        }
        return List.fromArray(returnValue);
    };

    /**
     * Adds one or more elements to the beginning of a List and returns the new length of the List.
     * @return {number}
     */
    List.prototype.unshift = function () {
        var argumentsLength  = arguments.length;
        if (argumentsLength > 0) {
            var arr = this.toArray(),
                notifier = Object.getNotifier(this),
                len = this.length,
                self = this;

            Array.prototype.unshift.apply(arr, arguments);
            notifier.performChange('splice', function () {
                for (var i = 0, l = arr.length; i < l; i++)  {
                    var oldValue = self[i];
                    if (!sameValue(oldValue, arr[i])) {
                        // avoid the usage of the set function and manually
                        // set the value and notify the changes to avoid the notification of
                        // multiple length modification
                        self[i] = arr[i];
                        notifier.notify(
                            i >= len ?
                                {type : 'add', name : i}:
                                {type : 'update', name : i, oldValue : oldValue}
                        );
                    }
                }

                if (len !== arr.length) {
                    if (len > arr.length) {
                        //delete values if the length have been decreased
                        for (i = arr.length; i < len; i++) {
                            self.delete(i);
                        }
                    }
                    Object.defineProperty(self, '_length', {
                        value : arr.length,
                        enumerable: false,
                        configurable: true,
                        writable: true
                    });
                    notifier.notify({ type: 'update', name: 'length', oldValue: len });
                }

                return {
                    index : 0,
                    removed : [],
                    addedCount: argumentsLength
                };
            });

        }
        return this.length;
    };

    /**
     * Apply a function against an accumulator and each value of the List (from left-to-right) as to reduce it to a single value.
     * @param {function} callback
     * @param {Object} [initialValue]
     * @return {Object}
     */
    List.prototype.reduce =  Array.prototype.reduce;

    /**
     * Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.
     * @param {function} callback
     * @param {Object} [initialValue]
     * @return {Object}
     */
    List.prototype.reduceRight =  Array.prototype.reduceRight;

    /**
     * Returns the first index at which a given element can be found in the List, or -1 if it is not present.
     * @param {Object} searchElement
     * @param {number} [fromIndex]
     * @return {number}
     */
    List.prototype.indexOf =  Array.prototype.indexOf;

    /**
     * Returns the last index at which a given element can be found in the List, or -1 if it is not present. The List is searched backwards, starting at fromIndex.
     * @param {Object} searchElement
     * @param {number} [fromIndex]
     * @return {number}
     */
    List.prototype.lastIndexOf = Array.prototype.lastIndexOf;

    /**
     * Tests whether all elements in the List pass the test implemented by the provided function.
     * @param {function} callback
     * @param {Object} [thisObject]
     * @return {boolean}
     */
    List.prototype.every = Array.prototype.every;

    /**
     * Creates a new List with all elements that pass the test implemented by the provided function
     * @param {function} callback
     * @param {Object} [thisObject]
     * @return {List}
     */
    List.prototype.filter = function (callback, thisObject) {
        return List.fromArray(this.toArray().filter(callback, thisObject));
    };

    /**
     * Executes a provided function once per List element.
     * @param {function} callback
     * @param {Object} [thisObject]
     * @return {void}
     */
    List.prototype.forEach = Array.prototype.forEach;

    /**
     * Creates a new List with the results of calling a provided function on every element in this List.
     * @param {function} callback
     * @param {Object} [thisObject]
     * @return {List}
     */
    List.prototype.map = function (callback, thisObject) {
        return List.fromArray(this.toArray().map(callback, thisObject));
    };

    /**
     * Tests whether some element in the List passes the test implemented by the provided function.
     * @param {function} callback
     * @param {Object} [thisObject]
     * @return {boolean}
     */
    List.prototype.some = Array.prototype.some;

    ObserveUtils.List = List;

})(this);
},{}],7:[function(require,module,exports){
'use strict';

module.exports = require('./lib')

},{"./lib":12}],8:[function(require,module,exports){
'use strict';

var asap = require('asap/raw');

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('not a function');
  }
  this._32 = 0;
  this._8 = null;
  this._89 = [];
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._83 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
};
function handle(self, deferred) {
  while (self._32 === 3) {
    self = self._8;
  }
  if (self._32 === 0) {
    self._89.push(deferred);
    return;
  }
  asap(function() {
    var cb = self._32 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._32 === 1) {
        resolve(deferred.promise, self._8);
      } else {
        reject(deferred.promise, self._8);
      }
      return;
    }
    var ret = tryCallOne(cb, self._8);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._32 = 3;
      self._8 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._32 = 1;
  self._8 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._32 = 2;
  self._8 = newValue;
  finale(self);
}
function finale(self) {
  for (var i = 0; i < self._89.length; i++) {
    handle(self, self._89[i]);
  }
  self._89 = null;
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  })
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}

},{"asap/raw":16}],9:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};

},{"./core.js":8}],10:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js');
var asap = require('asap/raw');

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._83);
  p._32 = 1;
  p._8 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._32 === 3) {
            val = val._8;
          }
          if (val._32 === 1) return res(i, val._8);
          if (val._32 === 2) reject(val._8);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

},{"./core.js":8,"asap/raw":16}],11:[function(require,module,exports){
'use strict';

var Promise = require('./core.js');

module.exports = Promise;
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err;
    });
  });
};

},{"./core.js":8}],12:[function(require,module,exports){
'use strict';

module.exports = require('./core.js');
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');

},{"./core.js":8,"./done.js":9,"./es6-extensions.js":10,"./finally.js":11,"./node-extensions.js":13}],13:[function(require,module,exports){
'use strict';

// This file contains then/promise specific extensions that are only useful
// for node.js interop

var Promise = require('./core.js');
var asap = require('asap');

module.exports = Promise;

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity;
  return function () {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop();
      }
      args.push(function (err, res) {
        if (err) reject(err);
        else resolve(res);
      })
      var res = fn.apply(self, args);
      if (res &&
        (
          typeof res === 'object' ||
          typeof res === 'function'
        ) &&
        typeof res.then === 'function'
      ) {
        resolve(res);
      }
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
}

},{"./core.js":8,"asap":14}],14:[function(require,module,exports){
"use strict";

// rawAsap provides everything we need except exception management.
var rawAsap = require("./raw");
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};

},{"./raw":15}],15:[function(require,module,exports){
(function (global){
"use strict";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],16:[function(require,module,exports){
(function (process){
"use strict";

var domain; // The domain module is executed on demand
var hasSetImmediate = typeof setImmediate === "function";

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including network IO events in Node.js.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Avoids a function call
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory excaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

rawAsap.requestFlush = requestFlush;
function requestFlush() {
    // Ensure flushing is not bound to any domain.
    // It is not sufficient to exit the domain, because domains exist on a stack.
    // To execute code outside of any domain, the following dance is necessary.
    var parentDomain = process.domain;
    if (parentDomain) {
        if (!domain) {
            // Lazy execute the domain module.
            // Only employed if the user elects to use domains.
            domain = require("domain");
        }
        domain.active = process.domain = null;
    }

    // `setImmediate` is slower that `process.nextTick`, but `process.nextTick`
    // cannot handle recursion.
    // `requestFlush` will only be called recursively from `asap.js`, to resume
    // flushing after an error is thrown into a domain.
    // Conveniently, `setImmediate` was introduced in the same version
    // `process.nextTick` started throwing recursion errors.
    if (flushing && hasSetImmediate) {
        setImmediate(flush);
    } else {
        process.nextTick(flush);
    }

    if (parentDomain) {
        domain.active = process.domain = parentDomain;
    }
}

}).call(this,require('_process'))

},{"_process":4,"domain":2}],17:[function(require,module,exports){
(function (process){
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;

    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }

    // This function accepts the same arguments as setImmediate, but
    // returns a function that requires no arguments.
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function installNextTickImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }

    function installSetTimeoutImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(new Function("return this")()));

}).call(this,require('_process'))

},{"_process":4}],18:[function(require,module,exports){
/**
 * microbe.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsArray = require('./utils/array');

var _utilsString = require('./utils/string');

var _utilsTypes = require('./utils/types');

var _utilsTypes2 = _interopRequireDefault(_utilsTypes);

var _type = '[object Microbe]';

/**
 * µ constructor
 *
 * builds the µ object
 *
 * @return µ
 */
var Microbe = function Microbe(selector, scope, elements) {
    return new Microbe.core.__init__(selector, scope, elements);
};

Microbe.core = Microbe.prototype = {
    version: '0.3.1',

    constructor: Microbe,

    type: _type,

    length: 0,

    _selector: '',

    /**
     * Add Class
     *
     * adds the passed class to the current element(s)
     *
     * @param   {String}            _class              class to add
     *
     * @return  {Microbe}
     */
    addClass: (function () {
        var _addClass = function _addClass(_class, _el) {
            for (var i = 0, len = _class.length; i < len; i++) {
                _el.classList.add(_class[i]);
            }

            _el.data = _el.data || {};
            _el.data['class'] = _el.data['class'] || {};
            _el.data['class']['class'] = _el.className;
        };

        return function (_class) {
            if (typeof _class === 'string') {
                _class = [_class];
            }

            for (var i = 0, len = this.length; i < len; i++) {
                _addClass(_class, this[i]);
            }

            return this;
        };
    })(),

    /**
     * Append Element
     *
     * appends an element or elements to the microbe.  if there is more than
     * one target the next ones are cloned
     *
     * @param   {Element Array or Microbe}  _ele          element(s) to append
     *
     * @return  {Microbe}
     */
    append: (function () {
        var _append = function _append(_parentEl, _elm) {
            _parentEl.appendChild(_elm);
        };

        return function (_el) {
            if (!_el.length) {
                _el = [_el];
            }

            for (var i = 0, leni = this.length; i < leni; i++) {
                for (var j = 0, lenj = _el.length; j < lenj; j++) {
                    if (i !== 0) {
                        _append(this[i], _el[j].cloneNode(true));
                    } else {
                        _append(this[i], _el[j]);
                    }
                }
            }

            return this;
        };
    })(),

    /**
    * Alter/Get Attribute
    *
    * Changes the attribute by writing the given property and value to the
    * supplied elements.  If the value is omitted, simply returns the current
    * attribute value of the element.
    *
    * @param   {String}            _attribute          attribute name
    * @param   {String}            _value              attribute value (optional)
    *
    * @return  {Microbe or Array}
    */
    attr: function attr(_attribute, _value) {
        var _setAttr = function _setAttr(_elm) {
            if (_value === null) {
                _removeAttr(_elm);
            } else {
                if (!_elm.getAttribute) {
                    _elm[_attribute] = _value;
                } else {
                    _elm.setAttribute(_attribute, _value);
                }

                _elm.data = _elm.data || {};
                _elm.data.attr = _elm.data.attr || {};
                _elm.data.attr.attr = _elm.data.attr.attr || {};
                _elm.data.attr.attr[_attribute] = _value;
            }
        };

        var _getAttr = function _getAttr(_elm) {
            if (_elm.getAttribute(_attribute) === null) {
                return _elm[_attribute];
            }
            return _elm.getAttribute(_attribute);
        };

        var _removeAttr = function _removeAttr(_elm) {
            if (_elm.getAttribute(_attribute) === null) {
                delete _elm[_attribute];
            } else {
                _elm.removeAttribute(_attribute);
            }

            delete _elm.data.attr.attr[_attribute];
        };

        if (_value !== undefined) {
            var i, len;
            for (i = 0, len = this.length; i < len; i++) {
                _setAttr(this[i]);
            }

            return this;
        }

        var j, lenj;
        var attributes = new Array(this.length);
        for (j = 0, lenj = this.length; j < lenj; j++) {
            attributes[j] = _getAttr(this[j]);
        }

        return attributes;
    },

    /**
     * Children
     *
     * gets an array of all the given element's children
     *
     * @return {Array}                                  array of microbes
     */
    children: function children() {
        var _children = function _children(_elm) {
            return Microbe.toArray(_elm.children);
        };

        var i,
            len,
            childrenArray = new Array(this.length);

        for (i = 0, len = this.length; i < len; i++) {
            childrenArray[i] = new Microbe('', undefined, _children(this[i]));
        }

        return childrenArray;
    },

    /**
     * CSS
     *
     * Changes the CSS by writing the given property and value inline to the
     * supplied elements. (properties should be supplied in javascript format).
     * If the value is omitted, simply returns the current css value of the element.
     *
     * @param   {String}            _attribute          css property
     * @param   {String}            _value              css value (optional)
     *
     * @return  {Microbe or Array}
     */
    css: function css(_property, _value) {
        var _setCss = function _setCss(_elm) {
            _elm.data = _elm.data || {};
            _elm.data.css = _elm.data.css || {};
            _elm.data.css[_property] = _value;
            _elm.style[_property] = _elm.data.css[_property];
        };

        var _getCss = function _getCss(_elm) {
            return window.getComputedStyle(_elm).getPropertyValue(_property);
        };

        if (_value || _value === null || _value === '') {
            _value = _value === null ? '' : _value;

            var i, len;
            for (i = 0, len = this.length; i < len; i++) {
                _setCss(this[i]);
            }

            return this;
        }
        var j,
            lenj,
            styles = new Array(this.length);
        for (j = 0, lenj = this.length; j < lenj; j++) {
            styles[j] = _getCss(this[j]);
        }

        return styles;
    },

    /**
     * Each
     *
     * Methods iterates through all the elements an execute the function on each of
     * them
     *
     * @param  {Function}           _callback           function to apply to each item
     *
     * @return {Array}
     */
    each: function each(_callback) {
        var i, leni;
        for (i = 0, leni = this.length; i < leni; i++) {
            _callback(this[i], i);
        }
        return this;
    },

    /**
     * Filter Element
     *
     * filters the microbe by the given given selector
     *
     * @param  {String}             selector            selector to filter by
     *
     * @return {Microbe}
     */
    filter: function filter(_filter) {
        var originalSelector = this.selector();

        var selectorRegex = originalSelector.match(this.__selectorRegex),
            filterRegex = _filter.match(this.__selectorRegex);

        var _id = '',
            _tag = '',
            _psuedo = '',
            _class = '',
            _selector;

        var selectorArray = [selectorRegex, filterRegex];

        var i, lenI, j, lenJ;
        for (j = 0, lenJ = selectorArray.length; j < lenJ; j++) {
            if (selectorArray[j]) {
                for (i = 0, lenI = selectorArray[j].length; i < lenI; i++) {
                    var trigger = selectorArray[j][i][0];

                    switch (trigger) {
                        case '#':
                            _id += selectorArray[j][i];
                            break;

                        case '.':
                            _class += selectorArray[j][i];
                            break;

                        case ':':
                            _psuedo = selectorArray[j][i];
                            break;

                        default:
                            if (_tag !== selectorArray[j][i]) {
                                if (_tag !== '') {
                                    return new Microbe();
                                } else {
                                    _tag = selectorArray[j][i];
                                }
                            }
                            break;
                    }
                }
            }
        }

        _selector = _tag + _id + _class + _psuedo;

        return new Microbe(_selector);
    },

    /**
     * Find Element
     *
     * finds a child element with the given selector inside the scope of the current microbe
     *
     * @param  {String}             selector            selector to search for
     *
     * @return {Microbe}
     */
    find: function find(selector) {
        var _scope = this.selector();
        return new Microbe(selector, _scope);
    },

    /**
     * First Element
     *
     * Methods gets the first HTML Elements of the current object, and wrap it in
     * Microbe.
     *
     * @return  {Microbe}
     */
    first: function first() {
        if (this.length === 1) {
            return this;
        }

        return new Microbe([this[0]]);
    },

    /**
     * Get Parent Index
     *
     * gets the index of the item in it's parentNode's children array
     *
     * @return {Array}                                  array of indexes
     */
    getParentIndex: function getParentIndex() {
        var _getParentIndex = function _getParentIndex(_elm) {
            return Array.prototype.indexOf.call(_elm.parentNode.children, _elm);
        };

        var i,
            len,
            indexes = new Array(this.length);

        for (i = 0, len = this.length; i < len; i++) {
            indexes[i] = _getParentIndex(this[i]);
        }

        return indexes;
    },

    /**
     * Has Class
     *
     * Checks if the current object or the given element has the given class
     *
     * @param   {String}            _class              class to check
     *
     * @return  {Microbe}
    */
    hasClass: function hasClass(_class) {
        var _hasClass = function _hasClass(_elm) {
            return _elm.classList.contains(_class);
        };

        var i,
            len,
            results = new Array(this.length);
        for (i = 0, len = this.length; i < len; i++) {
            results[i] = _hasClass(this[i]);
        }

        return results;
    },

    /**
     * HTML
     *
     * Changes the innerHtml to the supplied string.  If the value is omitted,
     * simply returns the current inner html value of the element.
     *
     * @param   {String}            _value              html value (optional)
     *
     * @return  {Microbe or Array}
    */
    html: function html(_value) {
        var _getHtml = function _getHtml(_elm) {
            return _elm.innerHTML;
        };

        if (_value && _value.nodeType === 1) {
            return _getHtml(_value);
        }

        if (_value || _value === '') {
            var _setHtml = function _setHtml(_elm) {
                _elm.data = _elm.data || {};
                _elm.data.html = _elm.data.html || {};
                _elm.data.html.html = _value;
                _elm.innerHTML = _value;
            };

            var i, len;
            for (i = 0, len = this.length; i < len; i++) {
                _setHtml(this[i]);
            }

            return this;
        }

        var j,
            lenj,
            markup = new Array(this.length);
        for (j = 0, lenj = this.length; j < lenj; j++) {
            markup[j] = _getHtml(this[j]);
        }

        return markup;
    },

    /**
     * Index of
     *
     * returns the index of an element in this microbe
     *
     * @param {Element}             _el                 element to check
     *
     * @return {Number}
     */
    indexOf: function indexOf(_el) {
        return this.toArray().indexOf(_el);
    },

    /**
     * Insert After
     *
     * Inserts the given element after each of the elements given (or passed through this).
     * if it is an elemnet it is wrapped in a microbe object.  if it is a string it is created
     *
     * @example µ( '.elementsInDom' ).insertAfter( µElementToInsert )
     *
     * @param  {Object or String}   _elAfter            element to insert
     *
     * @return {Microbe}
     */
    insertAfter: function insertAfter(_elAfter) {
        var _this = this;
        var elementArray = [];

        var _insertAfter = function _insertAfter(_elm) {
            var nextIndex;

            nextIndex = _this.getParentIndex(_elm)[0];

            var node,
                nextEle = _elm.parentNode.children[nextIndex + 1];

            for (var i = 0, lenI = _elAfter.length; i < lenI; i++) {
                node = i === 0 ? _elAfter[i] : _elAfter[i].cloneNode(true);

                elementArray.push(node);

                if (nextEle) {
                    nextEle.parentNode.insertBefore(node, nextEle);
                } else {
                    _elm.parentNode.appendChild(node);
                }
            }
        };

        if (typeof _elAfter === 'string') {
            _elAfter = new Microbe(_elAfter);
        } else if (!_elAfter.length) {
            _elAfter = [_elAfter];
        }

        var i, len;
        for (i = 0, len = this.length; i < len; i++) {
            _insertAfter(this[i]);
        }

        return this.constructor(elementArray);
    },

    /**
     * Last Element
     *
     * Gets the last HTML Elements of the current object, and wrap it in
     * Microbe.
     *
     * @return  {Microbe}
     */
    last: function last() {
        if (this.length === 1) {
            return this;
        }

        return new Microbe([this[this.length - 1]]);
    },

    /**
     * Map
     *
     * native map function
     *
     * @param  {Function}           callback            function to apply to all element
     *
     * @return {Array}                                  array of callback returns
     */
    map: function map(callback) {
        return _utilsArray.map.call(this, callback);
    },

    /**
     * Parent
     *
     * sets all elements in a microbe to their parent nodes
     *
     * @return {Microbe}
     */
    parent: function parent() {
        var _parent = function _parent(_elm) {
            return _elm.parentNode;
        };

        var i,
            len,
            parentArray = new Array(this.length);

        for (i = 0, len = this.length; i < len; i++) {
            parentArray[i] = _parent(this[i]);
        }

        return new Microbe(parentArray);
    },

    /**
     * Push element
     *
     * adds a new element to a microbe
     *
     * @param  {Element}            _el                 element to add
     *
     * @return {Microbe}
     */
    push: function push(_el) {
        var length = this.length;

        if (_el && _el.nodeType === 1) {
            this[length] = _el;
            this.length = length + 1;
        }

        return this;
    },

    /**
     * Remove Element
     *
     * removes an element or elements from the dom
     *
     * @return {Microbe}
     */
    remove: function remove() {
        var _remove = function _remove(_elm) {
            return _elm.parentNode.removeChild(_elm);
        };

        var i, len;

        this.off();

        for (i = 0, len = this.length; i < len; i++) {
            _remove(this[i]);
        }

        return this;
    },

    /**
     * Remove Class
     *
     * Method removes the given class from the current object or the given element.
     *
     * @param   {String}            _class              class to remove
     *
     * @return  {Microbe}
    */
    removeClass: (function () {
        var _removeClass = function _removeClass(_class, _el) {
            _el.classList.remove(_class);

            _el.data = _el.data || {};
            _el.data['class'] = _el.data['class'] || {};
            _el.data['class']['class'] = _el.className;
        };

        return function (_class) {
            var i, len;
            for (i = 0, len = this.length; i < len; i++) {
                _removeClass(_class, this[i]);
            }

            return this;
        };
    })(),

    /**
     * returns the root elements of the document
     *
     * @return {Microbe}
     */
    root: function root() {
        var _root = this[0];

        if (_root) {
            while (_root.parentNode !== document) {
                _root = _root.parentNode;
            }

            return new Microbe([_root]);
        }

        return new Microbe([]);
    },

    /**
     * Get Selector
     *
     * returns the css selector from an element
     *
     * @return {String}                                  combined selectors
     */
    selector: function selector() {
        var self = this;

        return this._selector || (function () {
            var getSelectorString = function getSelectorString(_elm) {
                if (_elm && _elm.tagName) {
                    var tag = _elm.tagName.toLowerCase(),
                        id = _elm.id ? '#' + _elm.id : '',
                        clss = Array.prototype.join.call(_elm.classList, '.');

                    clss = clss !== '' ? '.' + clss : clss;

                    return tag + id + clss;
                }

                // document or window
                return '';
            };

            var _selector,
                selectors = [];

            for (var i = 0, lenI = self.length; i < lenI; i++) {
                _selector = getSelectorString(self[i]);

                if (selectors.indexOf(_selector) === -1) {
                    selectors.push(_selector);
                }
            }

            selectors = selectors.join(', ');
            self._selector = selectors;

            return selectors;
        })();
    },

    /**
     * Splice
     *
     * native splice wrapped in a microbe
     *
     * @return {Array}                                  array of elements
     */
    splice: function splice(_start, _end) {
        var arr = _utilsArray.splice.call(this, _start, _end);

        return new Microbe(arr);
    },

    /**
     * Text
     *
     * Changes the inner text to the supplied string. If the value is omitted,
     * simply returns the current inner html value of the element.
     *
     * @param   {String}            _value              Text value (optional)
     *
     * @return  {Microbe or Array}
    */
    text: (function () {
        var _setText = function _setText(_value, _el) {
            if (document.all) {
                _el.innerText = _value;
            } else // FF
                {
                    _el.textContent = _value;
                }

            _el.data = _el.data || {};
            _el.data.text = _el.data.text || {};
            _el.data.text.text = _value;
        };

        var _getText = function _getText(_el) {
            if (document.all) {
                return _el.innerText;
            } else // FF
                {
                    return _el.textContent;
                }
        };
        return function (_value) {
            if (_value || _value === '') {
                var i, len;
                for (i = 0, len = this.length; i < len; i++) {
                    _setText(_value, this[i]);
                }

                return this;
            }

            var j,
                lenj,
                arrayText = new Array(this.length);
            for (j = 0, lenj = this.length; j < lenj; j++) {
                arrayText[j] = _getText(this[j]);
            }

            return arrayText;
        };
    })(),

    /**
     * Toggle Class
     *
     * Methods calls removeClass on the current object or given element.
     *
     * @param   {String}            _class              class to add
     *
     * @return  {Microbe}
    */
    toggleClass: (function () {
        var _toggleClass = function _toggleClass(_class, _el) {
            if (_el.classList.contains(_class)) {
                _el.classList.remove(_class);
            } else {
                _el.classList.add(_class);
            }

            _el.data = _el.data || {};
            _el.data['class'] = _el.data['class'] || {};
            _el.data['class']['class'] = _el.className;
        };
        return function (_class) {
            var i, len;
            for (i = 0, len = this.length; i < len; i++) {
                _toggleClass(_class, this[i]);
            }

            return this;
        };
    })()
};

/**
 * Extend
 *
 * extends an object or microbe
 *
 * @return {Object}
 */
Microbe.extend = Microbe.core.extend = function () {
    var args = _utilsArray.slice.call(arguments);

    var index = 0;
    var length = args.length;
    var deep = false;
    var isArray;
    var target;
    var options;
    var src;
    var copy;
    var clone;

    if (args[index] === true) {
        deep = true;
        index += 1;
    }

    if (this.type === '[object Microbe]') {
        target = this;
    } else {
        if (Microbe.isObject(args[index])) {
            target = args[index];
        } else {
            target = {};
        }
    }

    for (; index < length; index++) {
        if ((options = args[index]) !== null) {
            for (var name in options) {
                if (options.hasOwnProperty(name)) {
                    isArray = false;
                    src = target[name];
                    copy = options[name];

                    if (target === copy || typeof copy === undefined) {
                        continue;
                    }

                    if (deep && copy && Microbe.isObject(copy)) {
                        if (Microbe.isArray(copy)) {
                            clone = src && Microbe.isArray(src) ? src : [];
                        } else {
                            clone = src && Microbe.isObject(src) ? src : {};
                        }

                        target[name] = Microbe.extend(deep, clone, copy);
                    }

                    target[name] = copy;
                }
            }
        }
    }

    return target;
};

/**
 * Merge
 *
 * combines microbes or array elements.
 *
 * @param  {Object or Array}        first               first array or array-like object
 * @param  {Object or Array}        second              second array or array-like object
 *
 * @return {Object or Array}                            combined arr or obj (based off first)
 */
Microbe.merge = Microbe.core.merge = function (first, second) {
    if (!second) {
        second = first;
        first = this;
    }

    var i = first.length;

    for (var j = 0, length = second.length; j < length; j++) {
        first[i++] = second[j];
    }

    first.length = i;

    return first;
};

/**
 * Capitalize String
 *
 * capitalizes every word in a string or an array of strings and returns the
 * type that it was given
 *
 * @param  {String or Array}        text                string(s) to capitalize
 *
 * @return {String or Array}                            capitalized string(s)
 */
Microbe.capitalize = function (text) {
    var array = Microbe.isArray(text);
    text = !array ? [text] : text;

    for (var i = 0, lenI = text.length; i < lenI; i++) {
        text[i] = text[i].split(' ');
        for (var j = 0, lenJ = text[i].length; j < lenJ; j++) {
            text[i][j] = text[i][j].charAt(0).toUpperCase() + text[i][j].slice(1);
        }
        text[i] = text[i].join(' ');
    }

    return array ? text : text[0];
};

// british people....
Microbe.capitalise = Microbe.capitalize;

/**
 * Identify a value
 *
 * returns itself if a value needs to be executed
 *
 * @param  {any}                    value               any value
 *
 * @return {value}
 */
Microbe.identity = function (value) {
    return value;
};

/**
 * nothing happens
 *
 * https://en.wikipedia.org/wiki/Xyzzy_(computing)
 *
 * @return {void}
 */
Microbe.noop = function () {};
Microbe.xyzzy = Microbe.noop;

/**
 * native isArray for completeness
 *
 * @type {Function}
 */
Microbe.isArray = Array.isArray;

/**
 * isEmpty
 *
 * checks if the passed object is empty
 *
 * @param  {Object}                 obj                 object to check
 *
 * @return {Boolean}                                    empty or not
 */
Microbe.isEmpty = function (obj) {
    var name;
    for (name in obj) {
        return false;
    }

    return true;
};

/**
 * isFunction
 *
 * checks if the passed parameter is a function
 *
 * @param  {Object}                 obj                 object to check
 *
 * @return {Boolean}                                    function or not
 */
Microbe.isFunction = function (obj) {
    return Microbe.type(obj) === 'function';
};

/**
 * isObject
 *
 * checks if the passed parameter is an object
 *
 * @param  {Object}                 obj                 object to check
 *
 * @return {Boolean}                                    isObject or not
 */
Microbe.isObject = function (obj) {
    if (Microbe.type(obj) !== 'object' || obj.nodeType || Microbe.isWindow(obj)) {
        return false;
    }

    return true;
};

/**
 * isUndefined
 *
 * @param  {String}                 obj                 property
 * @param  {Object}                 parent              object to check
 *
 * @return {Boolean}                                    obj in parent
 */
Microbe.isUndefined = function (obj, parent) {
    if (parent && typeof parent !== 'object') {
        return true;
    }

    return parent ? !(obj in parent) : obj === void 0;
};

/**
 * isWindow
 *
 * checks if the passed parameter equals window
 *
 * @param  {Object}                 obj                 object to check
 *
 * @return {Boolean}                                    isWindow or not
 */
Microbe.isWindow = function (obj) {
    return obj !== null && obj === obj.window;
};

/**
 * To string
 *
 * Methods returns the type of Microbe.
 *
 * @return  {String}
*/
Microbe.toString = Microbe.prototype.toString = function () {
    return _type;
};

/**
 * To array
 *
 * Methods returns all the elements in an array.
 *
 * @return  {Array}
*/
Microbe.toArray = Microbe.prototype.toArray = function (_arr) {
    _arr = _arr || this;
    return Array.prototype.slice.call(_arr);
};

/**
 * Type
 *
 * returns the type of the parameter passed to it
 *
 * @param  {all}                    obj                 parameter to test
 *
 * @return {String}                                     typeof obj
 */
Microbe.type = function (obj) {
    if (obj === null) {
        return obj + '';
    }

    var type = _utilsTypes2['default'][Object.prototype.toString.call(obj)];
    type = !type ? _utilsTypes2['default'][obj.toString()] : type;
    return type || typeof obj;
};

module.exports = Microbe;

},{"./utils/array":25,"./utils/string":26,"./utils/types":27}],19:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

_core2['default'].ready = function (_cb) {
    if (document.readyState === 'complete') {
        return _cb();
    }

    if (window.addEventListener) {
        window.addEventListener('load', _cb, false);
    } else if (window.attachEvent) {
        window.attachEvent('onload', _cb);
    } else {
        window.onload = _cb;
    }
};

},{"./core":18}],20:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

/**
 * CustomEvent pollyfill for IE >= 9
 *
 * @param   {str}               _event              HTMLEvent
 * @param   {obj}               _data               event data
 *
 * @return  {void}
 */
if (typeof CustomEvent !== 'function') {
    (function () {
        function CustomEvent(event, data) {
            data = data || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, data.bubbles, data.cancelable, data.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();
}

/**
 * emit event
 *
 * emits a custom event to the HTMLElements of the current object
 *
 * @param   {String}            _event              HTMLEvent
 * @param   {Object}            _data               event data
 * @param   {Boolean}           _bubbles            event bubbles?
 * @param   {Boolean}           _cancelable         cancelable?
 *
 * @return  {Microbe}
*/
_core2['default'].prototype.emit = function (_event, _data, _bubbles, _cancelable) {
    _bubbles = _bubbles || false;
    _cancelable = _cancelable || false;
    var _emit = function _emit(_elm) {
        var _evt = new CustomEvent(_event, {
            detail: _data,
            cancelable: _cancelable,
            bubbles: _bubbles
        });
        _elm.dispatchEvent(_evt);
    };

    var i, len;
    for (i = 0, len = this.length; i < len; i++) {
        _emit(this[i]);
    }

    return this;
};

/**
 * Bind Events
 *
 * Binds an event to the HTMLElements of the current object or to the
 * given element.
 *
 * @param   {String}            _event              HTMLEvent
 * @param   {Function}          _callback           callback function
 *
 * @return  {Microbe}
*/
_core2['default'].prototype.on = function (_event, _callback) {
    var _on = function _on(_elm) {
        var prop = '_' + _event + '-bound-function';

        _elm.data = _elm.data || {};
        _elm.data[prop] = _elm.data[prop] || {};
        _elm.data[prop][prop] = _elm.data[prop][prop] || [];

        _elm.data.__boundEvents = _elm.data.__boundEvents || {};
        _elm.data.__boundEvents.__boundEvents = _elm.data.__boundEvents.__boundEvents || [];

        _elm.addEventListener(_event, _callback);
        _elm.data[prop][prop].push(_callback);

        _elm.data.__boundEvents.__boundEvents.push(_event);
    };

    var i, len;
    for (i = 0, len = this.length; i < len; i++) {
        _on(this[i]);
    }

    return this;
};

/**
 * Unbind Events
 *
 * unbinds an/all events.
 *
 * @param   {str}           _event                  event name
 * @param   {func}          _callback               callback function
 * @param   {obj}           _el                     HTML element to modify (optional)
 *
 * @return  Microbe
*/
_core2['default'].prototype.off = function (_event, _callback) {
    var _off = function _off(_e, _elm) {
        _cb = _callback;
        var prop = '_' + _e + '-bound-function';

        if (!_cb && _elm.data && _elm.data[prop] && _elm.data[prop][prop]) {
            _cb = _elm.data[prop][prop];
        }

        if (_cb) {
            if (!Array.isArray(_cb)) {
                _cb = [_cb];
            }

            for (var j = 0, lenJ = _cb.length; j < lenJ; j++) {
                _elm.removeEventListener(_e, _cb[j]);
                _cb[j] = null;
            }

            _elm.data = _elm.data || {};
            _elm.data[prop] = _elm.data[prop] || {};
            _elm.data[prop][prop] = _cb;
        }
        _cb = null;
    };

    var _cb,
        filterFunction = function filterFunction(e) {
        return e;
    };
    for (var i = 0, len = this.length; i < len; i++) {
        var _elm = this[i];

        if (!_event && _elm.data && _elm.data.__boundEvents && _elm.data.__boundEvents.__boundEvents) {
            _event = _elm.data.__boundEvents.__boundEvents;
        } else {
            _elm.data = _elm.data || {};
            _elm.data.__boundEvents = _elm.data.__boundEvents || {};
        }

        if (!Array.isArray(_event)) {
            _event = [_event];
        }

        for (var j = 0, lenJ = _event.length; j < lenJ; j++) {
            _off(_event[j], _elm);
            _event[j] = null;
        }

        _elm.data.__boundEvents.__boundEvents = _event.filter(filterFunction);
    }

    return this;
};

},{"./core":18}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

/**
 * microbe.http.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * Http takes as many of few parameters, with url being the only required.
 * The return then has the methods .then( _cb ) and .error( _cb )
 *
 * @param {Object}             _parameters          http parameters. possible properties
 *                                                  method, url, data, user, password, headers, async
 */
var http = function http(_parameters) {
    var fail, req, method, url, data, user, password, headers, async;

    if (!_parameters) {
        return new Error('No parameters given');
    } else {
        if (typeof _parameters === 'string') {
            _parameters = { url: _parameters };
        }

        req = new XMLHttpRequest();
        method = _parameters.method || 'GET';
        url = _parameters.url;
        data = JSON.stringify(_parameters.data) || null;
        user = _parameters.user || '';
        password = _parameters.password || '';
        headers = _parameters.headers || null;
        async = typeof _parameters.async === 'boolean' ? _parameters.async : true;

        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                return req;
            }
        };
    }

    req.open(method, url, async, user, password);

    // weird Safari voodoo fix
    if (method === 'POST') {
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    if (headers) {
        for (var header in headers) {
            req.setRequestHeader(header, headers[header]);
        }
    }

    if (async) {
        return new _promise2['default'](function (resolve, reject) {
            req.onerror = function () {
                return reject(new Error('Network error!'));
            };

            req.send(data);
            req.onload = function () {
                if (req.status === 200) {
                    resolve(req.response);
                } else {
                    reject(new Error(req.status));
                }
            };
        });
    } else {
        var _response = function _response(_val) {
            var _responses = {
                /**
                 * .then()
                 *
                 * called after http(), http.get(), or http.post(), this is
                 * called passing the result as the first parameter to the callback
                 *
                 * @param  {Function}   _cb         function to call after http request
                 *
                 * @return {Object}                 contains the .catch method
                 */
                then: function then(_cb) {
                    if (_val.status === 200) {
                        _cb(_val.responseText);
                    }
                    return _responses;
                },

                /**
                 * .catch()
                 *
                 * called after http(), http.get(), or http.post(), this is
                 * called passing the error as the first parameter to the callback
                 *
                 * @param  {Function}   _cb         function to call after http request
                 *
                 * @return {Object}                 contains the .then method
                 */
                'catch': function _catch(_cb) {
                    if (_val.status !== 200) {
                        _cb({
                            status: _val.status,
                            statusText: _val.statusText
                        });
                    }
                    return _responses;
                }
            };
            return _responses;
        };

        req.send(data);
        req.onloadend = function () {
            req.onreadystatechange();
            return _response(req);
        };
        return req.onloadend();
    }
};

/**
 * Syntactic shortcut for simple GET requests
 *
 * @param  {String}             _url                file url
 *
 * @return {Object}                                 contains .then() and .catch()
 */
http.get = function (_url) {
    return http({
        url: _url,
        method: 'GET'
    });
};

/**
 * Syntactic shortcut for simple POST requests
 *
 * @param  {String}             _url                file url
 * @param  {Object or String}   _data               data to post to location
 *
 * @return {Object}                                 contains .then() and .catch()
 */
http.post = function (_url, _data) {
    return http({
        url: _url,
        data: _data,
        method: 'POST'
    });
};

_core2['default'].http = http;

exports['default'] = http;
module.exports = exports['default'];

},{"./core":18,"promise":7}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var trigger, _shortSelector;

var selectorRegex = _core2['default'].prototype.__selectorRegex = /(?:[\s]*\.([\w-_\.]+)|#([\w-_]+)|([^#\.:<][\w-_]*)|(<[\w-_#\.]+>)|:([^#\.<][\w-()_]*))/g;

// TODO: Check if we hit the duck

/**
 * Build
 *
 * builds and returns the final microbe
 *
 * @param  {Array}              _elements           array of elements
 * @param  {String}             _selector           selector
 *
 * @return {Microbe}                                microbe wrapped elements
 */
function _build(_elements, _selector) {
    var i = undefined,
        lenI = undefined;
    for (i = 0, lenI = _elements.length; i < lenI; i++) {
        if (_elements[i]) {
            _elements[i].data = _elements[i].data || {};
            this[i] = _elements[i];
        }
    }

    this._selector = _selector;
    this.length = i;

    return this;
}

/**
 * Create Element
 *
 * Method creates a Microbe from an element or a new element of the passed string, and
 * returns the Microbe
 *
 * @param   {Element}           _el                 element to create
 *
 * @return  {Microbe}
*/
function _create(_el) {
    var resultsRegex = _el.match(selectorRegex),
        _id = '',
        _tag = '',
        _class = '',
        _selector = '';

    for (var i = 0, lenI = resultsRegex.length; i < lenI; i++) {
        var trigger = resultsRegex[i][0];
        switch (trigger) {
            case '#':
                _id += resultsRegex[i];
                break;

            case '.':
                _class += resultsRegex[i];
                break;

            default:
                _tag += resultsRegex[i];
                break;
        }
    }

    if (typeof _tag === 'string') {
        _el = document.createElement(_tag);
        _selector = _tag;

        if (_id) {
            _selector += _id;
            _el.id = _id.slice(1);
        }

        if (_class) {
            _selector += _class;
            _class = _class.split('.');

            for (var i = 1, lenI = _class.length; i < lenI; i++) {
                _el.classList.add(_class[i]);
            }
        }
    }

    return _build.call(this, [_el], _selector);
}

/**
 * Contains
 *
 * checks if a given element is a child of _scope
 *
 * @param  {Element}            _el                 element to check
 * @param  {Element}            _scope              scope
 *
 * @return {Boolean}                                whether _el is contained in the scope
 */
function _contains(_el, _scope) {
    var parent = _el.parentNode;

    while (parent !== document && parent !== _scope) {
        parent = parent.parentNode || _scope.parentNode;
    }

    if (parent === document) {
        return false;
    }

    return true;
}

/**
 * Class Microbe
 *
 * Constructor.
 * Either selects or creates an HTML element and wraps it into a Microbe instance.
 * Usage:   µ('div#test')   ---> selection
 *          µ('<div#test>') ---> creation
 *
 * @param   {Element or String} _selector           HTML selector
 * @param   {Element}           _scope              scope to look inside
 * @param   {Element or Array}  _elements           elements to fill Microbe with (optional)
 *
 * @return  {Microbe}
*/
var init = _core2['default'].core.__init__ = function (_selector, _scope, _elements) {
    if (!_scope) {
        if (_selector && typeof _selector === 'string') {
            var _s = _selector[0];
            var _i, _c, _p;

            if (_s !== '<' && _selector.indexOf(':') === -1 && _selector.indexOf(' ') === -1) {
                switch (_s) {
                    case '#':
                        if (_selector.indexOf('.') === -1) {
                            var id = document.getElementById(_selector.slice(1));

                            if (id) {
                                id = [id];
                            } else {
                                id = [];
                            }

                            return _build.call(this, id, _selector);
                        }
                        break;
                    case '.':
                        if (_selector.indexOf('#') === -1) {
                            var clss = _selector.slice(1);

                            if (clss.indexOf('.') === -1) {
                                clss = document.getElementsByClassName(clss);

                                return _build.call(this, clss, _selector);
                            }
                        }
                        break;
                    default:
                        if (_selector.indexOf('#') === -1 && _selector.indexOf('.') === -1) {
                            var tag = document.getElementsByTagName(_selector);

                            return _build.call(this, tag, _selector);
                        }
                }
            }
        }
    }

    _selector = _selector || '';

    if (_selector.nodeType === 1 || Object.prototype.toString.call(_selector) === '[object Array]' || _selector === window || _selector === document) {
        _selector = _core2['default'].isArray(_selector) ? _selector : [_selector];
        return _build.call(this, _selector, '');
    }

    _scope = _scope === undefined ? document : _scope;

    if (_scope !== document) {
        if (_scope.type === '[object Microbe]') {
            _scope = _scope.selector();
        }

        if (typeof _scope === 'string' && typeof _selector === 'string') {
            if (_selector.indexOf(',') !== -1 || _scope.indexOf(',') !== -1) {
                var newSelector = '';
                _selector = _selector.split(',');
                _scope = _scope.split(',');

                for (var i = 0, lenI = _scope.length; i < lenI; i++) {
                    for (var j = 0, lenJ = _selector.length; j < lenJ; j++) {
                        newSelector += _scope[i] + ' ' + _selector[j] + ', ';
                    }
                }

                newSelector = newSelector.trim();
                newSelector = newSelector.slice(0, newSelector.length - 1);
            } else {
                _selector = _scope + ' ' + _selector;
                _scope = document;
            }
        }
    }

    var scopeNodeType = _scope.nodeType,
        nodeType = _selector ? _selector.nodeType || typeof _selector : null;

    if (_elements) {
        if (Object.prototype.toString.call(_elements) === '[object Array]') {
            return _build.call(this, _elements, _selector);
        } else {
            return _build.call(this, [_elements], _selector);
        }
    } else {
        if (!_selector || typeof _selector !== 'string' || scopeNodeType !== 1 && scopeNodeType !== 9) {
            return _build.call(this, [], _selector);
        }

        var resultsRegex = _selector.match(selectorRegex);

        if (resultsRegex && resultsRegex.length === 1) {
            trigger = resultsRegex[0][0];

            _shortSelector = _selector.slice(1);

            switch (trigger) {
                case '.':
                    // non-document scoped classname search
                    var _classesCount = (_selector || '').slice(1).split('.').length;

                    if (_classesCount === 1) {
                        return _build.call(this, _scope.getElementsByClassName(_shortSelector), _selector);
                    }
                    break;
                case '#':
                    // non-document scoped id search
                    var _id = document.getElementById(_shortSelector);

                    if (_scope.ownerDocument && _contains(_id, _scope)) {
                        return _build.call(this, [_id], _selector);
                    }
                    break;
                case '<':
                    // element creation
                    return _create.call(this, _selector.substring(1, _selector.length - 1));
                default:
                    return _build.call(this, _scope.getElementsByTagName(_selector), _selector);
            }
        }
    }

    if (!(this instanceof _core2['default'].core.__init__)) {
        return new _core2['default'].core.__init__(_selector, _scope, _elements);
    }

    var pseudo;
    if (_selector.indexOf(':') !== -1) {
        var _pseudoArray;
        pseudo = _selector.split(':');
        _selector = pseudo[0];
        pseudo.splice(0, 1);

        for (var i = 0, lenI = pseudo.length; i < lenI; i++) {
            _pseudoArray = pseudo[i].split('(');

            if (!_core2['default'].constructor.pseudo[_pseudoArray[0]]) {
                _selector += ':' + pseudo[i];
                pseudo.splice(i, 1);
            }
        }
    }

    var obj = _build.call(this, _scope.querySelectorAll(_selector), _selector);

    if (pseudo) {
        var _sel, _var;
        for (var i = 0, lenI = pseudo.length; i < lenI; i++) {
            _sel = pseudo[i].split('(');
            _var = _sel[1];
            if (_var) {
                _var = _var.slice(0, _var.length - 1);
            }
            _sel = _sel[0];

            if (_core2['default'].constructor.pseudo[_sel]) {
                obj = _core2['default'].constructor.pseudo[_sel](obj, _var);
            }
        }
    }

    return obj;
};

_core2['default'].core.__init__.prototype = _core2['default'].core;

exports['default'] = init;
module.exports = exports['default'];

},{"./core":18}],23:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

// shim needed for observe
if (!Object.observe) {
    require('setimmediate');
    require('observe-shim');
    var ObserveUtils = require('observe-utils');
}

/**
 * Get data
 *
 * gets the saved value from each element in the microbe in an array
 *
 * @param  {String}             _prop               property to get
 *
 * @return {Array}                                  array of values
 */
_core2['default'].prototype.get = function (prop) {
    var _get = function _get(_el) {
        if (!prop) {
            return _el.data;
        } else {
            if (_el.data[prop] && _el.data[prop][prop]) {
                return _el.data[prop][prop];
            } else {
                return false;
            }
        }
    };

    var i,
        len,
        values = new Array(this.length);

    for (i = 0, len = this.length; i < len; i++) {
        values[i] = _get(this[i]);
    }

    return values;
};

/**
 * Observe
 *
 * applies a function to an element if it is changed from within µ
 *
 * @param  {Function}           function            function to apply
 * @param  {String}             _prop               property to observe
 * @param  {Boolean}            _once               bool to trigger auto unobserve
 *
 * @return  {Microbe}
*/
_core2['default'].prototype.observe = function (prop, func, _once) {
    var self = this;

    var _observe = (function (_elm) {
        var _setObserve = function _setObserve(_target, _prop) {
            if (_once === true) {
                var _func = (function (e) {
                    _target._observeFunc(e);
                    Object.unobserve(_target, _func);
                }).bind(this);

                Object.observe(_target, _func);
            } else {
                Object.observe(_target, _target._observeFunc);
            }
        };

        var _setObserveFunc = function _setObserveFunc(_target) {
            if (_target._observeFunc) {
                Object.unobserve(_target, _target._observeFunc);
            }

            _target._observeFunc = func;

            return _target;
        };

        _elm.data = _elm.data || {};
        var _data = _elm.data;
        func = func.bind(this);

        var target = null;

        if (prop) {
            _data[prop] = _data[prop] || {};

            target = _setObserveFunc(_data[prop]);
            _setObserve(target, prop);
        } else {
            var _props = ['attr', 'text', 'css', 'html', 'class'];

            for (var i = 0, lenI = _props.length; i < lenI; i++) {
                _data[_props[i]] = _data[_props[i]] || {};

                target = _setObserveFunc(_data[_props[i]]);
                _setObserve(target, _props[i]);
            }

            target = _setObserveFunc(_data);
            _setObserve(target, null);
        }
    }).bind(this);

    if (typeof prop === 'function') {
        func = prop;
        prop = null;
    }

    var i,
        len,
        results = new Array(this.length);

    for (i = 0, len = this.length; i < len; i++) {
        _observe(this[i]);
    }

    return this;
};

/**
 * Observe Once
 *
 * applies a function to an element if it is changed from within µ (once)
 *
 * @param  {Function}           func                function to apply
 * @param  {String}             _prop               property to observe
 *
 * @return  Microbe
*/
_core2['default'].prototype.observeOnce = function (func, _prop) {
    this.observe(func, _prop, true);
};

/**
 * Set data
 *
 * sets the value to the data object in the each element in the microbe
 *
 * @param  {String}             prop                property to set
 * @param  {String}             value               value to set to
 *
 * @return {Microbe}
 */
_core2['default'].prototype.set = function (prop, value) {
    var _set = function _set(_el) {
        _el.data = _el.data || {};

        // shim
        if (ObserveUtils && !_el.data[prop]) {
            ObserveUtils.defineObservableProperties(_el.data, prop);
        }

        if (_core2['default'].isArray(value)) {
            value = _core2['default'].extend([], value);
        } else if (_core2['default'].isObject(value)) {
            value = _core2['default'].extend({}, value);
        }

        _el.data[prop] = _el.data[prop] || {};
        _el.data[prop][prop] = value;
    };

    var i,
        len,
        values = new Array(this.length);

    for (i = 0, len = this.length; i < len; i++) {
        values[i] = _set(this[i]);
    }

    return this;
};

/**
 * Stop observing
 *
 * stops watching the data changes of a µ onject
 *
 * @param   {String}            _prop               property to stop observing
 *
 * @return  {Microbe}
*/
_core2['default'].prototype.unobserve = function (_prop) {
    var _unobserve = (function (_elm) {
        var _data = _elm.data;

        if (_data) {
            if (_prop && _data[_prop] && _data[_prop]._observeFunc) {
                Object.unobserve(_data[_prop], _data[_prop]._observeFunc);
            } else if (!_prop) {
                if (_data._observeFunc) {
                    Object.unobserve(_data, _data._observeFunc);
                }

                for (var _property in _data) {
                    if (_data[_property]._observeFunc) {
                        Object.unobserve(_data[_property], _data[_property]._observeFunc);
                    }
                }
            }
        }
    }).bind(this);

    for (var i = 0, len = this.length; i < len; i++) {
        _unobserve(this[i]);
    }

    return this;
};

},{"./core":18,"observe-shim":5,"observe-utils":6,"setimmediate":17}],24:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

_core2['default'].constructor.prototype.pseudo = {
    /**
     * returns only elements that contain the given text.  The supplied text
     * is compared ignoring case
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     * @param  {String}         _var                string to search for
     *
     * @return {Microbe}
     */
    contains: function contains(_el, _var) {
        _var = _var.toLowerCase();

        var textArray = _el.text();
        var elements = [];

        for (var i = 0, lenI = _el.length; i < lenI; i++) {
            if (textArray[i].toLowerCase().indexOf(_var) !== -1) {
                elements.push(_el[i]);
            }
        }
        return _el.constructor(elements);
    },

    /**
     * returns the even indexed elements of a microbe (starting at 0)
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     *
     * @return {Microbe}
     */
    even: function even(_el) {
        var elements = [];
        for (var i = 0, lenI = _el.length; i < lenI; i++) {
            if ((i + 1) % 2 === 0) {
                elements.push(_el[i]);
            }
        }
        return _el.constructor(elements);
    },

    /**
     * returns the first element of a microbe
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     *
     * @return {Microbe}
     */
    first: function first(_el) {
        return _el.first();
    },

    /**
     * returns the last {_var} element
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     * @param  {String}         _var                number of elements to return
     *
     * @return {Microbe}
     */
    gt: function gt(_el, _var) {
        return _el.splice(_var, _el.length);
    },

    /**
     * returns elements that have the passed selector as a child
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     * @param  {String}         _var                selector string
     *
     * @return {Microbe}
     */
    has: function has(_el, _var) {
        var i,
            lenI,
            _obj,
            results = [];

        for (i = 0, lenI = _el.length; i < lenI; i++) {
            _obj = _el.constructor(_var, _el[i]);

            if (_obj.length !== 0) {
                results.push(_el[i]);
            }
        }

        return _el.constructor(results);
    },

    /**
     * returns the last element of a microbe
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     *
     * @return {Microbe}
     */
    last: function last(_el) {
        return _el.last();
    },

    /**
     * returns the first {_var} element
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     * @param  {String}         _var                number of elements to return
     *
     * @return {Microbe}
     */
    lt: function lt(_el, _var) {
        return _el.splice(0, _var);
    },

    /**
     * returns the odd indexed elements of a microbe
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     *
     * @return {Microbe}
     */
    odd: function odd(_el) {
        var elements = [];
        for (var i = 0, lenI = _el.length; i < lenI; i++) {
            if ((i + 1) % 2 !== 0) {
                elements.push(_el[i]);
            }
        }
        return _el.constructor(elements);
    },

    /**
     * returns the root elements of the document
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     *
     * @return {Microbe}
     */
    root: function root(_el) {
        return _el.root();
    },

    /**
     * returns a microbe with elements that match both the original selector, and the id of the page hash
     *
     * @param  {Microbe}        _el                 microbe to be filtered
     *
     * @return {Microbe}
     */
    target: function target(_el) {
        var hash = location.href.split('#')[1];

        var elements = [];

        if (hash) {
            for (var i = 0, lenI = _el.length; i < lenI; i++) {
                if (_el[i].id === hash) {
                    elements.push(_el[i]);
                }
            }
        }

        return _el.constructor(elements);
    }
};

},{"./core":18}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var fill = Array.prototype.fill;
exports.fill = fill;
var pop = Array.prototype.pop;
exports.pop = pop;
var push = Array.prototype.push;
exports.push = push;
var reverse = Array.prototype.reverse;
exports.reverse = reverse;
var shift = Array.prototype.shift;
exports.shift = shift;
var sort = Array.prototype.sort;
exports.sort = sort;
var splice = Array.prototype.splice;
exports.splice = splice;
var unshift = Array.prototype.unshift;
exports.unshift = unshift;
var concat = Array.prototype.concat;
exports.concat = concat;
var join = Array.prototype.join;
exports.join = join;
var slice = Array.prototype.slice;
exports.slice = slice;
var toSource = Array.prototype.toSource;
exports.toSource = toSource;
var toString = Array.prototype.toString;
exports.toString = toString;
var toLocaleString = Array.prototype.toLocaleString;
exports.toLocaleString = toLocaleString;
var indexOf = Array.prototype.indexOf;
exports.indexOf = indexOf;
var lastIndexOf = Array.prototype.lastIndexOf;
exports.lastIndexOf = lastIndexOf;
var forEach = Array.prototype.forEach;
exports.forEach = forEach;
var entries = Array.prototype.entries;
exports.entries = entries;
var every = Array.prototype.every;
exports.every = every;
var some = Array.prototype.some;
exports.some = some;
var filter = Array.prototype.filter;
exports.filter = filter;
var find = Array.prototype.find;
exports.find = find;
var findIndex = Array.prototype.findIndex;
exports.findIndex = findIndex;
var keys = Array.prototype.keys;
exports.keys = keys;
var map = Array.prototype.map;
exports.map = map;
var reduce = Array.prototype.reduce;
exports.reduce = reduce;
var reduceRight = Array.prototype.reduceRight;
exports.reduceRight = reduceRight;
var copyWithin = Array.prototype.copyWithi;

exports.copyWithin = copyWithin;
exports["default"] = {
    fill: fill,
    pop: pop,
    push: push,
    reverse: reverse,
    shift: shift,
    sort: sort,
    splice: splice,
    unshift: unshift,
    concat: concat,
    join: join,
    slice: slice,
    toSource: toSource,
    toString: toString,
    toLocaleString: toLocaleString,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    forEach: forEach,
    entries: entries,
    every: every,
    some: some,
    filter: filter,
    find: find,
    findIndex: findIndex,
    keys: keys,
    map: map,
    reduce: reduce,
    reduceRight: reduceRight,
    copyWithin: copyWithin
};

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var charAt = String.prototype.charAt;
exports.charAt = charAt;
var charCodeAt = String.prototype.charCodeAt;
exports.charCodeAt = charCodeAt;
var codePointAt = String.prototype.codePointAt;
exports.codePointAt = codePointAt;
var concat = String.prototype.concat;
exports.concat = concat;
var contains = String.prototype.contains;
exports.contains = contains;
var endsWith = String.prototype.endsWith;
exports.endsWith = endsWith;
var indexOf = String.prototype.indexOf;
exports.indexOf = indexOf;
var lastIndexOf = String.prototype.lastIndexOf;
exports.lastIndexOf = lastIndexOf;
var localeCompare = String.prototype.localeCompare;
exports.localeCompare = localeCompare;
var match = String.prototype.match;
exports.match = match;
var normalize = String.prototype.normalize;
exports.normalize = normalize;
var quote = String.prototype.quote;
exports.quote = quote;
var repeat = String.prototype.repeat;
exports.repeat = repeat;
var replace = String.prototype.replace;
exports.replace = replace;
var search = String.prototype.search;
exports.search = search;
var slice = String.prototype.slice;
exports.slice = slice;
var split = String.prototype.split;
exports.split = split;
var startsWith = String.prototype.startsWith;
exports.startsWith = startsWith;
var substr = String.prototype.substr;
exports.substr = substr;
var substring = String.prototype.substring;
exports.substring = substring;
var toLocaleLowerCase = String.prototype.toLocaleLowerCase;
exports.toLocaleLowerCase = toLocaleLowerCase;
var toLocaleUpperCase = String.prototype.toLocaleUpperCase;
exports.toLocaleUpperCase = toLocaleUpperCase;
var toLowerCase = String.prototype.toLowerCase;
exports.toLowerCase = toLowerCase;
var toSource = String.prototype.toSource;
exports.toSource = toSource;
var toString = String.prototype.toString;
exports.toString = toString;
var toUpperCase = String.prototype.toUpperCase;
exports.toUpperCase = toUpperCase;
var trim = String.prototype.trim;
exports.trim = trim;
var trimLeft = String.prototype.trimLeft;
exports.trimLeft = trimLeft;
var trimRight = String.prototype.trimRight;
exports.trimRight = trimRight;
var valueOf = String.prototype.valueOf;

exports.valueOf = valueOf;
exports["default"] = {
    charAt: charAt,
    charCodeAt: charCodeAt,
    codePointAt: codePointAt,
    concat: concat,
    contains: contains,
    endsWith: endsWith,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    localeCompare: localeCompare,
    match: match,
    normalize: normalize,
    quote: quote,
    repeat: repeat,
    replace: replace,
    search: search,
    slice: slice,
    split: split,
    startsWith: startsWith,
    substr: substr,
    substring: substring,
    toLocaleLowerCase: toLocaleLowerCase,
    toLocaleUpperCase: toLocaleUpperCase,
    toLowerCase: toLowerCase,
    toSource: toSource,
    toString: toString,
    toUpperCase: toUpperCase,
    trim: trim,
    trimLeft: trimLeft,
    trimRight: trimRight,
    valueOf: valueOf
};

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Error]': 'error',
    '[object Promise]': 'promise',
    '[object Microbe]': 'microbe'
};
module.exports = exports['default'];

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmljb2xhc2Ivd29ya3NwYWNlL3d3dy9taWNyb2JlL3NyYy9taWNyb2JlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2RvbWFpbi1icm93c2VyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL29ic2VydmUtc2hpbS9saWIvb2JzZXJ2ZS1zaGltLmpzIiwibm9kZV9tb2R1bGVzL29ic2VydmUtdXRpbHMvbGliL29ic2VydmUtdXRpbHMuanMiLCJub2RlX21vZHVsZXMvcHJvbWlzZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlL2xpYi9jb3JlLmpzIiwibm9kZV9tb2R1bGVzL3Byb21pc2UvbGliL2RvbmUuanMiLCJub2RlX21vZHVsZXMvcHJvbWlzZS9saWIvZXM2LWV4dGVuc2lvbnMuanMiLCJub2RlX21vZHVsZXMvcHJvbWlzZS9saWIvZmluYWxseS5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlL2xpYi9ub2RlLWV4dGVuc2lvbnMuanMiLCJub2RlX21vZHVsZXMvcHJvbWlzZS9ub2RlX21vZHVsZXMvYXNhcC9icm93c2VyLWFzYXAuanMiLCJub2RlX21vZHVsZXMvcHJvbWlzZS9ub2RlX21vZHVsZXMvYXNhcC9icm93c2VyLXJhdy5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlL25vZGVfbW9kdWxlcy9hc2FwL3Jhdy5qcyIsIm5vZGVfbW9kdWxlcy9zZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwiL1VzZXJzL25pY29sYXNiL3dvcmtzcGFjZS93d3cvbWljcm9iZS9zcmMvY29yZS5qcyIsIi9Vc2Vycy9uaWNvbGFzYi93b3Jrc3BhY2Uvd3d3L21pY3JvYmUvc3JjL2RvbS5qcyIsIi9Vc2Vycy9uaWNvbGFzYi93b3Jrc3BhY2Uvd3d3L21pY3JvYmUvc3JjL2V2ZW50cy5qcyIsIi9Vc2Vycy9uaWNvbGFzYi93b3Jrc3BhY2Uvd3d3L21pY3JvYmUvc3JjL2h0dHAuanMiLCIvVXNlcnMvbmljb2xhc2Ivd29ya3NwYWNlL3d3dy9taWNyb2JlL3NyYy9pbml0LmpzIiwiL1VzZXJzL25pY29sYXNiL3dvcmtzcGFjZS93d3cvbWljcm9iZS9zcmMvb2JzZXJ2ZS5qcyIsIi9Vc2Vycy9uaWNvbGFzYi93b3Jrc3BhY2Uvd3d3L21pY3JvYmUvc3JjL3BzZXVkby5qcyIsIi9Vc2Vycy9uaWNvbGFzYi93b3Jrc3BhY2Uvd3d3L21pY3JvYmUvc3JjL3V0aWxzL2FycmF5L2luZGV4LmpzIiwiL1VzZXJzL25pY29sYXNiL3dvcmtzcGFjZS93d3cvbWljcm9iZS9zcmMvdXRpbHMvc3RyaW5nL2luZGV4LmpzIiwiL1VzZXJzL25pY29sYXNiL3dvcmtzcGFjZS93d3cvbWljcm9iZS9zcmMvdXRpbHMvdHlwZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztvQkNBb0IsUUFBUTs7OztvQkFFWCxRQUFROzs7O21CQUNULE9BQU87Ozs7b0JBQ04sUUFBUTs7Ozt1QkFDTCxXQUFXOzs7O3NCQUNaLFVBQVU7Ozs7c0JBQ1YsVUFBVTs7Ozs7Ozs7QUNQN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3R2QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdktBLFlBQVksQ0FBQzs7OzswQkFFOEMsZUFBZTs7MkJBQ2pELGdCQUFnQjs7MEJBQ3ZCLGVBQWU7Ozs7QUFFakMsSUFBTSxLQUFLLEdBQVMsa0JBQWtC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Q1AsZUFBVyxFQUFYLFdBQVc7QUFDWCxpQkFBYSxFQUFiLGFBQWE7QUFDYixTQUFLLEVBQUwsS0FBSztBQUNMLGFBQVMsRUFBVCxTQUFTO0FBQ1QsU0FBSyxFQUFMLEtBQUs7QUFDTCxVQUFNLEVBQU4sTUFBTTtBQUNOLFdBQU8sRUFBUCxPQUFPO0FBQ1AsVUFBTSxFQUFOLE1BQU07QUFDTixTQUFLLEVBQUwsS0FBSztBQUNMLFNBQUssRUFBTCxLQUFLO0FBQ0wsY0FBVSxFQUFWLFVBQVU7QUFDVixVQUFNLEVBQU4sTUFBTTtBQUNOLGFBQVMsRUFBVCxTQUFTO0FBQ1QscUJBQWlCLEVBQWpCLGlCQUFpQjtBQUNqQixxQkFBaUIsRUFBakIsaUJBQWlCO0FBQ2pCLGVBQVcsRUFBWCxXQUFXO0FBQ1gsWUFBUSxFQUFSLFFBQVE7QUFDUixZQUFRLEVBQVIsUUFBUTtBQUNSLGVBQVcsRUFBWCxXQUFXO0FBQ1gsUUFBSSxFQUFKLElBQUk7QUFDSixZQUFRLEVBQVIsUUFBUTtBQUNSLGFBQVMsRUFBVCxTQUFTO0FBQ1QsV0FBTyxFQUFQLE9BQU87Q0FDVjs7Ozs7Ozs7cUJDOUREO0FBQ0kscUJBQWlCLEVBQUssUUFBUTtBQUM5QixxQkFBaUIsRUFBSyxRQUFRO0FBQzlCLHVCQUFtQixFQUFHLFVBQVU7QUFDaEMsb0JBQWdCLEVBQU0sT0FBTztBQUM3QixtQkFBZSxFQUFPLE1BQU07QUFDNUIscUJBQWlCLEVBQUssUUFBUTtBQUM5QixvQkFBZ0IsRUFBTSxPQUFPO0FBQzdCLHNCQUFrQixFQUFJLFNBQVM7QUFDL0Isc0JBQWtCLEVBQUksU0FBUztDQUNsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgTWljcm9iZSBmcm9tICcuL2NvcmUnO1xuXG5pbXBvcnQgaW5pdCBmcm9tICcuL2luaXQnO1xuaW1wb3J0IGRvbSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgaHR0cCBmcm9tICcuL2h0dHAnO1xuaW1wb3J0IG9ic2VydmUgZnJvbSAnLi9vYnNlcnZlJztcbmltcG9ydCBldmVudHMgZnJvbSAnLi9ldmVudHMnO1xuaW1wb3J0IHBzZXVkbyBmcm9tICcuL3BzZXVkbyc7XG5cbmV4cG9ydCBkZWZhdWx0IE1pY3JvYmU7XG4iLCIvKmdsb2JhbCBkZWZpbmU6ZmFsc2UgcmVxdWlyZTpmYWxzZSAqL1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKXtcblx0Ly8gSW1wb3J0IEV2ZW50c1xuXHR2YXIgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJylcblxuXHQvLyBFeHBvcnQgRG9tYWluXG5cdHZhciBkb21haW4gPSB7fVxuXHRkb21haW4uY3JlYXRlRG9tYWluID0gZG9tYWluLmNyZWF0ZSA9IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGQgPSBuZXcgZXZlbnRzLkV2ZW50RW1pdHRlcigpXG5cblx0XHRmdW5jdGlvbiBlbWl0RXJyb3IoZSkge1xuXHRcdFx0ZC5lbWl0KCdlcnJvcicsIGUpXG5cdFx0fVxuXG5cdFx0ZC5hZGQgPSBmdW5jdGlvbihlbWl0dGVyKXtcblx0XHRcdGVtaXR0ZXIub24oJ2Vycm9yJywgZW1pdEVycm9yKVxuXHRcdH1cblx0XHRkLnJlbW92ZSA9IGZ1bmN0aW9uKGVtaXR0ZXIpe1xuXHRcdFx0ZW1pdHRlci5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBlbWl0RXJyb3IpXG5cdFx0fVxuXHRcdGQuYmluZCA9IGZ1bmN0aW9uKGZuKXtcblx0XHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cylcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRmbi5hcHBseShudWxsLCBhcmdzKVxuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChlcnIpe1xuXHRcdFx0XHRcdGVtaXRFcnJvcihlcnIpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0ZC5pbnRlcmNlcHQgPSBmdW5jdGlvbihmbil7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oZXJyKXtcblx0XHRcdFx0aWYgKCBlcnIgKSB7XG5cdFx0XHRcdFx0ZW1pdEVycm9yKGVycilcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Zm4uYXBwbHkobnVsbCwgYXJncylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycil7XG5cdFx0XHRcdFx0XHRlbWl0RXJyb3IoZXJyKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRkLnJ1biA9IGZ1bmN0aW9uKGZuKXtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGZuKClcblx0XHRcdH1cblx0XHRcdGNhdGNoIChlcnIpIHtcblx0XHRcdFx0ZW1pdEVycm9yKGVycilcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzXG5cdFx0fTtcblx0XHRkLmRpc3Bvc2UgPSBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKVxuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9O1xuXHRcdGQuZW50ZXIgPSBkLmV4aXQgPSBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoaXNcblx0XHR9XG5cdFx0cmV0dXJuIGRcblx0fTtcblx0cmV0dXJuIGRvbWFpblxufSkuY2FsbCh0aGlzKSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLy8gICAgQ29weXJpZ2h0IDIwMTIgS2FwIElUIChodHRwOi8vd3d3LmthcGl0LmZyLylcbi8vXG4vLyAgICBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgJ0xpY2Vuc2UnKTtcbi8vICAgIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vICAgIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyAgICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyAgICBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiAnQVMgSVMnIEJBU0lTLFxuLy8gICAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyAgICBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyAgICBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbi8vICAgIEF1dGhvciA6IEZyYW7Dp29pcyBkZSBDYW1wcmVkb24gKGh0dHA6Ly9mcmFuY29pcy5kZS1jYW1wcmVkb24uZnIvKSxcblxuLy8gT2JqZWN0Lm9ic2VydmUgU2hpbVxuLy8gPT09PT09PT09PT09PT09PT09PVxuXG4vLyAqU2VlIFtUaGUgaGFybW9ueSBwcm9wb3NhbCBwYWdlXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255Om9ic2VydmUpKlxuXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIFV0aWxpdGllc1xuICAgIC8vIC0tLS0tLS0tLVxuXG4gICAgLy8gc2V0SW1tZWRpYXRlIHNoaW0gdXNlZCB0byBkZWxpdmVyIGNoYW5nZXMgcmVjb3JkcyBhc3luY2hyb25vdXNseVxuICAgIC8vIHVzZSBzZXRJbW1lZGlhdGUgaWYgYXZhaWxhYmxlXG4gICAgdmFyIHNldEltbWVkaWF0ZSA9IGdsb2JhbC5zZXRJbW1lZGlhdGUgfHwgZ2xvYmFsLm1zU2V0SW1tZWRpYXRlLFxuICAgICAgICBjbGVhckltbWVkaWF0ZSA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZSB8fCBnbG9iYWwubXNDbGVhckltbWVkaWF0ZTtcbiAgICBpZiAoIXNldEltbWVkaWF0ZSkge1xuICAgICAgICAvLyBmYWxsYmFjayBvbiBzZXRUaW1lb3V0IGlmIG5vdFxuICAgICAgICBzZXRJbW1lZGlhdGUgPSBmdW5jdGlvbiAoZnVuYywgYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuYywgMCwgYXJncyk7XG4gICAgICAgIH07XG4gICAgICAgIGNsZWFySW1tZWRpYXRlID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLy8gV2Vha01hcFxuICAgIC8vIC0tLS0tLS1cblxuICAgIHZhciBQcml2YXRlTWFwO1xuICAgIGlmICh0eXBlb2YgV2Vha01hcCAhPT0gJ3VuZGVmaW5lZCcpICB7XG4gICAgICAgIC8vdXNlIHdlYWttYXAgaWYgZGVmaW5lZFxuICAgICAgICBQcml2YXRlTWFwID0gV2Vha01hcDtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvL2Vsc2UgdXNlIHNlcyBsaWtlIHNoaW0gb2YgV2Vha01hcFxuICAgICAgICAvKiBqc2hpbnQgLVcwMTYgKi9cbiAgICAgICAgdmFyIEhJRERFTl9QUkVGSVggPSAnX193ZWFrbWFwOicgKyAoTWF0aC5yYW5kb20oKSAqIDFlOSA+Pj4gMCksXG4gICAgICAgICAgICBjb3VudGVyID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgJSAxZTksXG4gICAgICAgICAgICBtYXNjb3QgPSB7fTtcblxuICAgICAgICBQcml2YXRlTWFwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gSElEREVOX1BSRUZJWCArIChNYXRoLnJhbmRvbSgpICogMWU5ID4+PiAwKSArIChjb3VudGVyKysgKyAnX18nKTtcbiAgICAgICAgfTtcblxuICAgICAgICBQcml2YXRlTWFwLnByb3RvdHlwZSA9IHtcbiAgICAgICAgICAgIGhhczogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkgJiYga2V5Lmhhc093blByb3BlcnR5KHRoaXMubmFtZSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBrZXkgJiYga2V5W3RoaXMubmFtZV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBtYXNjb3QgPyB1bmRlZmluZWQgOiB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoa2V5LCB0aGlzLm5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgOiB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnID8gbWFzY290IDogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZXRlIGtleVt0aGlzLm5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgdmFyIGdldE93blByb3BlcnR5TmFtZSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlOYW1lcycsIHtcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBmYWtlR2V0T3duUHJvcGVydHlOYW1lcyhvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0T3duUHJvcGVydHlOYW1lKG9iaikuZmlsdGVyKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuYW1lLnN1YnN0cigwLCBISURERU5fUFJFRklYLmxlbmd0aCkgIT09IEhJRERFTl9QUkVGSVg7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vIEludGVybmFsIFByb3BlcnRpZXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBBbiBvcmRlcmVkIGxpc3QgdXNlZCB0byBwcm92aWRlIGEgZGV0ZXJtaW5pc3RpYyBvcmRlcmluZyBpbiB3aGljaCBjYWxsYmFja3MgYXJlIGNhbGxlZC5cbiAgICAvLyBbQ29ycmVzcG9uZGluZyBTZWN0aW9uIGluIEVDTUFTY3JpcHQgd2lraV0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpvYnNlcnZlX2ludGVybmFscyNvYnNlcnZlcmNhbGxiYWNrcylcbiAgICB2YXIgb2JzZXJ2ZXJDYWxsYmFja3MgPSBbXTtcblxuICAgIC8vIFRoaXMgb2JqZWN0IGlzIHVzZWQgYXMgdGhlIHByb3RvdHlwZSBvZiBhbGwgdGhlIG5vdGlmaWVycyB0aGF0IGFyZSByZXR1cm5lZCBieSBPYmplY3QuZ2V0Tm90aWZpZXIoTykuXG4gICAgLy8gW0NvcnJlc3BvbmRpbmcgU2VjdGlvbiBpbiBFQ01BU2NyaXB0IHdpa2ldKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6b2JzZXJ2ZV9pbnRlcm5hbHMjbm90aWZpZXJwcm90b3R5cGUpXG4gICAgdmFyIE5vdGlmaWVyUHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShPYmplY3QucHJvdG90eXBlKTtcblxuICAgIC8vIFVzZWQgdG8gc3RvcmUgaW1tZWRpYXRlIHVpZCByZWZlcmVuY2VcbiAgICB2YXIgY2hhbmdlRGVsaXZlcnlJbW1lZGlhdGVVaWQ7XG5cbiAgICAvLyBVc2VkIHRvIHNjaGVkdWxlIGEgY2FsbCB0byBfZGVsaXZlckFsbENoYW5nZVJlY29yZHNcbiAgICBmdW5jdGlvbiBzZXRVcENoYW5nZXNEZWxpdmVyeSgpIHtcbiAgICAgICAgY2xlYXJJbW1lZGlhdGUoY2hhbmdlRGVsaXZlcnlJbW1lZGlhdGVVaWQpO1xuICAgICAgICBjaGFuZ2VEZWxpdmVyeUltbWVkaWF0ZVVpZCA9IHNldEltbWVkaWF0ZShfZGVsaXZlckFsbENoYW5nZVJlY29yZHMpO1xuICAgIH1cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb3RpZmllclByb3RvdHlwZSwgJ25vdGlmeScsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG5vdGlmeShjaGFuZ2VSZWNvcmQpIHtcbiAgICAgICAgICAgIHZhciBub3RpZmllciA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoT2JqZWN0KG5vdGlmaWVyKSAhPT0gbm90aWZpZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIG11c3QgYmUgYW4gT2JqZWN0LCBnaXZlbiAnICsgbm90aWZpZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFub3RpZmllci5fX3RhcmdldCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChPYmplY3QoY2hhbmdlUmVjb3JkKSAhPT0gY2hhbmdlUmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2hhbmdlUmVjb3JkIG11c3QgYmUgYW4gT2JqZWN0LCBnaXZlbiAnICsgY2hhbmdlUmVjb3JkKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB2YXIgdHlwZSA9IGNoYW5nZVJlY29yZC50eXBlO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NoYW5nZVJlY29yZC50eXBlIG11c3QgYmUgYSBzdHJpbmcsIGdpdmVuICcgKyB0eXBlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNoYW5nZU9ic2VydmVycyA9IGNoYW5nZU9ic2VydmVyc01hcC5nZXQobm90aWZpZXIpO1xuICAgICAgICAgICAgaWYgKCFjaGFuZ2VPYnNlcnZlcnMgfHwgY2hhbmdlT2JzZXJ2ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBub3RpZmllci5fX3RhcmdldCxcbiAgICAgICAgICAgICAgICBuZXdSZWNvcmQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgICAgICAgICAgJ29iamVjdCc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0YXJnZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZSA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gY2hhbmdlUmVjb3JkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3AgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGNoYW5nZVJlY29yZFtwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5ld1JlY29yZCwgcHJvcCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBPYmplY3QucHJldmVudEV4dGVuc2lvbnMobmV3UmVjb3JkKTtcbiAgICAgICAgICAgIF9lbnF1ZXVlQ2hhbmdlUmVjb3JkKG5vdGlmaWVyLl9fdGFyZ2V0LCBuZXdSZWNvcmQpO1xuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZSA6IHRydWVcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb3RpZmllclByb3RvdHlwZSwgJ3BlcmZvcm1DaGFuZ2UnLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBwZXJmb3JtQ2hhbmdlKGNoYW5nZVR5cGUsIGNoYW5nZUZuKSB7XG4gICAgICAgICAgICB2YXIgbm90aWZpZXIgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKE9iamVjdChub3RpZmllcikgIT09IG5vdGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBtdXN0IGJlIGFuIE9iamVjdCwgZ2l2ZW4gJyArIG5vdGlmaWVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbm90aWZpZXIuX190YXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoYW5nZVR5cGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2hhbmdlVHlwZSBtdXN0IGJlIGEgc3RyaW5nIGdpdmVuICcgKyBub3RpZmllcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoYW5nZUZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2hhbmdlRm4gbXVzdCBiZSBhIGZ1bmN0aW9uLCBnaXZlbiAnICsgY2hhbmdlRm4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfYmVnaW5DaGFuZ2Uobm90aWZpZXIuX190YXJnZXQsIGNoYW5nZVR5cGUpO1xuICAgICAgICAgICAgdmFyIGVycm9yLCBjaGFuZ2VSZWNvcmQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNoYW5nZVJlY29yZCA9IGNoYW5nZUZuLmNhbGwodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBlcnJvciA9IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfZW5kQ2hhbmdlKG5vdGlmaWVyLl9fdGFyZ2V0LCBjaGFuZ2VUeXBlKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjaGFuZ2VPYnNlcnZlcnMgPSBjaGFuZ2VPYnNlcnZlcnNNYXAuZ2V0KG5vdGlmaWVyKTtcbiAgICAgICAgICAgIGlmIChjaGFuZ2VPYnNlcnZlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gbm90aWZpZXIuX190YXJnZXQsXG4gICAgICAgICAgICAgICAgbmV3UmVjb3JkID0gT2JqZWN0LmNyZWF0ZShPYmplY3QucHJvdG90eXBlLCB7XG4gICAgICAgICAgICAgICAgICAgICdvYmplY3QnOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAndHlwZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjaGFuZ2VUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGUgOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGUgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoYW5nZVJlY29yZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIGNoYW5nZVJlY29yZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCAhPT0gJ29iamVjdCcgJiYgcHJvcCAhPT0gJ3R5cGUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBjaGFuZ2VSZWNvcmRbcHJvcF07XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3UmVjb3JkLCBwcm9wLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhuZXdSZWNvcmQpO1xuICAgICAgICAgICAgX2VucXVldWVDaGFuZ2VSZWNvcmQobm90aWZpZXIuX190YXJnZXQsIG5ld1JlY29yZCk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGUgOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgaW50ZXJuYWwgYWxnb3JpdGhtICdCZWdpbkNoYW5nZSdcbiAgICAvLyBkZXNjcmliZWQgaW4gdGhlIHByb3Bvc2FsLlxuICAgIC8vIFtDb3JyZXNwb25kaW5nIFNlY3Rpb24gaW4gRUNNQVNjcmlwdCB3aWtpXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255Om9ic2VydmVfaW50ZXJuYWxzI2JlZ2luY2hhbmdlKVxuICAgIGZ1bmN0aW9uIF9iZWdpbkNoYW5nZShvYmplY3QsIGNoYW5nZVR5cGUpIHtcbiAgICAgICAgdmFyIG5vdGlmaWVyID0gT2JqZWN0LmdldE5vdGlmaWVyKG9iamVjdCksXG4gICAgICAgICAgICBhY3RpdmVDaGFuZ2VzID0gYWN0aXZlQ2hhbmdlc01hcC5nZXQobm90aWZpZXIpLFxuICAgICAgICAgICAgY2hhbmdlQ291bnQgPSBhY3RpdmVDaGFuZ2VzTWFwLmdldChub3RpZmllcilbY2hhbmdlVHlwZV07XG4gICAgICAgIGFjdGl2ZUNoYW5nZXNbY2hhbmdlVHlwZV0gPSB0eXBlb2YgY2hhbmdlQ291bnQgPT09ICd1bmRlZmluZWQnID8gMSA6IGNoYW5nZUNvdW50ICsgMTtcbiAgICB9XG5cbiAgICAvLyBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgaW50ZXJuYWwgYWxnb3JpdGhtICdFbmRDaGFuZ2UnXG4gICAgLy8gZGVzY3JpYmVkIGluIHRoZSBwcm9wb3NhbC5cbiAgICAvLyBbQ29ycmVzcG9uZGluZyBTZWN0aW9uIGluIEVDTUFTY3JpcHQgd2lraV0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpvYnNlcnZlX2ludGVybmFscyNlbmRjaGFuZ2UpXG4gICAgZnVuY3Rpb24gX2VuZENoYW5nZShvYmplY3QsIGNoYW5nZVR5cGUpIHtcbiAgICAgICAgdmFyIG5vdGlmaWVyID0gT2JqZWN0LmdldE5vdGlmaWVyKG9iamVjdCksXG4gICAgICAgICAgICBhY3RpdmVDaGFuZ2VzID0gYWN0aXZlQ2hhbmdlc01hcC5nZXQobm90aWZpZXIpLFxuICAgICAgICAgICAgY2hhbmdlQ291bnQgPSBhY3RpdmVDaGFuZ2VzTWFwLmdldChub3RpZmllcilbY2hhbmdlVHlwZV07XG4gICAgICAgIGFjdGl2ZUNoYW5nZXNbY2hhbmdlVHlwZV0gPSBjaGFuZ2VDb3VudCA+IDAgPyBjaGFuZ2VDb3VudCAtIDEgOiAwO1xuICAgIH1cblxuICAgIC8vIEltcGxlbWVudGF0aW9uIG9mIHRoZSBpbnRlcm5hbCBhbGdvcml0aG0gJ1Nob3VsZERlbGl2ZXJUb09ic2VydmVyJ1xuICAgIC8vIGRlc2NyaWJlZCBpbiB0aGUgcHJvcG9zYWwuXG4gICAgLy8gW0NvcnJlc3BvbmRpbmcgU2VjdGlvbiBpbiBFQ01BU2NyaXB0IHdpa2ldKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6b2JzZXJ2ZV9pbnRlcm5hbHMjc2hvdWxkZGVsaXZlcnRvb2JzZXJ2ZXIpXG4gICAgZnVuY3Rpb24gX3Nob3VsZERlbGl2ZXJUb09ic2VydmVyKGFjdGl2ZUNoYW5nZXMsIGFjY2VwdExpc3QsIGNoYW5nZVR5cGUpIHtcbiAgICAgICAgdmFyIGRvZXNBY2NlcHQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGFjY2VwdExpc3QpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYWNjZXB0TGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYWNjZXB0ID0gYWNjZXB0TGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ2hhbmdlc1thY2NlcHRdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhY2NlcHQgPT09IGNoYW5nZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9lc0FjY2VwdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkb2VzQWNjZXB0O1xuICAgIH1cblxuXG4gICAgLy8gTWFwIHVzZWQgdG8gc3RvcmUgY29ycmVzcG9uZGluZyBub3RpZmllciB0byBhbiBvYmplY3RcbiAgICB2YXIgbm90aWZpZXJNYXAgPSBuZXcgUHJpdmF0ZU1hcCgpLFxuICAgICAgICBjaGFuZ2VPYnNlcnZlcnNNYXAgPSBuZXcgUHJpdmF0ZU1hcCgpLFxuICAgICAgICBhY3RpdmVDaGFuZ2VzTWFwID0gbmV3IFByaXZhdGVNYXAoKTtcblxuICAgIC8vIEltcGxlbWVudGF0aW9uIG9mIHRoZSBpbnRlcm5hbCBhbGdvcml0aG0gJ0dldE5vdGlmaWVyJ1xuICAgIC8vIGRlc2NyaWJlZCBpbiB0aGUgcHJvcG9zYWwuXG4gICAgLy8gW0NvcnJlc3BvbmRpbmcgU2VjdGlvbiBpbiBFQ01BU2NyaXB0IHdpa2ldKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6b2JzZXJ2ZV9pbnRlcm5hbHMjZ2V0bm90aWZpZXIpXG4gICAgZnVuY3Rpb24gX2dldE5vdGlmaWVyKHRhcmdldCkge1xuICAgICAgICBpZiAoIW5vdGlmaWVyTWFwLmhhcyh0YXJnZXQpKSB7XG4gICAgICAgICAgICB2YXIgbm90aWZpZXIgPSBPYmplY3QuY3JlYXRlKE5vdGlmaWVyUHJvdG90eXBlKTtcbiAgICAgICAgICAgIC8vIHdlIGRvZXMgbm90IHJlYWxseSBuZWVkIHRvIGhpZGUgdGhpcywgc2luY2UgYW55d2F5IHRoZSBob3N0IG9iamVjdCBpcyBhY2Nlc3NpYmxlIGZyb20gb3V0c2lkZSBvZiB0aGVcbiAgICAgICAgICAgIC8vIGltcGxlbWVudGF0aW9uLiB3ZSBqdXN0IG1ha2UgaXQgdW53cml0YWJsZVxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5vdGlmaWVyLCAnX190YXJnZXQnLCB7IHZhbHVlIDogdGFyZ2V0IH0pO1xuICAgICAgICAgICAgY2hhbmdlT2JzZXJ2ZXJzTWFwLnNldChub3RpZmllciwgW10pO1xuICAgICAgICAgICAgYWN0aXZlQ2hhbmdlc01hcC5zZXQobm90aWZpZXIsIHt9KTtcbiAgICAgICAgICAgIG5vdGlmaWVyTWFwLnNldCh0YXJnZXQsIG5vdGlmaWVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm90aWZpZXJNYXAuZ2V0KHRhcmdldCk7XG4gICAgfVxuXG5cblxuICAgIC8vIG1hcCB1c2VkIHRvIHN0b3JlIHJlZmVyZW5jZSB0byBhIGxpc3Qgb2YgcGVuZGluZyBjaGFuZ2VSZWNvcmRzXG4gICAgLy8gaW4gb2JzZXJ2ZXIgY2FsbGJhY2suXG4gICAgdmFyIHBlbmRpbmdDaGFuZ2VzTWFwID0gbmV3IFByaXZhdGVNYXAoKTtcblxuICAgIC8vIEltcGxlbWVudGF0aW9uIG9mIHRoZSBpbnRlcm5hbCBhbGdvcml0aG0gJ0VucXVldWVDaGFuZ2VSZWNvcmQnXG4gICAgLy8gZGVzY3JpYmVkIGluIHRoZSBwcm9wb3NhbC5cbiAgICAvLyBbQ29ycmVzcG9uZGluZyBTZWN0aW9uIGluIEVDTUFTY3JpcHQgd2lraV0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpvYnNlcnZlX2ludGVybmFscyNlbnF1ZXVlY2hhbmdlcmVjb3JkKVxuICAgIGZ1bmN0aW9uIF9lbnF1ZXVlQ2hhbmdlUmVjb3JkKG9iamVjdCwgY2hhbmdlUmVjb3JkKSB7XG4gICAgICAgIHZhciBub3RpZmllciA9IE9iamVjdC5nZXROb3RpZmllcihvYmplY3QpLFxuICAgICAgICAgICAgY2hhbmdlVHlwZSA9IGNoYW5nZVJlY29yZC50eXBlLFxuICAgICAgICAgICAgYWN0aXZlQ2hhbmdlcyA9IGFjdGl2ZUNoYW5nZXNNYXAuZ2V0KG5vdGlmaWVyKSxcbiAgICAgICAgICAgIGNoYW5nZU9ic2VydmVycyA9IGNoYW5nZU9ic2VydmVyc01hcC5nZXQobm90aWZpZXIpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hhbmdlT2JzZXJ2ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdmFyIG9ic2VydmVyUmVjb3JkID0gY2hhbmdlT2JzZXJ2ZXJzW2ldLFxuICAgICAgICAgICAgICAgIGFjY2VwdExpc3QgPSBvYnNlcnZlclJlY29yZC5hY2NlcHQ7XG4gICAgICAgICAgICBpZiAoX3Nob3VsZERlbGl2ZXJUb09ic2VydmVyKGFjdGl2ZUNoYW5nZXMsIGFjY2VwdExpc3QsIGNoYW5nZVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9ic2VydmVyID0gb2JzZXJ2ZXJSZWNvcmQuY2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgIHBlbmRpbmdDaGFuZ2VSZWNvcmRzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKCFwZW5kaW5nQ2hhbmdlc01hcC5oYXMob2JzZXJ2ZXIpKSAge1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nQ2hhbmdlc01hcC5zZXQob2JzZXJ2ZXIsIHBlbmRpbmdDaGFuZ2VSZWNvcmRzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwZW5kaW5nQ2hhbmdlUmVjb3JkcyA9IHBlbmRpbmdDaGFuZ2VzTWFwLmdldChvYnNlcnZlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBlbmRpbmdDaGFuZ2VSZWNvcmRzLnB1c2goY2hhbmdlUmVjb3JkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXRVcENoYW5nZXNEZWxpdmVyeSgpO1xuICAgIH1cblxuICAgIC8vIG1hcCB1c2VkIHRvIHN0b3JlIGEgY291bnQgb2YgYXNzb2NpYXRlZCBub3RpZmllciB0byBhIGZ1bmN0aW9uXG4gICAgdmFyIGF0dGFjaGVkTm90aWZpZXJDb3VudE1hcCA9IG5ldyBQcml2YXRlTWFwKCk7XG5cbiAgICAvLyBSZW1vdmUgcmVmZXJlbmNlIGFsbCByZWZlcmVuY2UgdG8gYW4gb2JzZXJ2ZXIgY2FsbGJhY2ssXG4gICAgLy8gaWYgdGhpcyBvbmUgaXMgbm90IHVzZWQgYW55bW9yZS5cbiAgICAvLyBJbiB0aGUgcHJvcG9zYWwgdGhlIE9ic2VydmVyQ2FsbEJhY2sgaGFzIGEgd2VhayByZWZlcmVuY2Ugb3ZlciBvYnNlcnZlcnMsXG4gICAgLy8gV2l0aG91dCB0aGlzIHBvc3NpYmlsaXR5IHdlIG5lZWQgdG8gY2xlYW4gdGhpcyBsaXN0IHRvIGF2b2lkIG1lbW9yeSBsZWFrXG4gICAgZnVuY3Rpb24gX2NsZWFuT2JzZXJ2ZXIob2JzZXJ2ZXIpIHtcbiAgICAgICAgaWYgKCFhdHRhY2hlZE5vdGlmaWVyQ291bnRNYXAuZ2V0KG9ic2VydmVyKSAmJiAhcGVuZGluZ0NoYW5nZXNNYXAuaGFzKG9ic2VydmVyKSkge1xuICAgICAgICAgICAgYXR0YWNoZWROb3RpZmllckNvdW50TWFwLmRlbGV0ZShvYnNlcnZlcik7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBvYnNlcnZlckNhbGxiYWNrcy5pbmRleE9mKG9ic2VydmVyKTtcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlckNhbGxiYWNrcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW1wbGVtZW50YXRpb24gb2YgdGhlIGludGVybmFsIGFsZ29yaXRobSAnRGVsaXZlckNoYW5nZVJlY29yZHMnXG4gICAgLy8gZGVzY3JpYmVkIGluIHRoZSBwcm9wb3NhbC5cbiAgICAvLyBbQ29ycmVzcG9uZGluZyBTZWN0aW9uIGluIEVDTUFTY3JpcHQgd2lraV0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTpvYnNlcnZlX2ludGVybmFscyNkZWxpdmVyY2hhbmdlcmVjb3JkcylcbiAgICBmdW5jdGlvbiBfZGVsaXZlckNoYW5nZVJlY29yZHMob2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIHBlbmRpbmdDaGFuZ2VSZWNvcmRzID0gcGVuZGluZ0NoYW5nZXNNYXAuZ2V0KG9ic2VydmVyKTtcbiAgICAgICAgcGVuZGluZ0NoYW5nZXNNYXAuZGVsZXRlKG9ic2VydmVyKTtcbiAgICAgICAgaWYgKCFwZW5kaW5nQ2hhbmdlUmVjb3JkcyB8fCBwZW5kaW5nQ2hhbmdlUmVjb3Jkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuY2FsbCh1bmRlZmluZWQsIHBlbmRpbmdDaGFuZ2VSZWNvcmRzKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkgeyB9XG5cbiAgICAgICAgX2NsZWFuT2JzZXJ2ZXIob2JzZXJ2ZXIpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgaW50ZXJuYWwgYWxnb3JpdGhtICdEZWxpdmVyQWxsQ2hhbmdlUmVjb3JkcydcbiAgICAvLyBkZXNjcmliZWQgaW4gdGhlIHByb3Bvc2FsLlxuICAgIC8vIFtDb3JyZXNwb25kaW5nIFNlY3Rpb24gaW4gRUNNQVNjcmlwdCB3aWtpXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255Om9ic2VydmVfaW50ZXJuYWxzI2RlbGl2ZXJhbGxjaGFuZ2VyZWNvcmRzKVxuICAgIGZ1bmN0aW9uIF9kZWxpdmVyQWxsQ2hhbmdlUmVjb3JkcygpIHtcbiAgICAgICAgdmFyIG9ic2VydmVycyA9IG9ic2VydmVyQ2FsbGJhY2tzLnNsaWNlKCk7XG4gICAgICAgIHZhciBhbnlXb3JrRG9uZSA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9ic2VydmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBvYnNlcnZlciA9IG9ic2VydmVyc1tpXTtcbiAgICAgICAgICAgIGlmIChfZGVsaXZlckNoYW5nZVJlY29yZHMob2JzZXJ2ZXIpKSB7XG4gICAgICAgICAgICAgICAgYW55V29ya0RvbmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnlXb3JrRG9uZTtcbiAgICB9XG5cblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE9iamVjdCwge1xuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgcHVibGljIGFwaSAnT2JqZWN0Lm9ic2VydmUnXG4gICAgICAgIC8vIGRlc2NyaWJlZCBpbiB0aGUgcHJvcG9zYWwuXG4gICAgICAgIC8vIFtDb3JyZXNwb25kaW5nIFNlY3Rpb24gaW4gRUNNQVNjcmlwdCB3aWtpXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255Om9ic2VydmVfcHVibGljX2FwaSNvYmplY3Qub2JzZXJ2ZSlcbiAgICAgICAgJ29ic2VydmUnOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb2JzZXJ2ZSh0YXJnZXQsIGNhbGxiYWNrLCBhY2NlcHQpIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0KHRhcmdldCkgIT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXQgbXVzdCBiZSBhbiBPYmplY3QsIGdpdmVuICcgKyB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29ic2VydmVyIG11c3QgYmUgYSBmdW5jdGlvbiwgZ2l2ZW4gJyArIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5pc0Zyb3plbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb2JzZXJ2ZXIgY2Fubm90IGJlIGZyb3plbicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBhY2NlcHRMaXN0O1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYWNjZXB0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICBhY2NlcHRMaXN0ID0gWydhZGQnLCAndXBkYXRlJywgJ2RlbGV0ZScsICdyZWNvbmZpZ3VyZScsICdzZXRQcm90b3R5cGUnLCAncHJldmVudEV4dGVuc2lvbnMnXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0KGFjY2VwdCkgIT09IGFjY2VwdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYWNjZXB0IG11c3QgYmUgYW4gb2JqZWN0LCBnaXZlbiAnICsgYWNjZXB0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gYWNjZXB0Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBsZW4gIT09ICdudW1iZXInIHx8IGxlbiA+Pj4gMCAhPT0gbGVuIHx8IGxlbiA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoZSBcXCdsZW5ndGhcXCcgcHJvcGVydHkgb2YgYWNjZXB0IG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLCBnaXZlbiAnICsgbGVuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0SW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICBhY2NlcHRMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChuZXh0SW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0ID0gYWNjZXB0W25leHRJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG5leHQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYWNjZXB0IG11c3QgY29udGFpbnMgb25seSBzdHJpbmcsIGdpdmVuJyArIG5leHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0TGlzdC5wdXNoKG5leHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dEluZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIHZhciBub3RpZmllciA9IF9nZXROb3RpZmllcih0YXJnZXQpLFxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VPYnNlcnZlcnMgPSBjaGFuZ2VPYnNlcnZlcnNNYXAuZ2V0KG5vdGlmaWVyKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hhbmdlT2JzZXJ2ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlT2JzZXJ2ZXJzW2ldLmNhbGxiYWNrID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlT2JzZXJ2ZXJzW2ldLmFjY2VwdCA9IGFjY2VwdExpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2hhbmdlT2JzZXJ2ZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgICAgIGFjY2VwdDogYWNjZXB0TGlzdFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9ic2VydmVyQ2FsbGJhY2tzLmluZGV4T2YoY2FsbGJhY2spID09PSAtMSkgIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXJDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghYXR0YWNoZWROb3RpZmllckNvdW50TWFwLmhhcyhjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoZWROb3RpZmllckNvdW50TWFwLnNldChjYWxsYmFjaywgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoZWROb3RpZmllckNvdW50TWFwLnNldChjYWxsYmFjaywgYXR0YWNoZWROb3RpZmllckNvdW50TWFwLmdldChjYWxsYmFjaykgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEltcGxlbWVudGF0aW9uIG9mIHRoZSBwdWJsaWMgYXBpICdPYmplY3QudW5vYnNldmUnXG4gICAgICAgIC8vIGRlc2NyaWJlZCBpbiB0aGUgcHJvcG9zYWwuXG4gICAgICAgIC8vIFtDb3JyZXNwb25kaW5nIFNlY3Rpb24gaW4gRUNNQVNjcmlwdCB3aWtpXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255Om9ic2VydmVfcHVibGljX2FwaSNvYmplY3QudW5vYnNldmUpXG4gICAgICAgICd1bm9ic2VydmUnOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdW5vYnNlcnZlKHRhcmdldCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0KHRhcmdldCkgIT09IHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXQgbXVzdCBiZSBhbiBPYmplY3QsIGdpdmVuICcgKyB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29ic2VydmVyIG11c3QgYmUgYSBmdW5jdGlvbiwgZ2l2ZW4gJyArIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIG5vdGlmaWVyID0gX2dldE5vdGlmaWVyKHRhcmdldCksXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZU9ic2VydmVycyA9IGNoYW5nZU9ic2VydmVyc01hcC5nZXQobm90aWZpZXIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gY2hhbmdlT2JzZXJ2ZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2hhbmdlT2JzZXJ2ZXJzW2ldLmNhbGxiYWNrID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlT2JzZXJ2ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaGVkTm90aWZpZXJDb3VudE1hcC5zZXQoY2FsbGJhY2ssIGF0dGFjaGVkTm90aWZpZXJDb3VudE1hcC5nZXQoY2FsbGJhY2spIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2xlYW5PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gSW1wbGVtZW50YXRpb24gb2YgdGhlIHB1YmxpYyBhcGkgJ09iamVjdC5kZWxpdmVyQ2hhbmdlUmVjb3JkcydcbiAgICAgICAgLy8gZGVzY3JpYmVkIGluIHRoZSBwcm9wb3NhbC5cbiAgICAgICAgLy8gW0NvcnJlc3BvbmRpbmcgU2VjdGlvbiBpbiBFQ01BU2NyaXB0IHdpa2ldKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6b2JzZXJ2ZV9wdWJsaWNfYXBpI29iamVjdC5kZWxpdmVyY2hhbmdlcmVjb3JkcylcbiAgICAgICAgJ2RlbGl2ZXJDaGFuZ2VSZWNvcmRzJzoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlbGl2ZXJDaGFuZ2VSZWNvcmRzKG9ic2VydmVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYnNlcnZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24sIGdpdmVuICcgKyBvYnNlcnZlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlIChfZGVsaXZlckNoYW5nZVJlY29yZHMob2JzZXJ2ZXIpKSB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gSW1wbGVtZW50YXRpb24gb2YgdGhlIHB1YmxpYyBhcGkgJ09iamVjdC5nZXROb3RpZmllcidcbiAgICAgICAgLy8gZGVzY3JpYmVkIGluIHRoZSBwcm9wb3NhbC5cbiAgICAgICAgLy8gW0NvcnJlc3BvbmRpbmcgU2VjdGlvbiBpbiBFQ01BU2NyaXB0IHdpa2ldKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6b2JzZXJ2ZV9wdWJsaWNfYXBpI29iamVjdC5nZXRub3RpZmllcilcbiAgICAgICAgJ2dldE5vdGlmaWVyJzoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldE5vdGlmaWVyKHRhcmdldCkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QodGFyZ2V0KSAhPT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhcmdldCBtdXN0IGJlIGFuIE9iamVjdCwgZ2l2ZW4gJyArIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChPYmplY3QuaXNGcm96ZW4odGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9nZXROb3RpZmllcih0YXJnZXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuXG5cbiIsIi8vICAgIENvcHlyaWdodCAyMDEyIEthcCBJVCAoaHR0cDovL3d3dy5rYXBpdC5mci8pXG4vL1xuLy8gICAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlICdMaWNlbnNlJyk7XG4vLyAgICB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyAgICBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gICAgVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gICAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gJ0FTIElTJyBCQVNJUyxcbi8vICAgIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gICAgU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gICAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4vLyAgICBBdXRob3IgOiBGcmFuw6dvaXMgZGUgQ2FtcHJlZG9uIChodHRwOi8vZnJhbmNvaXMuZGUtY2FtcHJlZG9uLmZyLyksXG5cbi8vIE9iamVjdFV0aWxzXG4vLyA9PT09PT09PT09PVxuXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKi9cbiAgICB2YXIgT2JzZXJ2ZVV0aWxzO1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgT2JzZXJ2ZVV0aWxzID0gZXhwb3J0cztcbiAgICB9IGVsc2Uge1xuICAgICAgICBPYnNlcnZlVXRpbHMgPSBnbG9iYWwuT2JzZXJ2ZVV0aWxzID0ge307XG4gICAgfVxuXG4gICAgLy8gVXRpbGl0aWVzXG4gICAgLy8gLS0tLS0tLS0tXG5cblxuICAgIC8vIGJvcnJvd2luZyBzb21lIGFycmF5IG1ldGhvZHNcbiAgICB2YXIgYXJyU2xpY2UgPSBGdW5jdGlvbi5jYWxsLmJpbmQoQXJyYXkucHJvdG90eXBlLnNsaWNlKSxcbiAgICAgICAgYXJyTWFwID0gRnVuY3Rpb24uY2FsbC5iaW5kKEFycmF5LnByb3RvdHlwZS5tYXApO1xuXG4gICAgLy8gcmV0dXJuIHRydWUgaWYgdGhlIGdpdmVuIHByb3BlcnR5IGRlc2NyaXB0b3IgY29udGFpbnMgYWNjZXNzb3JcbiAgICBmdW5jdGlvbiBpc0FjY2Vzc29yRGVzY3JpcHRvcihkZXNjKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGVzYyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCdnZXQnIGluIGRlc2MgfHwgJ3NldCcgaW4gZGVzYyk7XG4gICAgfVxuXG5cblxuICAgIC8vIGdldFByb3BlcnR5RGVzY3JpcHRvciBzaGltXG4gICAgLy8gY29waWVkIGZyb20gW2VzNi1zaGltXShodHRwczovL2dpdGh1Yi5jb20vcGF1bG1pbGxyL2VzNi1zaGltKVxuICAgIGZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpIHtcbiAgICAgICAgdmFyIHBkID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpLFxuICAgICAgICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KTtcbiAgICAgICAgd2hpbGUgKHR5cGVvZiBwZCA9PT0gJ3VuZGVmaW5lZCcgJiYgcHJvdG8gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHBkID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG4gICAgICAgICAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBkO1xuICAgIH1cblxuXG5cbiAgICAvLyBlZ2FsIHNoaW1cbiAgICAvLyBjb3BpZWQgZnJvbSBbdGhlIGVjbWFzY3JpcHQgd2lraV0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKVxuICAgIGZ1bmN0aW9uIHNhbWVWYWx1ZSh4LCB5KSB7XG4gICAgICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAgICAgICAvLyAwID09PSAtMCwgYnV0IHRoZXkgYXJlIG5vdCBpZGVudGljYWxcbiAgICAgICAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5hTiAhPT0gTmFOLCBidXQgdGhleSBhcmUgaWRlbnRpY2FsLlxuICAgICAgICAvLyBOYU5zIGFyZSB0aGUgb25seSBub24tcmVmbGV4aXZlIHZhbHVlLCBpLmUuLCBpZiB4ICE9PSB4LFxuICAgICAgICAvLyB0aGVuIHggaXMgYSBOYU4uXG4gICAgICAgIC8vIGlzTmFOIGlzIGJyb2tlbjogaXQgY29udmVydHMgaXRzIGFyZ3VtZW50IHRvIG51bWJlciwgc29cbiAgICAgICAgLy8gaXNOYU4oJ2ZvbycpID0+IHRydWVcbiAgICAgICAgcmV0dXJuIHggIT09IHggJiYgeSAhPT0geTtcbiAgICB9XG5cbiAgICAvLyBjYXN0IGEgdmFsdWUgYXMgbnVtYmVyLCBhbmQgdGVzdCBpZiB0aGUgb2J0YWluZWQgcmVzdWx0XG4gICAgLy8gaXMgYSBwb3NpdGl2ZSBmaW5pdGUgaW50ZWdlciwgdGhyb3cgYW4gZXJyb3Igb3RoZXJ3aXNlXG4gICAgZnVuY3Rpb24gaXNQb3NpdGl2ZUZpbml0ZUludGVnZXIodmFsdWUsIGVycm9yTWVzc2FnZSkge1xuICAgICAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG4gICAgICAgIGlmIChpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSB8fCB2YWx1ZSA8IDAgfHwgdmFsdWUgJSAxICE9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihlcnJvck1lc3NhZ2UucmVwbGFjZSgnJCcsIHZhbHVlKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8vIGRlZmluZU9ic2VydmFibGVQcm9wZXJ0aWVzIEltcGxlbWVudGF0aW9uXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBVaWQgZ2VuZXJhdGlvbiBoZWxwZXJcbiAgICB2YXIgdWlkQ291bnRlciA9IDA7XG5cbiAgICAvLyBEZWZpbmUgYSBwcm9wZXJ0eSBvbiBhbiBvYmplY3QgdGhhdCB3aWxsIGNhbGwgdGhlIE5vdGlmaWVyLm5vdGlmeSBtZXRob2Qgd2hlbiB1cGRhdGVkXG4gICAgZnVuY3Rpb24gZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIG9yaWdpbmFsVmFsdWUpIHtcblxuICAgICAgICAvL3dlIHN0b3JlIHRoZSB2YWx1ZSBpbiBhbiBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSB3aXRoIGdlbmVyYXRlZCB1bmlxdWUgbmFtZVxuICAgICAgICB2YXIgaW50ZXJuYWxQcm9wTmFtZSA9ICdfJyArICh1aWRDb3VudGVyKyspICsgcHJvcGVydHk7XG5cbiAgICAgICAgaWYgKHRhcmdldC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGludGVybmFsUHJvcE5hbWUsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogb3JpZ2luYWxWYWx1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy90aGVuIHdlIGNyZWF0ZSBhY2Nlc3NvciBtZXRob2QgZm9yIG91ciAnaGlkZGVuJyBwcm9wZXJ0eSxcbiAgICAgICAgLy8gdGhhdCBkaXNwYXRjaCBjaGFuZ2VzUmVjb3JkcyB3aGVuIHRoZSB2YWx1ZSBpcyB1cGRhdGVkXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tpbnRlcm5hbFByb3BOYW1lXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghc2FtZVZhbHVlKHZhbHVlLCB0aGlzW2ludGVybmFsUHJvcE5hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzW2ludGVybmFsUHJvcE5hbWVdO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgaW50ZXJuYWxQcm9wTmFtZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vdGlmaWVyID0gT2JqZWN0LmdldE5vdGlmaWVyKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBub3RpZmllci5ub3RpZnkoeyB0eXBlOiAndXBkYXRlJywgbmFtZTogcHJvcGVydHksIG9sZFZhbHVlOiBvbGRWYWx1ZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIC8vIGNhbGwgZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnR5IGZvciBlYWNoIHByb3BlcnR5IG5hbWUgcGFzc2VkIGFzICdyZXN0IGFyZ3VtZW50J1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lIG9ic2VydmFibGUgcHJvcGVydGllcyBvbiB0aGUgZ2l2ZW4gb2JqZWN0IGFuIHJldHVybiBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAgICAgKiBAcGFyYW0gey4uLnN0cmluZ30gcHJvcGVydGllc1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgT2JzZXJ2ZVV0aWxzLmRlZmluZU9ic2VydmFibGVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lT2JzZXJ2YWJsZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wZXJ0aWVzKSB7XG4gICAgICAgIGlmIChPYmplY3QodGFyZ2V0KSAhPT0gdGFyZ2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXQgbXVzdCBiZSBhbiBPYmplY3QsIGdpdmVuICcgKyB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIHByb3BlcnRpZXMgPSBhcnJTbGljZShhcmd1bWVudHMsIDEpO1xuICAgICAgICB3aGlsZSAocHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSBwcm9wZXJ0aWVzLnNoaWZ0KCksXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvciA9IGdldFByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5KTtcblxuICAgICAgICAgICAgaWYgKCFkZXNjcmlwdG9yIHx8ICFpc0FjY2Vzc29yRGVzY3JpcHRvcihkZXNjcmlwdG9yKSkge1xuICAgICAgICAgICAgICAgIHZhciBvcmlnaW5hbFZhbHVlID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICAgICAgICAgIGRlZmluZU9ic2VydmFibGVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5LCBvcmlnaW5hbFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG5cblxuXG4gICAgLy8gTGlzdCBJbXBsZW1lbnRhdGlvblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGVuZ3RoXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQGZ1bmN0aW9uXG4gICAgICovXG4gICAgZnVuY3Rpb24gTGlzdChsZW5ndGgpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGxlbmd0aCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpbiB0aGlzIGNhc2Ugd2UgY3JlYXRlIGEgbGlzdCB3aXRoIGEgZ2l2ZW4gbGVuZ3RoXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEgJiYgdHlwZW9mIGxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgTGlzdCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXN0KGxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvL2hlcmUgd2UgY3JlYXRlIGEgbGlzdCB3aXRoIGluaXRpYWwgdmFsdWVzXG4gICAgICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgTGlzdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTGlzdC5mcm9tQXJyYXkoYXJyU2xpY2UoYXJndW1lbnRzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGggOyBpIDwgbCA7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPYnNlcnZlIGEgbGlzdFxuICAgICAqIEBwYXJhbSB7TGlzdH0gbGlzdFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9ic2VydmVyXG4gICAgICovXG4gICAgTGlzdC5vYnNlcnZlID0gZnVuY3Rpb24gb2JzZXJ2ZShsaXN0LCBvYnNlcnZlcikge1xuICAgICAgICBPYmplY3Qub2JzZXJ2ZShsaXN0LCBvYnNlcnZlciwgWydhZGQnLCAndXBkYXRlJywgJ2RlbGV0ZScsICdzcGxpY2UnXSk7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogVW5vYnNlcnZlIGEgbGlzdFxuICAgICAqIEBwYXJhbSB7TGlzdH0gbGlzdFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG9ic2VydmVyXG4gICAgICovXG4gICAgTGlzdC51bm9ic2VydmUgPSBmdW5jdGlvbiB1bm9ic2VydmUobGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICAgICAgT2JqZWN0LnVub2JzZXJ2ZShsaXN0LCBvYnNlcnZlcik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGxpc3QgZnJvbSBhIGdpdmVuIGFycmF5XG4gICAgICogQHBhcmFtIGFycmF5XG4gICAgICogQHJldHVybnMge0xpc3R9XG4gICAgICovXG4gICAgTGlzdC5mcm9tQXJyYXkgPSBmdW5jdGlvbiBmcm9tQXJyYXkoYXJyYXkpIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGlzdCA9IG5ldyBMaXN0KCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyYXkubGVuZ3RoIDsgaSA8IGwgOyBpKyspIHtcbiAgICAgICAgICAgIGxpc3RbaV0gPSBhcnJheVtpXTtcbiAgICAgICAgfVxuICAgICAgICBsaXN0Lmxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKExpc3QucHJvdG90eXBlLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBoaWRkZW4gdmFsdWUgaG9sZGVyIGZvciB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICAnX2xlbmd0aCcgOiB7XG4gICAgICAgICAgICB2YWx1ZSA6IDAsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0aGUgbGVuZ3RoIG9mIHRoZSBsaXN0XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsZW5ndGhcbiAgICAgICAgICovXG4gICAgICAgICdsZW5ndGgnIDoge1xuICAgICAgICAgICAgZ2V0IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0IDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBpc1Bvc2l0aXZlRmluaXRlSW50ZWdlcih2YWx1ZSwgJ0ludmFsaWQgIGxpc3QgbGVuZ3RoIDogJCcpO1xuICAgICAgICAgICAgICAgIHZhciBub3RpZmllciA9IE9iamVjdC5nZXROb3RpZmllcih0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWUgPSB0aGlzLl9sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBub3RpZmllci5wZXJmb3JtQ2hhbmdlKCdzcGxpY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgJ19sZW5ndGgnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0dXJuVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgPiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZGVsZXRlIHZhbHVlcyBpZiB0aGUgbGVuZ3RoIGhhdmUgYmVlbiBkZWNyZWFzZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gdmFsdWU7IGkgPCBvbGRWYWx1ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWQucHVzaChzZWxmW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGUoaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkIDogcmVtb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRDb3VudDogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblZhbHVlID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA6IG9sZFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVkIDogcmVtb3ZlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkZWRDb3VudDogdmFsdWUgLSBvbGRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RpZmllci5ub3RpZnkoeyB0eXBlOiAndXBkYXRlJywgbmFtZTogJ2xlbmd0aCcsIG9sZFZhbHVlOiBvbGRWYWx1ZSB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlIDogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIEFycmF5IGNvcHkgb2YgdGhlIGxpc3RcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiBhcnJTbGljZSh0aGlzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGxpc3RcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIExpc3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKS50b1N0cmluZygpO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4ganNvbiByZXByZXNlbnRhdGlvbiBvZiB0aGUgbGlzdFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b0FycmF5KCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIHNldCB0aGUgZ2l2ZW50IHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KGluZGV4LCB2YWx1ZSkge1xuICAgICAgICBpbmRleCA9IGlzUG9zaXRpdmVGaW5pdGVJbnRlZ2VyKGluZGV4LCAnSW52YWxpZCBpbmRleCA6ICQnKTtcblxuICAgICAgICB2YXIgbm90aWZpZXIgPSBPYmplY3QuZ2V0Tm90aWZpZXIodGhpcyksXG4gICAgICAgICAgICBsZW4gPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoaW5kZXggPj0gbGVuKSB7XG4gICAgICAgICAgICBub3RpZmllci5wZXJmb3JtQ2hhbmdlKCdzcGxpY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZltpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBub3RpZmllci5ub3RpZnkoeyB0eXBlOiAnYWRkJywgbmFtZTogaW5kZXh9KTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgJ19sZW5ndGgnLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlIDogaW5kZXggKyAxLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG5vdGlmaWVyLm5vdGlmeSh7IHR5cGU6ICd1cGRhdGUnLCBuYW1lOiAnbGVuZ3RoJywgb2xkVmFsdWU6IGxlbiB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4IDogbGVuLFxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkIDogW10sXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkQ291bnQ6IHNlbGYubGVuZ3RoIC0gbGVuXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFzYW1lVmFsdWUodmFsdWUsIHRoaXNbaW5kZXhdKSkge1xuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpc1tpbmRleF07XG4gICAgICAgICAgICB0aGlzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgbm90aWZpZXIubm90aWZ5KHsgdHlwZTogJ3VwZGF0ZScsIG5hbWU6IGluZGV4LCBvbGRWYWx1ZTogb2xkVmFsdWUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBkZWxldGUgdGhlIHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBMaXN0LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiBkZWwoaW5kZXgpIHtcbiAgICAgICAgaW5kZXggPSBpc1Bvc2l0aXZlRmluaXRlSW50ZWdlcihpbmRleCwgJ0ludmFsaWQgaW5kZXggOiAkJyk7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGluZGV4KSkge1xuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpc1tpbmRleF07XG4gICAgICAgICAgICBpZiAoZGVsZXRlIHRoaXNbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vdGlmaWVyID0gT2JqZWN0LmdldE5vdGlmaWVyKHRoaXMpO1xuICAgICAgICAgICAgICAgIG5vdGlmaWVyLm5vdGlmeSh7IHR5cGU6ICdkZWxldGUnLCBuYW1lOiBpbmRleCwgb2xkVmFsdWU6IG9sZFZhbHVlIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGEgbmV3IGxpc3QgcmVzdWx0aW5nIG9mIHRoZSBjb25jYXRlbmF0aW9uIG9mIGFsbCB0aGUgTGlzdCBhbmQgYXJyYXlcbiAgICAgKiBwYXNzZWQgYXMgcGFyYW1ldGVyIHdpdGggdGhlIGFkZGl0aW9uIG9mIG90aGVyIHZhbHVlcyBwYXNzZWQgYXMgcGFyYW1ldGVyXG4gICAgICogQHBhcmFtIHsuLi4qfSBhcmdzXG4gICAgICogQHJldHVybiB7TGlzdH1cbiAgICAgKi9cbiAgICBMaXN0LnByb3RvdHlwZS5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQoYXJncykge1xuICAgICAgICBhcmdzID0gYXJyTWFwKGFyZ3VtZW50cywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiAoaXRlbSBpbnN0YW5jZW9mIExpc3QpID8gIGl0ZW0udG9BcnJheSgpIDogaXRlbTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBMaXN0LmZyb21BcnJheShBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KHRoaXMudG9BcnJheSgpLCBhcmdzKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEpvaW5zIGFsbCBlbGVtZW50cyBvZiBhIExpc3QgaW50byBhIHN0cmluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3NlcGFyYXRvcl1cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUuam9pbiA9IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKS5qb2luKHNlcGFyYXRvcik7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgbGFzdCBlbGVtZW50IGZyb20gYSBMaXN0IGFuZCByZXR1cm5zIHRoYXQgZWxlbWVudC5cbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIExpc3QucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uIHBvcCgpIHtcbiAgICAgICAgaWYgKE9iamVjdCh0aGlzKSAhPT0gdGhpcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBtdXMgYmUgYW4gb2JqZWN0IGdpdmVuIDogJyArIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW4gPSBpc1Bvc2l0aXZlRmluaXRlSW50ZWdlcih0aGlzLmxlbmd0aCwgJ3RoaXMgbXVzdCBoYXZlIGEgZmluaXRlIGludGVnZXIgcHJvcGVydHkgXFwnbGVuZ3RoXFwnLCBnaXZlbiA6ICQnKTtcbiAgICAgICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQoMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3TGVuID0gbGVuIC0gMSxcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdGhpc1tuZXdMZW5dLFxuICAgICAgICAgICAgICAgIG5vdGlmaWVyID0gIE9iamVjdC5nZXROb3RpZmllcih0aGlzKSxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIG5vdGlmaWVyLnBlcmZvcm1DaGFuZ2UoJ3NwbGljZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgc2VsZltuZXdMZW5dO1xuICAgICAgICAgICAgICAgIG5vdGlmaWVyLm5vdGlmeSh7IHR5cGU6ICdkZWxldGUnLCBuYW1lOiBuZXdMZW4sIG9sZFZhbHVlOiBlbGVtZW50IH0pO1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCAnX2xlbmd0aCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgOiBuZXdMZW4sXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbm90aWZpZXIubm90aWZ5KHsgdHlwZTogJ3VwZGF0ZScsIG5hbWU6ICdsZW5ndGgnLCBvbGRWYWx1ZTogbGVuIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggOiBuZXdMZW4sXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQgOiBbZWxlbWVudF0sXG4gICAgICAgICAgICAgICAgICAgIGFkZGVkQ291bnQ6IDBcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTXV0YXRlcyBhIExpc3QgYnkgYXBwZW5kaW5nIHRoZSBnaXZlbiBlbGVtZW50cyBhbmQgcmV0dXJuaW5nIHRoZSBuZXcgbGVuZ3RoIG9mIHRoZSBhcnJheS5cbiAgICAgKiBAcGFyYW0gey4uLip9IGl0ZW1zXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIExpc3QucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiBwdXNoKCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gYXJndW1lbnRzLFxuICAgICAgICAgICAgICAgIGxlbiA9IHRoaXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIG5vdGlmaWVyID0gT2JqZWN0LmdldE5vdGlmaWVyKHRoaXMpLFxuICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGksIGluZGV4O1xuICAgICAgICAgICAgbm90aWZpZXIucGVyZm9ybUNoYW5nZSgnc3BsaWNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcmd1bWVudHNMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9ICBsZW4gKyBpO1xuICAgICAgICAgICAgICAgICAgICAvLyBhdm9pZCB0aGUgdXNhZ2Ugb2YgdGhlIHNldCBmdW5jdGlvbiBhbmQgbWFudWFsbHlcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHRoZSB2YWx1ZSBhbmQgbm90aWZ5IHRoZSBjaGFuZ2VzIHRvIGF2b2lkIHRoZSBub3RpZmljYXRpb24gb2ZcbiAgICAgICAgICAgICAgICAgICAgLy8gbXVsdGlwbGUgbGVuZ3RoIG1vZGlmaWNhdGlvblxuICAgICAgICAgICAgICAgICAgICBzZWxmW2luZGV4XSA9IGVsZW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICBub3RpZmllci5ub3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA6ICdhZGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA6IGluZGV4XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgJ19sZW5ndGgnLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlIDogbGVuICsgYXJndW1lbnRzTGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG5vdGlmaWVyLm5vdGlmeSh7IHR5cGU6ICd1cGRhdGUnLCBuYW1lOiAnbGVuZ3RoJywgb2xkVmFsdWU6IGxlbiB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA6IGxlbixcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZCA6IFtdLFxuICAgICAgICAgICAgICAgICAgICBhZGRlZENvdW50OiBhcmd1bWVudHNMZW5ndGhcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXZlcnNlcyBhIExpc3QgaW4gcGxhY2UuICBUaGUgZmlyc3QgTGlzdCBlbGVtZW50IGJlY29tZXMgdGhlIGxhc3QgYW5kIHRoZSBsYXN0IGJlY29tZXMgdGhlIGZpcnN0LlxuICAgICAqIEByZXR1cm4ge0xpc3R9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2UoKSB7XG4gICAgICAgIHZhciBjb3B5ID0gdGhpcy50b0FycmF5KCksXG4gICAgICAgICAgICBhcnIgPSBjb3B5LnNsaWNlKCkucmV2ZXJzZSgpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zZXQoaSwgYXJyW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBmaXJzdCBlbGVtZW50IGZyb20gYSBMaXN0IGFuZCByZXR1cm5zIHRoYXQgZWxlbWVudC4gVGhpcyBtZXRob2QgY2hhbmdlcyB0aGUgbGVuZ3RoIG9mIHRoZSBMaXN0LlxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHZvaWQoMCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXJyID0gdGhpcy50b0FycmF5KCksXG4gICAgICAgICAgICBlbGVtZW50ID0gYXJyLnNoaWZ0KCksXG4gICAgICAgICAgICBub3RpZmllciA9IE9iamVjdC5nZXROb3RpZmllcih0aGlzKSxcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzLCBsZW4gPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgbm90aWZpZXIucGVyZm9ybUNoYW5nZSgnc3BsaWNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXQoaSwgYXJyW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuZGVsZXRlKGxlbiAtIDEpO1xuXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgJ19sZW5ndGgnLCB7XG4gICAgICAgICAgICAgICAgdmFsdWUgOiBsZW4gLSAxLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBub3RpZmllci5ub3RpZnkoeyB0eXBlOiAndXBkYXRlJywgbmFtZTogJ2xlbmd0aCcsIG9sZFZhbHVlOiBsZW4gfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5kZXggOiAwLFxuICAgICAgICAgICAgICAgIHJlbW92ZWQgOiBbZWxlbWVudF0sXG4gICAgICAgICAgICAgICAgYWRkZWRDb3VudDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHNoYWxsb3cgY29weSBvZiBhIHBvcnRpb24gb2YgYW4gTGlzdC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kXVxuICAgICAqIEByZXR1cm4ge0xpc3R9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICAgICAgICByZXR1cm4gTGlzdC5mcm9tQXJyYXkodGhpcy50b0FycmF5KCkuc2xpY2Uoc3RhcnQsIGVuZCkpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTb3J0cyB0aGUgZWxlbWVudHMgb2YgYSBMaXN0IGluIHBsYWNlIGFuZCByZXR1cm5zIHRoZSBMaXN0LlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjb21wYXJlRm5dXG4gICAgICogQHJldHVybiB7TGlzdH1cbiAgICAgKi9cbiAgICBMaXN0LnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24gKGNvbXBhcmVGbikge1xuICAgICAgICB2YXIgY29weSA9IHRoaXMudG9BcnJheSgpLFxuICAgICAgICAgICAgYXJyID0gY29weS5zbGljZSgpLnNvcnQoY29tcGFyZUZuKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnNldChpLCBhcnJbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHRoZSBjb250ZW50IG9mIGEgTGlzdCwgYWRkaW5nIG5ldyBlbGVtZW50cyB3aGlsZSByZW1vdmluZyBvbGQgZWxlbWVudHMuXG4gICAgICogQHJldHVybiB7TGlzdH1cbiAgICAgKi9cbiAgICBMaXN0LnByb3RvdHlwZS5zcGxpY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IFtdLFxuICAgICAgICAgICAgYXJndW1lbnRzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgICAgICBpZiAoYXJndW1lbnRzTGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGFyciA9IHRoaXMudG9BcnJheSgpLFxuICAgICAgICAgICAgICAgIG5vdGlmaWVyID0gT2JqZWN0LmdldE5vdGlmaWVyKHRoaXMpLFxuICAgICAgICAgICAgICAgIGxlbiA9IHRoaXMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGluZGV4ID0gYXJndW1lbnRzWzBdLFxuICAgICAgICAgICAgICAgIGksIGw7XG5cbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShhcnIsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBub3RpZmllci5wZXJmb3JtQ2hhbmdlKCdzcGxpY2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGFyci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gc2VsZltpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzYW1lVmFsdWUob2xkVmFsdWUsIGFycltpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGZbaV0gPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RpZmllci5ub3RpZnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA+PSBsZW4gP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZSA6ICdhZGQnLCBuYW1lIDogaX06XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlIDogJ3VwZGF0ZScsIG5hbWUgOiBpLCBvbGRWYWx1ZSA6IG9sZFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgaWYgKGxlbiAhPT0gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGVuID4gYXJyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9kZWxldGUgdmFsdWVzIGlmIHRoZSBsZW5ndGggaGF2ZSBiZWVuIGRlY3JlYXNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5kZWxldGUoaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc2VsZiwgJ19sZW5ndGgnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA6IGFyci5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBub3RpZmllci5ub3RpZnkoeyB0eXBlOiAndXBkYXRlJywgbmFtZTogJ2xlbmd0aCcsIG9sZFZhbHVlOiBsZW4gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4IDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQgOiByZXR1cm5WYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgYWRkZWRDb3VudDogYXJndW1lbnRzTGVuZ3RoID49IDIgPyBhcmd1bWVudHNMZW5ndGggLSAyIDogMFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBMaXN0LmZyb21BcnJheShyZXR1cm5WYWx1ZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgb25lIG9yIG1vcmUgZWxlbWVudHMgdG8gdGhlIGJlZ2lubmluZyBvZiBhIExpc3QgYW5kIHJldHVybnMgdGhlIG5ldyBsZW5ndGggb2YgdGhlIExpc3QuXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIExpc3QucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmd1bWVudHNMZW5ndGggID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgaWYgKGFyZ3VtZW50c0xlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBhcnIgPSB0aGlzLnRvQXJyYXkoKSxcbiAgICAgICAgICAgICAgICBub3RpZmllciA9IE9iamVjdC5nZXROb3RpZmllcih0aGlzKSxcbiAgICAgICAgICAgICAgICBsZW4gPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBzZWxmID0gdGhpcztcblxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnVuc2hpZnQuYXBwbHkoYXJyLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgbm90aWZpZXIucGVyZm9ybUNoYW5nZSgnc3BsaWNlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXJyLmxlbmd0aDsgaSA8IGw7IGkrKykgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gc2VsZltpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzYW1lVmFsdWUob2xkVmFsdWUsIGFycltpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGF2b2lkIHRoZSB1c2FnZSBvZiB0aGUgc2V0IGZ1bmN0aW9uIGFuZCBtYW51YWxseVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHRoZSB2YWx1ZSBhbmQgbm90aWZ5IHRoZSBjaGFuZ2VzIHRvIGF2b2lkIHRoZSBub3RpZmljYXRpb24gb2ZcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG11bHRpcGxlIGxlbmd0aCBtb2RpZmljYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGZbaV0gPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RpZmllci5ub3RpZnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA+PSBsZW4gP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dHlwZSA6ICdhZGQnLCBuYW1lIDogaX06XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0eXBlIDogJ3VwZGF0ZScsIG5hbWUgOiBpLCBvbGRWYWx1ZSA6IG9sZFZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsZW4gIT09IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlbiA+IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZGVsZXRlIHZhbHVlcyBpZiB0aGUgbGVuZ3RoIGhhdmUgYmVlbiBkZWNyZWFzZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZGVsZXRlKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzZWxmLCAnX2xlbmd0aCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlIDogYXJyLmxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIG5vdGlmaWVyLm5vdGlmeSh7IHR5cGU6ICd1cGRhdGUnLCBuYW1lOiAnbGVuZ3RoJywgb2xkVmFsdWU6IGxlbiB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA6IDAsXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQgOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgYWRkZWRDb3VudDogYXJndW1lbnRzTGVuZ3RoXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBcHBseSBhIGZ1bmN0aW9uIGFnYWluc3QgYW4gYWNjdW11bGF0b3IgYW5kIGVhY2ggdmFsdWUgb2YgdGhlIExpc3QgKGZyb20gbGVmdC10by1yaWdodCkgYXMgdG8gcmVkdWNlIGl0IHRvIGEgc2luZ2xlIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtpbml0aWFsVmFsdWVdXG4gICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAqL1xuICAgIExpc3QucHJvdG90eXBlLnJlZHVjZSA9ICBBcnJheS5wcm90b3R5cGUucmVkdWNlO1xuXG4gICAgLyoqXG4gICAgICogQXBwbHkgYSBmdW5jdGlvbiBzaW11bHRhbmVvdXNseSBhZ2FpbnN0IHR3byB2YWx1ZXMgb2YgdGhlIGFycmF5IChmcm9tIHJpZ2h0LXRvLWxlZnQpIGFzIHRvIHJlZHVjZSBpdCB0byBhIHNpbmdsZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbaW5pdGlhbFZhbHVlXVxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKi9cbiAgICBMaXN0LnByb3RvdHlwZS5yZWR1Y2VSaWdodCA9ICBBcnJheS5wcm90b3R5cGUucmVkdWNlUmlnaHQ7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBhdCB3aGljaCBhIGdpdmVuIGVsZW1lbnQgY2FuIGJlIGZvdW5kIGluIHRoZSBMaXN0LCBvciAtMSBpZiBpdCBpcyBub3QgcHJlc2VudC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc2VhcmNoRWxlbWVudFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4XVxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBMaXN0LnByb3RvdHlwZS5pbmRleE9mID0gIEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbGFzdCBpbmRleCBhdCB3aGljaCBhIGdpdmVuIGVsZW1lbnQgY2FuIGJlIGZvdW5kIGluIHRoZSBMaXN0LCBvciAtMSBpZiBpdCBpcyBub3QgcHJlc2VudC4gVGhlIExpc3QgaXMgc2VhcmNoZWQgYmFja3dhcmRzLCBzdGFydGluZyBhdCBmcm9tSW5kZXguXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNlYXJjaEVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleF1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2Y7XG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyB3aGV0aGVyIGFsbCBlbGVtZW50cyBpbiB0aGUgTGlzdCBwYXNzIHRoZSB0ZXN0IGltcGxlbWVudGVkIGJ5IHRoZSBwcm92aWRlZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGhpc09iamVjdF1cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIExpc3QucHJvdG90eXBlLmV2ZXJ5ID0gQXJyYXkucHJvdG90eXBlLmV2ZXJ5O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBMaXN0IHdpdGggYWxsIGVsZW1lbnRzIHRoYXQgcGFzcyB0aGUgdGVzdCBpbXBsZW1lbnRlZCBieSB0aGUgcHJvdmlkZWQgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGhpc09iamVjdF1cbiAgICAgKiBAcmV0dXJuIHtMaXN0fVxuICAgICAqL1xuICAgIExpc3QucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc09iamVjdCkge1xuICAgICAgICByZXR1cm4gTGlzdC5mcm9tQXJyYXkodGhpcy50b0FycmF5KCkuZmlsdGVyKGNhbGxiYWNrLCB0aGlzT2JqZWN0KSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIGEgcHJvdmlkZWQgZnVuY3Rpb24gb25jZSBwZXIgTGlzdCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0aGlzT2JqZWN0XVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBMaXN0IHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5IGVsZW1lbnQgaW4gdGhpcyBMaXN0LlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0aGlzT2JqZWN0XVxuICAgICAqIEByZXR1cm4ge0xpc3R9XG4gICAgICovXG4gICAgTGlzdC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBMaXN0LmZyb21BcnJheSh0aGlzLnRvQXJyYXkoKS5tYXAoY2FsbGJhY2ssIHRoaXNPYmplY3QpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGVzdHMgd2hldGhlciBzb21lIGVsZW1lbnQgaW4gdGhlIExpc3QgcGFzc2VzIHRoZSB0ZXN0IGltcGxlbWVudGVkIGJ5IHRoZSBwcm92aWRlZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGhpc09iamVjdF1cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqL1xuICAgIExpc3QucHJvdG90eXBlLnNvbWUgPSBBcnJheS5wcm90b3R5cGUuc29tZTtcblxuICAgIE9ic2VydmVVdGlscy5MaXN0ID0gTGlzdDtcblxufSkodGhpcyk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliJylcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzYXAgPSByZXF1aXJlKCdhc2FwL3JhdycpO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxuLy8gU3RhdGVzOlxuLy9cbi8vIDAgLSBwZW5kaW5nXG4vLyAxIC0gZnVsZmlsbGVkIHdpdGggX3ZhbHVlXG4vLyAyIC0gcmVqZWN0ZWQgd2l0aCBfdmFsdWVcbi8vIDMgLSBhZG9wdGVkIHRoZSBzdGF0ZSBvZiBhbm90aGVyIHByb21pc2UsIF92YWx1ZVxuLy9cbi8vIG9uY2UgdGhlIHN0YXRlIGlzIG5vIGxvbmdlciBwZW5kaW5nICgwKSBpdCBpcyBpbW11dGFibGVcblxuLy8gQWxsIGBfYCBwcmVmaXhlZCBwcm9wZXJ0aWVzIHdpbGwgYmUgcmVkdWNlZCB0byBgX3tyYW5kb20gbnVtYmVyfWBcbi8vIGF0IGJ1aWxkIHRpbWUgdG8gb2JmdXNjYXRlIHRoZW0gYW5kIGRpc2NvdXJhZ2UgdGhlaXIgdXNlLlxuLy8gV2UgZG9uJ3QgdXNlIHN5bWJvbHMgb3IgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRvIGZ1bGx5IGhpZGUgdGhlbVxuLy8gYmVjYXVzZSB0aGUgcGVyZm9ybWFuY2UgaXNuJ3QgZ29vZCBlbm91Z2guXG5cblxuLy8gdG8gYXZvaWQgdXNpbmcgdHJ5L2NhdGNoIGluc2lkZSBjcml0aWNhbCBmdW5jdGlvbnMsIHdlXG4vLyBleHRyYWN0IHRoZW0gdG8gaGVyZS5cbnZhciBMQVNUX0VSUk9SID0gbnVsbDtcbnZhciBJU19FUlJPUiA9IHt9O1xuZnVuY3Rpb24gZ2V0VGhlbihvYmopIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gb2JqLnRoZW47XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgTEFTVF9FUlJPUiA9IGV4O1xuICAgIHJldHVybiBJU19FUlJPUjtcbiAgfVxufVxuXG5mdW5jdGlvbiB0cnlDYWxsT25lKGZuLCBhKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZuKGEpO1xuICB9IGNhdGNoIChleCkge1xuICAgIExBU1RfRVJST1IgPSBleDtcbiAgICByZXR1cm4gSVNfRVJST1I7XG4gIH1cbn1cbmZ1bmN0aW9uIHRyeUNhbGxUd28oZm4sIGEsIGIpIHtcbiAgdHJ5IHtcbiAgICBmbihhLCBiKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBMQVNUX0VSUk9SID0gZXg7XG4gICAgcmV0dXJuIElTX0VSUk9SO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcblxuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG4gIH1cbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgdGhpcy5fMzIgPSAwO1xuICB0aGlzLl84ID0gbnVsbDtcbiAgdGhpcy5fODkgPSBbXTtcbiAgaWYgKGZuID09PSBub29wKSByZXR1cm47XG4gIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG59XG5Qcm9taXNlLl84MyA9IG5vb3A7XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICBpZiAodGhpcy5jb25zdHJ1Y3RvciAhPT0gUHJvbWlzZSkge1xuICAgIHJldHVybiBzYWZlVGhlbih0aGlzLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gIH1cbiAgdmFyIHJlcyA9IG5ldyBQcm9taXNlKG5vb3ApO1xuICBoYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gc2FmZVRoZW4oc2VsZiwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgcmV0dXJuIG5ldyBzZWxmLmNvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzID0gbmV3IFByb21pc2Uobm9vcCk7XG4gICAgcmVzLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICBoYW5kbGUoc2VsZiwgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHJlcykpO1xuICB9KTtcbn07XG5mdW5jdGlvbiBoYW5kbGUoc2VsZiwgZGVmZXJyZWQpIHtcbiAgd2hpbGUgKHNlbGYuXzMyID09PSAzKSB7XG4gICAgc2VsZiA9IHNlbGYuXzg7XG4gIH1cbiAgaWYgKHNlbGYuXzMyID09PSAwKSB7XG4gICAgc2VsZi5fODkucHVzaChkZWZlcnJlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFzYXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNiID0gc2VsZi5fMzIgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICBpZiAoc2VsZi5fMzIgPT09IDEpIHtcbiAgICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl84KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl84KTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJldCA9IHRyeUNhbGxPbmUoY2IsIHNlbGYuXzgpO1xuICAgIGlmIChyZXQgPT09IElTX0VSUk9SKSB7XG4gICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICBpZiAobmV3VmFsdWUgPT09IHNlbGYpIHtcbiAgICByZXR1cm4gcmVqZWN0KFxuICAgICAgc2VsZixcbiAgICAgIG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJylcbiAgICApO1xuICB9XG4gIGlmIChcbiAgICBuZXdWYWx1ZSAmJlxuICAgICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgKSB7XG4gICAgdmFyIHRoZW4gPSBnZXRUaGVuKG5ld1ZhbHVlKTtcbiAgICBpZiAodGhlbiA9PT0gSVNfRVJST1IpIHtcbiAgICAgIHJldHVybiByZWplY3Qoc2VsZiwgTEFTVF9FUlJPUik7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRoZW4gPT09IHNlbGYudGhlbiAmJlxuICAgICAgbmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlXG4gICAgKSB7XG4gICAgICBzZWxmLl8zMiA9IDM7XG4gICAgICBzZWxmLl84ID0gbmV3VmFsdWU7XG4gICAgICBmaW5hbGUoc2VsZik7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZG9SZXNvbHZlKHRoZW4uYmluZChuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBzZWxmLl8zMiA9IDE7XG4gIHNlbGYuXzggPSBuZXdWYWx1ZTtcbiAgZmluYWxlKHNlbGYpO1xufVxuXG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgc2VsZi5fMzIgPSAyO1xuICBzZWxmLl84ID0gbmV3VmFsdWU7XG4gIGZpbmFsZShzZWxmKTtcbn1cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5fODkubGVuZ3RoOyBpKyspIHtcbiAgICBoYW5kbGUoc2VsZiwgc2VsZi5fODlbaV0pO1xuICB9XG4gIHNlbGYuXzg5ID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSl7XG4gIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG59XG5cbi8qKlxuICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAqL1xuZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBwcm9taXNlKSB7XG4gIHZhciBkb25lID0gZmFsc2U7XG4gIHZhciByZXMgPSB0cnlDYWxsVHdvKGZuLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgfSlcbiAgaWYgKCFkb25lICYmIHJlcyA9PT0gSVNfRVJST1IpIHtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3QocHJvbWlzZSwgTEFTVF9FUlJPUik7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFByb21pc2UgPSByZXF1aXJlKCcuL2NvcmUuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuUHJvbWlzZS5wcm90b3R5cGUuZG9uZSA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICB2YXIgc2VsZiA9IGFyZ3VtZW50cy5sZW5ndGggPyB0aGlzLnRoZW4uYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IHRoaXM7XG4gIHNlbGYudGhlbihudWxsLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSwgMCk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy9UaGlzIGZpbGUgY29udGFpbnMgdGhlIEVTNiBleHRlbnNpb25zIHRvIHRoZSBjb3JlIFByb21pc2VzL0ErIEFQSVxuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4vY29yZS5qcycpO1xudmFyIGFzYXAgPSByZXF1aXJlKCdhc2FwL3JhdycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG5cbi8qIFN0YXRpYyBGdW5jdGlvbnMgKi9cblxudmFyIFRSVUUgPSB2YWx1ZVByb21pc2UodHJ1ZSk7XG52YXIgRkFMU0UgPSB2YWx1ZVByb21pc2UoZmFsc2UpO1xudmFyIE5VTEwgPSB2YWx1ZVByb21pc2UobnVsbCk7XG52YXIgVU5ERUZJTkVEID0gdmFsdWVQcm9taXNlKHVuZGVmaW5lZCk7XG52YXIgWkVSTyA9IHZhbHVlUHJvbWlzZSgwKTtcbnZhciBFTVBUWVNUUklORyA9IHZhbHVlUHJvbWlzZSgnJyk7XG5cbmZ1bmN0aW9uIHZhbHVlUHJvbWlzZSh2YWx1ZSkge1xuICB2YXIgcCA9IG5ldyBQcm9taXNlKFByb21pc2UuXzgzKTtcbiAgcC5fMzIgPSAxO1xuICBwLl84ID0gdmFsdWU7XG4gIHJldHVybiBwO1xufVxuUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHJldHVybiB2YWx1ZTtcblxuICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiBOVUxMO1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFVOREVGSU5FRDtcbiAgaWYgKHZhbHVlID09PSB0cnVlKSByZXR1cm4gVFJVRTtcbiAgaWYgKHZhbHVlID09PSBmYWxzZSkgcmV0dXJuIEZBTFNFO1xuICBpZiAodmFsdWUgPT09IDApIHJldHVybiBaRVJPO1xuICBpZiAodmFsdWUgPT09ICcnKSByZXR1cm4gRU1QVFlTVFJJTkc7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIHZhciB0aGVuID0gdmFsdWUudGhlbjtcbiAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UodGhlbi5iaW5kKHZhbHVlKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlamVjdChleCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlUHJvbWlzZSh2YWx1ZSk7XG59O1xuXG5Qcm9taXNlLmFsbCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgdmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuICAgIGZ1bmN0aW9uIHJlcyhpLCB2YWwpIHtcbiAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgIGlmICh2YWwgaW5zdGFuY2VvZiBQcm9taXNlICYmIHZhbC50aGVuID09PSBQcm9taXNlLnByb3RvdHlwZS50aGVuKSB7XG4gICAgICAgICAgd2hpbGUgKHZhbC5fMzIgPT09IDMpIHtcbiAgICAgICAgICAgIHZhbCA9IHZhbC5fODtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbC5fMzIgPT09IDEpIHJldHVybiByZXMoaSwgdmFsLl84KTtcbiAgICAgICAgICBpZiAodmFsLl8zMiA9PT0gMikgcmVqZWN0KHZhbC5fOCk7XG4gICAgICAgICAgdmFsLnRoZW4oZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmVzKGksIHZhbCk7XG4gICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRoZW4gPSB2YWwudGhlbjtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBwID0gbmV3IFByb21pc2UodGhlbi5iaW5kKHZhbCkpO1xuICAgICAgICAgICAgcC50aGVuKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgcmVzKGksIHZhbCk7XG4gICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYXJnc1tpXSA9IHZhbDtcbiAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICByZXNvbHZlKGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlcyhpLCBhcmdzW2ldKTtcbiAgICB9XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZWplY3QodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmFjZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG4vKiBQcm90b3R5cGUgTWV0aG9kcyAqL1xuXG5Qcm9taXNlLnByb3RvdHlwZVsnY2F0Y2gnXSA9IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJy4vY29yZS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG5Qcm9taXNlLnByb3RvdHlwZVsnZmluYWxseSddID0gZnVuY3Rpb24gKGYpIHtcbiAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGYoKSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSk7XG4gIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGYoKSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2NvcmUuanMnKTtcbnJlcXVpcmUoJy4vZG9uZS5qcycpO1xucmVxdWlyZSgnLi9maW5hbGx5LmpzJyk7XG5yZXF1aXJlKCcuL2VzNi1leHRlbnNpb25zLmpzJyk7XG5yZXF1aXJlKCcuL25vZGUtZXh0ZW5zaW9ucy5qcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgdGhlbi9wcm9taXNlIHNwZWNpZmljIGV4dGVuc2lvbnMgdGhhdCBhcmUgb25seSB1c2VmdWxcbi8vIGZvciBub2RlLmpzIGludGVyb3BcblxudmFyIFByb21pc2UgPSByZXF1aXJlKCcuL2NvcmUuanMnKTtcbnZhciBhc2FwID0gcmVxdWlyZSgnYXNhcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG5cbi8qIFN0YXRpYyBGdW5jdGlvbnMgKi9cblxuUHJvbWlzZS5kZW5vZGVpZnkgPSBmdW5jdGlvbiAoZm4sIGFyZ3VtZW50Q291bnQpIHtcbiAgYXJndW1lbnRDb3VudCA9IGFyZ3VtZW50Q291bnQgfHwgSW5maW5pdHk7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgd2hpbGUgKGFyZ3MubGVuZ3RoICYmIGFyZ3MubGVuZ3RoID4gYXJndW1lbnRDb3VudCkge1xuICAgICAgICBhcmdzLnBvcCgpO1xuICAgICAgfVxuICAgICAgYXJncy5wdXNoKGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyKTtcbiAgICAgICAgZWxzZSByZXNvbHZlKHJlcyk7XG4gICAgICB9KVxuICAgICAgdmFyIHJlcyA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKHJlcyAmJlxuICAgICAgICAoXG4gICAgICAgICAgdHlwZW9mIHJlcyA9PT0gJ29iamVjdCcgfHxcbiAgICAgICAgICB0eXBlb2YgcmVzID09PSAnZnVuY3Rpb24nXG4gICAgICAgICkgJiZcbiAgICAgICAgdHlwZW9mIHJlcy50aGVuID09PSAnZnVuY3Rpb24nXG4gICAgICApIHtcbiAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblByb21pc2Uubm9kZWlmeSA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICB2YXIgY2FsbGJhY2sgPVxuICAgICAgdHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJyA/IGFyZ3MucG9wKCkgOiBudWxsO1xuICAgIHZhciBjdHggPSB0aGlzO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKS5ub2RlaWZ5KGNhbGxiYWNrLCBjdHgpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICBpZiAoY2FsbGJhY2sgPT09IG51bGwgfHwgdHlwZW9mIGNhbGxiYWNrID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhc2FwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKGN0eCwgZXgpO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5ub2RlaWZ5ID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBjdHgpIHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnZnVuY3Rpb24nKSByZXR1cm4gdGhpcztcblxuICB0aGlzLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKGN0eCwgbnVsbCwgdmFsdWUpO1xuICAgIH0pO1xuICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgYXNhcChmdW5jdGlvbiAoKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKGN0eCwgZXJyKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gcmF3QXNhcCBwcm92aWRlcyBldmVyeXRoaW5nIHdlIG5lZWQgZXhjZXB0IGV4Y2VwdGlvbiBtYW5hZ2VtZW50LlxudmFyIHJhd0FzYXAgPSByZXF1aXJlKFwiLi9yYXdcIik7XG4vLyBSYXdUYXNrcyBhcmUgcmVjeWNsZWQgdG8gcmVkdWNlIEdDIGNodXJuLlxudmFyIGZyZWVUYXNrcyA9IFtdO1xuLy8gV2UgcXVldWUgZXJyb3JzIHRvIGVuc3VyZSB0aGV5IGFyZSB0aHJvd24gaW4gcmlnaHQgb3JkZXIgKEZJRk8pLlxuLy8gQXJyYXktYXMtcXVldWUgaXMgZ29vZCBlbm91Z2ggaGVyZSwgc2luY2Ugd2UgYXJlIGp1c3QgZGVhbGluZyB3aXRoIGV4Y2VwdGlvbnMuXG52YXIgcGVuZGluZ0Vycm9ycyA9IFtdO1xudmFyIHJlcXVlc3RFcnJvclRocm93ID0gcmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIodGhyb3dGaXJzdEVycm9yKTtcblxuZnVuY3Rpb24gdGhyb3dGaXJzdEVycm9yKCkge1xuICAgIGlmIChwZW5kaW5nRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBwZW5kaW5nRXJyb3JzLnNoaWZ0KCk7XG4gICAgfVxufVxuXG4vKipcbiAqIENhbGxzIGEgdGFzayBhcyBzb29uIGFzIHBvc3NpYmxlIGFmdGVyIHJldHVybmluZywgaW4gaXRzIG93biBldmVudCwgd2l0aCBwcmlvcml0eVxuICogb3ZlciBvdGhlciBldmVudHMgbGlrZSBhbmltYXRpb24sIHJlZmxvdywgYW5kIHJlcGFpbnQuIEFuIGVycm9yIHRocm93biBmcm9tIGFuXG4gKiBldmVudCB3aWxsIG5vdCBpbnRlcnJ1cHQsIG5vciBldmVuIHN1YnN0YW50aWFsbHkgc2xvdyBkb3duIHRoZSBwcm9jZXNzaW5nIG9mXG4gKiBvdGhlciBldmVudHMsIGJ1dCB3aWxsIGJlIHJhdGhlciBwb3N0cG9uZWQgdG8gYSBsb3dlciBwcmlvcml0eSBldmVudC5cbiAqIEBwYXJhbSB7e2NhbGx9fSB0YXNrIEEgY2FsbGFibGUgb2JqZWN0LCB0eXBpY2FsbHkgYSBmdW5jdGlvbiB0aGF0IHRha2VzIG5vXG4gKiBhcmd1bWVudHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gYXNhcDtcbmZ1bmN0aW9uIGFzYXAodGFzaykge1xuICAgIHZhciByYXdUYXNrO1xuICAgIGlmIChmcmVlVGFza3MubGVuZ3RoKSB7XG4gICAgICAgIHJhd1Rhc2sgPSBmcmVlVGFza3MucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmF3VGFzayA9IG5ldyBSYXdUYXNrKCk7XG4gICAgfVxuICAgIHJhd1Rhc2sudGFzayA9IHRhc2s7XG4gICAgcmF3QXNhcChyYXdUYXNrKTtcbn1cblxuLy8gV2Ugd3JhcCB0YXNrcyB3aXRoIHJlY3ljbGFibGUgdGFzayBvYmplY3RzLiAgQSB0YXNrIG9iamVjdCBpbXBsZW1lbnRzXG4vLyBgY2FsbGAsIGp1c3QgbGlrZSBhIGZ1bmN0aW9uLlxuZnVuY3Rpb24gUmF3VGFzaygpIHtcbiAgICB0aGlzLnRhc2sgPSBudWxsO1xufVxuXG4vLyBUaGUgc29sZSBwdXJwb3NlIG9mIHdyYXBwaW5nIHRoZSB0YXNrIGlzIHRvIGNhdGNoIHRoZSBleGNlcHRpb24gYW5kIHJlY3ljbGVcbi8vIHRoZSB0YXNrIG9iamVjdCBhZnRlciBpdHMgc2luZ2xlIHVzZS5cblJhd1Rhc2sucHJvdG90eXBlLmNhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgdGhpcy50YXNrLmNhbGwoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBpZiAoYXNhcC5vbmVycm9yKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGhvb2sgZXhpc3RzIHB1cmVseSBmb3IgdGVzdGluZyBwdXJwb3Nlcy5cbiAgICAgICAgICAgIC8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdFxuICAgICAgICAgICAgLy8gZGVwZW5kcyBvbiBpdHMgZXhpc3RlbmNlLlxuICAgICAgICAgICAgYXNhcC5vbmVycm9yKGVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEluIGEgd2ViIGJyb3dzZXIsIGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC4gSG93ZXZlciwgdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIHNsb3dpbmcgZG93biB0aGUgcXVldWUgb2YgcGVuZGluZyB0YXNrcywgd2UgcmV0aHJvdyB0aGUgZXJyb3IgaW4gYVxuICAgICAgICAgICAgLy8gbG93ZXIgcHJpb3JpdHkgdHVybi5cbiAgICAgICAgICAgIHBlbmRpbmdFcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgICByZXF1ZXN0RXJyb3JUaHJvdygpO1xuICAgICAgICB9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy50YXNrID0gbnVsbDtcbiAgICAgICAgZnJlZVRhc2tzW2ZyZWVUYXNrcy5sZW5ndGhdID0gdGhpcztcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBtZWFucyBwb3NzaWJsZSB0byBleGVjdXRlIGEgdGFzayBpbiBpdHMgb3duIHR1cm4sIHdpdGhcbi8vIHByaW9yaXR5IG92ZXIgb3RoZXIgZXZlbnRzIGluY2x1ZGluZyBJTywgYW5pbWF0aW9uLCByZWZsb3csIGFuZCByZWRyYXdcbi8vIGV2ZW50cyBpbiBicm93c2Vycy5cbi8vXG4vLyBBbiBleGNlcHRpb24gdGhyb3duIGJ5IGEgdGFzayB3aWxsIHBlcm1hbmVudGx5IGludGVycnVwdCB0aGUgcHJvY2Vzc2luZyBvZlxuLy8gc3Vic2VxdWVudCB0YXNrcy4gVGhlIGhpZ2hlciBsZXZlbCBgYXNhcGAgZnVuY3Rpb24gZW5zdXJlcyB0aGF0IGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duIGJ5IGEgdGFzaywgdGhhdCB0aGUgdGFzayBxdWV1ZSB3aWxsIGNvbnRpbnVlIGZsdXNoaW5nIGFzXG4vLyBzb29uIGFzIHBvc3NpYmxlLCBidXQgaWYgeW91IHVzZSBgcmF3QXNhcGAgZGlyZWN0bHksIHlvdSBhcmUgcmVzcG9uc2libGUgdG9cbi8vIGVpdGhlciBlbnN1cmUgdGhhdCBubyBleGNlcHRpb25zIGFyZSB0aHJvd24gZnJvbSB5b3VyIHRhc2ssIG9yIHRvIG1hbnVhbGx5XG4vLyBjYWxsIGByYXdBc2FwLnJlcXVlc3RGbHVzaGAgaWYgYW4gZXhjZXB0aW9uIGlzIHRocm93bi5cbm1vZHVsZS5leHBvcnRzID0gcmF3QXNhcDtcbmZ1bmN0aW9uIHJhd0FzYXAodGFzaykge1xuICAgIGlmICghcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHJlcXVlc3RGbHVzaCgpO1xuICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgfVxuICAgIC8vIEVxdWl2YWxlbnQgdG8gcHVzaCwgYnV0IGF2b2lkcyBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgcXVldWVbcXVldWUubGVuZ3RoXSA9IHRhc2s7XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuLy8gT25jZSBhIGZsdXNoIGhhcyBiZWVuIHJlcXVlc3RlZCwgbm8gZnVydGhlciBjYWxscyB0byBgcmVxdWVzdEZsdXNoYCBhcmVcbi8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cbnZhciBmbHVzaGluZyA9IGZhbHNlO1xuLy8gYHJlcXVlc3RGbHVzaGAgaXMgYW4gaW1wbGVtZW50YXRpb24tc3BlY2lmaWMgbWV0aG9kIHRoYXQgYXR0ZW1wdHMgdG8ga2lja1xuLy8gb2ZmIGEgYGZsdXNoYCBldmVudCBhcyBxdWlja2x5IGFzIHBvc3NpYmxlLiBgZmx1c2hgIHdpbGwgYXR0ZW1wdCB0byBleGhhdXN0XG4vLyB0aGUgZXZlbnQgcXVldWUgYmVmb3JlIHlpZWxkaW5nIHRvIHRoZSBicm93c2VyJ3Mgb3duIGV2ZW50IGxvb3AuXG52YXIgcmVxdWVzdEZsdXNoO1xuLy8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuLy8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG4vLyBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbnZhciBpbmRleCA9IDA7XG4vLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG4vLyB1bmJvdW5kZWQuIFRvIHByZXZlbnQgbWVtb3J5IGV4aGF1c3Rpb24sIHRoZSB0YXNrIHF1ZXVlIHdpbGwgcGVyaW9kaWNhbGx5XG4vLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cbnZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cbi8vIFRoZSBmbHVzaCBmdW5jdGlvbiBwcm9jZXNzZXMgYWxsIHRhc2tzIHRoYXQgaGF2ZSBiZWVuIHNjaGVkdWxlZCB3aXRoXG4vLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cbi8vIGNvbnNpc3RlbnQgYW5kIHdpbGwgcmVzdW1lIHdoZXJlIGl0IGxlZnQgb2ZmIHdoZW4gY2FsbGVkIGFnYWluLlxuLy8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duLlxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgICBxdWV1ZVtjdXJyZW50SW5kZXhdLmNhbGwoKTtcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cbiAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yICh2YXIgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBpbmRleCA9IDA7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gYHJlcXVlc3RGbHVzaGAgaXMgaW1wbGVtZW50ZWQgdXNpbmcgYSBzdHJhdGVneSBiYXNlZCBvbiBkYXRhIGNvbGxlY3RlZCBmcm9tXG4vLyBldmVyeSBhdmFpbGFibGUgU2F1Y2VMYWJzIFNlbGVuaXVtIHdlYiBkcml2ZXIgd29ya2VyIGF0IHRpbWUgb2Ygd3JpdGluZy5cbi8vIGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzFtRy01VVlHdXA1cXhHZEVNV2toUDZCV0N6MDUzTlViMkUxUW9VVFUxNnVBL2VkaXQjZ2lkPTc4MzcyNDU5M1xuXG4vLyBTYWZhcmkgNiBhbmQgNi4xIGZvciBkZXNrdG9wLCBpUGFkLCBhbmQgaVBob25lIGFyZSB0aGUgb25seSBicm93c2VycyB0aGF0XG4vLyBoYXZlIFdlYktpdE11dGF0aW9uT2JzZXJ2ZXIgYnV0IG5vdCB1bi1wcmVmaXhlZCBNdXRhdGlvbk9ic2VydmVyLlxuLy8gTXVzdCB1c2UgYGdsb2JhbGAgaW5zdGVhZCBvZiBgd2luZG93YCB0byB3b3JrIGluIGJvdGggZnJhbWVzIGFuZCB3ZWJcbi8vIHdvcmtlcnMuIGBnbG9iYWxgIGlzIGEgcHJvdmlzaW9uIG9mIEJyb3dzZXJpZnksIE1yLCBNcnMsIG9yIE1vcC5cbnZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG4vLyBNdXRhdGlvbk9ic2VydmVycyBhcmUgZGVzaXJhYmxlIGJlY2F1c2UgdGhleSBoYXZlIGhpZ2ggcHJpb3JpdHkgYW5kIHdvcmtcbi8vIHJlbGlhYmx5IGV2ZXJ5d2hlcmUgdGhleSBhcmUgaW1wbGVtZW50ZWQuXG4vLyBUaGV5IGFyZSBpbXBsZW1lbnRlZCBpbiBhbGwgbW9kZXJuIGJyb3dzZXJzLlxuLy9cbi8vIC0gQW5kcm9pZCA0LTQuM1xuLy8gLSBDaHJvbWUgMjYtMzRcbi8vIC0gRmlyZWZveCAxNC0yOVxuLy8gLSBJbnRlcm5ldCBFeHBsb3JlciAxMVxuLy8gLSBpUGFkIFNhZmFyaSA2LTcuMVxuLy8gLSBpUGhvbmUgU2FmYXJpIDctNy4xXG4vLyAtIFNhZmFyaSA2LTdcbmlmICh0eXBlb2YgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJlcXVlc3RGbHVzaCA9IG1ha2VSZXF1ZXN0Q2FsbEZyb21NdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcblxuLy8gTWVzc2FnZUNoYW5uZWxzIGFyZSBkZXNpcmFibGUgYmVjYXVzZSB0aGV5IGdpdmUgZGlyZWN0IGFjY2VzcyB0byB0aGUgSFRNTFxuLy8gdGFzayBxdWV1ZSwgYXJlIGltcGxlbWVudGVkIGluIEludGVybmV0IEV4cGxvcmVyIDEwLCBTYWZhcmkgNS4wLTEsIGFuZCBPcGVyYVxuLy8gMTEtMTIsIGFuZCBpbiB3ZWIgd29ya2VycyBpbiBtYW55IGVuZ2luZXMuXG4vLyBBbHRob3VnaCBtZXNzYWdlIGNoYW5uZWxzIHlpZWxkIHRvIGFueSBxdWV1ZWQgcmVuZGVyaW5nIGFuZCBJTyB0YXNrcywgdGhleVxuLy8gd291bGQgYmUgYmV0dGVyIHRoYW4gaW1wb3NpbmcgdGhlIDRtcyBkZWxheSBvZiB0aW1lcnMuXG4vLyBIb3dldmVyLCB0aGV5IGRvIG5vdCB3b3JrIHJlbGlhYmx5IGluIEludGVybmV0IEV4cGxvcmVyIG9yIFNhZmFyaS5cblxuLy8gSW50ZXJuZXQgRXhwbG9yZXIgMTAgaXMgdGhlIG9ubHkgYnJvd3NlciB0aGF0IGhhcyBzZXRJbW1lZGlhdGUgYnV0IGRvZXNcbi8vIG5vdCBoYXZlIE11dGF0aW9uT2JzZXJ2ZXJzLlxuLy8gQWx0aG91Z2ggc2V0SW1tZWRpYXRlIHlpZWxkcyB0byB0aGUgYnJvd3NlcidzIHJlbmRlcmVyLCBpdCB3b3VsZCBiZVxuLy8gcHJlZmVycmFibGUgdG8gZmFsbGluZyBiYWNrIHRvIHNldFRpbWVvdXQgc2luY2UgaXQgZG9lcyBub3QgaGF2ZVxuLy8gdGhlIG1pbmltdW0gNG1zIHBlbmFsdHkuXG4vLyBVbmZvcnR1bmF0ZWx5IHRoZXJlIGFwcGVhcnMgdG8gYmUgYSBidWcgaW4gSW50ZXJuZXQgRXhwbG9yZXIgMTAgTW9iaWxlIChhbmRcbi8vIERlc2t0b3AgdG8gYSBsZXNzZXIgZXh0ZW50KSB0aGF0IHJlbmRlcnMgYm90aCBzZXRJbW1lZGlhdGUgYW5kXG4vLyBNZXNzYWdlQ2hhbm5lbCB1c2VsZXNzIGZvciB0aGUgcHVycG9zZXMgb2YgQVNBUC5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS9pc3N1ZXMvMzk2XG5cbi8vIFRpbWVycyBhcmUgaW1wbGVtZW50ZWQgdW5pdmVyc2FsbHkuXG4vLyBXZSBmYWxsIGJhY2sgdG8gdGltZXJzIGluIHdvcmtlcnMgaW4gbW9zdCBlbmdpbmVzLCBhbmQgaW4gZm9yZWdyb3VuZFxuLy8gY29udGV4dHMgaW4gdGhlIGZvbGxvd2luZyBicm93c2Vycy5cbi8vIEhvd2V2ZXIsIG5vdGUgdGhhdCBldmVuIHRoaXMgc2ltcGxlIGNhc2UgcmVxdWlyZXMgbnVhbmNlcyB0byBvcGVyYXRlIGluIGFcbi8vIGJyb2FkIHNwZWN0cnVtIG9mIGJyb3dzZXJzLlxuLy9cbi8vIC0gRmlyZWZveCAzLTEzXG4vLyAtIEludGVybmV0IEV4cGxvcmVyIDYtOVxuLy8gLSBpUGFkIFNhZmFyaSA0LjNcbi8vIC0gTHlueCAyLjguN1xufSBlbHNlIHtcbiAgICByZXF1ZXN0Rmx1c2ggPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXIoZmx1c2gpO1xufVxuXG4vLyBgcmVxdWVzdEZsdXNoYCByZXF1ZXN0cyB0aGF0IHRoZSBoaWdoIHByaW9yaXR5IGV2ZW50IHF1ZXVlIGJlIGZsdXNoZWQgYXNcbi8vIHNvb24gYXMgcG9zc2libGUuXG4vLyBUaGlzIGlzIHVzZWZ1bCB0byBwcmV2ZW50IGFuIGVycm9yIHRocm93biBpbiBhIHRhc2sgZnJvbSBzdGFsbGluZyB0aGUgZXZlbnRcbi8vIHF1ZXVlIGlmIHRoZSBleGNlcHRpb24gaGFuZGxlZCBieSBOb2RlLmpz4oCZc1xuLy8gYHByb2Nlc3Mub24oXCJ1bmNhdWdodEV4Y2VwdGlvblwiKWAgb3IgYnkgYSBkb21haW4uXG5yYXdBc2FwLnJlcXVlc3RGbHVzaCA9IHJlcXVlc3RGbHVzaDtcblxuLy8gVG8gcmVxdWVzdCBhIGhpZ2ggcHJpb3JpdHkgZXZlbnQsIHdlIGluZHVjZSBhIG11dGF0aW9uIG9ic2VydmVyIGJ5IHRvZ2dsaW5nXG4vLyB0aGUgdGV4dCBvZiBhIHRleHQgbm9kZSBiZXR3ZWVuIFwiMVwiIGFuZCBcIi0xXCIuXG5mdW5jdGlvbiBtYWtlUmVxdWVzdENhbGxGcm9tTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjaykge1xuICAgIHZhciB0b2dnbGUgPSAxO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICB0b2dnbGUgPSAtdG9nZ2xlO1xuICAgICAgICBub2RlLmRhdGEgPSB0b2dnbGU7XG4gICAgfTtcbn1cblxuLy8gVGhlIG1lc3NhZ2UgY2hhbm5lbCB0ZWNobmlxdWUgd2FzIGRpc2NvdmVyZWQgYnkgTWFsdGUgVWJsIGFuZCB3YXMgdGhlXG4vLyBvcmlnaW5hbCBmb3VuZGF0aW9uIGZvciB0aGlzIGxpYnJhcnkuXG4vLyBodHRwOi8vd3d3Lm5vbmJsb2NraW5nLmlvLzIwMTEvMDYvd2luZG93bmV4dHRpY2suaHRtbFxuXG4vLyBTYWZhcmkgNi4wLjUgKGF0IGxlYXN0KSBpbnRlcm1pdHRlbnRseSBmYWlscyB0byBjcmVhdGUgbWVzc2FnZSBwb3J0cyBvbiBhXG4vLyBwYWdlJ3MgZmlyc3QgbG9hZC4gVGhhbmtmdWxseSwgdGhpcyB2ZXJzaW9uIG9mIFNhZmFyaSBzdXBwb3J0c1xuLy8gTXV0YXRpb25PYnNlcnZlcnMsIHNvIHdlIGRvbid0IG5lZWQgdG8gZmFsbCBiYWNrIGluIHRoYXQgY2FzZS5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbU1lc3NhZ2VDaGFubmVsKGNhbGxiYWNrKSB7XG4vLyAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbi8vICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGNhbGxiYWNrO1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBGb3IgcmVhc29ucyBleHBsYWluZWQgYWJvdmUsIHdlIGFyZSBhbHNvIHVuYWJsZSB0byB1c2UgYHNldEltbWVkaWF0ZWBcbi8vIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLlxuLy8gRXZlbiBpZiB3ZSB3ZXJlLCB0aGVyZSBpcyBhbm90aGVyIGJ1ZyBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMC5cbi8vIEl0IGlzIG5vdCBzdWZmaWNpZW50IHRvIGFzc2lnbiBgc2V0SW1tZWRpYXRlYCB0byBgcmVxdWVzdEZsdXNoYCBiZWNhdXNlXG4vLyBgc2V0SW1tZWRpYXRlYCBtdXN0IGJlIGNhbGxlZCAqYnkgbmFtZSogYW5kIHRoZXJlZm9yZSBtdXN0IGJlIHdyYXBwZWQgaW4gYVxuLy8gY2xvc3VyZS5cbi8vIE5ldmVyIGZvcmdldC5cblxuLy8gZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuLy8gICAgIHJldHVybiBmdW5jdGlvbiByZXF1ZXN0Q2FsbCgpIHtcbi8vICAgICAgICAgc2V0SW1tZWRpYXRlKGNhbGxiYWNrKTtcbi8vICAgICB9O1xuLy8gfVxuXG4vLyBTYWZhcmkgNi4wIGhhcyBhIHByb2JsZW0gd2hlcmUgdGltZXJzIHdpbGwgZ2V0IGxvc3Qgd2hpbGUgdGhlIHVzZXIgaXNcbi8vIHNjcm9sbGluZy4gVGhpcyBwcm9ibGVtIGRvZXMgbm90IGltcGFjdCBBU0FQIGJlY2F1c2UgU2FmYXJpIDYuMCBzdXBwb3J0c1xuLy8gbXV0YXRpb24gb2JzZXJ2ZXJzLCBzbyB0aGF0IGltcGxlbWVudGF0aW9uIGlzIHVzZWQgaW5zdGVhZC5cbi8vIEhvd2V2ZXIsIGlmIHdlIGV2ZXIgZWxlY3QgdG8gdXNlIHRpbWVycyBpbiBTYWZhcmksIHRoZSBwcmV2YWxlbnQgd29yay1hcm91bmRcbi8vIGlzIHRvIGFkZCBhIHNjcm9sbCBldmVudCBsaXN0ZW5lciB0aGF0IGNhbGxzIGZvciBhIGZsdXNoLlxuXG4vLyBgc2V0VGltZW91dGAgZG9lcyBub3QgY2FsbCB0aGUgcGFzc2VkIGNhbGxiYWNrIGlmIHRoZSBkZWxheSBpcyBsZXNzIHRoYW5cbi8vIGFwcHJveGltYXRlbHkgNyBpbiB3ZWIgd29ya2VycyBpbiBGaXJlZm94IDggdGhyb3VnaCAxOCwgYW5kIHNvbWV0aW1lcyBub3Rcbi8vIGV2ZW4gdGhlbi5cblxuZnVuY3Rpb24gbWFrZVJlcXVlc3RDYWxsRnJvbVRpbWVyKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVlc3RDYWxsKCkge1xuICAgICAgICAvLyBXZSBkaXNwYXRjaCBhIHRpbWVvdXQgd2l0aCBhIHNwZWNpZmllZCBkZWxheSBvZiAwIGZvciBlbmdpbmVzIHRoYXRcbiAgICAgICAgLy8gY2FuIHJlbGlhYmx5IGFjY29tbW9kYXRlIHRoYXQgcmVxdWVzdC4gVGhpcyB3aWxsIHVzdWFsbHkgYmUgc25hcHBlZFxuICAgICAgICAvLyB0byBhIDQgbWlsaXNlY29uZCBkZWxheSwgYnV0IG9uY2Ugd2UncmUgZmx1c2hpbmcsIHRoZXJlJ3Mgbm8gZGVsYXlcbiAgICAgICAgLy8gYmV0d2VlbiBldmVudHMuXG4gICAgICAgIHZhciB0aW1lb3V0SGFuZGxlID0gc2V0VGltZW91dChoYW5kbGVUaW1lciwgMCk7XG4gICAgICAgIC8vIEhvd2V2ZXIsIHNpbmNlIHRoaXMgdGltZXIgZ2V0cyBmcmVxdWVudGx5IGRyb3BwZWQgaW4gRmlyZWZveFxuICAgICAgICAvLyB3b3JrZXJzLCB3ZSBlbmxpc3QgYW4gaW50ZXJ2YWwgaGFuZGxlIHRoYXQgd2lsbCB0cnkgdG8gZmlyZVxuICAgICAgICAvLyBhbiBldmVudCAyMCB0aW1lcyBwZXIgc2Vjb25kIHVudGlsIGl0IHN1Y2NlZWRzLlxuICAgICAgICB2YXIgaW50ZXJ2YWxIYW5kbGUgPSBzZXRJbnRlcnZhbChoYW5kbGVUaW1lciwgNTApO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVRpbWVyKCkge1xuICAgICAgICAgICAgLy8gV2hpY2hldmVyIHRpbWVyIHN1Y2NlZWRzIHdpbGwgY2FuY2VsIGJvdGggdGltZXJzIGFuZFxuICAgICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dEhhbmRsZSk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSGFuZGxlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vLyBUaGlzIGlzIGZvciBgYXNhcC5qc2Agb25seS5cbi8vIEl0cyBuYW1lIHdpbGwgYmUgcGVyaW9kaWNhbGx5IHJhbmRvbWl6ZWQgdG8gYnJlYWsgYW55IGNvZGUgdGhhdCBkZXBlbmRzIG9uXG4vLyBpdHMgZXhpc3RlbmNlLlxucmF3QXNhcC5tYWtlUmVxdWVzdENhbGxGcm9tVGltZXIgPSBtYWtlUmVxdWVzdENhbGxGcm9tVGltZXI7XG5cbi8vIEFTQVAgd2FzIG9yaWdpbmFsbHkgYSBuZXh0VGljayBzaGltIGluY2x1ZGVkIGluIFEuIFRoaXMgd2FzIGZhY3RvcmVkIG91dFxuLy8gaW50byB0aGlzIEFTQVAgcGFja2FnZS4gSXQgd2FzIGxhdGVyIGFkYXB0ZWQgdG8gUlNWUCB3aGljaCBtYWRlIGZ1cnRoZXJcbi8vIGFtZW5kbWVudHMuIFRoZXNlIGRlY2lzaW9ucywgcGFydGljdWxhcmx5IHRvIG1hcmdpbmFsaXplIE1lc3NhZ2VDaGFubmVsIGFuZFxuLy8gdG8gY2FwdHVyZSB0aGUgTXV0YXRpb25PYnNlcnZlciBpbXBsZW1lbnRhdGlvbiBpbiBhIGNsb3N1cmUsIHdlcmUgaW50ZWdyYXRlZFxuLy8gYmFjayBpbnRvIEFTQVAgcHJvcGVyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RpbGRlaW8vcnN2cC5qcy9ibG9iL2NkZGY3MjMyNTQ2YTljZjg1ODUyNGI3NWNkZTZmOWVkZjcyNjIwYTcvbGliL3JzdnAvYXNhcC5qc1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBkb21haW47IC8vIFRoZSBkb21haW4gbW9kdWxlIGlzIGV4ZWN1dGVkIG9uIGRlbWFuZFxudmFyIGhhc1NldEltbWVkaWF0ZSA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIjtcblxuLy8gVXNlIHRoZSBmYXN0ZXN0IG1lYW5zIHBvc3NpYmxlIHRvIGV4ZWN1dGUgYSB0YXNrIGluIGl0cyBvd24gdHVybiwgd2l0aFxuLy8gcHJpb3JpdHkgb3ZlciBvdGhlciBldmVudHMgaW5jbHVkaW5nIG5ldHdvcmsgSU8gZXZlbnRzIGluIE5vZGUuanMuXG4vL1xuLy8gQW4gZXhjZXB0aW9uIHRocm93biBieSBhIHRhc2sgd2lsbCBwZXJtYW5lbnRseSBpbnRlcnJ1cHQgdGhlIHByb2Nlc3Npbmcgb2Zcbi8vIHN1YnNlcXVlbnQgdGFza3MuIFRoZSBoaWdoZXIgbGV2ZWwgYGFzYXBgIGZ1bmN0aW9uIGVuc3VyZXMgdGhhdCBpZiBhblxuLy8gZXhjZXB0aW9uIGlzIHRocm93biBieSBhIHRhc2ssIHRoYXQgdGhlIHRhc2sgcXVldWUgd2lsbCBjb250aW51ZSBmbHVzaGluZyBhc1xuLy8gc29vbiBhcyBwb3NzaWJsZSwgYnV0IGlmIHlvdSB1c2UgYHJhd0FzYXBgIGRpcmVjdGx5LCB5b3UgYXJlIHJlc3BvbnNpYmxlIHRvXG4vLyBlaXRoZXIgZW5zdXJlIHRoYXQgbm8gZXhjZXB0aW9ucyBhcmUgdGhyb3duIGZyb20geW91ciB0YXNrLCBvciB0byBtYW51YWxseVxuLy8gY2FsbCBgcmF3QXNhcC5yZXF1ZXN0Rmx1c2hgIGlmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG5tb2R1bGUuZXhwb3J0cyA9IHJhd0FzYXA7XG5mdW5jdGlvbiByYXdBc2FwKHRhc2spIHtcbiAgICBpZiAoIXF1ZXVlLmxlbmd0aCkge1xuICAgICAgICByZXF1ZXN0Rmx1c2goKTtcbiAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgIH1cbiAgICAvLyBBdm9pZHMgYSBmdW5jdGlvbiBjYWxsXG4gICAgcXVldWVbcXVldWUubGVuZ3RoXSA9IHRhc2s7XG59XG5cbnZhciBxdWV1ZSA9IFtdO1xuLy8gT25jZSBhIGZsdXNoIGhhcyBiZWVuIHJlcXVlc3RlZCwgbm8gZnVydGhlciBjYWxscyB0byBgcmVxdWVzdEZsdXNoYCBhcmVcbi8vIG5lY2Vzc2FyeSB1bnRpbCB0aGUgbmV4dCBgZmx1c2hgIGNvbXBsZXRlcy5cbnZhciBmbHVzaGluZyA9IGZhbHNlO1xuLy8gVGhlIHBvc2l0aW9uIG9mIHRoZSBuZXh0IHRhc2sgdG8gZXhlY3V0ZSBpbiB0aGUgdGFzayBxdWV1ZS4gVGhpcyBpc1xuLy8gcHJlc2VydmVkIGJldHdlZW4gY2FsbHMgdG8gYGZsdXNoYCBzbyB0aGF0IGl0IGNhbiBiZSByZXN1bWVkIGlmXG4vLyBhIHRhc2sgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbnZhciBpbmRleCA9IDA7XG4vLyBJZiBhIHRhc2sgc2NoZWR1bGVzIGFkZGl0aW9uYWwgdGFza3MgcmVjdXJzaXZlbHksIHRoZSB0YXNrIHF1ZXVlIGNhbiBncm93XG4vLyB1bmJvdW5kZWQuIFRvIHByZXZlbnQgbWVtb3J5IGV4Y2F1c3Rpb24sIHRoZSB0YXNrIHF1ZXVlIHdpbGwgcGVyaW9kaWNhbGx5XG4vLyB0cnVuY2F0ZSBhbHJlYWR5LWNvbXBsZXRlZCB0YXNrcy5cbnZhciBjYXBhY2l0eSA9IDEwMjQ7XG5cbi8vIFRoZSBmbHVzaCBmdW5jdGlvbiBwcm9jZXNzZXMgYWxsIHRhc2tzIHRoYXQgaGF2ZSBiZWVuIHNjaGVkdWxlZCB3aXRoXG4vLyBgcmF3QXNhcGAgdW5sZXNzIGFuZCB1bnRpbCBvbmUgb2YgdGhvc2UgdGFza3MgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbi8vIElmIGEgdGFzayB0aHJvd3MgYW4gZXhjZXB0aW9uLCBgZmx1c2hgIGVuc3VyZXMgdGhhdCBpdHMgc3RhdGUgd2lsbCByZW1haW5cbi8vIGNvbnNpc3RlbnQgYW5kIHdpbGwgcmVzdW1lIHdoZXJlIGl0IGxlZnQgb2ZmIHdoZW4gY2FsbGVkIGFnYWluLlxuLy8gSG93ZXZlciwgYGZsdXNoYCBkb2VzIG5vdCBtYWtlIGFueSBhcnJhbmdlbWVudHMgdG8gYmUgY2FsbGVkIGFnYWluIGlmIGFuXG4vLyBleGNlcHRpb24gaXMgdGhyb3duLlxuZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgd2hpbGUgKGluZGV4IDwgcXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBpbmRleDtcbiAgICAgICAgLy8gQWR2YW5jZSB0aGUgaW5kZXggYmVmb3JlIGNhbGxpbmcgdGhlIHRhc2suIFRoaXMgZW5zdXJlcyB0aGF0IHdlIHdpbGxcbiAgICAgICAgLy8gYmVnaW4gZmx1c2hpbmcgb24gdGhlIG5leHQgdGFzayB0aGUgdGFzayB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICAgIGluZGV4ID0gaW5kZXggKyAxO1xuICAgICAgICBxdWV1ZVtjdXJyZW50SW5kZXhdLmNhbGwoKTtcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBhc2FwYC5cbiAgICAgICAgLy8gSWYgd2UgY2FsbCBgYXNhcGAgd2l0aGluIHRhc2tzIHNjaGVkdWxlZCBieSBgYXNhcGAsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IHRhc2sgd2UgZXhlY3V0ZSwgd2UgZG9uJ3RcbiAgICAgICAgLy8gc2hpZnQgdGFza3Mgb2ZmIHRoZSBxdWV1ZSBhZnRlciB0aGV5IGhhdmUgYmVlbiBleGVjdXRlZC5cbiAgICAgICAgLy8gSW5zdGVhZCwgd2UgcGVyaW9kaWNhbGx5IHNoaWZ0IDEwMjQgdGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yICh2YXIgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICBxdWV1ZVtzY2FuXSA9IHF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBxdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICBpbmRleCA9IDA7XG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxucmF3QXNhcC5yZXF1ZXN0Rmx1c2ggPSByZXF1ZXN0Rmx1c2g7XG5mdW5jdGlvbiByZXF1ZXN0Rmx1c2goKSB7XG4gICAgLy8gRW5zdXJlIGZsdXNoaW5nIGlzIG5vdCBib3VuZCB0byBhbnkgZG9tYWluLlxuICAgIC8vIEl0IGlzIG5vdCBzdWZmaWNpZW50IHRvIGV4aXQgdGhlIGRvbWFpbiwgYmVjYXVzZSBkb21haW5zIGV4aXN0IG9uIGEgc3RhY2suXG4gICAgLy8gVG8gZXhlY3V0ZSBjb2RlIG91dHNpZGUgb2YgYW55IGRvbWFpbiwgdGhlIGZvbGxvd2luZyBkYW5jZSBpcyBuZWNlc3NhcnkuXG4gICAgdmFyIHBhcmVudERvbWFpbiA9IHByb2Nlc3MuZG9tYWluO1xuICAgIGlmIChwYXJlbnREb21haW4pIHtcbiAgICAgICAgaWYgKCFkb21haW4pIHtcbiAgICAgICAgICAgIC8vIExhenkgZXhlY3V0ZSB0aGUgZG9tYWluIG1vZHVsZS5cbiAgICAgICAgICAgIC8vIE9ubHkgZW1wbG95ZWQgaWYgdGhlIHVzZXIgZWxlY3RzIHRvIHVzZSBkb21haW5zLlxuICAgICAgICAgICAgZG9tYWluID0gcmVxdWlyZShcImRvbWFpblwiKTtcbiAgICAgICAgfVxuICAgICAgICBkb21haW4uYWN0aXZlID0gcHJvY2Vzcy5kb21haW4gPSBudWxsO1xuICAgIH1cblxuICAgIC8vIGBzZXRJbW1lZGlhdGVgIGlzIHNsb3dlciB0aGF0IGBwcm9jZXNzLm5leHRUaWNrYCwgYnV0IGBwcm9jZXNzLm5leHRUaWNrYFxuICAgIC8vIGNhbm5vdCBoYW5kbGUgcmVjdXJzaW9uLlxuICAgIC8vIGByZXF1ZXN0Rmx1c2hgIHdpbGwgb25seSBiZSBjYWxsZWQgcmVjdXJzaXZlbHkgZnJvbSBgYXNhcC5qc2AsIHRvIHJlc3VtZVxuICAgIC8vIGZsdXNoaW5nIGFmdGVyIGFuIGVycm9yIGlzIHRocm93biBpbnRvIGEgZG9tYWluLlxuICAgIC8vIENvbnZlbmllbnRseSwgYHNldEltbWVkaWF0ZWAgd2FzIGludHJvZHVjZWQgaW4gdGhlIHNhbWUgdmVyc2lvblxuICAgIC8vIGBwcm9jZXNzLm5leHRUaWNrYCBzdGFydGVkIHRocm93aW5nIHJlY3Vyc2lvbiBlcnJvcnMuXG4gICAgaWYgKGZsdXNoaW5nICYmIGhhc1NldEltbWVkaWF0ZSkge1xuICAgICAgICBzZXRJbW1lZGlhdGUoZmx1c2gpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnREb21haW4pIHtcbiAgICAgICAgZG9tYWluLmFjdGl2ZSA9IHByb2Nlc3MuZG9tYWluID0gcGFyZW50RG9tYWluO1xuICAgIH1cbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHNldEltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIGFkZEZyb21TZXRJbW1lZGlhdGVBcmd1bWVudHMoYXJncykge1xuICAgICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gcGFydGlhbGx5QXBwbGllZC5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWNjZXB0cyB0aGUgc2FtZSBhcmd1bWVudHMgYXMgc2V0SW1tZWRpYXRlLCBidXRcbiAgICAvLyByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCByZXF1aXJlcyBubyBhcmd1bWVudHMuXG4gICAgZnVuY3Rpb24gcGFydGlhbGx5QXBwbGllZChoYW5kbGVyKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgKG5ldyBGdW5jdGlvbihcIlwiICsgaGFuZGxlcikpKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChwYXJ0aWFsbHlBcHBsaWVkKHJ1bklmUHJlc2VudCwgaGFuZGxlKSwgMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0YXNrKCk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHNldEltbWVkaWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGFkZEZyb21TZXRJbW1lZGlhdGVBcmd1bWVudHMoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2socGFydGlhbGx5QXBwbGllZChydW5JZlByZXNlbnQsIGhhbmRsZSkpO1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0SW1tZWRpYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gYWRkRnJvbVNldEltbWVkaWF0ZUFyZ3VtZW50cyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2V0SW1tZWRpYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gYWRkRnJvbVNldEltbWVkaWF0ZUFyZ3VtZW50cyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHNldEltbWVkaWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGFkZEZyb21TZXRJbW1lZGlhdGVBcmd1bWVudHMoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICBzZXRJbW1lZGlhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBhZGRGcm9tU2V0SW1tZWRpYXRlQXJndW1lbnRzKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBhcnRpYWxseUFwcGxpZWQocnVuSWZQcmVzZW50LCBoYW5kbGUpLCAwKTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufShuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpKSk7XG4iLCIvKipcbiAqIG1pY3JvYmUuanNcbiAqXG4gKiBAYXV0aG9yICBNb3VzZSBCcmF1biAgICAgICAgIDxtb3VzZUBzb2Npb21hbnRpYy5jb20+XG4gKiBAYXV0aG9yICBOaWNvbGFzIEJydWduZWF1eCAgIDxuaWNvbGFzLmJydWduZWF1eEBzb2Npb21hbnRpYy5jb20+XG4gKlxuICogQHBhY2thZ2UgTWljcm9iZVxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7IHNsaWNlLCBzcGxpY2UsIHB1c2gsIGZvckVhY2gsIG1hcCwgaW5kZXhPZiB9IGZyb20gJy4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgdG9TdHJpbmcgfSBmcm9tICcuL3V0aWxzL3N0cmluZyc7XG5pbXBvcnQgVHlwZXMgZnJvbSAnLi91dGlscy90eXBlcyc7XG5cbmNvbnN0IF90eXBlICAgICAgID0gJ1tvYmplY3QgTWljcm9iZV0nO1xuXG4vKipcbiAqIMK1IGNvbnN0cnVjdG9yXG4gKlxuICogYnVpbGRzIHRoZSDCtSBvYmplY3RcbiAqXG4gKiBAcmV0dXJuIMK1XG4gKi9cbmNvbnN0IE1pY3JvYmUgPSAoIHNlbGVjdG9yLCBzY29wZSwgZWxlbWVudHMgKSA9Plxue1xuICAgIHJldHVybiBuZXcgTWljcm9iZS5jb3JlLl9faW5pdF9fKCBzZWxlY3Rvciwgc2NvcGUsIGVsZW1lbnRzICk7XG59O1xuXG5cbk1pY3JvYmUuY29yZSA9IE1pY3JvYmUucHJvdG90eXBlID1cbntcbiAgICB2ZXJzaW9uIDogICAgICAgJzAuMy4xJyxcblxuICAgIGNvbnN0cnVjdG9yIDogICBNaWNyb2JlLFxuXG4gICAgdHlwZSA6ICAgICAgICAgIF90eXBlLFxuXG4gICAgbGVuZ3RoIDogICAgICAgIDAsXG5cbiAgICBfc2VsZWN0b3I6ICAgICAgJycsXG5cblxuICAgIC8qKlxuICAgICAqIEFkZCBDbGFzc1xuICAgICAqXG4gICAgICogYWRkcyB0aGUgcGFzc2VkIGNsYXNzIHRvIHRoZSBjdXJyZW50IGVsZW1lbnQocylcbiAgICAgKlxuICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgICAgICAgX2NsYXNzICAgICAgICAgICAgICBjbGFzcyB0byBhZGRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIGFkZENsYXNzIDogKGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIGNvbnN0IF9hZGRDbGFzcyA9ICggX2NsYXNzLCBfZWwgKSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKCBsZXQgaSA9IDAsIGxlbiA9IF9jbGFzcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2VsLmNsYXNzTGlzdC5hZGQoIF9jbGFzc1tpXSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfZWwuZGF0YSAgICAgICAgICAgICAgICA9IF9lbC5kYXRhIHx8wqB7fTtcbiAgICAgICAgICAgIF9lbC5kYXRhLmNsYXNzICAgICAgICAgID0gX2VsLmRhdGEuY2xhc3MgfHzCoHt9O1xuICAgICAgICAgICAgX2VsLmRhdGEuY2xhc3MuY2xhc3MgICAgPSBfZWwuY2xhc3NOYW1lO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggX2NsYXNzIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgX2NsYXNzID09PSAnc3RyaW5nJyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2NsYXNzID0gWyBfY2xhc3MgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICggbGV0IGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfYWRkQ2xhc3MoIF9jbGFzcywgdGhpc1tpXSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9KCkpLFxuXG5cblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBhcHBlbmRzIGFuIGVsZW1lbnQgb3IgZWxlbWVudHMgdG8gdGhlIG1pY3JvYmUuICBpZiB0aGVyZSBpcyBtb3JlIHRoYW5cbiAgICAgKiBvbmUgdGFyZ2V0IHRoZSBuZXh0IG9uZXMgYXJlIGNsb25lZFxuICAgICAqXG4gICAgICogQHBhcmFtICAge0VsZW1lbnQgQXJyYXkgb3IgTWljcm9iZX0gIF9lbGUgICAgICAgICAgZWxlbWVudChzKSB0byBhcHBlbmRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIGFwcGVuZCA6IChmdW5jdGlvbigpXG4gICAge1xuICAgICAgICBjb25zdCBfYXBwZW5kID0gKCBfcGFyZW50RWwsIF9lbG0gKSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBfcGFyZW50RWwuYXBwZW5kQ2hpbGQoIF9lbG0gKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIF9lbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggIV9lbC5sZW5ndGggKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9lbCA9IFsgX2VsIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuaSA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuaTsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IgKCBsZXQgaiA9IDAsIGxlbmogPSBfZWwubGVuZ3RoOyBqIDwgbGVuajsgaisrIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggaSAhPT0gMCApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hcHBlbmQoIHRoaXNbIGkgXSwgX2VsWyBqIF0uY2xvbmVOb2RlKCB0cnVlICkgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hcHBlbmQoIHRoaXNbIGkgXSwgX2VsWyBqIF0gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfSgpKSxcblxuXG4gICAgIC8qKlxuICAgICAqIEFsdGVyL0dldCBBdHRyaWJ1dGVcbiAgICAgKlxuICAgICAqIENoYW5nZXMgdGhlIGF0dHJpYnV0ZSBieSB3cml0aW5nIHRoZSBnaXZlbiBwcm9wZXJ0eSBhbmQgdmFsdWUgdG8gdGhlXG4gICAgICogc3VwcGxpZWQgZWxlbWVudHMuICBJZiB0aGUgdmFsdWUgaXMgb21pdHRlZCwgc2ltcGx5IHJldHVybnMgdGhlIGN1cnJlbnRcbiAgICAgKiBhdHRyaWJ1dGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgICAgIF9hdHRyaWJ1dGUgICAgICAgICAgYXR0cmlidXRlIG5hbWVcbiAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgICAgIF92YWx1ZSAgICAgICAgICAgICAgYXR0cmlidXRlIHZhbHVlIChvcHRpb25hbClcbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtNaWNyb2JlIG9yIEFycmF5fVxuICAgICAqL1xuICAgIGF0dHIgOiBmdW5jdGlvbiAoIF9hdHRyaWJ1dGUsIF92YWx1ZSApXG4gICAge1xuICAgICAgICB2YXIgX3NldEF0dHIgPSBmdW5jdGlvbiggX2VsbSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggX3ZhbHVlID09PSBudWxsIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfcmVtb3ZlQXR0ciggX2VsbSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICggIV9lbG0uZ2V0QXR0cmlidXRlIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIF9lbG1bIF9hdHRyaWJ1dGUgXSA9IF92YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgX2VsbS5zZXRBdHRyaWJ1dGUoIF9hdHRyaWJ1dGUsIF92YWx1ZSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIF9lbG0uZGF0YSAgICAgICAgICAgICAgICAgICAgICAgICAgID0gX2VsbS5kYXRhIHx8wqB7fTtcbiAgICAgICAgICAgICAgICBfZWxtLmRhdGEuYXR0ciAgICAgICAgICAgICAgICAgICAgICA9IF9lbG0uZGF0YS5hdHRyIHx8wqB7fTtcbiAgICAgICAgICAgICAgICBfZWxtLmRhdGEuYXR0ci5hdHRyICAgICAgICAgICAgICAgICA9IF9lbG0uZGF0YS5hdHRyLmF0dHIgfHzCoHt9O1xuICAgICAgICAgICAgICAgIF9lbG0uZGF0YS5hdHRyLmF0dHJbIF9hdHRyaWJ1dGUgXSAgID0gX3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfZ2V0QXR0ciA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCBfZWxtLmdldEF0dHJpYnV0ZSggX2F0dHJpYnV0ZSApID09PSBudWxsIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2VsbVsgX2F0dHJpYnV0ZSBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIF9lbG0uZ2V0QXR0cmlidXRlKCBfYXR0cmlidXRlICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9yZW1vdmVBdHRyID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIF9lbG0uZ2V0QXR0cmlidXRlKCBfYXR0cmlidXRlICkgPT09IG51bGwgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfZWxtWyBfYXR0cmlidXRlIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2VsbS5yZW1vdmVBdHRyaWJ1dGUoIF9hdHRyaWJ1dGUgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSBfZWxtLmRhdGEuYXR0ci5hdHRyWyBfYXR0cmlidXRlIF07XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCBfdmFsdWUgIT09IHVuZGVmaW5lZCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBpLCBsZW47XG4gICAgICAgICAgICBmb3IgKCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX3NldEF0dHIoIHRoaXNbIGkgXSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBqLCBsZW5qO1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IG5ldyBBcnJheSggdGhpcy5sZW5ndGggKTtcbiAgICAgICAgZm9yICggaiA9IDAsIGxlbmogPSB0aGlzLmxlbmd0aDsgaiA8IGxlbmo7IGorKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNbIGogXSA9IF9nZXRBdHRyKCB0aGlzWyBqIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIENoaWxkcmVuXG4gICAgICpcbiAgICAgKiBnZXRzIGFuIGFycmF5IG9mIGFsbCB0aGUgZ2l2ZW4gZWxlbWVudCdzIGNoaWxkcmVuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkgb2YgbWljcm9iZXNcbiAgICAgKi9cbiAgICBjaGlsZHJlbiA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHZhciBfY2hpbGRyZW4gPSBmdW5jdGlvbiggX2VsbSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBNaWNyb2JlLnRvQXJyYXkoIF9lbG0uY2hpbGRyZW4gKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgaSwgbGVuLCBjaGlsZHJlbkFycmF5ID0gbmV3IEFycmF5KCB0aGlzLmxlbmd0aCApO1xuXG4gICAgICAgIGZvciAoIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAge1xuICAgICAgICAgICAgY2hpbGRyZW5BcnJheVsgaSBdID0gbmV3IE1pY3JvYmUoICcnLCB1bmRlZmluZWQsIF9jaGlsZHJlbiggdGhpc1sgaSBdICkgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGlsZHJlbkFycmF5O1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIENTU1xuICAgICAqXG4gICAgICogQ2hhbmdlcyB0aGUgQ1NTIGJ5IHdyaXRpbmcgdGhlIGdpdmVuIHByb3BlcnR5IGFuZCB2YWx1ZSBpbmxpbmUgdG8gdGhlXG4gICAgICogc3VwcGxpZWQgZWxlbWVudHMuIChwcm9wZXJ0aWVzIHNob3VsZCBiZSBzdXBwbGllZCBpbiBqYXZhc2NyaXB0IGZvcm1hdCkuXG4gICAgICogSWYgdGhlIHZhbHVlIGlzIG9taXR0ZWQsIHNpbXBseSByZXR1cm5zIHRoZSBjdXJyZW50IGNzcyB2YWx1ZSBvZiB0aGUgZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgICAgICAgX2F0dHJpYnV0ZSAgICAgICAgICBjc3MgcHJvcGVydHlcbiAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgICAgIF92YWx1ZSAgICAgICAgICAgICAgY3NzIHZhbHVlIChvcHRpb25hbClcbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtNaWNyb2JlIG9yIEFycmF5fVxuICAgICAqL1xuICAgIGNzcyA6IGZ1bmN0aW9uICggX3Byb3BlcnR5LCBfdmFsdWUgKVxuICAgIHtcbiAgICAgICAgdmFyIF9zZXRDc3MgPSBmdW5jdGlvbiggX2VsbSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbG0uZGF0YSAgICAgICAgICAgICAgICAgICA9IF9lbG0uZGF0YSB8fMKge307XG4gICAgICAgICAgICBfZWxtLmRhdGEuY3NzICAgICAgICAgICAgICAgPSBfZWxtLmRhdGEuY3NzIHx8wqB7fTtcbiAgICAgICAgICAgIF9lbG0uZGF0YS5jc3NbIF9wcm9wZXJ0eSBdICA9IF92YWx1ZTtcbiAgICAgICAgICAgIF9lbG0uc3R5bGVbIF9wcm9wZXJ0eSBdICAgICA9IF9lbG0uZGF0YS5jc3NbIF9wcm9wZXJ0eSBdO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBfZ2V0Q3NzID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIF9lbG0gKS5nZXRQcm9wZXJ0eVZhbHVlKCBfcHJvcGVydHkgKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIF92YWx1ZSB8fCBfdmFsdWUgPT09IG51bGwgfHwgX3ZhbHVlID09PSAnJyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF92YWx1ZSA9ICggX3ZhbHVlID09PSBudWxsICkgPyAnJyA6IF92YWx1ZTtcblxuICAgICAgICAgICAgdmFyIGksIGxlbjtcbiAgICAgICAgICAgIGZvciAoIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfc2V0Q3NzKCB0aGlzWyBpIF0gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGosIGxlbmosIHN0eWxlcyA9IG5ldyBBcnJheSggdGhpcy5sZW5ndGggKTtcbiAgICAgICAgZm9yICggaiA9IDAsIGxlbmogPSB0aGlzLmxlbmd0aDsgaiA8IGxlbmo7IGorKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN0eWxlc1sgaiBdID0gX2dldENzcyggdGhpc1sgaiBdICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3R5bGVzO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIEVhY2hcbiAgICAgKlxuICAgICAqIE1ldGhvZHMgaXRlcmF0ZXMgdGhyb3VnaCBhbGwgdGhlIGVsZW1lbnRzIGFuIGV4ZWN1dGUgdGhlIGZ1bmN0aW9uIG9uIGVhY2ggb2ZcbiAgICAgKiB0aGVtXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgICAgIF9jYWxsYmFjayAgICAgICAgICAgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBpdGVtXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKi9cbiAgICBlYWNoIDogZnVuY3Rpb24oIF9jYWxsYmFjayApXG4gICAge1xuICAgICAgICB2YXIgaSwgbGVuaTtcbiAgICAgICAgZm9yICggaSA9IDAsIGxlbmkgPSB0aGlzLmxlbmd0aDsgaSA8IGxlbmk7IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9jYWxsYmFjayggdGhpc1sgaSBdLCBpICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogRmlsdGVyIEVsZW1lbnRcbiAgICAgKlxuICAgICAqIGZpbHRlcnMgdGhlIG1pY3JvYmUgYnkgdGhlIGdpdmVuIGdpdmVuIHNlbGVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgIHNlbGVjdG9yICAgICAgICAgICAgc2VsZWN0b3IgdG8gZmlsdGVyIGJ5XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIGZpbHRlciA6IGZ1bmN0aW9uKCBmaWx0ZXIgKVxuICAgIHtcbiAgICAgICAgdmFyIG9yaWdpbmFsU2VsZWN0b3IgPSB0aGlzLnNlbGVjdG9yKCk7XG5cbiAgICAgICAgdmFyIHNlbGVjdG9yUmVnZXggICA9IG9yaWdpbmFsU2VsZWN0b3IubWF0Y2goIHRoaXMuX19zZWxlY3RvclJlZ2V4ICksXG4gICAgICAgICAgICBmaWx0ZXJSZWdleCAgICAgPSBmaWx0ZXIubWF0Y2goIHRoaXMuX19zZWxlY3RvclJlZ2V4ICk7XG5cbiAgICAgICAgdmFyIF9pZCA9ICcnLCBfdGFnID0gJycsIF9wc3VlZG8gPSAnJywgX2NsYXNzID0gJycsIF9zZWxlY3RvcjtcblxuICAgICAgICB2YXIgc2VsZWN0b3JBcnJheSA9IFsgc2VsZWN0b3JSZWdleCwgZmlsdGVyUmVnZXggXTtcblxuICAgICAgICB2YXIgaSwgbGVuSSwgaiwgbGVuSjtcbiAgICAgICAgZm9yICggaiA9IDAsIGxlbkogPSBzZWxlY3RvckFycmF5Lmxlbmd0aDsgaiA8IGxlbko7IGorKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggc2VsZWN0b3JBcnJheVsgaiBdIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IgKCBpID0gMCwgbGVuSSA9IHNlbGVjdG9yQXJyYXlbIGogXS5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBzZWxlY3RvckFycmF5WyBqIF1bIGkgXVsgMCBdO1xuXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoIHRyaWdnZXIgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQgICAgICArPSBzZWxlY3RvckFycmF5WyBqIF1bIGkgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2NsYXNzICAgKz0gc2VsZWN0b3JBcnJheVsgaiBdWyBpIF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzonOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9wc3VlZG8gICA9IHNlbGVjdG9yQXJyYXlbIGogXVsgaSBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggX3RhZyAhPT0gc2VsZWN0b3JBcnJheVsgaiBdWyBpIF0gKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBfdGFnICE9PSAnJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTWljcm9iZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RhZyAgICAgPSBzZWxlY3RvckFycmF5WyBqIF1bIGkgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIF9zZWxlY3RvciA9IF90YWcgKyBfaWQgKyBfY2xhc3MgKyBfcHN1ZWRvO1xuXG4gICAgICAgIHJldHVybiBuZXcgTWljcm9iZSggX3NlbGVjdG9yICk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogRmluZCBFbGVtZW50XG4gICAgICpcbiAgICAgKiBmaW5kcyBhIGNoaWxkIGVsZW1lbnQgd2l0aCB0aGUgZ2l2ZW4gc2VsZWN0b3IgaW5zaWRlIHRoZSBzY29wZSBvZiB0aGUgY3VycmVudCBtaWNyb2JlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgIHNlbGVjdG9yICAgICAgICAgICAgc2VsZWN0b3IgdG8gc2VhcmNoIGZvclxuICAgICAqXG4gICAgICogQHJldHVybiB7TWljcm9iZX1cbiAgICAgKi9cbiAgICBmaW5kIDogZnVuY3Rpb24oIHNlbGVjdG9yIClcbiAgICB7XG4gICAgICAgIHZhciBfc2NvcGUgPSB0aGlzLnNlbGVjdG9yKCk7XG4gICAgICAgIHJldHVybiBuZXcgTWljcm9iZSggc2VsZWN0b3IsIF9zY29wZSApO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIEZpcnN0IEVsZW1lbnRcbiAgICAgKlxuICAgICAqIE1ldGhvZHMgZ2V0cyB0aGUgZmlyc3QgSFRNTCBFbGVtZW50cyBvZiB0aGUgY3VycmVudCBvYmplY3QsIGFuZCB3cmFwIGl0IGluXG4gICAgICogTWljcm9iZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIGZpcnN0IDogZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICAgIGlmICggdGhpcy5sZW5ndGggPT09IDEgKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgTWljcm9iZSggWyB0aGlzWyAwIF0gXSApO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIEdldCBQYXJlbnQgSW5kZXhcbiAgICAgKlxuICAgICAqIGdldHMgdGhlIGluZGV4IG9mIHRoZSBpdGVtIGluIGl0J3MgcGFyZW50Tm9kZSdzIGNoaWxkcmVuIGFycmF5XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkgb2YgaW5kZXhlc1xuICAgICAqL1xuICAgIGdldFBhcmVudEluZGV4IDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIF9nZXRQYXJlbnRJbmRleCA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoIF9lbG0ucGFyZW50Tm9kZS5jaGlsZHJlbiwgX2VsbSApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBpLCBsZW4sIGluZGV4ZXMgPSBuZXcgQXJyYXkoIHRoaXMubGVuZ3RoICk7XG5cbiAgICAgICAgZm9yICggaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpbmRleGVzWyBpIF0gPSBfZ2V0UGFyZW50SW5kZXgoIHRoaXNbIGkgXSApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogSGFzIENsYXNzXG4gICAgICpcbiAgICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgb2JqZWN0IG9yIHRoZSBnaXZlbiBlbGVtZW50IGhhcyB0aGUgZ2l2ZW4gY2xhc3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgICAgICAgX2NsYXNzICAgICAgICAgICAgICBjbGFzcyB0byBjaGVja1xuICAgICAqXG4gICAgICogQHJldHVybiAge01pY3JvYmV9XG4gICAgKi9cbiAgICBoYXNDbGFzcyA6IGZ1bmN0aW9uKCBfY2xhc3MgKVxuICAgIHtcbiAgICAgICAgdmFyIF9oYXNDbGFzcyA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIF9lbG0uY2xhc3NMaXN0LmNvbnRhaW5zKCBfY2xhc3MgKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgaSwgbGVuLCByZXN1bHRzID0gbmV3IEFycmF5KCB0aGlzLmxlbmd0aCApO1xuICAgICAgICBmb3IgKCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdHNbIGkgXSA9IF9oYXNDbGFzcyggdGhpc1sgaSBdICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBIVE1MXG4gICAgICpcbiAgICAgKiBDaGFuZ2VzIHRoZSBpbm5lckh0bWwgdG8gdGhlIHN1cHBsaWVkIHN0cmluZy4gIElmIHRoZSB2YWx1ZSBpcyBvbWl0dGVkLFxuICAgICAqIHNpbXBseSByZXR1cm5zIHRoZSBjdXJyZW50IGlubmVyIGh0bWwgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgICAgIF92YWx1ZSAgICAgICAgICAgICAgaHRtbCB2YWx1ZSAob3B0aW9uYWwpXG4gICAgICpcbiAgICAgKiBAcmV0dXJuICB7TWljcm9iZSBvciBBcnJheX1cbiAgICAqL1xuICAgIGh0bWwgOiBmdW5jdGlvbiAoIF92YWx1ZSApXG4gICAge1xuICAgICAgICB2YXIgX2dldEh0bWwgPSBmdW5jdGlvbiggX2VsbSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBfZWxtLmlubmVySFRNTDtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIF92YWx1ZSAmJiBfdmFsdWUubm9kZVR5cGUgPT09IDEgKVxuICAgICAgICB7XG4gICAgICAgICAgIHJldHVybiBfZ2V0SHRtbCggX3ZhbHVlICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF92YWx1ZSB8fCBfdmFsdWUgPT09ICcnIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIF9zZXRIdG1sID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9lbG0uZGF0YSAgICAgICAgICAgPSBfZWxtLmRhdGEgfHwge307XG4gICAgICAgICAgICAgICAgX2VsbS5kYXRhLmh0bWwgICAgICA9IF9lbG0uZGF0YS5odG1sIHx8IHt9O1xuICAgICAgICAgICAgICAgIF9lbG0uZGF0YS5odG1sLmh0bWwgPSBfdmFsdWU7XG4gICAgICAgICAgICAgICAgX2VsbS5pbm5lckhUTUwgICAgICA9IF92YWx1ZTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBpLCBsZW47XG4gICAgICAgICAgICBmb3IgKCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX3NldEh0bWwoIHRoaXNbIGkgXSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBqLCBsZW5qLCBtYXJrdXAgPSBuZXcgQXJyYXkoIHRoaXMubGVuZ3RoICk7XG4gICAgICAgIGZvciAoIGogPSAwLCBsZW5qID0gdGhpcy5sZW5ndGg7IGogPCBsZW5qOyBqKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBtYXJrdXBbIGogXSA9IF9nZXRIdG1sKCB0aGlzWyBqIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXJrdXA7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogSW5kZXggb2ZcbiAgICAgKlxuICAgICAqIHJldHVybnMgdGhlIGluZGV4IG9mIGFuIGVsZW1lbnQgaW4gdGhpcyBtaWNyb2JlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICAgICAgICAgICAgIF9lbCAgICAgICAgICAgICAgICAgZWxlbWVudCB0byBjaGVja1xuICAgICAqXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqL1xuICAgIGluZGV4T2YgOiBmdW5jdGlvbiggX2VsIClcbiAgICB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvQXJyYXkoKS5pbmRleE9mKCBfZWwgKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnQgQWZ0ZXJcbiAgICAgKlxuICAgICAqIEluc2VydHMgdGhlIGdpdmVuIGVsZW1lbnQgYWZ0ZXIgZWFjaCBvZiB0aGUgZWxlbWVudHMgZ2l2ZW4gKG9yIHBhc3NlZCB0aHJvdWdoIHRoaXMpLlxuICAgICAqIGlmIGl0IGlzIGFuIGVsZW1uZXQgaXQgaXMgd3JhcHBlZCBpbiBhIG1pY3JvYmUgb2JqZWN0LiAgaWYgaXQgaXMgYSBzdHJpbmcgaXQgaXMgY3JlYXRlZFxuICAgICAqXG4gICAgICogQGV4YW1wbGUgwrUoICcuZWxlbWVudHNJbkRvbScgKS5pbnNlcnRBZnRlciggwrVFbGVtZW50VG9JbnNlcnQgKVxuICAgICAqXG4gICAgICogQHBhcmFtICB7T2JqZWN0IG9yIFN0cmluZ30gICBfZWxBZnRlciAgICAgICAgICAgIGVsZW1lbnQgdG8gaW5zZXJ0XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIGluc2VydEFmdGVyIDogZnVuY3Rpb24oIF9lbEFmdGVyIClcbiAgICB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBlbGVtZW50QXJyYXkgPSBbXTtcblxuICAgICAgICB2YXIgX2luc2VydEFmdGVyID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgbmV4dEluZGV4O1xuXG4gICAgICAgICAgICBuZXh0SW5kZXggPSBfdGhpcy5nZXRQYXJlbnRJbmRleCggX2VsbSApWzBdO1xuXG4gICAgICAgICAgICB2YXIgbm9kZSwgbmV4dEVsZSAgID0gX2VsbS5wYXJlbnROb2RlLmNoaWxkcmVuWyBuZXh0SW5kZXggKyAxIF07XG5cbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IF9lbEFmdGVyLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IGkgPT09IDAgPyBfZWxBZnRlclsgaSBdIDogX2VsQWZ0ZXJbIGkgXS5jbG9uZU5vZGUoIHRydWUgKTtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRBcnJheS5wdXNoKCBub2RlICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIG5leHRFbGUgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEVsZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggbm9kZSwgbmV4dEVsZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBfZWxtLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoIG5vZGUgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCB0eXBlb2YgX2VsQWZ0ZXIgPT09ICdzdHJpbmcnIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2VsQWZ0ZXIgPSBuZXcgTWljcm9iZSggX2VsQWZ0ZXIgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICggISBfZWxBZnRlci5sZW5ndGggKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxBZnRlciA9IFsgX2VsQWZ0ZXIgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpLCBsZW47XG4gICAgICAgIGZvciAoIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2luc2VydEFmdGVyKCB0aGlzWyBpIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKCBlbGVtZW50QXJyYXkgKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBMYXN0IEVsZW1lbnRcbiAgICAgKlxuICAgICAqIEdldHMgdGhlIGxhc3QgSFRNTCBFbGVtZW50cyBvZiB0aGUgY3VycmVudCBvYmplY3QsIGFuZCB3cmFwIGl0IGluXG4gICAgICogTWljcm9iZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIGxhc3QgOiBmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgICAgaWYgKCB0aGlzLmxlbmd0aCA9PT0gMSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBNaWNyb2JlKCBbIHRoaXNbIHRoaXMubGVuZ3RoIC0gMSBdIF0gKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBNYXBcbiAgICAgKlxuICAgICAqIG5hdGl2ZSBtYXAgZnVuY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICAgICAgICAgY2FsbGJhY2sgICAgICAgICAgICBmdW5jdGlvbiB0byBhcHBseSB0byBhbGwgZWxlbWVudFxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXl9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5IG9mIGNhbGxiYWNrIHJldHVybnNcbiAgICAgKi9cbiAgICBtYXAgOiBmdW5jdGlvbiggY2FsbGJhY2sgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIG1hcC5jYWxsKCB0aGlzLCBjYWxsYmFjayApO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIFBhcmVudFxuICAgICAqXG4gICAgICogc2V0cyBhbGwgZWxlbWVudHMgaW4gYSBtaWNyb2JlIHRvIHRoZWlyIHBhcmVudCBub2Rlc1xuICAgICAqXG4gICAgICogQHJldHVybiB7TWljcm9iZX1cbiAgICAgKi9cbiAgICBwYXJlbnQgOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgX3BhcmVudCA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIF9lbG0ucGFyZW50Tm9kZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgaSwgbGVuLCBwYXJlbnRBcnJheSA9IG5ldyBBcnJheSggdGhpcy5sZW5ndGggKTtcblxuICAgICAgICBmb3IgKCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBhcmVudEFycmF5WyBpIF0gPSBfcGFyZW50KCB0aGlzWyBpIF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgTWljcm9iZSggcGFyZW50QXJyYXkgKTtcbiAgICB9LFxuXG5cblxuICAgIC8qKlxuICAgICAqIFB1c2ggZWxlbWVudFxuICAgICAqXG4gICAgICogYWRkcyBhIG5ldyBlbGVtZW50IHRvIGEgbWljcm9iZVxuICAgICAqXG4gICAgICogQHBhcmFtICB7RWxlbWVudH0gICAgICAgICAgICBfZWwgICAgICAgICAgICAgICAgIGVsZW1lbnQgdG8gYWRkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIHB1c2ggOiBmdW5jdGlvbiggX2VsIClcbiAgICB7XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICBpZiAoIF9lbCAmJiBfZWwubm9kZVR5cGUgPT09IDEgKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzWyBsZW5ndGggXSA9IF9lbDtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoICsgMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBFbGVtZW50XG4gICAgICpcbiAgICAgKiByZW1vdmVzIGFuIGVsZW1lbnQgb3IgZWxlbWVudHMgZnJvbSB0aGUgZG9tXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIHJlbW92ZSA6IGZ1bmN0aW9uKClcbiAgICB7XG4gICAgICAgIHZhciBfcmVtb3ZlID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gX2VsbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBfZWxtICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGksIGxlbjtcblxuICAgICAgICB0aGlzLm9mZigpO1xuXG4gICAgICAgIGZvciAoIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3JlbW92ZSggdGhpc1sgaSBdICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgQ2xhc3NcbiAgICAgKlxuICAgICAqIE1ldGhvZCByZW1vdmVzIHRoZSBnaXZlbiBjbGFzcyBmcm9tIHRoZSBjdXJyZW50IG9iamVjdCBvciB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgICAgICAgX2NsYXNzICAgICAgICAgICAgICBjbGFzcyB0byByZW1vdmVcbiAgICAgKlxuICAgICAqIEByZXR1cm4gIHtNaWNyb2JlfVxuICAgICovXG4gICAgcmVtb3ZlQ2xhc3MgOiAoZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIF9yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKCBfY2xhc3MsIF9lbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9lbC5jbGFzc0xpc3QucmVtb3ZlKCBfY2xhc3MgKTtcblxuICAgICAgICAgICAgX2VsLmRhdGEgICAgICAgICAgICAgICAgPSBfZWwuZGF0YSB8fMKge307XG4gICAgICAgICAgICBfZWwuZGF0YS5jbGFzcyAgICAgICAgICA9IF9lbC5kYXRhLmNsYXNzIHx8wqB7fTtcbiAgICAgICAgICAgIF9lbC5kYXRhLmNsYXNzLmNsYXNzICAgID0gX2VsLmNsYXNzTmFtZTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIF9jbGFzcyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBpLCBsZW47XG4gICAgICAgICAgICBmb3IgKCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX3JlbW92ZUNsYXNzKCBfY2xhc3MsIHRoaXNbIGkgXSApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfTtcbiAgICB9KCkpLFxuXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSByb290IGVsZW1lbnRzIG9mIHRoZSBkb2N1bWVudFxuICAgICAqXG4gICAgICogQHJldHVybiB7TWljcm9iZX1cbiAgICAgKi9cbiAgICByb290IDogZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIF9yb290ID0gdGhpc1sgMCBdO1xuXG4gICAgICAgIGlmICggX3Jvb3QgKVxuICAgICAgICB7XG4gICAgICAgICAgICB3aGlsZSAoIF9yb290LnBhcmVudE5vZGUgIT09IGRvY3VtZW50IClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfcm9vdCA9IF9yb290LnBhcmVudE5vZGVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNaWNyb2JlKCBbIF9yb290IF0gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgTWljcm9iZSggW10gKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgU2VsZWN0b3JcbiAgICAgKlxuICAgICAqIHJldHVybnMgdGhlIGNzcyBzZWxlY3RvciBmcm9tIGFuIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tYmluZWQgc2VsZWN0b3JzXG4gICAgICovXG4gICAgc2VsZWN0b3IgOiBmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdG9yIHx8IChmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBnZXRTZWxlY3RvclN0cmluZyA9IGZ1bmN0aW9uKCBfZWxtIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoIF9lbG0gJiYgX2VsbS50YWdOYW1lIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWcgPSBfZWxtLnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgaWQgICAgICA9ICggX2VsbS5pZCApID8gJyMnICsgX2VsbS5pZCA6ICcnLFxuICAgICAgICAgICAgICAgICAgICBjbHNzICAgID0gQXJyYXkucHJvdG90eXBlLmpvaW4uY2FsbCggX2VsbS5jbGFzc0xpc3QsICcuJyApO1xuXG4gICAgICAgICAgICAgICAgICAgIGNsc3MgPSAoIGNsc3MgIT09ICcnICkgPyAnLicgKyBjbHNzIDogY2xzcztcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFnICsgaWQgKyBjbHNzO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50IG9yIHdpbmRvd1xuICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBfc2VsZWN0b3IsIHNlbGVjdG9ycyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGxlbkkgPSBzZWxmLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX3NlbGVjdG9yID0gZ2V0U2VsZWN0b3JTdHJpbmcoIHNlbGZbIGkgXSApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzZWxlY3RvcnMuaW5kZXhPZiggX3NlbGVjdG9yICkgPT09IC0xIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9ycy5wdXNoKCBfc2VsZWN0b3IgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGVjdG9ycyAgICAgICA9IHNlbGVjdG9ycy5qb2luKCAnLCAnICk7XG4gICAgICAgICAgICBzZWxmLl9zZWxlY3RvciAgPSBzZWxlY3RvcnM7XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RvcnM7XG4gICAgICAgIH0pKCk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogU3BsaWNlXG4gICAgICpcbiAgICAgKiBuYXRpdmUgc3BsaWNlIHdyYXBwZWQgaW4gYSBtaWNyb2JlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkgb2YgZWxlbWVudHNcbiAgICAgKi9cbiAgICBzcGxpY2UgOiBmdW5jdGlvbiggX3N0YXJ0LCBfZW5kIClcbiAgICB7XG4gICAgICAgIHZhciBhcnIgPSBzcGxpY2UuY2FsbCggdGhpcywgX3N0YXJ0LCBfZW5kICk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBNaWNyb2JlKCBhcnIgKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiBUZXh0XG4gICAgICpcbiAgICAgKiBDaGFuZ2VzIHRoZSBpbm5lciB0ZXh0IHRvIHRoZSBzdXBwbGllZCBzdHJpbmcuIElmIHRoZSB2YWx1ZSBpcyBvbWl0dGVkLFxuICAgICAqIHNpbXBseSByZXR1cm5zIHRoZSBjdXJyZW50IGlubmVyIGh0bWwgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgICAgIF92YWx1ZSAgICAgICAgICAgICAgVGV4dCB2YWx1ZSAob3B0aW9uYWwpXG4gICAgICpcbiAgICAgKiBAcmV0dXJuICB7TWljcm9iZSBvciBBcnJheX1cbiAgICAqL1xuICAgIHRleHQgOiAoZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIF9zZXRUZXh0ID0gZnVuY3Rpb24oIF92YWx1ZSwgX2VsIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoIGRvY3VtZW50LmFsbCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2VsLmlubmVyVGV4dCA9IF92YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgLy8gRkZcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfZWwudGV4dENvbnRlbnQgPSBfdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9lbC5kYXRhICAgICAgICAgICAgPSBfZWwuZGF0YSB8fCB7fTtcbiAgICAgICAgICAgIF9lbC5kYXRhLnRleHQgICAgICAgPSBfZWwuZGF0YS50ZXh0IHx8IHt9O1xuICAgICAgICAgICAgX2VsLmRhdGEudGV4dC50ZXh0ICA9IF92YWx1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgX2dldFRleHQgPSBmdW5jdGlvbiggX2VsIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYoIGRvY3VtZW50LmFsbCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9lbC5pbm5lclRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIC8vIEZGXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9lbC50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBfdmFsdWUgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIF92YWx1ZSB8fCBfdmFsdWUgPT09ICcnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgaSwgbGVuO1xuICAgICAgICAgICAgICAgIGZvciAoIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIF9zZXRUZXh0KCBfdmFsdWUsIHRoaXNbIGkgXSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaiwgbGVuaiwgYXJyYXlUZXh0ID0gbmV3IEFycmF5KCB0aGlzLmxlbmd0aCApO1xuICAgICAgICAgICAgZm9yICggaiA9IDAsIGxlbmogPSB0aGlzLmxlbmd0aDsgaiA8IGxlbmo7IGorKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYXJyYXlUZXh0WyBqIF0gPSBfZ2V0VGV4dCggdGhpc1sgaiBdICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhcnJheVRleHQ7XG4gICAgICAgIH07XG4gICAgfSgpKSxcblxuXG4gICAgLyoqXG4gICAgICogVG9nZ2xlIENsYXNzXG4gICAgICpcbiAgICAgKiBNZXRob2RzIGNhbGxzIHJlbW92ZUNsYXNzIG9uIHRoZSBjdXJyZW50IG9iamVjdCBvciBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtICAge1N0cmluZ30gICAgICAgICAgICBfY2xhc3MgICAgICAgICAgICAgIGNsYXNzIHRvIGFkZFxuICAgICAqXG4gICAgICogQHJldHVybiAge01pY3JvYmV9XG4gICAgKi9cbiAgICB0b2dnbGVDbGFzcyA6IChmdW5jdGlvbigpXG4gICAge1xuICAgICAgICB2YXIgX3RvZ2dsZUNsYXNzID0gZnVuY3Rpb24oIF9jbGFzcywgX2VsIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCBfZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCBfY2xhc3MgKSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2VsLmNsYXNzTGlzdC5yZW1vdmUoIF9jbGFzcyApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9lbC5jbGFzc0xpc3QuYWRkKCBfY2xhc3MgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2VsLmRhdGEgICAgICAgICAgICAgICAgPSBfZWwuZGF0YSB8fMKge307XG4gICAgICAgICAgICBfZWwuZGF0YS5jbGFzcyAgICAgICAgICA9IF9lbC5kYXRhLmNsYXNzIHx8wqB7fTtcbiAgICAgICAgICAgIF9lbC5kYXRhLmNsYXNzLmNsYXNzICAgID0gX2VsLmNsYXNzTmFtZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBfY2xhc3MgKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgaSwgbGVuO1xuICAgICAgICAgICAgZm9yICggaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF90b2dnbGVDbGFzcyggX2NsYXNzLCB0aGlzWyBpIF0gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfSgpKVxufTtcblxuXG4vKipcbiAqIEV4dGVuZFxuICpcbiAqIGV4dGVuZHMgYW4gb2JqZWN0IG9yIG1pY3JvYmVcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbk1pY3JvYmUuZXh0ZW5kID0gTWljcm9iZS5jb3JlLmV4dGVuZCA9IGZ1bmN0aW9uKClcbntcbiAgICB2YXIgYXJncyAgICA9IHNsaWNlLmNhbGwoIGFyZ3VtZW50cyApO1xuXG4gICAgdmFyIGluZGV4ICAgPSAwO1xuICAgIHZhciBsZW5ndGggID0gYXJncy5sZW5ndGg7XG4gICAgdmFyIGRlZXAgICAgPSBmYWxzZTtcbiAgICB2YXIgaXNBcnJheTtcbiAgICB2YXIgdGFyZ2V0O1xuICAgIHZhciBvcHRpb25zO1xuICAgIHZhciBzcmM7XG4gICAgdmFyIGNvcHk7XG4gICAgdmFyIGNsb25lO1xuXG4gICAgaWYgKCBhcmdzWyBpbmRleCBdID09PSB0cnVlIClcbiAgICB7XG4gICAgICAgIGRlZXAgICAgPSB0cnVlO1xuICAgICAgICBpbmRleCAgICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKCB0aGlzLnR5cGUgPT09ICdbb2JqZWN0IE1pY3JvYmVdJyApXG4gICAge1xuICAgICAgICB0YXJnZXQgPSB0aGlzO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBpZiAoIE1pY3JvYmUuaXNPYmplY3QoIGFyZ3NbIGluZGV4IF0gKSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRhcmdldCA9IGFyZ3NbIGluZGV4IF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0YXJnZXQgPSB7fTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoIDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KysgKVxuICAgIHtcbiAgICAgICAgaWYgKCAoIG9wdGlvbnMgPSBhcmdzWyBpbmRleCBdICkgIT09IG51bGwgKVxuICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKCB2YXIgbmFtZSBpbiBvcHRpb25zIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoIG5hbWUgKSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpc0FycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNyYyAgICAgPSB0YXJnZXRbIG5hbWUgXTtcbiAgICAgICAgICAgICAgICAgICAgY29weSAgICA9IG9wdGlvbnNbIG5hbWUgXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRhcmdldCA9PT0gY29weSB8fCB0eXBlb2YgY29weSA9PT0gdW5kZWZpbmVkIClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoIGRlZXAgJiYgY29weSAmJiBNaWNyb2JlLmlzT2JqZWN0KCBjb3B5ICkgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIE1pY3JvYmUuaXNBcnJheSggY29weSApIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBNaWNyb2JlLmlzQXJyYXkoIHNyYyApID8gc3JjIDogW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgTWljcm9iZS5pc09iamVjdCggc3JjICkgPyBzcmMgOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0WyBuYW1lIF0gPSBNaWNyb2JlLmV4dGVuZCggZGVlcCwgY2xvbmUsIGNvcHkgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFsgbmFtZSBdID0gY29weTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuXG4vKipcbiAqIE1lcmdlXG4gKlxuICogY29tYmluZXMgbWljcm9iZXMgb3IgYXJyYXkgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0IG9yIEFycmF5fSAgICAgICAgZmlyc3QgICAgICAgICAgICAgICBmaXJzdCBhcnJheSBvciBhcnJheS1saWtlIG9iamVjdFxuICogQHBhcmFtICB7T2JqZWN0IG9yIEFycmF5fSAgICAgICAgc2Vjb25kICAgICAgICAgICAgICBzZWNvbmQgYXJyYXkgb3IgYXJyYXktbGlrZSBvYmplY3RcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3Qgb3IgQXJyYXl9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbWJpbmVkIGFyciBvciBvYmogKGJhc2VkIG9mZiBmaXJzdClcbiAqL1xuTWljcm9iZS5tZXJnZSA9IE1pY3JvYmUuY29yZS5tZXJnZSAgPSBmdW5jdGlvbiggZmlyc3QsIHNlY29uZCApXG57XG4gICAgaWYgKCAhc2Vjb25kIClcbiAgICB7XG4gICAgICAgIHNlY29uZCAgPSBmaXJzdDtcbiAgICAgICAgZmlyc3QgICA9IHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIGkgPSBmaXJzdC5sZW5ndGg7XG5cbiAgICBmb3IgKCB2YXIgaiA9IDAsIGxlbmd0aCA9IHNlY29uZC5sZW5ndGg7IGogPCBsZW5ndGg7IGorKyApXG4gICAge1xuICAgICAgICBmaXJzdFsgaSsrIF0gPSBzZWNvbmRbIGogXTtcbiAgICB9XG5cbiAgICBmaXJzdC5sZW5ndGggPSBpO1xuXG4gICAgcmV0dXJuIGZpcnN0O1xufTtcblxuXG4vKipcbiAqIENhcGl0YWxpemUgU3RyaW5nXG4gKlxuICogY2FwaXRhbGl6ZXMgZXZlcnkgd29yZCBpbiBhIHN0cmluZyBvciBhbiBhcnJheSBvZiBzdHJpbmdzIGFuZCByZXR1cm5zIHRoZVxuICogdHlwZSB0aGF0IGl0IHdhcyBnaXZlblxuICpcbiAqIEBwYXJhbSAge1N0cmluZyBvciBBcnJheX0gICAgICAgIHRleHQgICAgICAgICAgICAgICAgc3RyaW5nKHMpIHRvIGNhcGl0YWxpemVcbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmcgb3IgQXJyYXl9ICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcGl0YWxpemVkIHN0cmluZyhzKVxuICovXG5NaWNyb2JlLmNhcGl0YWxpemUgPSBmdW5jdGlvbiggdGV4dCApXG57XG4gICAgdmFyIGFycmF5ICAgPSBNaWNyb2JlLmlzQXJyYXkoIHRleHQgKTtcbiAgICB0ZXh0ICAgICAgICA9ICFhcnJheSA/IFsgdGV4dCBdIDogdGV4dDtcblxuICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IHRleHQubGVuZ3RoOyBpIDwgbGVuSTsgaSsrIClcbiAgICB7XG4gICAgICAgIHRleHRbIGkgXSA9IHRleHRbIGkgXS5zcGxpdCggJyAnICk7XG4gICAgICAgIGZvciAoIHZhciBqID0gMCwgbGVuSiA9IHRleHRbIGkgXS5sZW5ndGg7IGogPCBsZW5KOyBqKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICB0ZXh0WyBpIF1bIGogXSA9IHRleHRbIGkgXVsgaiBdLmNoYXJBdCggMCApLnRvVXBwZXJDYXNlKCkgKyB0ZXh0WyBpIF1bIGogXS5zbGljZSggMSApO1xuICAgICAgICB9XG4gICAgICAgIHRleHRbIGkgXSA9IHRleHRbIGkgXS5qb2luKCAnICcgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCBhcnJheSApID8gdGV4dCA6IHRleHRbIDAgXTtcbn07XG5cblxuLy8gYnJpdGlzaCBwZW9wbGUuLi4uXG5NaWNyb2JlLmNhcGl0YWxpc2UgPSBNaWNyb2JlLmNhcGl0YWxpemU7XG5cblxuLyoqXG4gKiBJZGVudGlmeSBhIHZhbHVlXG4gKlxuICogcmV0dXJucyBpdHNlbGYgaWYgYSB2YWx1ZSBuZWVkcyB0byBiZSBleGVjdXRlZFxuICpcbiAqIEBwYXJhbSAge2FueX0gICAgICAgICAgICAgICAgICAgIHZhbHVlICAgICAgICAgICAgICAgYW55IHZhbHVlXG4gKlxuICogQHJldHVybiB7dmFsdWV9XG4gKi9cbk1pY3JvYmUuaWRlbnRpdHkgPSBmdW5jdGlvbiggdmFsdWUgKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuXG4vKipcbiAqIG5vdGhpbmcgaGFwcGVuc1xuICpcbiAqIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1h5enp5Xyhjb21wdXRpbmcpXG4gKlxuICogQHJldHVybiB7dm9pZH1cbiAqL1xuTWljcm9iZS5ub29wICAgID0gZnVuY3Rpb24oKSB7fTtcbk1pY3JvYmUueHl6enkgICA9IE1pY3JvYmUubm9vcDtcblxuXG4vKipcbiAqIG5hdGl2ZSBpc0FycmF5IGZvciBjb21wbGV0ZW5lc3NcbiAqXG4gKiBAdHlwZSB7RnVuY3Rpb259XG4gKi9cbk1pY3JvYmUuaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cblxuLyoqXG4gKiBpc0VtcHR5XG4gKlxuICogY2hlY2tzIGlmIHRoZSBwYXNzZWQgb2JqZWN0IGlzIGVtcHR5XG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgb2JqICAgICAgICAgICAgICAgICBvYmplY3QgdG8gY2hlY2tcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcHR5IG9yIG5vdFxuICovXG5NaWNyb2JlLmlzRW1wdHkgPSBmdW5jdGlvbiggb2JqIClcbntcbiAgICB2YXIgbmFtZTtcbiAgICBmb3IgKCBuYW1lIGluIG9iaiApXG4gICAge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5cbi8qKlxuICogaXNGdW5jdGlvblxuICpcbiAqIGNoZWNrcyBpZiB0aGUgcGFzc2VkIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgb2JqICAgICAgICAgICAgICAgICBvYmplY3QgdG8gY2hlY2tcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9yIG5vdFxuICovXG5NaWNyb2JlLmlzRnVuY3Rpb24gPSBmdW5jdGlvbiggb2JqIClcbntcbiAgICByZXR1cm4gTWljcm9iZS50eXBlKCBvYmogKSA9PT0gXCJmdW5jdGlvblwiO1xufTtcblxuXG4vKipcbiAqIGlzT2JqZWN0XG4gKlxuICogY2hlY2tzIGlmIHRoZSBwYXNzZWQgcGFyYW1ldGVyIGlzIGFuIG9iamVjdFxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICAgICAgICAgIG9iaiAgICAgICAgICAgICAgICAgb2JqZWN0IHRvIGNoZWNrXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc09iamVjdCBvciBub3RcbiAqL1xuTWljcm9iZS5pc09iamVjdCA9IGZ1bmN0aW9uKCBvYmogKVxue1xuICAgIGlmICggTWljcm9iZS50eXBlKCBvYmogKSAhPT0gXCJvYmplY3RcIiB8fCBvYmoubm9kZVR5cGUgfHwgTWljcm9iZS5pc1dpbmRvdyggb2JqICkgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufTtcblxuXG4vKipcbiAqIGlzVW5kZWZpbmVkXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgb2JqICAgICAgICAgICAgICAgICBwcm9wZXJ0eVxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgcGFyZW50ICAgICAgICAgICAgICBvYmplY3QgdG8gY2hlY2tcbiAqXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iaiBpbiBwYXJlbnRcbiAqL1xuTWljcm9iZS5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKCBvYmosIHBhcmVudCApXG57XG4gICAgaWYgKCBwYXJlbnQgJiYgdHlwZW9mIHBhcmVudCAhPT0gJ29iamVjdCcgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmVudCA/ICEoIG9iaiBpbiBwYXJlbnQgKSA6IG9iaiA9PT0gdm9pZCAwO1xufTtcblxuXG4vKipcbiAqIGlzV2luZG93XG4gKlxuICogY2hlY2tzIGlmIHRoZSBwYXNzZWQgcGFyYW1ldGVyIGVxdWFscyB3aW5kb3dcbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgICAgICAgICBvYmogICAgICAgICAgICAgICAgIG9iamVjdCB0byBjaGVja1xuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNXaW5kb3cgb3Igbm90XG4gKi9cbk1pY3JvYmUuaXNXaW5kb3cgPSBmdW5jdGlvbiggb2JqIClcbntcbiAgICByZXR1cm4gb2JqICE9PSBudWxsICYmIG9iaiA9PT0gb2JqLndpbmRvdztcbn07XG5cblxuLyoqXG4gKiBUbyBzdHJpbmdcbiAqXG4gKiBNZXRob2RzIHJldHVybnMgdGhlIHR5cGUgb2YgTWljcm9iZS5cbiAqXG4gKiBAcmV0dXJuICB7U3RyaW5nfVxuKi9cbk1pY3JvYmUudG9TdHJpbmcgPSBNaWNyb2JlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKClcbntcbiAgICByZXR1cm4gX3R5cGU7XG59O1xuXG5cbi8qKlxuICogVG8gYXJyYXlcbiAqXG4gKiBNZXRob2RzIHJldHVybnMgYWxsIHRoZSBlbGVtZW50cyBpbiBhbiBhcnJheS5cbiAqXG4gKiBAcmV0dXJuICB7QXJyYXl9XG4qL1xuTWljcm9iZS50b0FycmF5ID0gTWljcm9iZS5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uKCBfYXJyIClcbntcbiAgICBfYXJyID0gX2FyciB8fCB0aGlzO1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggX2FyciApO1xufTtcblxuXG4vKipcbiAqIFR5cGVcbiAqXG4gKiByZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBwYXJhbWV0ZXIgcGFzc2VkIHRvIGl0XG4gKlxuICogQHBhcmFtICB7YWxsfSAgICAgICAgICAgICAgICAgICAgb2JqICAgICAgICAgICAgICAgICBwYXJhbWV0ZXIgdG8gdGVzdFxuICpcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG9ialxuICovXG5NaWNyb2JlLnR5cGUgPSBmdW5jdGlvbiggb2JqIClcbntcbiAgICBpZiAoIG9iaiA9PT0gbnVsbCApXG4gICAge1xuICAgICAgICByZXR1cm4gb2JqICsgJyc7XG4gICAgfVxuXG4gICAgdmFyIHR5cGUgPSBUeXBlc1sgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCBvYmogKSBdO1xuICAgICAgICB0eXBlID0gIXR5cGUgPyBUeXBlc1sgb2JqLnRvU3RyaW5nKCkgXSA6IHR5cGU7XG4gICAgcmV0dXJuICB0eXBlIHx8IHR5cGVvZiBvYmo7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWljcm9iZTtcbiIsImltcG9ydCBNaWNyb2JlIGZyb20gJy4vY29yZSc7XG5cbk1pY3JvYmUucmVhZHkgPSBmdW5jdGlvbiggX2NiIClcbntcbiAgICBpZiAoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9jYigpO1xuICAgIH1cblxuICAgIGlmICggd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgKVxuICAgIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgX2NiLCBmYWxzZSApO1xuICAgIH1cbiAgICBlbHNlIGlmICggd2luZG93LmF0dGFjaEV2ZW50IClcbiAgICB7XG4gICAgICAgIHdpbmRvdy5hdHRhY2hFdmVudCggJ29ubG9hZCcsIF9jYiApO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB3aW5kb3cub25sb2FkID0gX2NiO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgTWljcm9iZSBmcm9tICcuL2NvcmUnO1xuXG4vKipcbiAqIEN1c3RvbUV2ZW50IHBvbGx5ZmlsbCBmb3IgSUUgPj0gOVxuICpcbiAqIEBwYXJhbSAgIHtzdHJ9ICAgICAgICAgICAgICAgX2V2ZW50ICAgICAgICAgICAgICBIVE1MRXZlbnRcbiAqIEBwYXJhbSAgIHtvYmp9ICAgICAgICAgICAgICAgX2RhdGEgICAgICAgICAgICAgICBldmVudCBkYXRhXG4gKlxuICogQHJldHVybiAge3ZvaWR9XG4gKi9cbmlmICggdHlwZW9mIEN1c3RvbUV2ZW50ICE9PSAnZnVuY3Rpb24nIClcbntcbiAgICAoIGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgICBmdW5jdGlvbiBDdXN0b21FdmVudCAoIGV2ZW50LCBkYXRhIClcbiAgICAgICAge1xuICAgICAgICAgICAgZGF0YSAgICA9IGRhdGEgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XG4gICAgICAgICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdDdXN0b21FdmVudCcgKTtcbiAgICAgICAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoIGV2ZW50LCBkYXRhLmJ1YmJsZXMsIGRhdGEuY2FuY2VsYWJsZSwgZGF0YS5kZXRhaWwgKTtcbiAgICAgICAgICAgIHJldHVybiBldnQ7XG4gICAgICAgIH1cblxuICAgICAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgICA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gICAgICAgIHdpbmRvdy5DdXN0b21FdmVudCAgICAgID0gQ3VzdG9tRXZlbnQ7XG4gICAgfSApKCk7XG59XG5cblxuLyoqXG4gKiBlbWl0IGV2ZW50XG4gKlxuICogZW1pdHMgYSBjdXN0b20gZXZlbnQgdG8gdGhlIEhUTUxFbGVtZW50cyBvZiB0aGUgY3VycmVudCBvYmplY3RcbiAqXG4gKiBAcGFyYW0gICB7U3RyaW5nfSAgICAgICAgICAgIF9ldmVudCAgICAgICAgICAgICAgSFRNTEV2ZW50XG4gKiBAcGFyYW0gICB7T2JqZWN0fSAgICAgICAgICAgIF9kYXRhICAgICAgICAgICAgICAgZXZlbnQgZGF0YVxuICogQHBhcmFtICAge0Jvb2xlYW59ICAgICAgICAgICBfYnViYmxlcyAgICAgICAgICAgIGV2ZW50IGJ1YmJsZXM/XG4gKiBAcGFyYW0gICB7Qm9vbGVhbn0gICAgICAgICAgIF9jYW5jZWxhYmxlICAgICAgICAgY2FuY2VsYWJsZT9cbiAqXG4gKiBAcmV0dXJuICB7TWljcm9iZX1cbiovXG5NaWNyb2JlLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oIF9ldmVudCwgX2RhdGEsIF9idWJibGVzLCBfY2FuY2VsYWJsZSApXG57XG4gICAgX2J1YmJsZXMgICAgPSBfYnViYmxlcyB8fMKgZmFsc2U7XG4gICAgX2NhbmNlbGFibGUgPSBfY2FuY2VsYWJsZSB8fMKgZmFsc2U7XG4gICAgdmFyIF9lbWl0ID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgdmFyIF9ldnQgPSBuZXcgQ3VzdG9tRXZlbnQoIF9ldmVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsICAgICAgOiBfZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbGFibGUgIDogX2NhbmNlbGFibGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGVzICAgICA6IF9idWJibGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gKTtcbiAgICAgICAgX2VsbS5kaXNwYXRjaEV2ZW50KCBfZXZ0ICk7XG4gICAgfTtcblxuICAgIHZhciBpLCBsZW47XG4gICAgZm9yICggaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgX2VtaXQoIHRoaXNbIGkgXSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEJpbmQgRXZlbnRzXG4gKlxuICogQmluZHMgYW4gZXZlbnQgdG8gdGhlIEhUTUxFbGVtZW50cyBvZiB0aGUgY3VycmVudCBvYmplY3Qgb3IgdG8gdGhlXG4gKiBnaXZlbiBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgICAgICAgX2V2ZW50ICAgICAgICAgICAgICBIVE1MRXZlbnRcbiAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gICAgICAgICAgX2NhbGxiYWNrICAgICAgICAgICBjYWxsYmFjayBmdW5jdGlvblxuICpcbiAqIEByZXR1cm4gIHtNaWNyb2JlfVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oIF9ldmVudCwgX2NhbGxiYWNrIClcbntcbiAgICB2YXIgX29uID0gZnVuY3Rpb24oIF9lbG0gKVxuICAgIHtcbiAgICAgICAgdmFyIHByb3AgPSAnXycgKyBfZXZlbnQgKyAnLWJvdW5kLWZ1bmN0aW9uJztcblxuXG4gICAgICAgIF9lbG0uZGF0YSAgICAgICAgICAgICAgICAgICA9IF9lbG0uZGF0YSB8fCB7fTtcbiAgICAgICAgX2VsbS5kYXRhWyBwcm9wIF0gICAgICAgICAgID0gX2VsbS5kYXRhWyBwcm9wIF0gfHwge307XG4gICAgICAgIF9lbG0uZGF0YVsgcHJvcCBdWyBwcm9wIF0gICA9IF9lbG0uZGF0YVsgcHJvcCBdWyBwcm9wIF0gfHwgW107XG5cbiAgICAgICAgX2VsbS5kYXRhLl9fYm91bmRFdmVudHMgICAgID0gX2VsbS5kYXRhLl9fYm91bmRFdmVudHMgfHwge307XG4gICAgICAgIF9lbG0uZGF0YS5fX2JvdW5kRXZlbnRzLl9fYm91bmRFdmVudHMgICA9IF9lbG0uZGF0YS5fX2JvdW5kRXZlbnRzLl9fYm91bmRFdmVudHMgfHwgW107XG5cbiAgICAgICAgX2VsbS5hZGRFdmVudExpc3RlbmVyKCBfZXZlbnQsIF9jYWxsYmFjayApO1xuICAgICAgICBfZWxtLmRhdGFbIHByb3AgXVsgcHJvcCBdLnB1c2goIF9jYWxsYmFjayApO1xuXG4gICAgICAgIF9lbG0uZGF0YS5fX2JvdW5kRXZlbnRzLl9fYm91bmRFdmVudHMucHVzaCggX2V2ZW50ICk7XG4gICAgfTtcblxuICAgIHZhciBpLCBsZW47XG4gICAgZm9yICggaSA9IDAsIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKVxuICAgIHtcbiAgICAgICAgX29uKCB0aGlzWyBpIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBVbmJpbmQgRXZlbnRzXG4gKlxuICogdW5iaW5kcyBhbi9hbGwgZXZlbnRzLlxuICpcbiAqIEBwYXJhbSAgIHtzdHJ9ICAgICAgICAgICBfZXZlbnQgICAgICAgICAgICAgICAgICBldmVudCBuYW1lXG4gKiBAcGFyYW0gICB7ZnVuY30gICAgICAgICAgX2NhbGxiYWNrICAgICAgICAgICAgICAgY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEBwYXJhbSAgIHtvYmp9ICAgICAgICAgICBfZWwgICAgICAgICAgICAgICAgICAgICBIVE1MIGVsZW1lbnQgdG8gbW9kaWZ5IChvcHRpb25hbClcbiAqXG4gKiBAcmV0dXJuICBNaWNyb2JlXG4qL1xuTWljcm9iZS5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oIF9ldmVudCwgX2NhbGxiYWNrIClcbntcbiAgICB2YXIgX29mZiA9IGZ1bmN0aW9uKCBfZSwgX2VsbSApXG4gICAge1xuICAgICAgICBfY2IgPSBfY2FsbGJhY2s7XG4gICAgICAgIHZhciBwcm9wID0gJ18nICsgX2UgKyAnLWJvdW5kLWZ1bmN0aW9uJztcblxuICAgICAgICBpZiAoICEgX2NiICYmIF9lbG0uZGF0YSAmJiBfZWxtLmRhdGFbIHByb3AgXSAmJlxuICAgICAgICAgICAgICAgIF9lbG0uZGF0YVsgcHJvcCBdWyBwcm9wIF0gKVxuICAgICAgICB7XG4gICAgICAgICAgICBfY2IgPSBfZWxtLmRhdGFbIHByb3AgXVsgcHJvcCBdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfY2IgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoICEgQXJyYXkuaXNBcnJheSggX2NiICkgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9jYiA9IFsgX2NiIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoIHZhciBqID0gMCwgbGVuSiA9IF9jYi5sZW5ndGg7IGogPCBsZW5KOyBqKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9lbG0ucmVtb3ZlRXZlbnRMaXN0ZW5lciggX2UsIF9jYlsgaiBdICk7XG4gICAgICAgICAgICAgICAgX2NiWyBqIF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfZWxtLmRhdGEgICAgICAgICAgICAgICAgICAgPSBfZWxtLmRhdGEgfHwge307XG4gICAgICAgICAgICBfZWxtLmRhdGFbIHByb3AgXSAgICAgICAgICAgPSBfZWxtLmRhdGFbIHByb3AgXSB8fCB7fTtcbiAgICAgICAgICAgIF9lbG0uZGF0YVsgcHJvcCBdWyBwcm9wIF0gICA9IF9jYjtcbiAgICAgICAgfVxuICAgICAgICBfY2IgPSBudWxsO1xuICAgIH07XG5cbiAgICB2YXIgX2NiLCBmaWx0ZXJGdW5jdGlvbiA9IGZ1bmN0aW9uKCBlICl7IHJldHVybiBlOyB9O1xuICAgIGZvciAoIHZhciBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICB2YXIgX2VsbSA9IHRoaXNbIGkgXTtcblxuICAgICAgICBpZiAoICFfZXZlbnQgJiYgX2VsbS5kYXRhICYmIF9lbG0uZGF0YS5fX2JvdW5kRXZlbnRzICYmIF9lbG0uZGF0YS5fX2JvdW5kRXZlbnRzLl9fYm91bmRFdmVudHMgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZXZlbnQgPSBfZWxtLmRhdGEuX19ib3VuZEV2ZW50cy5fX2JvdW5kRXZlbnRzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgX2VsbS5kYXRhICAgICAgICAgICAgICAgICAgID0gX2VsbS5kYXRhIHx8IHt9O1xuICAgICAgICAgICAgX2VsbS5kYXRhLl9fYm91bmRFdmVudHMgICAgID0gX2VsbS5kYXRhLl9fYm91bmRFdmVudHMgfHwge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICEgQXJyYXkuaXNBcnJheSggX2V2ZW50ICkgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZXZlbnQgPSBbIF9ldmVudCBdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICggdmFyIGogPSAwLCBsZW5KID0gX2V2ZW50Lmxlbmd0aDsgaiA8IGxlbko7IGorKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9vZmYoIF9ldmVudFsgaiBdLCBfZWxtICk7XG4gICAgICAgICAgICBfZXZlbnRbIGogXSA9IG51bGw7XG4gICAgICAgIH1cblxuXG4gICAgICAgIF9lbG0uZGF0YS5fX2JvdW5kRXZlbnRzLl9fYm91bmRFdmVudHMgPSBfZXZlbnQuZmlsdGVyKCBmaWx0ZXJGdW5jdGlvbiApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcbiIsImltcG9ydCBQcm9taXNlIGZyb20gJ3Byb21pc2UnO1xuaW1wb3J0IE1pY3JvYmUgZnJvbSAnLi9jb3JlJztcblxuLyoqXG4gKiBtaWNyb2JlLmh0dHAuanNcbiAqXG4gKiBAYXV0aG9yICBNb3VzZSBCcmF1biAgICAgICAgIDxtb3VzZUBzb2Npb21hbnRpYy5jb20+XG4gKiBAYXV0aG9yICBOaWNvbGFzIEJydWduZWF1eCAgIDxuaWNvbGFzLmJydWduZWF1eEBzb2Npb21hbnRpYy5jb20+XG4gKlxuICogQHBhY2thZ2UgTWljcm9iZVxuICovXG5cbi8qKlxuICogSHR0cCB0YWtlcyBhcyBtYW55IG9mIGZldyBwYXJhbWV0ZXJzLCB3aXRoIHVybCBiZWluZyB0aGUgb25seSByZXF1aXJlZC5cbiAqIFRoZSByZXR1cm4gdGhlbiBoYXMgdGhlIG1ldGhvZHMgLnRoZW4oIF9jYiApIGFuZCAuZXJyb3IoIF9jYiApXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgICAgIF9wYXJhbWV0ZXJzICAgICAgICAgIGh0dHAgcGFyYW1ldGVycy4gcG9zc2libGUgcHJvcGVydGllc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZCwgdXJsLCBkYXRhLCB1c2VyLCBwYXNzd29yZCwgaGVhZGVycywgYXN5bmNcbiAqL1xuY29uc3QgaHR0cCA9ICggX3BhcmFtZXRlcnMgKSA9Plxue1xuICAgIHZhciBmYWlsLCByZXEsIG1ldGhvZCwgdXJsLCBkYXRhLCB1c2VyLCBwYXNzd29yZCwgaGVhZGVycywgYXN5bmM7XG5cbiAgICBpZiAoICFfcGFyYW1ldGVycyApXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKCAnTm8gcGFyYW1ldGVycyBnaXZlbicgKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgX3BhcmFtZXRlcnMgPT09ICdzdHJpbmcnIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3BhcmFtZXRlcnMgPSB7IHVybDogX3BhcmFtZXRlcnMgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcSAgICAgICAgID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIG1ldGhvZCAgICAgID0gX3BhcmFtZXRlcnMubWV0aG9kIHx8ICdHRVQnO1xuICAgICAgICB1cmwgICAgICAgICA9IF9wYXJhbWV0ZXJzLnVybDtcbiAgICAgICAgZGF0YSAgICAgICAgPSBKU09OLnN0cmluZ2lmeSggX3BhcmFtZXRlcnMuZGF0YSApIHx8IG51bGw7XG4gICAgICAgIHVzZXIgICAgICAgID0gX3BhcmFtZXRlcnMudXNlciB8fCAnJztcbiAgICAgICAgcGFzc3dvcmQgICAgPSBfcGFyYW1ldGVycy5wYXNzd29yZCB8fCAnJztcbiAgICAgICAgaGVhZGVycyAgICAgPSBfcGFyYW1ldGVycy5oZWFkZXJzICB8fCBudWxsO1xuICAgICAgICBhc3luYyAgICAgICA9IHR5cGVvZiBfcGFyYW1ldGVycy5hc3luYyA9PT0gXCJib29sZWFuXCIgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9wYXJhbWV0ZXJzLmFzeW5jIDogdHJ1ZTtcblxuICAgICAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCByZXEucmVhZHlTdGF0ZSA9PT0gNCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXEub3BlbiggbWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VyLCBwYXNzd29yZCApO1xuXG4gICAgLy8gd2VpcmQgU2FmYXJpIHZvb2RvbyBmaXhcbiAgICBpZiAoIG1ldGhvZCA9PT0gJ1BPU1QnIClcbiAgICB7XG4gICAgICAgIHJlcS5zZXRSZXF1ZXN0SGVhZGVyKCAnQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgKTtcbiAgICB9XG5cbiAgICBpZiAoIGhlYWRlcnMgKVxuICAgIHtcbiAgICAgICAgZm9yICggdmFyIGhlYWRlciBpbiBoZWFkZXJzIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoIGhlYWRlciwgaGVhZGVyc1toZWFkZXJdICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIGFzeW5jIClcbiAgICB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICByZXEub25lcnJvciA9ICgpID0+IHJlamVjdCggbmV3IEVycm9yKCAnTmV0d29yayBlcnJvciEnICkgKTtcblxuICAgICAgICAgICAgcmVxLnNlbmQoIGRhdGEgKTtcbiAgICAgICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICggcmVxLnN0YXR1cyA9PT0gMjAwIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoIHJlcS5yZXNwb25zZSApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoIG5ldyBFcnJvciggcmVxLnN0YXR1cyApICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgdmFyIF9yZXNwb25zZSA9ICggX3ZhbCApID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBfcmVzcG9uc2VzID1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiAudGhlbigpXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBjYWxsZWQgYWZ0ZXIgaHR0cCgpLCBodHRwLmdldCgpLCBvciBodHRwLnBvc3QoKSwgdGhpcyBpc1xuICAgICAgICAgICAgICAgICAqIGNhbGxlZCBwYXNzaW5nIHRoZSByZXN1bHQgYXMgdGhlIGZpcnN0IHBhcmFtZXRlciB0byB0aGUgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIF9jYiAgICAgICAgIGZ1bmN0aW9uIHRvIGNhbGwgYWZ0ZXIgaHR0cCByZXF1ZXN0XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICBjb250YWlucyB0aGUgLmNhdGNoIG1ldGhvZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHRoZW46ICggX2NiICkgPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggX3ZhbC5zdGF0dXMgPT09IDIwMCApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jYiggX3ZhbC5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3Jlc3BvbnNlcztcbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogLmNhdGNoKClcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIGNhbGxlZCBhZnRlciBodHRwKCksIGh0dHAuZ2V0KCksIG9yIGh0dHAucG9zdCgpLCB0aGlzIGlzXG4gICAgICAgICAgICAgICAgICogY2FsbGVkIHBhc3NpbmcgdGhlIGVycm9yIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXIgdG8gdGhlIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBfY2IgICAgICAgICBmdW5jdGlvbiB0byBjYWxsIGFmdGVyIGh0dHAgcmVxdWVzdFxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgY29udGFpbnMgdGhlIC50aGVuIG1ldGhvZFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIGNhdGNoOiAoIF9jYiApID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIF92YWwuc3RhdHVzICE9PSAyMDAgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfY2Ioe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1cyAgICAgIDogX3ZhbC5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzVGV4dCAgOiBfdmFsLnN0YXR1c1RleHRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfcmVzcG9uc2VzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gX3Jlc3BvbnNlcztcbiAgICAgICAgfTtcblxuICAgICAgICByZXEuc2VuZCggZGF0YSApO1xuICAgICAgICByZXEub25sb2FkZW5kID0gKCkgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSgpO1xuICAgICAgICAgICAgcmV0dXJuIF9yZXNwb25zZSggcmVxICk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiByZXEub25sb2FkZW5kKCk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBTeW50YWN0aWMgc2hvcnRjdXQgZm9yIHNpbXBsZSBHRVQgcmVxdWVzdHNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgIF91cmwgICAgICAgICAgICAgICAgZmlsZSB1cmxcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnMgLnRoZW4oKSBhbmQgLmNhdGNoKClcbiAqL1xuaHR0cC5nZXQgPSAoIF91cmwgKSA9Plxue1xuICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgdXJsICAgICA6IF91cmwsXG4gICAgICAgIG1ldGhvZCAgOiAnR0VUJ1xuICAgIH0pO1xufTtcblxuXG4vKipcbiAqIFN5bnRhY3RpYyBzaG9ydGN1dCBmb3Igc2ltcGxlIFBPU1QgcmVxdWVzdHNcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgIF91cmwgICAgICAgICAgICAgICAgZmlsZSB1cmxcbiAqIEBwYXJhbSAge09iamVjdCBvciBTdHJpbmd9ICAgX2RhdGEgICAgICAgICAgICAgICBkYXRhIHRvIHBvc3QgdG8gbG9jYXRpb25cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnMgLnRoZW4oKSBhbmQgLmNhdGNoKClcbiAqL1xuaHR0cC5wb3N0ID0gKCBfdXJsLCBfZGF0YSApID0+XG57XG4gICAgcmV0dXJuIGh0dHAoe1xuICAgICAgICB1cmwgICAgIDogX3VybCxcbiAgICAgICAgZGF0YSAgICA6IF9kYXRhLFxuICAgICAgICBtZXRob2QgIDogJ1BPU1QnXG4gICAgfSk7XG59O1xuXG5NaWNyb2JlLmh0dHAgPSBodHRwO1xuXG5leHBvcnQgZGVmYXVsdCBodHRwO1xuIiwiaW1wb3J0IE1pY3JvYmUgZnJvbSAnLi9jb3JlJztcblxuXG52YXIgdHJpZ2dlciwgX3Nob3J0U2VsZWN0b3I7XG5cbnZhciBzZWxlY3RvclJlZ2V4ID0gTWljcm9iZS5wcm90b3R5cGUuX19zZWxlY3RvclJlZ2V4ID0gIC8oPzpbXFxzXSpcXC4oW1xcdy1fXFwuXSspfCMoW1xcdy1fXSspfChbXiNcXC46PF1bXFx3LV9dKil8KDxbXFx3LV8jXFwuXSs+KXw6KFteI1xcLjxdW1xcdy0oKV9dKikpL2c7XG5cbi8vIFRPRE86IENoZWNrIGlmIHdlIGhpdCB0aGUgZHVja1xuXG4vKipcbiAqIEJ1aWxkXG4gKlxuICogYnVpbGRzIGFuZCByZXR1cm5zIHRoZSBmaW5hbCBtaWNyb2JlXG4gKlxuICogQHBhcmFtICB7QXJyYXl9ICAgICAgICAgICAgICBfZWxlbWVudHMgICAgICAgICAgIGFycmF5IG9mIGVsZW1lbnRzXG4gKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgICAgIF9zZWxlY3RvciAgICAgICAgICAgc2VsZWN0b3JcbiAqXG4gKiBAcmV0dXJuIHtNaWNyb2JlfSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWljcm9iZSB3cmFwcGVkIGVsZW1lbnRzXG4gKi9cbmZ1bmN0aW9uIF9idWlsZCggX2VsZW1lbnRzLCBfc2VsZWN0b3IgKVxue1xuICAgIGxldCBpLCBsZW5JO1xuICAgIGZvciAoaSA9IDAsIGxlbkkgPSBfZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuSTsgaSsrIClcbiAgICB7XG4gICAgICAgIGlmICggX2VsZW1lbnRzWyBpIF0gKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWxlbWVudHNbIGkgXS5kYXRhID0gX2VsZW1lbnRzWyBpIF0uZGF0YSB8fCB7fTtcbiAgICAgICAgICAgIHRoaXNbIGkgXSAgICAgICAgICAgPSBfZWxlbWVudHNbIGkgXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3NlbGVjdG9yICA9IF9zZWxlY3RvcjtcbiAgICB0aGlzLmxlbmd0aCAgICAgPSBpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cblxuLyoqXG4gKiBDcmVhdGUgRWxlbWVudFxuICpcbiAqIE1ldGhvZCBjcmVhdGVzIGEgTWljcm9iZSBmcm9tIGFuIGVsZW1lbnQgb3IgYSBuZXcgZWxlbWVudCBvZiB0aGUgcGFzc2VkIHN0cmluZywgYW5kXG4gKiByZXR1cm5zIHRoZSBNaWNyb2JlXG4gKlxuICogQHBhcmFtICAge0VsZW1lbnR9ICAgICAgICAgICBfZWwgICAgICAgICAgICAgICAgIGVsZW1lbnQgdG8gY3JlYXRlXG4gKlxuICogQHJldHVybiAge01pY3JvYmV9XG4qL1xuZnVuY3Rpb24gX2NyZWF0ZSggX2VsIClcbntcbiAgICB2YXIgcmVzdWx0c1JlZ2V4ICAgID0gX2VsLm1hdGNoKCBzZWxlY3RvclJlZ2V4ICksXG4gICAgICAgIF9pZCA9ICcnLCBfdGFnID0gJycsIF9jbGFzcyA9ICcnLCBfc2VsZWN0b3IgPSAnJztcblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuSSA9IHJlc3VsdHNSZWdleC5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgIHtcbiAgICAgICAgdmFyIHRyaWdnZXIgPSByZXN1bHRzUmVnZXhbIGkgXVsgMCBdO1xuICAgICAgICBzd2l0Y2ggKCB0cmlnZ2VyIClcbiAgICAgICAge1xuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICAgICAgX2lkICAgICArPSByZXN1bHRzUmVnZXhbIGkgXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgICAgICAgX2NsYXNzICArPSByZXN1bHRzUmVnZXhbIGkgXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBfdGFnICAgICs9IHJlc3VsdHNSZWdleFsgaSBdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgX3RhZyA9PT0gJ3N0cmluZycgKVxuICAgIHtcbiAgICAgICAgX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggX3RhZyApO1xuICAgICAgICBfc2VsZWN0b3IgPSBfdGFnO1xuXG4gICAgICAgIGlmICggX2lkIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3NlbGVjdG9yICs9IF9pZDtcbiAgICAgICAgICAgIF9lbC5pZCA9IF9pZC5zbGljZSggMSApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfY2xhc3MgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfc2VsZWN0b3IgKz0gX2NsYXNzO1xuICAgICAgICAgICAgX2NsYXNzID0gX2NsYXNzLnNwbGl0KCAnLicgKTtcblxuICAgICAgICAgICAgZm9yICggbGV0IGkgPSAxLCBsZW5JID0gX2NsYXNzLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX2VsLmNsYXNzTGlzdC5hZGQoIF9jbGFzc1sgaSBdICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBfYnVpbGQuY2FsbCggdGhpcywgWyBfZWwgXSwgIF9zZWxlY3RvciApO1xufVxuXG5cbi8qKlxuICogQ29udGFpbnNcbiAqXG4gKiBjaGVja3MgaWYgYSBnaXZlbiBlbGVtZW50IGlzIGEgY2hpbGQgb2YgX3Njb3BlXG4gKlxuICogQHBhcmFtICB7RWxlbWVudH0gICAgICAgICAgICBfZWwgICAgICAgICAgICAgICAgIGVsZW1lbnQgdG8gY2hlY2tcbiAqIEBwYXJhbSAge0VsZW1lbnR9ICAgICAgICAgICAgX3Njb3BlICAgICAgICAgICAgICBzY29wZVxuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGV0aGVyIF9lbCBpcyBjb250YWluZWQgaW4gdGhlIHNjb3BlXG4gKi9cbmZ1bmN0aW9uIF9jb250YWlucyggX2VsLCBfc2NvcGUgKVxue1xuICAgIHZhciBwYXJlbnQgPSBfZWwucGFyZW50Tm9kZTtcblxuICAgIHdoaWxlICggcGFyZW50ICE9PSBkb2N1bWVudCAmJiBwYXJlbnQgIT09IF9zY29wZSApXG4gICAge1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZSB8fCBfc2NvcGUucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICBpZiAoIHBhcmVudCA9PT0gZG9jdW1lbnQgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbi8qKlxuICogQ2xhc3MgTWljcm9iZVxuICpcbiAqIENvbnN0cnVjdG9yLlxuICogRWl0aGVyIHNlbGVjdHMgb3IgY3JlYXRlcyBhbiBIVE1MIGVsZW1lbnQgYW5kIHdyYXBzIGl0IGludG8gYSBNaWNyb2JlIGluc3RhbmNlLlxuICogVXNhZ2U6ICAgwrUoJ2RpdiN0ZXN0JykgICAtLS0+IHNlbGVjdGlvblxuICogICAgICAgICAgwrUoJzxkaXYjdGVzdD4nKSAtLS0+IGNyZWF0aW9uXG4gKlxuICogQHBhcmFtICAge0VsZW1lbnQgb3IgU3RyaW5nfSBfc2VsZWN0b3IgICAgICAgICAgIEhUTUwgc2VsZWN0b3JcbiAqIEBwYXJhbSAgIHtFbGVtZW50fSAgICAgICAgICAgX3Njb3BlICAgICAgICAgICAgICBzY29wZSB0byBsb29rIGluc2lkZVxuICogQHBhcmFtICAge0VsZW1lbnQgb3IgQXJyYXl9ICBfZWxlbWVudHMgICAgICAgICAgIGVsZW1lbnRzIHRvIGZpbGwgTWljcm9iZSB3aXRoIChvcHRpb25hbClcbiAqXG4gKiBAcmV0dXJuICB7TWljcm9iZX1cbiovXG5jb25zdCBpbml0ID0gTWljcm9iZS5jb3JlLl9faW5pdF9fID0gZnVuY3Rpb24oIF9zZWxlY3RvciwgX3Njb3BlLCBfZWxlbWVudHMgKVxue1xuICAgIGlmICggIV9zY29wZSApXG4gICAge1xuICAgICAgICBpZiAoIF9zZWxlY3RvciAmJiB0eXBlb2YgX3NlbGVjdG9yID09PSAnc3RyaW5nJyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBfcyA9IF9zZWxlY3RvclswXTtcbiAgICAgICAgICAgIHZhciBfaSwgX2MsIF9wO1xuXG4gICAgICAgICAgICBpZiAoIF9zICE9PSAnPCcgJiYgIF9zZWxlY3Rvci5pbmRleE9mKCAnOicgKSA9PT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VsZWN0b3IuaW5kZXhPZiggJyAnICkgPT09IC0xIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKCBfcyApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggX3NlbGVjdG9yLmluZGV4T2YoICcuJyApID09PSAtMSApXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIF9zZWxlY3Rvci5zbGljZSggMSApICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGlkIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkID0gWyBpZCBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfYnVpbGQuY2FsbCggdGhpcywgaWQsIF9zZWxlY3RvciApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBfc2VsZWN0b3IuaW5kZXhPZiggJyMnICkgPT09IC0xIClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xzcyA9IF9zZWxlY3Rvci5zbGljZSggMSApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBjbHNzLmluZGV4T2YoICcuJyApID09PSAtMSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbHNzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggY2xzcyApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfYnVpbGQuY2FsbCggdGhpcywgY2xzcywgX3NlbGVjdG9yICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIF9zZWxlY3Rvci5pbmRleE9mKCAnIycgKSA9PT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGVjdG9yLmluZGV4T2YoICcuJyApID09PSAtMSApXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCBfc2VsZWN0b3IgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfYnVpbGQuY2FsbCggdGhpcywgdGFnLCBfc2VsZWN0b3IgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfc2VsZWN0b3IgPSBfc2VsZWN0b3IgfHwgJyc7XG5cbiAgICBpZiAoIF9zZWxlY3Rvci5ub2RlVHlwZSA9PT0gMSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIF9zZWxlY3RvciApID09PSAnW29iamVjdCBBcnJheV0nIHx8XG4gICAgICAgIF9zZWxlY3RvciA9PT0gd2luZG93IHx8IF9zZWxlY3RvciA9PT0gZG9jdW1lbnQgKVxuICAgIHtcbiAgICAgICAgX3NlbGVjdG9yID0gTWljcm9iZS5pc0FycmF5KCBfc2VsZWN0b3IgKSA/IF9zZWxlY3RvciA6IFsgX3NlbGVjdG9yIF07XG4gICAgICAgIHJldHVybiBfYnVpbGQuY2FsbCggdGhpcywgX3NlbGVjdG9yLCAgJycgKTtcbiAgICB9XG5cbiAgICBfc2NvcGUgPSBfc2NvcGUgPT09IHVuZGVmaW5lZCA/ICBkb2N1bWVudCA6IF9zY29wZTtcblxuICAgIGlmICggX3Njb3BlICE9PSBkb2N1bWVudCApXG4gICAge1xuICAgICAgICBpZiAoIF9zY29wZS50eXBlID09PSAnW29iamVjdCBNaWNyb2JlXScgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfc2NvcGUgPSBfc2NvcGUuc2VsZWN0b3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdHlwZW9mIF9zY29wZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIF9zZWxlY3RvciA9PT0gJ3N0cmluZycgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIF9zZWxlY3Rvci5pbmRleE9mKCAnLCcgKSAhPT0gLTEgfHwgX3Njb3BlLmluZGV4T2YoICcsJyApICE9PSAtMSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1NlbGVjdG9yID0gJyc7XG4gICAgICAgICAgICAgICAgX3NlbGVjdG9yICAgPSBfc2VsZWN0b3Iuc3BsaXQoICcsJyApO1xuICAgICAgICAgICAgICAgIF9zY29wZSAgICAgID0gX3Njb3BlLnNwbGl0KCAnLCcgKTtcblxuICAgICAgICAgICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuSSA9IF9zY29wZS5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICggbGV0IGogPSAwLCBsZW5KID0gX3NlbGVjdG9yLmxlbmd0aDsgaiA8IGxlbko7IGorKyApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1NlbGVjdG9yICs9IF9zY29wZVsgaSBdICsgJyAnICsgX3NlbGVjdG9yWyBqIF0gKyAnLCAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbmV3U2VsZWN0b3IgPSBuZXdTZWxlY3Rvci50cmltKCk7XG4gICAgICAgICAgICAgICAgbmV3U2VsZWN0b3IgPSBuZXdTZWxlY3Rvci5zbGljZSggMCwgbmV3U2VsZWN0b3IubGVuZ3RoIC0gMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9zZWxlY3RvciAgID0gX3Njb3BlICsgJyAnICsgX3NlbGVjdG9yO1xuICAgICAgICAgICAgICAgIF9zY29wZSAgICAgID0gZG9jdW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2NvcGVOb2RlVHlwZSAgID0gX3Njb3BlLm5vZGVUeXBlLFxuICAgICAgICBub2RlVHlwZSAgICAgICAgPSAoIF9zZWxlY3RvciApID8gX3NlbGVjdG9yLm5vZGVUeXBlIHx8IHR5cGVvZiBfc2VsZWN0b3IgOiBudWxsO1xuXG4gICAgaWYgKCBfZWxlbWVudHMgKVxuICAgIHtcbiAgICAgICAgaWYgKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoIF9lbGVtZW50cyApID09PSAnW29iamVjdCBBcnJheV0nIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIF9idWlsZC5jYWxsKCB0aGlzLCBfZWxlbWVudHMsIF9zZWxlY3RvciApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIF9idWlsZC5jYWxsKCB0aGlzLCBbIF9lbGVtZW50cyBdLCBfc2VsZWN0b3IgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBpZiAoICggIV9zZWxlY3RvciB8fCB0eXBlb2YgX3NlbGVjdG9yICE9PSAnc3RyaW5nJyApIHx8XG4gICAgICAgICAgICAoIHNjb3BlTm9kZVR5cGUgIT09IDEgJiYgc2NvcGVOb2RlVHlwZSAhPT0gOSApIClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIF9idWlsZC5jYWxsKCB0aGlzLCBbXSwgX3NlbGVjdG9yICk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0c1JlZ2V4ID0gX3NlbGVjdG9yLm1hdGNoKCBzZWxlY3RvclJlZ2V4ICk7XG5cbiAgICAgICAgaWYgKCByZXN1bHRzUmVnZXggJiYgcmVzdWx0c1JlZ2V4Lmxlbmd0aCA9PT0gMSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRyaWdnZXIgICAgICAgICA9IHJlc3VsdHNSZWdleFswXVswXTtcblxuICAgICAgICAgICAgX3Nob3J0U2VsZWN0b3IgID0gX3NlbGVjdG9yLnNsaWNlKCAxICk7XG5cbiAgICAgICAgICAgIHN3aXRjaCggdHJpZ2dlciApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FzZSAnLic6IC8vIG5vbi1kb2N1bWVudCBzY29wZWQgY2xhc3NuYW1lIHNlYXJjaFxuICAgICAgICAgICAgICAgICAgICB2YXIgX2NsYXNzZXNDb3VudCAgID0gKCBfc2VsZWN0b3IgfHwgJycgKS5zbGljZSggMSApLnNwbGl0KCAnLicgKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCBfY2xhc3Nlc0NvdW50ID09PSAxIClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9idWlsZC5jYWxsKCB0aGlzLCBfc2NvcGUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggX3Nob3J0U2VsZWN0b3IgKSwgX3NlbGVjdG9yICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnIyc6IC8vIG5vbi1kb2N1bWVudCBzY29wZWQgaWQgc2VhcmNoXG4gICAgICAgICAgICAgICAgICAgIHZhciBfaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggX3Nob3J0U2VsZWN0b3IgKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIF9zY29wZS5vd25lckRvY3VtZW50ICYmIF9jb250YWlucyggX2lkLCBfc2NvcGUgKSApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBfYnVpbGQuY2FsbCggdGhpcywgWyBfaWQgXSwgX3NlbGVjdG9yICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPCc6IC8vIGVsZW1lbnQgY3JlYXRpb25cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9jcmVhdGUuY2FsbCggdGhpcywgX3NlbGVjdG9yLnN1YnN0cmluZyggMSwgX3NlbGVjdG9yLmxlbmd0aCAtIDEgKSApO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfYnVpbGQuY2FsbCggdGhpcywgX3Njb3BlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCBfc2VsZWN0b3IgKSwgX3NlbGVjdG9yICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoICEoIHRoaXMgaW5zdGFuY2VvZiBNaWNyb2JlLmNvcmUuX19pbml0X18gKSApXG4gICAge1xuICAgICAgICByZXR1cm4gbmV3IE1pY3JvYmUuY29yZS5fX2luaXRfXyggX3NlbGVjdG9yLCBfc2NvcGUsIF9lbGVtZW50cyApO1xuICAgIH1cblxuICAgIHZhciBwc2V1ZG87XG4gICAgaWYgKCBfc2VsZWN0b3IuaW5kZXhPZiggJzonICkgIT09IC0xIClcbiAgICB7XG4gICAgICAgIHZhciBfcHNldWRvQXJyYXk7XG4gICAgICAgICBwc2V1ZG8gICAgID0gX3NlbGVjdG9yLnNwbGl0KCAnOicgKTtcbiAgICAgICAgX3NlbGVjdG9yICAgPSBwc2V1ZG9bIDAgXTtcbiAgICAgICAgcHNldWRvLnNwbGljZSggMCwgMSApO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuSSA9IHBzZXVkby5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfcHNldWRvQXJyYXkgPSBwc2V1ZG9bIGkgXS5zcGxpdCggJygnICk7XG5cbiAgICAgICAgICAgIGlmICggIU1pY3JvYmUuY29uc3RydWN0b3IucHNldWRvWyBfcHNldWRvQXJyYXlbIDAgXSBdIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBfc2VsZWN0b3IgKz0gJzonICsgcHNldWRvWyBpIF07XG4gICAgICAgICAgICAgICAgcHNldWRvLnNwbGljZSggaSwgMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIG9iaiA9IF9idWlsZC5jYWxsKCB0aGlzLCBfc2NvcGUucXVlcnlTZWxlY3RvckFsbCggX3NlbGVjdG9yICksIF9zZWxlY3RvciApO1xuXG4gICAgaWYgKCBwc2V1ZG8gKVxuICAgIHtcbiAgICAgICAgdmFyIF9zZWwsIF92YXI7XG4gICAgICAgIGZvciAoIGxldCBpID0gMCwgbGVuSSA9IHBzZXVkby5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBfc2VsID0gcHNldWRvWyBpIF0uc3BsaXQoICcoJyApO1xuICAgICAgICAgICAgX3ZhciA9IF9zZWxbIDEgXTtcbiAgICAgICAgICAgIGlmICggX3ZhciApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgX3ZhciA9IF92YXIuc2xpY2UoIDAsIF92YXIubGVuZ3RoIC0gMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX3NlbCA9IF9zZWxbIDAgXTtcblxuICAgICAgICAgICAgaWYgKCBNaWNyb2JlLmNvbnN0cnVjdG9yLnBzZXVkb1sgX3NlbCBdIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvYmogPSBNaWNyb2JlLmNvbnN0cnVjdG9yLnBzZXVkb1sgX3NlbCBdKCBvYmosIF92YXIgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG59O1xuXG5NaWNyb2JlLmNvcmUuX19pbml0X18ucHJvdG90eXBlID0gTWljcm9iZS5jb3JlO1xuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIiwiaW1wb3J0IE1pY3JvYmUgZnJvbSAnLi9jb3JlJztcblxuLy8gc2hpbSBuZWVkZWQgZm9yIG9ic2VydmVcbmlmICggISBPYmplY3Qub2JzZXJ2ZSApXG57XG4gICAgcmVxdWlyZSggJ3NldGltbWVkaWF0ZScgKTtcbiAgICByZXF1aXJlKCAnb2JzZXJ2ZS1zaGltJyApO1xuICAgIHZhciBPYnNlcnZlVXRpbHMgPSByZXF1aXJlKCAnb2JzZXJ2ZS11dGlscycgKTtcbn1cblxuLyoqXG4gKiBHZXQgZGF0YVxuICpcbiAqIGdldHMgdGhlIHNhdmVkIHZhbHVlIGZyb20gZWFjaCBlbGVtZW50IGluIHRoZSBtaWNyb2JlIGluIGFuIGFycmF5XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICBfcHJvcCAgICAgICAgICAgICAgIHByb3BlcnR5IHRvIGdldFxuICpcbiAqIEByZXR1cm4ge0FycmF5fSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJheSBvZiB2YWx1ZXNcbiAqL1xuTWljcm9iZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oIHByb3AgKVxue1xuICAgIHZhciBfZ2V0ID0gZnVuY3Rpb24oIF9lbCApXG4gICAge1xuICAgICAgICBpZiAoICEgcHJvcCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBfZWwuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggX2VsLmRhdGFbIHByb3AgXSAmJiBfZWwuZGF0YVsgcHJvcCBdWyBwcm9wIF0gKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBfZWwuZGF0YVsgcHJvcCBdWyBwcm9wIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBpLCBsZW4sIHZhbHVlcyA9IG5ldyBBcnJheSggdGhpcy5sZW5ndGggKTtcblxuICAgIGZvciAoIGkgPSAwLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrIClcbiAgICB7XG4gICAgICAgIHZhbHVlc1sgaSBdID0gX2dldCggdGhpc1sgaSBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07XG5cblxuLyoqXG4gKiBPYnNlcnZlXG4gKlxuICogYXBwbGllcyBhIGZ1bmN0aW9uIHRvIGFuIGVsZW1lbnQgaWYgaXQgaXMgY2hhbmdlZCBmcm9tIHdpdGhpbiDCtVxuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgICAgICAgICAgZnVuY3Rpb24gICAgICAgICAgICBmdW5jdGlvbiB0byBhcHBseVxuICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgICAgICBfcHJvcCAgICAgICAgICAgICAgIHByb3BlcnR5IHRvIG9ic2VydmVcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgICAgX29uY2UgICAgICAgICAgICAgICBib29sIHRvIHRyaWdnZXIgYXV0byB1bm9ic2VydmVcbiAqXG4gKiBAcmV0dXJuICB7TWljcm9iZX1cbiovXG5NaWNyb2JlLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24oIHByb3AsIGZ1bmMsIF9vbmNlIClcbntcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgX29ic2VydmUgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICB2YXIgX3NldE9ic2VydmUgPSBmdW5jdGlvbiggX3RhcmdldCwgX3Byb3AgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIF9vbmNlID09PSB0cnVlIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgX2Z1bmMgPSBmdW5jdGlvbiggZSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBfdGFyZ2V0Ll9vYnNlcnZlRnVuYyggZSApO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QudW5vYnNlcnZlKCBfdGFyZ2V0LCBfZnVuYyApO1xuICAgICAgICAgICAgICAgIH0uYmluZCggdGhpcyApO1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0Lm9ic2VydmUoIF90YXJnZXQsIF9mdW5jICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT2JqZWN0Lm9ic2VydmUoIF90YXJnZXQsIF90YXJnZXQuX29ic2VydmVGdW5jICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIF9zZXRPYnNlcnZlRnVuYyA9IGZ1bmN0aW9uKCBfdGFyZ2V0IClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCBfdGFyZ2V0Ll9vYnNlcnZlRnVuYyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LnVub2JzZXJ2ZSggX3RhcmdldCwgX3RhcmdldC5fb2JzZXJ2ZUZ1bmMgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RhcmdldC5fb2JzZXJ2ZUZ1bmMgICAgID0gZnVuYztcblxuICAgICAgICAgICAgcmV0dXJuIF90YXJnZXQ7XG4gICAgICAgIH07XG5cblxuICAgICAgICBfZWxtLmRhdGEgICA9IF9lbG0uZGF0YSB8fCB7fTtcbiAgICAgICAgdmFyIF9kYXRhICAgPSBfZWxtLmRhdGE7XG4gICAgICAgIGZ1bmMgICAgICAgID0gZnVuYy5iaW5kKCB0aGlzICk7XG5cbiAgICAgICAgdmFyIHRhcmdldCA9IG51bGw7XG5cbiAgICAgICAgaWYgKCBwcm9wIClcbiAgICAgICAge1xuICAgICAgICAgICAgX2RhdGFbIHByb3AgXSAgPSBfZGF0YVsgcHJvcCBdIHx8IHt9O1xuXG4gICAgICAgICAgICB0YXJnZXQgPSBfc2V0T2JzZXJ2ZUZ1bmMoIF9kYXRhWyBwcm9wIF0gKTtcbiAgICAgICAgICAgIF9zZXRPYnNlcnZlKCB0YXJnZXQsIHByb3AgKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBfcHJvcHMgPSBbICdhdHRyJywgJ3RleHQnLCAnY3NzJywgJ2h0bWwnLCAnY2xhc3MnIF07XG5cbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IF9wcm9wcy5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9kYXRhWyBfcHJvcHNbIGkgXSBdID0gX2RhdGFbIF9wcm9wc1sgaSBdIF0gfHwge307XG5cbiAgICAgICAgICAgICAgICB0YXJnZXQgPSBfc2V0T2JzZXJ2ZUZ1bmMoIF9kYXRhWyBfcHJvcHNbIGkgXSBdICk7XG4gICAgICAgICAgICAgICAgX3NldE9ic2VydmUoIHRhcmdldCwgX3Byb3BzWyBpIF0gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0ID0gX3NldE9ic2VydmVGdW5jKCBfZGF0YSApO1xuICAgICAgICAgICAgX3NldE9ic2VydmUoIHRhcmdldCwgbnVsbCApO1xuXG4gICAgICAgIH1cbiAgICB9LmJpbmQoIHRoaXMgKTtcblxuICAgIGlmICggdHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicgKVxuICAgIHtcbiAgICAgICAgZnVuYyAgICA9IHByb3A7XG4gICAgICAgIHByb3AgICAgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBpLCBsZW4sIHJlc3VsdHMgPSBuZXcgQXJyYXkoIHRoaXMubGVuZ3RoICk7XG5cbiAgICBmb3IgKCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBfb2JzZXJ2ZSggdGhpc1sgaSBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogT2JzZXJ2ZSBPbmNlXG4gKlxuICogYXBwbGllcyBhIGZ1bmN0aW9uIHRvIGFuIGVsZW1lbnQgaWYgaXQgaXMgY2hhbmdlZCBmcm9tIHdpdGhpbiDCtSAob25jZSlcbiAqXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgICAgIGZ1bmMgICAgICAgICAgICAgICAgZnVuY3Rpb24gdG8gYXBwbHlcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgX3Byb3AgICAgICAgICAgICAgICBwcm9wZXJ0eSB0byBvYnNlcnZlXG4gKlxuICogQHJldHVybiAgTWljcm9iZVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLm9ic2VydmVPbmNlID0gZnVuY3Rpb24oIGZ1bmMsIF9wcm9wIClcbntcbiAgICB0aGlzLm9ic2VydmUoIGZ1bmMsIF9wcm9wLCB0cnVlICk7XG59O1xuXG5cbi8qKlxuICogU2V0IGRhdGFcbiAqXG4gKiBzZXRzIHRoZSB2YWx1ZSB0byB0aGUgZGF0YSBvYmplY3QgaW4gdGhlIGVhY2ggZWxlbWVudCBpbiB0aGUgbWljcm9iZVxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgcHJvcCAgICAgICAgICAgICAgICBwcm9wZXJ0eSB0byBzZXRcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgICAgICAgdmFsdWUgICAgICAgICAgICAgICB2YWx1ZSB0byBzZXQgdG9cbiAqXG4gKiBAcmV0dXJuIHtNaWNyb2JlfVxuICovXG5NaWNyb2JlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiggcHJvcCwgdmFsdWUgKVxue1xuICAgIHZhciBfc2V0ID0gZnVuY3Rpb24oIF9lbCApXG4gICAge1xuICAgICAgICBfZWwuZGF0YSAgICAgICAgICAgICAgICAgICAgPSBfZWwuZGF0YSB8fCB7fTtcblxuICAgICAgICAvLyBzaGltXG4gICAgICAgIGlmICggT2JzZXJ2ZVV0aWxzICYmICEgX2VsLmRhdGFbIHByb3AgXSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIE9ic2VydmVVdGlscy5kZWZpbmVPYnNlcnZhYmxlUHJvcGVydGllcyggX2VsLmRhdGEsIHByb3AgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggTWljcm9iZS5pc0FycmF5KCB2YWx1ZSApIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFsdWUgPSBNaWNyb2JlLmV4dGVuZCggW10sIHZhbHVlICk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIE1pY3JvYmUuaXNPYmplY3QoIHZhbHVlICkgKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZSA9IE1pY3JvYmUuZXh0ZW5kKCB7fSwgdmFsdWUgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9lbC5kYXRhWyBwcm9wIF0gICAgICAgICAgICA9IF9lbC5kYXRhWyBwcm9wIF0gfHwge307XG4gICAgICAgIF9lbC5kYXRhWyBwcm9wIF1bIHByb3AgXSAgICA9IHZhbHVlO1xuICAgIH07XG5cbiAgICB2YXIgaSwgbGVuLCB2YWx1ZXMgPSBuZXcgQXJyYXkoIHRoaXMubGVuZ3RoICk7XG5cbiAgICBmb3IgKCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICB2YWx1ZXNbIGkgXSA9IF9zZXQoIHRoaXNbIGkgXSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFN0b3Agb2JzZXJ2aW5nXG4gKlxuICogc3RvcHMgd2F0Y2hpbmcgdGhlIGRhdGEgY2hhbmdlcyBvZiBhIMK1IG9uamVjdFxuICpcbiAqIEBwYXJhbSAgIHtTdHJpbmd9ICAgICAgICAgICAgX3Byb3AgICAgICAgICAgICAgICBwcm9wZXJ0eSB0byBzdG9wIG9ic2VydmluZ1xuICpcbiAqIEByZXR1cm4gIHtNaWNyb2JlfVxuKi9cbk1pY3JvYmUucHJvdG90eXBlLnVub2JzZXJ2ZSA9IGZ1bmN0aW9uKCBfcHJvcCApXG57XG4gICAgdmFyIF91bm9ic2VydmUgPSBmdW5jdGlvbiggX2VsbSApXG4gICAge1xuICAgICAgICB2YXIgX2RhdGEgPSBfZWxtLmRhdGE7XG5cbiAgICAgICAgaWYgKCBfZGF0YSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggX3Byb3AgJiYgX2RhdGFbIF9wcm9wIF0gJiYgX2RhdGFbIF9wcm9wIF0uX29ic2VydmVGdW5jIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBPYmplY3QudW5vYnNlcnZlKCBfZGF0YVsgX3Byb3AgXSwgX2RhdGFbIF9wcm9wIF0uX29ic2VydmVGdW5jICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICggISBfcHJvcCApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKCBfZGF0YS5fb2JzZXJ2ZUZ1bmMgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnVub2JzZXJ2ZSggX2RhdGEsIF9kYXRhLl9vYnNlcnZlRnVuYyApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoIHZhciBfcHJvcGVydHkgaW4gX2RhdGEgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBfZGF0YVsgX3Byb3BlcnR5IF0uX29ic2VydmVGdW5jIClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnVub2JzZXJ2ZSggX2RhdGFbIF9wcm9wZXJ0eSBdLCBfZGF0YVsgX3Byb3BlcnR5IF0uX29ic2VydmVGdW5jICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LmJpbmQoIHRoaXMgKTtcblxuICAgIGZvciAoIGxldCBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApXG4gICAge1xuICAgICAgICBfdW5vYnNlcnZlKCB0aGlzWyBpIF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG4iLCJpbXBvcnQgTWljcm9iZSBmcm9tICcuL2NvcmUnO1xuXG5NaWNyb2JlLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wc2V1ZG8gPVxue1xuICAgIC8qKlxuICAgICAqIHJldHVybnMgb25seSBlbGVtZW50cyB0aGF0IGNvbnRhaW4gdGhlIGdpdmVuIHRleHQuICBUaGUgc3VwcGxpZWQgdGV4dFxuICAgICAqIGlzIGNvbXBhcmVkIGlnbm9yaW5nIGNhc2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge01pY3JvYmV9ICAgICAgICBfZWwgICAgICAgICAgICAgICAgIG1pY3JvYmUgdG8gYmUgZmlsdGVyZWRcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgX3ZhciAgICAgICAgICAgICAgICBzdHJpbmcgdG8gc2VhcmNoIGZvclxuICAgICAqXG4gICAgICogQHJldHVybiB7TWljcm9iZX1cbiAgICAgKi9cbiAgICBjb250YWlucyA6IGZ1bmN0aW9uKCBfZWwsIF92YXIgKVxuICAgIHtcbiAgICAgICAgX3ZhciAgICAgICAgICAgID0gX3Zhci50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIHZhciB0ZXh0QXJyYXkgICA9IF9lbC50ZXh0KCk7XG4gICAgICAgIHZhciBlbGVtZW50cyAgICA9IFtdO1xuXG4gICAgICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IF9lbC5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIHRleHRBcnJheVsgaSBdLnRvTG93ZXJDYXNlKCkuaW5kZXhPZiggX3ZhciApICE9PSAtMSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMucHVzaCggX2VsWyBpIF0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX2VsLmNvbnN0cnVjdG9yKCBlbGVtZW50cyApO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGV2ZW4gaW5kZXhlZCBlbGVtZW50cyBvZiBhIG1pY3JvYmUgKHN0YXJ0aW5nIGF0IDApXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtNaWNyb2JlfSAgICAgICAgX2VsICAgICAgICAgICAgICAgICBtaWNyb2JlIHRvIGJlIGZpbHRlcmVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIGV2ZW4gOiBmdW5jdGlvbiggX2VsIClcbiAgICB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IFtdO1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGxlbkkgPSBfZWwubGVuZ3RoOyBpIDwgbGVuSTsgaSsrIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCAoIGkgKyAxICkgJSAyID09PSAwIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKCBfZWxbIGkgXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZWwuY29uc3RydWN0b3IoIGVsZW1lbnRzICk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBvZiBhIG1pY3JvYmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge01pY3JvYmV9ICAgICAgICBfZWwgICAgICAgICAgICAgICAgIG1pY3JvYmUgdG8gYmUgZmlsdGVyZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge01pY3JvYmV9XG4gICAgICovXG4gICAgZmlyc3QgOiBmdW5jdGlvbiggX2VsIClcbiAgICB7XG4gICAgICAgIHJldHVybiBfZWwuZmlyc3QoKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBsYXN0IHtfdmFyfSBlbGVtZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtNaWNyb2JlfSAgICAgICAgX2VsICAgICAgICAgICAgICAgICBtaWNyb2JlIHRvIGJlIGZpbHRlcmVkXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgICAgICAgIF92YXIgICAgICAgICAgICAgICAgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJldHVyblxuICAgICAqXG4gICAgICogQHJldHVybiB7TWljcm9iZX1cbiAgICAgKi9cbiAgICBndCA6IGZ1bmN0aW9uKCBfZWwsIF92YXIgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9lbC5zcGxpY2UoIF92YXIsIF9lbC5sZW5ndGggKTtcbiAgICB9LFxuXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcGFzc2VkIHNlbGVjdG9yIGFzIGEgY2hpbGRcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge01pY3JvYmV9ICAgICAgICBfZWwgICAgICAgICAgICAgICAgIG1pY3JvYmUgdG8gYmUgZmlsdGVyZWRcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgX3ZhciAgICAgICAgICAgICAgICBzZWxlY3RvciBzdHJpbmdcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge01pY3JvYmV9XG4gICAgICovXG4gICAgaGFzIDogZnVuY3Rpb24oIF9lbCwgX3ZhciApXG4gICAge1xuICAgICAgICB2YXIgaSwgbGVuSSwgX29iaiwgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgIGZvciAoIGkgPSAwLCBsZW5JID0gX2VsLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIF9vYmogPSBfZWwuY29uc3RydWN0b3IoIF92YXIsIF9lbFsgaSBdICk7XG5cbiAgICAgICAgICAgIGlmICggX29iai5sZW5ndGggIT09IDAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCggX2VsWyBpIF0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfZWwuY29uc3RydWN0b3IoIHJlc3VsdHMgKTtcblxuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIGxhc3QgZWxlbWVudCBvZiBhIG1pY3JvYmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge01pY3JvYmV9ICAgICAgICBfZWwgICAgICAgICAgICAgICAgIG1pY3JvYmUgdG8gYmUgZmlsdGVyZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge01pY3JvYmV9XG4gICAgICovXG4gICAgbGFzdCA6IGZ1bmN0aW9uKCBfZWwgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9lbC5sYXN0KCk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgZmlyc3Qge192YXJ9IGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge01pY3JvYmV9ICAgICAgICBfZWwgICAgICAgICAgICAgICAgIG1pY3JvYmUgdG8gYmUgZmlsdGVyZWRcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgICAgX3ZhciAgICAgICAgICAgICAgICBudW1iZXIgb2YgZWxlbWVudHMgdG8gcmV0dXJuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtNaWNyb2JlfVxuICAgICAqL1xuICAgIGx0IDogZnVuY3Rpb24oIF9lbCwgX3ZhciApXG4gICAge1xuICAgICAgICByZXR1cm4gX2VsLnNwbGljZSggMCwgX3ZhciApO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdGhlIG9kZCBpbmRleGVkIGVsZW1lbnRzIG9mIGEgbWljcm9iZVxuICAgICAqXG4gICAgICogQHBhcmFtICB7TWljcm9iZX0gICAgICAgIF9lbCAgICAgICAgICAgICAgICAgbWljcm9iZSB0byBiZSBmaWx0ZXJlZFxuICAgICAqXG4gICAgICogQHJldHVybiB7TWljcm9iZX1cbiAgICAgKi9cbiAgICBvZGQgOiBmdW5jdGlvbiggX2VsIClcbiAgICB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IFtdO1xuICAgICAgICBmb3IgKCB2YXIgaSA9IDAsIGxlbkkgPSBfZWwubGVuZ3RoOyBpIDwgbGVuSTsgaSsrIClcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKCAoIGkgKyAxICkgJSAyICE9PSAwIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cy5wdXNoKCBfZWxbIGkgXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZWwuY29uc3RydWN0b3IoIGVsZW1lbnRzICk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0aGUgcm9vdCBlbGVtZW50cyBvZiB0aGUgZG9jdW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge01pY3JvYmV9ICAgICAgICBfZWwgICAgICAgICAgICAgICAgIG1pY3JvYmUgdG8gYmUgZmlsdGVyZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge01pY3JvYmV9XG4gICAgICovXG4gICAgcm9vdCA6IGZ1bmN0aW9uKCBfZWwgKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIF9lbC5yb290KCk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyBhIG1pY3JvYmUgd2l0aCBlbGVtZW50cyB0aGF0IG1hdGNoIGJvdGggdGhlIG9yaWdpbmFsIHNlbGVjdG9yLCBhbmQgdGhlIGlkIG9mIHRoZSBwYWdlIGhhc2hcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge01pY3JvYmV9ICAgICAgICBfZWwgICAgICAgICAgICAgICAgIG1pY3JvYmUgdG8gYmUgZmlsdGVyZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge01pY3JvYmV9XG4gICAgICovXG4gICAgdGFyZ2V0IDogZnVuY3Rpb24oIF9lbCApXG4gICAge1xuICAgICAgICB2YXIgaGFzaCA9ICggbG9jYXRpb24uaHJlZi5zcGxpdCggJyMnIClbIDEgXSApO1xuXG4gICAgICAgIHZhciBlbGVtZW50cyA9IFtdO1xuXG4gICAgICAgIGlmICggaGFzaCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IF9lbC5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICggX2VsWyBpIF0uaWQgPT09IGhhc2ggIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLnB1c2goIF9lbFsgaSBdICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9lbC5jb25zdHJ1Y3RvciggZWxlbWVudHMgKTtcbiAgICB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IGZpbGwgICAgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5maWxsO1xuZXhwb3J0IGNvbnN0IHBvcCAgICAgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5wb3A7XG5leHBvcnQgY29uc3QgcHVzaCAgICAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLnB1c2g7XG5leHBvcnQgY29uc3QgcmV2ZXJzZSAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLnJldmVyc2U7XG5leHBvcnQgY29uc3Qgc2hpZnQgICAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLnNoaWZ0O1xuZXhwb3J0IGNvbnN0IHNvcnQgICAgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5zb3J0O1xuZXhwb3J0IGNvbnN0IHNwbGljZSAgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2U7XG5leHBvcnQgY29uc3QgdW5zaGlmdCAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLnVuc2hpZnQ7XG5leHBvcnQgY29uc3QgY29uY2F0ICAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLmNvbmNhdDtcbmV4cG9ydCBjb25zdCBqb2luICAgICAgICAgICAgPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbmV4cG9ydCBjb25zdCBzbGljZSAgICAgICAgICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5leHBvcnQgY29uc3QgdG9Tb3VyY2UgICAgICAgID0gQXJyYXkucHJvdG90eXBlLnRvU291cmNlO1xuZXhwb3J0IGNvbnN0IHRvU3RyaW5nICAgICAgICA9IEFycmF5LnByb3RvdHlwZS50b1N0cmluZztcbmV4cG9ydCBjb25zdCB0b0xvY2FsZVN0cmluZyAgPSBBcnJheS5wcm90b3R5cGUudG9Mb2NhbGVTdHJpbmc7XG5leHBvcnQgY29uc3QgaW5kZXhPZiAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLmluZGV4T2Y7XG5leHBvcnQgY29uc3QgbGFzdEluZGV4T2YgICAgID0gQXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mO1xuZXhwb3J0IGNvbnN0IGZvckVhY2ggICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xuZXhwb3J0IGNvbnN0IGVudHJpZXMgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzO1xuZXhwb3J0IGNvbnN0IGV2ZXJ5ICAgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5ldmVyeTtcbmV4cG9ydCBjb25zdCBzb21lICAgICAgICAgICAgPSBBcnJheS5wcm90b3R5cGUuc29tZTtcbmV4cG9ydCBjb25zdCBmaWx0ZXIgICAgICAgICAgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyO1xuZXhwb3J0IGNvbnN0IGZpbmQgICAgICAgICAgICA9IEFycmF5LnByb3RvdHlwZS5maW5kO1xuZXhwb3J0IGNvbnN0IGZpbmRJbmRleCAgICAgICA9IEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXg7XG5leHBvcnQgY29uc3Qga2V5cyAgICAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLmtleXM7XG5leHBvcnQgY29uc3QgbWFwICAgICAgICAgICAgID0gQXJyYXkucHJvdG90eXBlLm1hcDtcbmV4cG9ydCBjb25zdCByZWR1Y2UgICAgICAgICAgPSBBcnJheS5wcm90b3R5cGUucmVkdWNlO1xuZXhwb3J0IGNvbnN0IHJlZHVjZVJpZ2h0ICAgICA9IEFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodDtcbmV4cG9ydCBjb25zdCBjb3B5V2l0aGluICAgICAgPSBBcnJheS5wcm90b3R5cGUuY29weVdpdGhpO1xuXG5leHBvcnQgZGVmYXVsdFxue1xuICAgIGZpbGwsXG4gICAgcG9wLFxuICAgIHB1c2gsXG4gICAgcmV2ZXJzZSxcbiAgICBzaGlmdCxcbiAgICBzb3J0LFxuICAgIHNwbGljZSxcbiAgICB1bnNoaWZ0LFxuICAgIGNvbmNhdCxcbiAgICBqb2luLFxuICAgIHNsaWNlLFxuICAgIHRvU291cmNlLFxuICAgIHRvU3RyaW5nLFxuICAgIHRvTG9jYWxlU3RyaW5nLFxuICAgIGluZGV4T2YsXG4gICAgbGFzdEluZGV4T2YsXG4gICAgZm9yRWFjaCxcbiAgICBlbnRyaWVzLFxuICAgIGV2ZXJ5LFxuICAgIHNvbWUsXG4gICAgZmlsdGVyLFxuICAgIGZpbmQsXG4gICAgZmluZEluZGV4LFxuICAgIGtleXMsXG4gICAgbWFwLFxuICAgIHJlZHVjZSxcbiAgICByZWR1Y2VSaWdodCxcbiAgICBjb3B5V2l0aGluXG59O1xuIiwiZXhwb3J0IGNvbnN0IGNoYXJBdCAgICAgICAgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLmNoYXJBdDtcbmV4cG9ydCBjb25zdCBjaGFyQ29kZUF0ICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5jaGFyQ29kZUF0O1xuZXhwb3J0IGNvbnN0IGNvZGVQb2ludEF0ICAgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0O1xuZXhwb3J0IGNvbnN0IGNvbmNhdCAgICAgICAgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLmNvbmNhdDtcbmV4cG9ydCBjb25zdCBjb250YWlucyAgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5jb250YWlucztcbmV4cG9ydCBjb25zdCBlbmRzV2l0aCAgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5lbmRzV2l0aDtcbmV4cG9ydCBjb25zdCBpbmRleE9mICAgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mO1xuZXhwb3J0IGNvbnN0IGxhc3RJbmRleE9mICAgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLmxhc3RJbmRleE9mO1xuZXhwb3J0IGNvbnN0IGxvY2FsZUNvbXBhcmUgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLmxvY2FsZUNvbXBhcmU7XG5leHBvcnQgY29uc3QgbWF0Y2ggICAgICAgICAgICAgICA9IFN0cmluZy5wcm90b3R5cGUubWF0Y2g7XG5leHBvcnQgY29uc3Qgbm9ybWFsaXplICAgICAgICAgICA9IFN0cmluZy5wcm90b3R5cGUubm9ybWFsaXplO1xuZXhwb3J0IGNvbnN0IHF1b3RlICAgICAgICAgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLnF1b3RlO1xuZXhwb3J0IGNvbnN0IHJlcGVhdCAgICAgICAgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLnJlcGVhdDtcbmV4cG9ydCBjb25zdCByZXBsYWNlICAgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuZXhwb3J0IGNvbnN0IHNlYXJjaCAgICAgICAgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLnNlYXJjaDtcbmV4cG9ydCBjb25zdCBzbGljZSAgICAgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5zbGljZTtcbmV4cG9ydCBjb25zdCBzcGxpdCAgICAgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5zcGxpdDtcbmV4cG9ydCBjb25zdCBzdGFydHNXaXRoICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoO1xuZXhwb3J0IGNvbnN0IHN1YnN0ciAgICAgICAgICAgICAgPSBTdHJpbmcucHJvdG90eXBlLnN1YnN0cjtcbmV4cG9ydCBjb25zdCBzdWJzdHJpbmcgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHJpbmc7XG5leHBvcnQgY29uc3QgdG9Mb2NhbGVMb3dlckNhc2UgICA9IFN0cmluZy5wcm90b3R5cGUudG9Mb2NhbGVMb3dlckNhc2U7XG5leHBvcnQgY29uc3QgdG9Mb2NhbGVVcHBlckNhc2UgICA9IFN0cmluZy5wcm90b3R5cGUudG9Mb2NhbGVVcHBlckNhc2U7XG5leHBvcnQgY29uc3QgdG9Mb3dlckNhc2UgICAgICAgICA9IFN0cmluZy5wcm90b3R5cGUudG9Mb3dlckNhc2U7XG5leHBvcnQgY29uc3QgdG9Tb3VyY2UgICAgICAgICAgICA9IFN0cmluZy5wcm90b3R5cGUudG9Tb3VyY2U7XG5leHBvcnQgY29uc3QgdG9TdHJpbmcgICAgICAgICAgICA9IFN0cmluZy5wcm90b3R5cGUudG9TdHJpbmc7XG5leHBvcnQgY29uc3QgdG9VcHBlckNhc2UgICAgICAgICA9IFN0cmluZy5wcm90b3R5cGUudG9VcHBlckNhc2U7XG5leHBvcnQgY29uc3QgdHJpbSAgICAgICAgICAgICAgICA9IFN0cmluZy5wcm90b3R5cGUudHJpbTtcbmV4cG9ydCBjb25zdCB0cmltTGVmdCAgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS50cmltTGVmdDtcbmV4cG9ydCBjb25zdCB0cmltUmlnaHQgICAgICAgICAgID0gU3RyaW5nLnByb3RvdHlwZS50cmltUmlnaHQ7XG5leHBvcnQgY29uc3QgdmFsdWVPZiAgICAgICAgICAgICA9IFN0cmluZy5wcm90b3R5cGUudmFsdWVPZjtcblxuZXhwb3J0IGRlZmF1bHRcbntcbiAgICBjaGFyQXQsXG4gICAgY2hhckNvZGVBdCxcbiAgICBjb2RlUG9pbnRBdCxcbiAgICBjb25jYXQsXG4gICAgY29udGFpbnMsXG4gICAgZW5kc1dpdGgsXG4gICAgaW5kZXhPZixcbiAgICBsYXN0SW5kZXhPZixcbiAgICBsb2NhbGVDb21wYXJlLFxuICAgIG1hdGNoLFxuICAgIG5vcm1hbGl6ZSxcbiAgICBxdW90ZSxcbiAgICByZXBlYXQsXG4gICAgcmVwbGFjZSxcbiAgICBzZWFyY2gsXG4gICAgc2xpY2UsXG4gICAgc3BsaXQsXG4gICAgc3RhcnRzV2l0aCxcbiAgICBzdWJzdHIsXG4gICAgc3Vic3RyaW5nLFxuICAgIHRvTG9jYWxlTG93ZXJDYXNlLFxuICAgIHRvTG9jYWxlVXBwZXJDYXNlLFxuICAgIHRvTG93ZXJDYXNlLFxuICAgIHRvU291cmNlLFxuICAgIHRvU3RyaW5nLFxuICAgIHRvVXBwZXJDYXNlLFxuICAgIHRyaW0sXG4gICAgdHJpbUxlZnQsXG4gICAgdHJpbVJpZ2h0LFxuICAgIHZhbHVlT2Zcbn07XG4iLCJleHBvcnQgZGVmYXVsdFxue1xuICAgICdbb2JqZWN0IE51bWJlcl0nICAgOiAnbnVtYmVyJyxcbiAgICAnW29iamVjdCBTdHJpbmddJyAgIDogJ3N0cmluZycsXG4gICAgJ1tvYmplY3QgRnVuY3Rpb25dJyA6ICdmdW5jdGlvbicsXG4gICAgJ1tvYmplY3QgQXJyYXldJyAgICA6ICdhcnJheScsXG4gICAgJ1tvYmplY3QgRGF0ZV0nICAgICA6ICdkYXRlJyxcbiAgICAnW29iamVjdCBSZWdFeHBdJyAgIDogJ3JlZ0V4cCcsXG4gICAgJ1tvYmplY3QgRXJyb3JdJyAgICA6ICdlcnJvcicsXG4gICAgJ1tvYmplY3QgUHJvbWlzZV0nICA6ICdwcm9taXNlJyxcbiAgICAnW29iamVjdCBNaWNyb2JlXScgIDogJ21pY3JvYmUnXG59O1xuIl19
