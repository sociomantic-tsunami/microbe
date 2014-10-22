!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.µ=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Microbe = require( './core/' );
    require( './core/init' )( Microbe );
require( './dom/' )( Microbe );
require( './http/' )( Microbe );

module.exports = Microbe;

},{"./core/":9,"./core/init":10,"./dom/":11,"./http/":13}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

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
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = require('./lib/core.js')
require('./lib/done.js')
require('./lib/es6-extensions.js')
require('./lib/node-extensions.js')
},{"./lib/core.js":4,"./lib/done.js":5,"./lib/es6-extensions.js":6,"./lib/node-extensions.js":7}],4:[function(require,module,exports){
'use strict';

var asap = require('asap')

module.exports = Promise;
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new self.constructor(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    asap(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          doResolve(then.bind(newValue), resolve, reject)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject(e) }
  }

  function reject(newValue) {
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  doResolve(fn, resolve, reject)
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

},{"asap":8}],5:[function(require,module,exports){
'use strict';

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    asap(function () {
      throw err
    })
  })
}
},{"./core.js":4,"asap":8}],6:[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Promise.prototype

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.resolve = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    })
  });
}

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
}

},{"./core.js":4,"asap":8}],7:[function(require,module,exports){
'use strict';

//This file contains then/promise specific extensions that are only useful for node.js interop

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop()
      }
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      fn.apply(self, args)
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    var ctx = this
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        asap(function () {
          callback.call(ctx, ex)
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value)
    })
  }, function (err) {
    asap(function () {
      callback.call(ctx, err)
    })
  })
}

},{"./core.js":4,"asap":8}],8:[function(require,module,exports){
(function (process){

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// linked list of tasks (single, with head node)
var head = {task: void 0, next: null};
var tail = head;
var flushing = false;
var requestFlush = void 0;
var isNodeJS = false;

function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;
        var domain = head.domain;

        if (domain) {
            head.domain = void 0;
            domain.enter();
        }

        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function() {
                   throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    flushing = false;
}

if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.
    isNodeJS = true;

    requestFlush = function () {
        process.nextTick(flush);
    };

} else if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        requestFlush = setImmediate.bind(window, flush);
    } else {
        requestFlush = function () {
            setImmediate(flush);
        };
    }

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    requestFlush = function () {
        channel.port2.postMessage(0);
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null
    };

    if (!flushing) {
        flushing = true;
        requestFlush();
    }
};

module.exports = asap;


}).call(this,require('_process'))
},{"_process":2}],9:[function(require,module,exports){
/**
 * microbe.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
'use strict';

var Arrays      = require( '../utils/array' );
var Strings     = require( '../utils/string' );
var Types       = require( '../utils/types' );

var slice       = Arrays.slice;
var splice      = Arrays.splice;
var push        = Arrays.push;
var forEach     = Arrays.forEach;
var map         = Arrays.map;
var indexOf     = Arrays.indexOf;
var toString    = Strings.toString;
var _type       = '[object Microbe]';

/**
 * µ constructor
 *
 * builds the µ object
 *
 * @return µ
 */
var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};

function isIterable( obj )
{
    var length  = obj.length;
    var type    = Microbe.type( obj );

    if ( type === 'function' || obj === window )
    {
        return false;
    }

    if ( obj.nodeType === 1 && length )
    {
        return true;
    }

    return type === 'array' || length === 0 ||
        ( typeof length === 'number' && length > 0 && ( length - 1 ) in obj );
}


Microbe.core = Microbe.prototype =
{
    version : '0.1.0',

    constructor : Microbe,

    selector : '',

    length : 0,


    /**
     * Add Class
     *
     * Method adds the given class from the current object or the given element.
     *
     * @param   _class      string       class to add
     * @param   _el         HTMLELement  element to modify (optional)
     *
     * @return  Microbe
    */
    addClass : (function()
    {
        var _addClass = function( _class, _el )
        {
            var i, len;
            for ( i = 0, len = _class.length; i < len; i++ )
            {
                _el.classList.add( _class[i] );
            }
        };

        return function( _class, _el )
        {
            if ( typeof _class === 'string' )
            {
                _class = [ _class ];
            }

            if ( _el )
            {
                _addClass( _class, _el );
                return this;
            }

            var i, len;
            for ( i = 0, len = this.length; i < len; i++ )
            {
                _addClass( _class, this[i] );
            }

            return this;
        };
    }()),


    /**
     * Append Element
     *
     * @param  {[type]} _ele    [description]
     * @param  {[type]} _parent [description]
     * @return {[type]}         [description]
     */
    append : (function()
    {
        var _append = function( _el, _parentEl, _elm )
        {
            if ( _elm )
            {
                _parentEl.appendChild( _elm );
            }
            else
            {
                _parentEl.appendChild( _el );
            }
        };

        return function( _el, _parent )
        {
            if ( _parent )
            {
                _append( _el, _parent );
            }

            if ( !_el.length )
            {
                _el = [ _el ];
            }

            var i, j, leni, lenj;
            for ( i = 0, leni = this.length; i < leni; i++ )
            {
                for ( j = 0, lenj = _el.length; j < lenj; j++ )
                {
                    if ( i !== 0 )
                    {
                        _append( _el, this[ i ], _el[ j ].cloneNode(true) );
                    }
                    else
                    {
                        _append( _el, this[ i ], _el[ j ] );
                    }
                }
            }

            return this;
        };
    }()),


     /**
     * Alter/Get Attribute
     *
     * Changes the attribute by writing the given property and value to the
     * supplied elements. (properties should be supplied in javascript format).
     * If the value is omitted, simply returns the current attribute value  of the
     * element.
     *
     * @param   _attribute  string           JS formatted CSS property
     * @param   _el         HTMLELement      element to modify (optional)
     * @param   _value      string           CSS value (optional)
     *
     * @return  mixed ( Microbe or string or array of strings)
    */
    attr : function ( _attribute, _value, _el)
    {
        var _setAttr;
        var _getAttr;
        var _removeAttr;

        _setAttr = function( _elm )
        {
            if ( _value === null )
            {
                _removeAttr( _elm );
            }
            else
            {
                if ( !_elm.getAttribute )
                {
                    _elm[ _attribute ] = _value;
                }
                else
                {
                    _elm.setAttribute( _attribute, _value );
                }
            }
        };

        _getAttr = function( _elm )
        {
            if ( _elm.getAttribute( _attribute ) === null )
            {
                return _elm[ _attribute ];
            }
            return _elm.getAttribute( _attribute );
        };

        _removeAttr = function( _elm )
        {
            if ( _elm.getAttribute( _attribute ) === null )
            {
                delete _elm[ _attribute ];
            }
            else
            {
                _elm.removeAttribute( _attribute );
            }
        };

        if ( _value !== undefined )
        {
            if ( _el )
            {
                _setAttr( _el );
                return this;
            }

            var i, len;
            for ( i = 0, len = this.length; i < len; i++ )
            {
                _setAttr( this[ i ] );
            }

            return this;
        }

        var j, lenj;
        var attributes = new Array( this.length );
        for ( j = 0, lenj = this.length; j < lenj; j++ )
        {
            attributes[ j ] = _getAttr( this[ j ] );
        }

        if ( attributes.length === 1 )
        {
            return attributes[0];
        }

        return attributes;
    },


     /**
     * Bind Events
     *
     * Methods binds an event to the HTMLElements of the current object or to the
     * given element.
     *
     * @param   _event      string          HTMLEvent
     * @param   _callback   function        callback function
     * @param   _el         HTMLELement     element to modify (optional)
     *
     * @return  Microbe
    */
    bind : function ( _event, _callback, _el )
    {
        var _bind = function( _elm )
        {
            _elm.addEventListener( _event, _callback );
        };

        if ( _el )
        {
            _bind( _el );
            return this;
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _bind( this[ i ] );
        }

        return this;
    },


    /**
     * Get Children
     *
     * gets an array or all the given element's children
     *
     * @param  {[type]} _el [description]
     * @return {[type]}     [description]
     */
    children : function( _el )
    {
        var _children = function( _elm )
        {
            return _elm.children;
        };

        var i, len, childrenArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            childrenArray[ i ] = _children( this[ i ] );
        }

        if ( childrenArray.length === 1 )
        {
            return childrenArray[0];
        }

        return childrenArray;
    },


    /**
     * Create Element
     *
     * Method creates a Microbe from an element or a new element of the passed string, and
     * returns the Microbe
     *
     * @param   _el                 HTMLELement         element to create
     *
     * @return  Microbe
    */
    create : function ( _el )
    {
        var selectorRegex   = /(?:[\s]*\.([\w-_\.]*)|#([\w-_]*)|([^#\.<][\w-_]*)|(<[\w-_#\.]*>))/g,
            resultsRegex    = _el.match( selectorRegex ),
            _id, _tag, _class, _selector = '';

        var i, lenI;
        for ( i = 0, lenI = resultsRegex.length; i < lenI; i++ )
        {
            var trigger = resultsRegex[ i ][ 0 ];
            switch ( trigger )
            {
                case '#':
                    _id      = resultsRegex[ i ];
                    break;

                case '.':
                    _class   = resultsRegex[ i ];
                    break;

                default:
                    _tag     = resultsRegex[ i ];
                    break;
            }
        }

        if ( typeof _tag === 'string' )
        {
            _el = document.createElement( _tag );
            _selector = _tag;

            if ( _id )
            {
                _selector += _id;
                _el.id = _id.slice( 1 );
            }

            if ( _class )
            {
                _selector += _class;
                _class = _class.split( '.' );

                for ( i = 1, lenI = _class.length; i < lenI; i++ )
                {
                    _el.classList.add( _class[ i ] );
                }
            }

        }

        return new Microbe( _selector, undefined, _el );
    },


    /**
     * Alter/Get CSS
     *
     * Changes the CSS by writing the given property and value inline to the
     * supplied elements. (properties should be supplied in javascript format).
     * If the value is omitted, simply returns the current css value of the element.
     *
     * @param   _property   string          CSS property
     * @param   _el         HTMLELement     element to modify (optional)
     * @param   _value      string          CSS value (optional)
     *
     * @return  mixed ( Microbe or string or array of strings)
    */
    css : function ( _property, _value, _el)
    {
        var _setCss = function( _elm )
        {
            _elm.style[ _property ] = _value;
        };

        var _getCss = function( _elm )
        {
            return window.getComputedStyle( _elm ).getPropertyValue( _property );
        };

        if ( _value)
        {
            if ( _el )
            {
                _setCss( _el );
                return this;
            }

            var i, len;
            for ( i = 0, len = this.length; i < len; i++ )
            {
                _setCss( this[ i ] );
            }

            return this;
        }
        var j, lenj, styles = new Array( this.length );
        for ( j = 0, lenj = this.length; j < lenj; j++ )
        {
            styles[ j ] = _getCss( this[ j ] );
        }
        if ( styles.length === 1 )
        {
            return styles[0];
        }

        return styles;
    },


    /**
     * For each
     *
     * Methods iterates through all the elements an execute the function on each of
     * them
     *
     * @return  Array
    */
    each : function( _callback )
    {
        var i, leni;
        for ( i = 0, leni = this.length; i < leni; i++ )
        {
            _callback( this[ i ], i );
        }
        return this;
    },

// UNTESTED
    // eachExp : function( callback )
    // {
    //     return forEach.call( this, callback );
    // },


    /**
     * Get First Element
     *
     * Methods gets the first HTML Elements of the current object, and wrap it in
     * Microbe for chaining purpose.
     *
     * @return  Microbe
     */
    first : function ()
    {
        if ( this.length === 1 )
        {
            return this;
        }

        return new Microbe( [ this[ 0 ] ] );
    },


    /**
     * Get value
     *
     * gets the element in the appropriate index
     *
     * @param  {element object or array} _el object to find the index of (optional)
     * @return {array}                       array of indexes
     */
    get : function( index )
    {
        if ( index === null || index === undefined )
        {
            return slice.call( this );
        }
        var i = +index;

        if ( index < 0 )
        {
            i += this.length;
        }

        return this[i];
    },


    /**
     * Get Parent Index
     *
     * gets the index of the item in it's parentNode's children array
     *
     * @param  {element object or array} _el object to find the index of (optional)
     * @return {array}                       array of indexes
     */
    getParentIndex : function( _el )
    {
        var _getParentIndex = function( _elm )
        {
            return Array.prototype.indexOf.call( _elm.parentNode.children, _elm );
        };

        if ( _el )
        {
            return _getParentIndex( _el );
        }

        var i, len, indexes = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            indexes[ i ] = _getParentIndex( this[ i ] );
        }

        return indexes;
    },


    /**
     * Has Class
     *
     * Method checks if the current object or the given element has the given class
     *
     * @param   _class      string       class to check
     * @param   _el         HTMLELement  element to modify (optional)
     *
     * @return  Microbe
    */
    hasClass : function( _class, _el )
    {
        var _hasClass = function( _elm )
        {
            return _elm.classList.contains( _class );
        };

        if ( _el )
        {
            return _hasClass( _el );
        }

        var i, len, results = new Array( this.length );
        for ( i = 0, len = this.length; i < len; i++ )
        {
            results[ i ] = _hasClass( this[ i ] );
        }

        return results;
    },


    /**
     * Alter/Get inner HTML
     *
     * Changes the innerHtml to the supplied string.
     * If the value is omitted, simply returns the current inner html value of the element.
     *
     * @param   _value      string          html value (optional)
     * @param   _el         HTMLELement     element to modify (optional)
     *
     * @return  mixed ( Microbe or string or array of strings)
    */
    html : function ( _value, _el)
    {
        var _setHtml = function( _elm )
        {
            _elm.innerHTML = _value;
        };

        var _getHtml = function( _elm )
        {
            return _elm.innerHTML;
        };

        if ( _value || _value === '' )
        {
            if ( _el )
            {
                _setHtml( _el );
                return this;
            }

            var i, len;
            for ( i = 0, len = this.length; i < len; i++ )
            {
                _setHtml( this[ i ] );
            }

            return this;
        }

        var j, lenj, markup = new Array( this.length );
        for ( j = 0, lenj = this.length; j < lenj; j++ )
        {
            markup[ j ] = _getHtml( this[ j ] );
        }

        if ( markup.length === 1 )
        {
            return markup[0];
        }
        return markup;
    },


    /**
     * Index of
     *
     *
     *
     * @return {void}
     */
    indexOf : function( _el )
    {
        return this.toArray().indexOf( _el );
    },


    /**
     * Insert After
     *
     * Inserts the given element after each of the elements given (or passed through this).
     * if it is an elemnet it is wrapped in a microbe object.  if it is a string it is created
     *
     * @example µ( '.elementsInDom' ).insertAfter( µElementToInsert )
     *
     * @param  {object or string} _elAfter element to insert
     * @param  {object} _el      element to insert after (optional)
     *
     * @return Microbe
     */
    insertAfter : function( _elAfter, _el )
    {
        var _this = this;

        var _insertAfter = function( _elm )
        {
            var nextIndex;

            nextIndex = _this.getParentIndex( _elm );

            var nextEle   = _elm.parentNode.children[ nextIndex + 1 ];

            for ( var i = 0, lenI = _elAfter.length; i < lenI; i++ )
            {
                if ( nextEle )
                {
                    nextEle.parentNode.insertBefore( _elAfter[ i ].cloneNode( true ), nextEle );
                }
                else
                {
                    _elm.parentNode.appendChild( _elAfter[ i ].cloneNode( true ) );
                }
            }
        };

        if ( _el )
        {
            _insertAfter( _el );
            return this;
        }

        if ( typeof _elAfter === 'string' )
        {
            _elAfter = new Microbe( _elAfter );
        }
        else if ( ! _elAfter.length )
        {
            _elAfter = [ _elAfter ];
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _insertAfter( this[ i ] );
        }

        return this;
    },


    /**
     * Get Last Element
     *
     * Methods gets the last HTML Elements of the current object, and wrap it in
     * Microbe for chaining purpose.
     *
     * @return  Microbe
     */
    last : function ()
    {
        if ( this.length === 1 )
        {
            return this;
        }

        return new Microbe( [ this[ this.length - 1 ] ] );
    },


    map : function( callback )
    {
        return map.call( this, callback );
    },


    /**
     * Get Parent
     *
     * sets all elements in µ to their parent nodes
     *
     * @param  {[type]} _el [description]
     * @return {[type]}     [description]
     */
    parent : function( _el )
    {
        var _parent = function( _elm )
        {
            return _elm.parentNode;
        };

        var i, len, parentArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            parentArray[ i ] = _parent( this[ i ] );
        }

        return new Microbe( parentArray );
    },


    /**
     * Remove Element
     *
     * removes an element or elements from the dom
     *
     * @param  {[type]} _el [description]
     * @return {[type]}     [description]
     */
    remove : function( _el )
    {
        var _remove = function( _elm )
        {
            return _elm.parentNode.removeChild( _elm );
        };

        if ( _el )
        {
            _remove( _el );
        }

        var i, len;

        for ( i = 0, len = this.length; i < len; i++ )
        {
            _remove( this[ i ] );
        }

        return this;
    },


    /**
     * Remove Class
     *
     * Method removes the given class from the current object or the given element.
     *
     * @param   {str}               _class              class to remove
     * @param   {ele}               _el                 element to modify (optional)
     *
     * @return  Microbe
    */
    removeClass : (function()
    {
        var _removeClass = function( _class, _el )
        {
            _el.classList.remove( _class );
        };

        return function( _class, _el )
        {
            if ( _el )
            {
                _removeClass( _class, _el );
                return this;
            }

            var i, len;
            for ( i = 0, len = this.length; i < len; i++ )
            {
                _removeClass( _class, this[ i ] );
            }

            return this;
        };
    }()),


    splice : splice,


    /**
     * Alter/Get inner Text
     *
     * Changes the inner text to the supplied string.
     * If the value is
     * If the value is omitted, simply returns the current inner html value of the element.
     *
     * @param   _value      string          Text value (optional)
     * @param   _el         HTMLELement     element to modify (optional)
     *
     * @return  mixed ( Microbe or string or array of strings)
    */
    text : (function()
    {
        var _setText = function( _value, _el )
        {
            if( document.all )
            {
                _el.innerText = _value;
            }
            else // stupid FF
            {
                _el.textContent = _value;
            }
        };

        var _getText = function( _el )
        {
            if( document.all )
            {
                return _el.innerText;
            }
            else // stupid FF
            {
                return _el.textContent;
            }
        };
        return function( _value, _el )
        {
            if ( _value )
            {
                if ( _el )
                {
                    _setText( _value, _el );
                    return this;
                }

                var i, len;
                for ( i = 0, len = this.length; i < len; i++ )
                {
                    _setText( _value, this[ i ] );
                }

                return this;
            }

            var j, lenj, arrayText = new Array( this.length );
            for ( j = 0, lenj = this.length; j < lenj; j++ )
            {
                arrayText[ j ] = _getText( this[ j ] );
            }

            if ( arrayText.length === 1 )
            {
                return arrayText[0];
            }

            return arrayText;
        };
    }()),


    /**
     * To array
     *
     * Methods returns all the elements in an array.
     *
     * @return  Array
    */
    toArray : function( _el )
    {
        _el = _el || this;

        return Array.prototype.slice.call( _el );
    },

// UNTESTED
    // toArrayExp : function()
    // {
    //     return slice.call( this );
    // },


    /**
     * Toggle Class
     *
     * Methods calls removeClass or removeClass from the current object or given
     * element.
     *
     * @param   _class      string       class to add
     * @param   _el         HTMLELement  element to modify (optional)
     *
     * @return  Microbe
    */
    toggleClass : (function()
    {
        var _toggleClass = function( _class, _el )
        {
            if ( _el.classList.contains( _class ) )
            {
                _el.classList.remove( _class );
            }
            else
            {
                _el.classList.add( _class );
            }
        };
        return function( _class, _el )
        {
            if ( _el )
            {
                _toggleClass( _el );
                return this;
            }

            var i, len;
            for ( i = 0, len = this.length; i < len; i++ )
            {
                _toggleClass( _class, this[ i ] );
            }

            return this;
        };
    }()),


    /**
     * To String
     *
     * Methods returns the type of Microbe.
     *
     * @return  string
    */
    toString : function()
    {
        return _type;
    },


     /**
     * Unbind Events
     *
     * Methods binds an event to the HTMLElements of the current object or to the
     * given element.
     *
     * @param   _event      string          HTMLEvent
     * @param   _callback   function        callback function
     * @param   _el         HTMLELement     element to modify (optional)
     *
     * @return  Microbe
    */
    unbind : function( _event, _callback, _el )
    {
        if ( _el )
        {
            _el.removeEventListener( _event, _callback );
            return this;
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            this[ i ].removeEventListener( _event, _callback );
        }

        return this;
    }
};

Microbe.extend = Microbe.core.extend = function()
{
    var args    = slice.call( arguments );
    var index   = 0;
    var length  = args.length;
    var deep    = false;
    var isArray;
    var target;
    var options;
    var src;
    var copy;
    var clone;

    if ( args[index] === true )
    {
        deep    = true;
        index   += 1;
    }

    target = Microbe.isObject( args[index] ) ? args[index] : {};

    for ( ; index < length; index++ )
    {
        if ( ( options = args[index] ) !== null )
        {
            for ( var name in options )
            {
                isArray = false;
                src     = target[name];
                copy    = options[name];

                if ( target === copy || copy === undefined )
                {
                    continue;
                }

                if ( deep && copy && Microbe.isObject( copy ) )
                {
                    if ( Microbe.isArray( copy ) )
                    {
                        clone = src && Microbe.isArray( src ) ? src : [];
                    }
                    else
                    {
                        clone = src && Microbe.isObject( src ) ? src : {};
                    }

                    target[name] = Microbe.extend( deep, clone, copy );
                }

                target[name] = copy;
            }
        }
    }

    return target;
};


Microbe.identity = function( value ) { return value; };


Microbe.isFunction = function( obj )
{
    return Microbe.type(obj) === "function";
};


Microbe.isArray = Array.isArray;


Microbe.isWindow = function( obj )
{
    return obj !== null && obj === obj.window;
};


Microbe.isObject = function( obj )
{
    if ( Microbe.type( obj ) !== "object" || obj.nodeType || Microbe.isWindow( obj ) )
    {
        return false;
    }

    return true;
};


Microbe.isEmpty = function( obj )
{
    var name;
    for ( name in obj )
    {
        return false;
    }

    return true;
};


Microbe.merge = Microbe.core.merge  = function( first, second )
{
    var i = first.length;

    for ( var j = 0, length = second.length; j < length; j++ )
    {
        first[ i++ ] = second[ j ];
    }

    first.length = i;

    return first;
};


Microbe.noop = function() {};

Microbe.toString = Microbe.core.toString = function()
{
    return _type;
};

Microbe.type = function( obj )
{
    if ( obj === null )
    {
        return obj + '';
    }

    return typeof obj === 'object' ?
        Types[ obj.toString() ] || 'object' :
        typeof obj;
};

module.exports = Microbe;

},{"../utils/array":14,"../utils/string":15,"../utils/types":16}],10:[function(require,module,exports){
module.exports = function( Microbe )
{
    var trigger, _shortSelector, selectorRegex   = /(?:[\s]*\.([\w-_\.]*)|#([\w-_]*)|([^#\.<][\w-_]*)|(<[\w-_#\.]*>))/g;

    /**
     * Build
     *
     * builds and returns the final microbe
     *
     * @param  {[type]} _elements [description]
     * @param  {[type]} _selector [description]
     *
     * @return {[type]}           [description]
     */
    function _build( _elements, _selector )
    {
        var i = 0, lenI = _elements.length;

        for ( ; i < lenI; i++ )
        {
            this[ i ] = _elements[ i ];
        }

        this.selector    = _selector;
        this.length      = i;

        return this;
    }


    /**
     * Contains
     *
     * checks if a given element is a child of _scope
     *
     * @param  {[type]} _el        [description]
     * @param  {[type]} _scope     [description]
     *
     * @return {[type]}            [description]
     */
    function _contains( _el, _scope )
    {
        var parent = _el.parentNode;

        while ( parent !== document && parent !== _scope )
        {
            parent = parent.parentNode || _scope.parentNode;
        }

        if ( parent === document )
        {
            return false;
        }

        return true;
    }


    /**
     * Get Selector
     *
     * returns the css selector from an element
     *
     * @param  {DOM Element}        _el         DOM element
     *
     * @return {string}                         css selector
     */
    function _getSelector( _el )
    {
        if ( _el.nodeType === 1 )
        {
            var tag     = _el.tagName.toLowerCase(),
                id      = ( _el.id ) ? '#' + _el.id : '',
                clss   = ( _el.className.length > 0 ) ? '.' + _el.className : '';
            clss = clss.replace( ' ', '.' );

            return tag + id + clss;
        }
        else
        {
            return 'fromArray';
        }
    }


    /**
     * Class Microbe
     *
     * Constructor.
     * Either selects or creates an HTML element and wraps in into an Microbe instance.
     * Usage:   µ('div#test')   ---> selection
     *          µ('<div#test>') ---> creation
     *
     * @param   _selector   string or HTMLElement   HTML selector
     * @param   _scope      HTMLElement             scope to look inside
     * @param   _elements   HTMLElement(s)          elements to fill Microbe with (optional)
     *
     * @return  Microbe
    */
    Microbe.core.__init__ =  function( _selector, _scope, _elements )
    {
        if ( _selector.nodeType === 1 || Object.prototype.toString.call( _selector ) === '[object Array]' )
        {
            _elements = _selector;
            _selector = ( _elements.length ) ? 'fromArray' : _getSelector( _elements );
        }

        _scope = _scope === undefined ?  document : _scope;
        var scopeNodeType   = _scope.nodeType,
            nodeType        = ( _selector ) ? _selector.nodeType || typeof _selector : null;

        if ( !( this instanceof Microbe.core.__init__ ) )
        {
            return new Microbe.core.__init__( _selector, _scope, _elements );
        }

        if ( ( !_selector || typeof _selector !== 'string' ) ||
             ( scopeNodeType !== 1 && scopeNodeType !== 9 ) )
        {
            return _build.call( this, [], _selector );
        }

        if ( _elements )
        {
            if ( Object.prototype.toString.call( _elements ) === '[object Array]' )
            {
                return _build.call( this, _elements, _selector );
            }
            else
            {
                return _build.call( this, [ _elements ], _selector );
            }
        }
        else
        {
            var resultsRegex = _selector.match( selectorRegex );

            if ( resultsRegex && resultsRegex.length === 1 )
            {
                trigger = resultsRegex[0][0];
                _shortSelector = _selector.slice( 1 );

                if ( trigger === '<' )
                {
                    return Microbe.core.create( _selector.substring( 1, _selector.length - 1 ) );
                }
                else if ( trigger === '.' )
                {
                    var _classesCount   = ( _selector || '' ).slice( 1 ).split( '.' ).length;

                    if ( _classesCount === 1 )
                    {
                        return _build.call( this, _scope.getElementsByClassName( _shortSelector ), _selector );
                    }
                }
                else if ( trigger === '#' )
                {
                    var _id = document.getElementById( _shortSelector );

                    if ( ! _id )
                    {
                        return _build.call( this, [], _selector );
                    }

                    if ( scopeNodeType === 9 )
                    {
                        if ( _id.parentNode && ( _id.id === _selector ) )
                        {
                            return _build.call( this, [ _id ], _selector );
                        }
                    }
                    else // scope not document
                    {
                        if ( _scope.ownerDocument && _contains( _id, _scope ) )
                        {
                            return _build.call( this, [ _id ], _selector );
                        }
                    }
                }
                else // if ( _tagSelector ) // && ! _idSelector && ! _classSelector )
                {
                    return _build.call( this, _scope.getElementsByTagName( _selector ), _selector );
                }
            }
        }
        return _build.call( this, _scope.querySelectorAll( _selector ), _selector );
    };

    Microbe.core.__init__.prototype = Microbe.core;
};

},{}],11:[function(require,module,exports){
module.exports = function( Microbe )
{
    Microbe.ready = require( './ready' );
};

},{"./ready":12}],12:[function(require,module,exports){
module.exports = function( _callback )
{
    /* Mozilla, Chrome, Opera */
    if ( document.addEventListener )
    {
        document.addEventListener( 'DOMContentLoaded', _callback, false );
    }
    /* Safari, iCab, Konqueror */
    if ( /KHTML|WebKit|iCab/i.test( navigator.userAgent ) )
    {
        var DOMLoadTimer = setInterval(function ()
        {
            if ( /loaded|complete/i.test( document.readyState ) )
            {
                _callback();
                clearInterval( DOMLoadTimer );
            }
        }, 10);
    }
    /* Other web browsers */
    window.onload = _callback;
};

},{}],13:[function(require,module,exports){
module.exports = function( Microbe )
{
    var Promise = require( 'promise' );

    /**
     * microbe.http.js
     *
     * @author  Mouse Braun         <mouse@sociomantic.com>
     * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
     *
     * @package Microbe
     */
    Microbe.http = function( _parameters )
    {
        var fail,
            req, method, url, data, user, password, headers, async;

        if ( !_parameters )
        {
            return new Error( 'No parameters given' );
        }
        else
        {
            if ( typeof _parameters === 'string' )
            {
                _parameters = { url: _parameters };
            }

            req         = new XMLHttpRequest();
            method      = _parameters.method || 'GET';
            url         = _parameters.url;
            data        = JSON.stringify( _parameters.data ) || null;
            user        = _parameters.user || '';
            password    = _parameters.password || '';
            headers     = _parameters.headers  || null;
            async       = typeof _parameters.async === "boolean" ?
                                _parameters.async : true;

            req.onreadystatechange = function()
            {
                if ( req.readyState === 4 )
                {
                    return req;
                }
            };
        }

        req.open( method, url, async, user, password );

        if ( headers )
        {
            if ( Array.isArray( headers ) )
            {
                for ( var i = 0, len = headers.length; i < len; i++ )
                {
                    req.setRequestHeader( headers[i].header, headers[i].value );
                }
            }
            else
            {
                req.setRequestHeader( headers.header, headers.value );
            }
        }

        if ( async )
        {
            return new Promise( function( resolve, reject )
            {
                req.onerror = function()
                {
                    reject( new Error( 'Network error!' ) );
                };

                req.send( data );
                req.onload = function()
                {
                    if ( req.status === 200 )
                    {
                        resolve( req.response );
                    }
                    else
                    {
                        reject( new Error( req.status ) );
                    }
                };

            });
        }
        else
        {
            var _response = function( _val )
            {
                var _responses =
                {
                    then: function( _cb )
                    {
                        if ( _val.status === 200 )
                        {
                            _cb( _val.responseText );
                        }
                        return _responses;
                    },
                    catch: function( _cb )
                    {
                        if ( _val.status !== 200 )
                        {
                            _cb({
                                status      : _val.status,
                                statusText  : _val.statusText
                            });
                        }
                        return _responses;
                    }
                };
                return _responses;
            };

            req.send( data );
            req.onloadend = function()
            {
                req.onreadystatechange();
                return _response( req );
            };
            return req.onloadend();
        }
    };

    Microbe.http.get = function( _url )
    {
        return this({
            url     : _url,
            method  : 'GET'
        });
    };

    Microbe.http.post = function( _url, _data )
    {
        return this({
            url     : _url,
            data    : _data,
            method  : 'POST'
        });
    };
};

},{"promise":3}],14:[function(require,module,exports){
module.exports =
{
    fill            : Array.prototype.fill,
    pop             : Array.prototype.pop,
    push            : Array.prototype.push,
    reverse         : Array.prototype.reverse,
    shift           : Array.prototype.shift,
    sort            : Array.prototype.sort,
    splice          : Array.prototype.splice,
    unshift         : Array.prototype.unshift,
    concat          : Array.prototype.concat,
    join            : Array.prototype.join,
    slice           : Array.prototype.slice,
    toSource        : Array.prototype.toSource,
    toString        : Array.prototype.toString,
    toLocaleString  : Array.prototype.toLocaleString,
    indexOf         : Array.prototype.indexOf,
    lastIndexOf     : Array.prototype.lastIndexOf,
    forEach         : Array.prototype.forEach,
    entries         : Array.prototype.entries,
    every           : Array.prototype.every,
    some            : Array.prototype.some,
    filter          : Array.prototype.filter,
    find            : Array.prototype.find,
    findIndex       : Array.prototype.findIndex,
    keys            : Array.prototype.keys,
    map             : Array.prototype.map,
    reduce          : Array.prototype.reduce,
    reduceRight     : Array.prototype.reduceRight,
    copyWithin      : Array.prototype.copyWithin
};

},{}],15:[function(require,module,exports){
module.exports =
{
    charAt              : String.prototype.charAt,
    charCodeAt          : String.prototype.charCodeAt,
    codePointAt         : String.prototype.codePointAt,
    concat              : String.prototype.concat,
    contains            : String.prototype.contains,
    endsWith            : String.prototype.endsWith,
    indexOf             : String.prototype.indexOf,
    lastIndexOf         : String.prototype.lastIndexOf,
    localeCompare       : String.prototype.localeCompare,
    match               : String.prototype.match,
    normalize           : String.prototype.normalize,
    quote               : String.prototype.quote,
    repeat              : String.prototype.repeat,
    replace             : String.prototype.replace,
    search              : String.prototype.search,
    slice               : String.prototype.slice,
    split               : String.prototype.split,
    startsWith          : String.prototype.startsWith,
    substr              : String.prototype.substr,
    substring           : String.prototype.substring,
    toLocaleLowerCase   : String.prototype.toLocaleLowerCase,
    toLocaleUpperCase   : String.prototype.toLocaleUpperCase,
    toLowerCase         : String.prototype.toLowerCase,
    toSource            : String.prototype.toSource,
    toString            : String.prototype.toString,
    toUpperCase         : String.prototype.toUpperCase,
    trim                : String.prototype.trim,
    trimLeft            : String.prototype.trimLeft,
    trimRight           : String.prototype.trimRight,
    valueOf             : String.prototype.valueOf
};

},{}],16:[function(require,module,exports){
module.exports =
{
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Object]'   : 'object',
    '[object Error]'    : 'error',
    '[object Promise]'  : 'promise',
    '[object Microbe]'  : 'microbe'
};

},{}]},{},[1])(1)
});