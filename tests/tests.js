(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/* global document, window, µ, $, QUnit, Benchmark  */

/**
 * benchmark tests
 *
 * this function is weird.  it must mix between µ and $ so it can
 * test µ without all modules present
 *
 * @param  {str}                    _str1               test 1 name
 * @param  {func}                   _cb1                test 1
 * @param  {str}                    _str2               test 2 name
 * @param  {func}                   _cb2                test 2
 *
 * @return {void}
 */
var buildTest = function( _str1, _cb1, _str2, _cb2, _console )
{
    this.count = this.count || 0;

    var $Result, µLi, µStrong;

    var suite = new Benchmark.Suite();

    if ( !_console )
    {
        var µTests  = $( '#qunit-tests' ).first().children();

        var resDiv  = µTests[ this.count ];

        µLi      = µ( 'li', resDiv );
        µStrong  = µ( 'strong', resDiv );
        $Result =  $( '<div class="fastest">' );

        resDiv.insertBefore( $Result[ 0 ], µStrong[ 0 ] );
    }

    var startTheTest = function( e )
    {
        if ( e )
        {
            // µ( e.target ).text( 'Speed test started...' );
            $( e.target ).text( 'Speed test started...' );
            e.stopPropagation();
            e.preventDefault();
        }

        if ( $Result )
        {
            $Result.off();
        }

        setTimeout( function()
        {
            suite.run( { 'async': true } );
        }, 1 );
    };

    var setupTest = function()
    {
        var testRes = [];
        var _arr    = [];
        var i       = 0;
        var libraries = [ 'µ', '$' ];

        suite.add( _str1, _cb1 )
            .add( _str2, _cb2 )
            .on( 'cycle', function( event )
            {
                _arr.push( this[ i ].hz );

                if ( !_console )
                {
                    var test = testRes[ i ] = $( '<span class="slow  speed--result">' );
                    $( µLi[ i ] ).append( test );
                    test.html( String( event.target ) );
                }

                i++;
            } )
            .on( 'complete', function()
            {
                var fastest = _arr.indexOf( Math.max.apply( Math, _arr ) );
                var slowest = fastest === 1 ? 0 : 1;
                var percent = ( _arr[ fastest ] /  _arr[ slowest ] * 100 - 100 ).toFixed( 2 );

                if ( !_console )
                {
                    testRes[ fastest ].removeClass( 'slow' );
                    $Result.html( libraries[ fastest ] + ' is ' + percent + '% faster' );
                }
                else
                {
                    console.log( 'function ' + ( fastest + 1 ) + ' is ' + percent + '% faster' );
                    console.log( {
                        raw: _arr,
                        func1: _cb1,
                        func2: _cb2
                    } );
                }
            } );

            if ( _console === true )
            {
                console.log( 'test started' );
                startTheTest();
            }
    };

    if ( !_console )
    {
        if ( typeof _cb1 === 'function' )
        {
            setupTest();

            $Result.html( 'Click to start the speed test' );
            $Result.on( 'click', startTheTest );
        }
        else
        {
            $Result.html( _str1 ).addClass( 'invalid--test' );
        }

        this.count++;
    }
    else
    {
        setupTest();
    }
};

require( './cytoplasm/cytoplasm' )( buildTest );
require( './cytoplasm/pseudo' )( buildTest );
require( './cytoplasm/utils' )( buildTest );
require( './core' )( buildTest );
require( './root' )( buildTest );
require( './http' )( buildTest );
require( './dom' )( buildTest );
require( './events' )( buildTest );
require( './observe' )( buildTest );

window.buildTest = buildTest;
},{"./core":9,"./cytoplasm/cytoplasm":10,"./cytoplasm/pseudo":11,"./cytoplasm/utils":12,"./dom":13,"./events":14,"./http":15,"./observe":16,"./root":17}],2:[function(require,module,exports){
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
      var res = fn.apply(self, args)
      if (res && (typeof res === 'object' || typeof res === 'function') && typeof res.then === 'function') {
        resolve(res)
      }
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
 /* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    var version = '0.4.4';

    var _observables = µ().get ? true : false;

    QUnit.module( 'core.js' );


    /**
     * µ addClass tests
     *
     * @test    addClass exists
     * @test    adds a class
     * @test    sets the data object
     * @test    sets multiple classes from an array
     * @test    multiple classes all set to data object
     * @test    multiple classes set by className string
     */
    QUnit.test( '.addClass()', function( assert )
    {
        assert.ok( µ().addClass, 'exists' );

        var µMooDivs        = µ( 'div' ).addClass( 'moo' );
        var µMooDivsLength  = µMooDivs.length;

        assert.equal( µMooDivsLength, µ( '.moo' ).length, 'it added a class!' );

        µ( '.moo' ).removeClass( 'moo' );

        µMooDivs = µ( 'div' ).first().addClass( [ 'moo', 'for--real' ] );
        assert.equal( µMooDivs.length, µ( '.moo.for--real' ).length, 'it added 2 classes from an array of strings' );

        var µDiv = µ( 'div' ).addClass( µMooDivs[0].className );
        assert.equal( µDiv.length, µ( '.moo.for--real' ).length, 'multiple classes set by className string' );

        if ( _observables )
        {
            assert.ok( µMooDivs.get( 'class' )[0].indexOf( 'moo' ) !== -1, 'it set the class into the data object' );
            var classData = µ( '.moo' )[0].data.class.class;
            assert.ok( classData.indexOf( 'for--real' ) !== -1, 'class sets data' );
        }

        µ( '.moo' ).removeClass( 'moo  for--real' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        var resetDivs = function()
        {
            for ( var i = 0, lenI = µDivs.length; i < lenI; i++ )
            {
                µDivs[ i ].className.replace( 'moo', '' );
            }
        };

        buildTest(
        'µDivs.addClass( \'moo\' )', function()
        {
            µDivs.addClass( 'moo' );

            resetDivs();
        },

        '$Divs.addClass( \'moo\' )', function()
        {
            $Divs.addClass( 'moo' );

            resetDivs();
        } );
    });


    /**
     * µ attr tests
     *
     * @test    attr exists
     * @test    sets an attr
     * @test    retrieves an attr
     * @test    removes an attr
     */
    QUnit.test( '.attr()', function( assert )
    {
        assert.ok( µ().attr, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.attr( 'testing', 'should work' );
        assert.equal( µTarget[0].getAttribute( 'testing' ), 'should work', 'attribute set' );

        var attrGotten = µTarget.attr( 'testing' );
        assert.equal( attrGotten[0], 'should work', 'attribute gotten' );

        µTarget.attr( 'testing', null );
        assert.equal( µTarget[0].getAttribute( 'testing' ), null, 'attribute removed' );

        µTarget.attr( { testing: 'tested', moon: 'doge' } );
        assert.equal( µTarget[0].getAttribute( 'moon' ), 'doge', 'attributes bulk added by object' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        var vanillaRemove = function()
        {
            for ( var i = 0, lenI = µDivs.length; i < lenI; i++ )
            {
                µDivs[ i ].removeAttribute( 'moo' );
            }
        };

        buildTest(
        'µDivs.attr( \'moo\', \'moooooooooooooon\' )', function()
        {
            µDivs.attr( 'moo', 'moooooooooooooon' );

            vanillaRemove();
        },

        '$Divs.attr( \'moo\', \'moooooooooooooon\' )', function()
        {
            $Divs.attr( 'moo', 'moooooooooooooon' );

            vanillaRemove();
        } );
    });


    /**
     * µ css tests
     *
     * @test    css exists
     * @test    sets css
     * @test    retrieves a css array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     * @test    removes css
     */
    QUnit.test( '.css()', function( assert )
    {
        assert.ok( µ().css, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.css( 'background-color', 'rgb(255, 0, 0)' );
        assert.equal( µTarget[0].style.backgroundColor, 'rgb(255, 0, 0)', 'css set' );

        var cssGotten = µTarget.css( 'background-color' );
        assert.ok( Array.isArray( cssGotten ), 'css get returns an array' );
        assert.ok( typeof cssGotten[0] === 'string', 'full of strings' );
        assert.equal( cssGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( cssGotten[0], 'rgb(255, 0, 0)', 'correct result' );


        µTarget.css( 'background-color', null );
        assert.equal( µTarget[0].style.backgroundColor, '', 'css removed' );


        µTarget = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.css( \'background-color\', \'#f00\' )', function()
        {
            µTarget.css( 'background-color', '#f00' );
            µTarget.css( 'background-color', null );
        },

        '$Target.css( \'background-color\', \'#f00\' )', function()
        {
            $Target.css( 'background-color', '#f00' );
            $Target.css( 'background-color', null );
        } );
    });


    /**
     * µ each tests
     *
     * @test    each exists
     * @test    affects each element
     * @test    correctly
     */
    QUnit.test( '.each()', function( assert )
    {
        assert.ok( µ().each, 'exists' );

        var µDivs   = µ( 'div' );
        var divs    = [];

        µDivs.each( function( _el ){ divs.push( _el ); } );
        assert.equal( µDivs.length, divs.length, 'pushed each element' );
        assert.deepEqual( µDivs[ 0 ], divs[ 0 ], 'correct result' );

        µDivs       = µ( 'div' );
        var $Divs   = $( 'div' );

        buildTest(
        'µDivs.each( function( _el, i ){} )', function()
        {
            var arr = [];
            µDivs.each( function( _el, i )
            {
                arr.push( _el.id );
            } );
        },

        '$Divs.each( function( _el, i ){} )', function()
        {
            var arr = [];
            $Divs.each( function( _el, i )
            {
                arr.push( _el.id );
            } );
        } );
    });



    /**
     * µ extend tests
     *
     * @test    extend exists
     * @test    extends microbes
     * @test    extends objects
     */
    QUnit.test( '.extend()', function( assert )
    {
        assert.ok( µ().extend, 'core exists' );
        assert.ok( µ.extend, 'root exists' );

        var µDivs = µ( 'div' );
        var extension = { more: function(){ return 'MOAR!!!'; } };
        µDivs.extend( extension );
        assert.equal( µDivs.more(), 'MOAR!!!', 'extends microbes' );

        var _obj = { a: 1, b: 2, c:3 };
        µ.extend( _obj, extension );
        assert.equal( _obj.more(), 'MOAR!!!', 'extends objects' );

            µDivs = µ( 'divs' );
        var $Divs = µ( 'divs' );

        buildTest(
        'µ.extend( _obj, extension );', function()
        {
            extension = { more: function(){ return 'MOAR!!!'; } };
            // µDivs.extend( extension );
            _obj        = { a: 1, b: 2, c:3 };
            µ.extend( _obj, extension );
        },

        '$.extend( _obj, extension )', function()
        {
            extension   = { more: function(){ return 'MOAR!!!'; } };
            // $Divs.extend( extension );
            _obj        = { a: 1, b: 2, c:3 };
            $.extend( _obj, extension );
        } );
    });


    /**
     * µ getParentIndex tests
     *
     * @test    getParentIndex exists
     * @test    retrieves the correct index
     */
    QUnit.test( '.getParentIndex()', function( assert )
    {
        assert.ok( µ().getParentIndex, 'exists' );

        var setup       = µ( '#example--combined' ).parent().children()[0];

        var literal     = setup[4];
        var _function   = setup[ µ( '#example--combined' ).getParentIndex()[0] ];

        assert.deepEqual( literal, _function, 'parent index is correctly determined' );

        var µDiv = µ( 'div' ), $Div = $( 'div' );

        buildTest(
        'µDiv.getParentIndex()', function()
        {
            µDiv.getParentIndex();
        },

        '$Div for loop', function()
        {
            var res = new Array( $Div.length );
            for ( var i = 0, lenI = $Div.length; i < lenI; i++ )
            {
                res[ i ] = $( $Div[ i ] ).index();
            }

            return res;
        } );
    });


    /**
     * µ hasClass tests
     *
     * @test    hasClass exists
     * @test    checks every element
     * @test    correctly
     */
    QUnit.test( '.hasClass()', function( assert )
    {
        assert.ok( µ().hasClass, 'exists' );

        var µExampleClass = µ( '.example--class' );

        var exampleClass = µExampleClass.hasClass( 'example--class' );

        assert.ok( exampleClass.length === µExampleClass.length, 'it checks every element' );

        var correct = true;
        for ( var i = 0, lenI = exampleClass.length; i < lenI; i++ )
        {
            if ( ! exampleClass[ i ] )
            {
                correct = false;
                break;
            }
        }
        assert.ok( correct, 'correctly' );

        var µDiv = µ( 'div' ), $Div = $( 'div' );
        buildTest(
        'µDiv.hasClass()', function()
        {
            µDiv.hasClass();
        },

        '$Div for loop', function()
        {
            var res = new Array( $Div.length );
            for ( var i = 0, lenI = $Div.length; i < lenI; i++ )
            {
                res[ i ] = $( $Div[ i ] ).hasClass();
            }

            return res;
        } );
    });


    /**
     * µ html tests
     *
     * @test    html exists
     * @test    html sets
     * @test    returns an array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     */
    QUnit.test( '.html()', function( assert )
    {
        assert.ok( µ().html, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.html( 'text, yo' );
        assert.equal( µTarget[0].innerHTML, 'text, yo', 'html set' );

        var htmlGotten = µTarget.html();
        assert.ok( Array.isArray( htmlGotten ), 'html() returns an array' );
        assert.ok( typeof htmlGotten[0] === 'string', 'full of strings' );

        assert.equal( htmlGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( htmlGotten[0], 'text, yo', 'correct result' );

        µTarget.html( '' );


        µTarget = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.html( \'blarg\' )', function()
        {
            µTarget.html( 'blarg' );
            µTarget.html();
        },

        '$Target.html( \'blarg\' )', function()
        {
            $Target.html( 'blarg' );
            $Target.html();
        } );
    });


    /**
     * µ indexOf tests
     *
     * @test    indexOf exists
     * @test    indexOf correctly determines the index
     */
    QUnit.test( '.indexOf()', function( assert )
    {
        assert.ok( µ().indexOf, 'exists' );

        var µTarget = µ( '#example--id' );

        var target  = document.getElementById( 'example--id' );
        var index   = µTarget.indexOf( target );

        assert.deepEqual( µTarget[ index ], target, 'index correctly determined' );

        var µDivs   = µ( 'div' );
        var $Divs   = $( 'div' );
        var _el     = document.getElementById( 'QUnit' );

        buildTest(
        'µDivs.indexOf( _el )', function()
        {
            µDivs.indexOf( _el );
        },

        '$Divs.index( _el )', function()
        {
            $Divs.index( _el );
        } );
    });


    /**
     * µ map tests
     *
     * @test    map exists
     * @test    applies to all elements
     */
    QUnit.test( '.map()', function( assert )
    {
        assert.ok( µ().map, 'exists' );

        var µDivs = µ( 'div' );

        µDivs.map( function( el )
        {
            el.moo = 'moo';
        } );

        var rand = Math.floor( Math.random() * µDivs.length );

        assert.equal( µDivs[ rand ].moo, 'moo', 'applies to all elements' );


            µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        var resetDivs = function()
        {
            µDivs = µ( 'div' );
            $Divs = $( 'div' );
        };


        buildTest(
        'µDivs.map( function(){} )', function()
        {
            resetDivs();

            µDivs.map( function( el )
            {
                el.moo = 'moo';
            } );
        },

        '$Divs.map( function(){} )', function()
        {
            resetDivs();

            $Divs.map( function( el )
            {
                el.moo = 'moo';
            } );
        } );
    });


    /**
     * µ merge tests
     *
     * @test    µ().merge exists
     * @test    µ.merge exists
     * @test    merged microbes
     * @test    merged arrays
     * @test    merged this
     */
    QUnit.test( '.merge()', function( assert )
    {
        assert.ok( µ().merge, 'µ().merge exists' );
        assert.ok( µ.merge, 'µ.merge exists' );

        var µDivs       = µ( 'div' );
        var divCount    = µDivs.length;
        var µHtml       = µ( 'html' );
        var htmlCount   = µHtml.length;

        var merged      = µ.merge( µDivs, µHtml );
        assert.equal( divCount + htmlCount, merged.length, 'merged microbes' );

        merged = µ.merge( [ 1, 2, 3 ], [ 4, 5, 6 ] );
        assert.equal( 6, merged.length, 'merged arrays' );

        µDivs       = µ( 'div' );
        µDivs.merge( µHtml );
        assert.equal( µDivs.length, divCount + htmlCount, 'merged this' );


        var $Divs, µLi, $Li;

        var refreshObjects = function()
        {
            µDivs = µ( 'div' );
            $Divs = $( 'div' );

            µLi = µ( 'li' );
            $Li = $( 'li' );
        };


        buildTest(
        'µ.merge( _obj, extension );', function()
        {
            refreshObjects();

            /* these are commented out because jquery doesn't handle this syntax */
            // µDivs.merge( µLi );

            µ.merge( µDivs, µLi );
        },

        '$.merge( _obj, extension )', function()
        {
            refreshObjects();

            /* these are commented out because jquery doesn't handle this syntax */
            // $Divs.merge( $Li );

            $.merge( $Divs, µLi );
        } );
    });


    /**
     * µ push tests
     *
     * @test    push exists
     * @test    pushes to the microbe
     * @test    the correctc element
     */
    QUnit.test( '.push()', function( assert )
    {
        assert.ok( µ().push, 'exists' );

        var µDivs   = µ( 'div' );
        var µDivsLength = µDivs.length;
        var newDiv = µ( '<div>' )[0];

        µDivs.push( newDiv );

        assert.equal( µDivsLength + 1, µDivs.length, 'pushes to the microbe' );
        assert.deepEqual( newDiv, µDivs[ µDivs.length - 1 ], 'the correct element' );

        var _el;
        var µEmpty = µ( [] );
        var $Empty = $( [] );

        buildTest(
        'µEmpty.push( _el )', function()
        {
            _el = document.getElementById( 'QUnit' );
            µEmpty.push( _el );
        },

        '$Empty.push( _el )', function()
        {
            _el = document.getElementById( 'QUnit' );
            $Empty.push( _el );
        } );
    });


    /**
     * µ removeClass tests
     *
     * @test    removeClass exists
     * @test    sets data
     * @test    removes class in all elements
     */
    QUnit.test( '.removeClass()', function( assert )
    {
        assert.ok( µ().removeClass, 'exists' );

        var µDivs   = µ( '.example--class--groups' );
        µDivs.removeClass( 'example--class--groups' );

        var classData = µDivs[0].data.class.class;
        assert.ok( classData.indexOf( 'example--class--groups' ) === -1, 'removeClass sets data' );

        assert.equal( µ( '.example--class--groups' ).length, 0, 'removed class to both divs' );

        µ( '#qunit' ).addClass( 'test--yyy  test--zzz' );
        µ( '#qunit' ).removeClass( µ( '#qunit' )[0].className );
        assert.equal( 0, µ( '.test--yyy.test--zzz' ).length, 'multiple classes removed by className string' );

        µDivs.addClass( 'example--class--groups' );

            µDivs   = µ( '.example--class--groups' );
        var $Divs   = $( '.example--class--groups' );

        var resetDivs = function()
        {
          for ( var i = 0, lenI = µDivs.length; i < lenI; i++ )
          {
              µDivs[ i ].className += ' moo';
          }
        };

        buildTest(
        'µDivs.removeClass( \'moo\' )', function()
        {
          µDivs.removeClass( 'moo' );

          resetDivs();
        },

        '$Divs.removeClass( \'moo\' )', function()
        {
          $Divs.removeClass( 'moo' );

          resetDivs();
        } );
    });


    /**
     * µ text tests
     *
     * @test    text exists
     * @test    text sets
     * @test    returns an array
     * @test    full of strings
     * @test    with the correct number of results
     * @test    with the correct results
     */
    QUnit.test( '.text()', function( assert )
    {
        assert.ok( µ().text, 'exists' );

        var µTarget = µ( '#example--id' );

        µTarget.text( 'text, yo' );

        var _text;
        if( document.all )
        {
            _text = µTarget[0].innerText;
        }
        else // FF
        {
            _text = µTarget[0].textContent;
        }


        assert.equal( _text, 'text, yo', 'text set' );

        var textGotten = µTarget.text();
        assert.ok( Array.isArray( textGotten ), 'text() get returns an array' );
        assert.ok( typeof textGotten[0] === 'string', 'full of strings' );

        assert.equal( textGotten.length, µTarget.length, 'correct amount of results' );
        assert.equal( textGotten[0], 'text, yo', 'correct result' );

        µTarget.text( '' );

        µTarget     = µ( '#example--id' );
        var $Target = $( '#example--id' );

        buildTest(
        'µTarget.text( \'blarg\' )', function()
        {
            µTarget.text( 'blarg' );
            µTarget.text();
        },

        '$Target.text( \'blarg\' )', function()
        {
            $Target.text( 'blarg' );
            $Target.text();
        } );
    });


     /**
      * µ toArray tests
      *
      * @test    µ().toArray exists
      * @test    µ.toArray exists
      * @test    makes arrays
      */
     QUnit.test( '.toArray()', function( assert )
     {
         assert.ok( µ().toArray, 'exists' );

         var µArr = µ( 'div' );
         var $arr = $( 'div' );
         assert.equal( µ.type( µArr.toArray() ), 'array', 'makes arrays' );

         buildTest(
         'µ.toArray', function()
         {
             µArr.toArray();
         },

         '$.toArray', function()
         {
             $arr.toArray();
         } );
     });


    /**
     * µ toggleClass tests
     *
     * @test    toggleClass exists
     * @test    removes classes
     * @test    adds classes
     */
    QUnit.test( '.toggleClass()', function( assert )
    {
        assert.ok( µ().toggleClass, 'exists' );

        var µDivs   = µ( '.example--class--groups' );

        µDivs.toggleClass( 'example--class--groups' );
        assert.equal( µDivs.first().hasClass( 'example--class--groups' )[0], false, 'removes classes' );

        µDivs.toggleClass( 'example--class--groups' );
        assert.equal( µDivs.first().hasClass( 'example--class--groups' )[0], true, 'adds classes' );

            µDivs   = µ( '.example--class--groups' );
        var $Divs   = $( '.example--class--groups' );

        buildTest(
        'µDivs.toggleClass( \'moo\' )', function()
        {
            µDivs.toggleClass( 'moo' );
        },

        '$Divs.toggleClass( \'moo\' )', function()
        {
            $Divs.toggleClass( 'moo' );
        } );
    });


    /**
     * µ type test
     *
     * @test    type exists
     */
    QUnit.test( '.type', function( assert )
    {
        var type = '[object Microbe]';

        assert.equal( µ().type, type, 'type is ' + type );

        buildTest( 'No speed tests available for non-functions' );
    });


    /**
     * µ version test
     *
     * @test    version exists
     */
    QUnit.test( '.version', function( assert )
    {
        assert.equal( µ().version, version, 'version is ' + version );

        buildTest( 'No speed tests available for non-functions' );
    });
};


},{}],10:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, buildTest  */
module.exports = function( buildTest )
{
    QUnit.module( 'cytoplasm/cytoplasm.js' );


    /**
     * µ init wrap element tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'wrap an empty set', function( assert )
    {
        var µBody = µ( [] );

        assert.equal( µBody.length, 0, 'empty set' );
        assert.equal( µBody[ 0 ], undefined, 'undefined 0' );

        buildTest(
        'µ( [] )', function()
        {
            return µ( [] );
        },

        '$( [] )', function()
        {
            return $( [] );
        } );
    });


    /**
     * µ init wrap element tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'wrap an element', function( assert )
    {
        var _body = document.getElementsByTagName( 'body' )[0];
        var µBody = µ( _body );

        assert.equal( µBody.length, 1, 'one body' );
        assert.deepEqual( µBody[ 0 ], _body, 'passes' );

        buildTest(
        'µ( _el )', function()
        {
            return µ( _body );
        },

        '$( _el )', function()
        {
            return $( _body );
        } );
    });


    /**
     * µ init wrap element tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'wrap an array of elements', function( assert )
    {
        var _body = document.getElementsByTagName( 'body' )[0];
        var µBody = µ( [ _body ] );

        assert.equal( µBody.length, 1, 'one body' );
        assert.deepEqual( µBody[ 0 ], _body, 'passes' );

        var _divs = Array.prototype.slice.call( document.getElementsByTagName( 'div' ) );

        buildTest(
        'µ( _divs )', function()
        {
            return µ( _divs );
        },

        '$( _divs )', function()
        {
            return $( _divs );
        } );
    });


    /**
     * µ init query class tests
     *
     * @test    one div
     * @test    passes
     */
    QUnit.test( 'query class', function( assert )
    {
        var _div = document.getElementsByClassName( 'example--class' )[0];
        var µDiv = µ( '.example--class' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );
        assert.equal( µ( '.exarmple-classssss' ).length, 0, 'successfully fails' );

        buildTest(
        'µ( \'.example--class\' )', function()
        {
            return µ( '.example--class' );
        },

        '$( \'.example--class\' )', function()
        {
            return $( '.example--class' );
        } );
    });


    /**
     * µ init query multiple classes tests
     *
     * @test    one div
     * @test    passes
     */
    QUnit.test( 'query multiple classes', function( assert )
    {
        var _div    = document.getElementsByClassName( 'example--class' );
        var µDiv    = µ( '.example--class.example--class--groups' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div[0], 'passes' );

        buildTest(
        'µ( \'.example--class.example--class--groups\' )', function()
        {
            return µ( '.example--class.example--class--groups' );
        },

        '$( \'.example--class.example--class--groups\' )', function()
        {
            return $( '.example--class.example--class--groups' );
        } );
    });


    /**
     * µ init query id tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'query id', function( assert )
    {
        var _div = document.getElementById( 'example--id' );
        var µDiv = µ( '#example--id' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'#example--id\' )', function()
        {
            return µ( '#example--id' );
        },

        '$( \'#example--id\' )', function()
        {
            return $( '#example--id' );
        } );
    });


    /**
     * µ init query id and class tests
     *
     * @test    one body
     * @test    passes
     */
    QUnit.test( 'query id and class', function( assert )
    {
        var _div    = document.getElementById( 'example--combined' );
        var µDiv    = µ( '#example--combined.example--combined' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'#example--combined.example--combined\' )', function()
        {
            return µ( '#example--combined.example--combined' );
        },

        '$( \'#example--combined.example--combined\' )', function()
        {
            return $( '#example--combined.example--combined' );
        } );
    });


    /**
     * µ init query tagname tests
     *
     * @test    correct element
     * @test    passes
     */
    QUnit.test( 'query tagname', function( assert )
    {
        var _div = document.getElementsByTagName( 'div' )[0];
        var µDiv = µ( 'div' );

        assert.equal( µDiv[ 0 ].tagName, 'DIV', 'correct element' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'div\' )', function()
        {
            return µ( 'div' );
        },

        '$( \'div\' )', function()
        {
            return $( 'div' );
        } );
    });


    /**
     * µ init query combined tests
     *
     * @test    one div
     * @test    passes
     */
    QUnit.test( 'query combined', function( assert )
    {
        var _div = document.querySelector( 'div#example--combined.example--combined' );
        var µDiv = µ( 'div#example--combined.example--combined' );

        assert.equal( µDiv.length, 1, 'one div' );
        assert.deepEqual( µDiv[ 0 ], _div, 'passes' );

        buildTest(
        'µ( \'div#example--combined.example--combined\' )', function()
        {
            return µ( 'div#example--combined.example--combined' );
        },

        '$( \'div#example--combined.example--combined\' )', function()
        {
            return $( 'div#example--combined.example--combined' );
        } );
    });


    /**
     * µ init query with microbe scope tests
     *
     * @test    two divs
     * @test    correct element
     */
    QUnit.test( 'query with microbe scope', function( assert )
    {
        var µDiv = µ( 'div', µ( '.example--class--groups' ) );
        var $Div = $( 'div', $( '.example--class--groups' ) );

        assert.equal( µDiv.length, 2, 'two divs' );
        assert.equal( µDiv[0].tagName, 'DIV', 'correct element' );

        buildTest(
        'µ( \'div\', µDiv )', function()
        {
            return µ( 'div', µDiv );
        },

        '$( \'div\', $Div )', function()
        {
            return $( 'div', $Div );
        } );
    });


    /**
     * µ init query with element scope tests
     *
     * @test    two divs
     * @test    correct parent
     */
    QUnit.test( 'query with element scope', function( assert )
    {
        var _scopeEl = µ( '.example--class--groups' )[0];

        var µDiv = µ( 'div', _scopeEl );

        assert.equal( µDiv.length, 2, 'two divs' );
        assert.deepEqual( µDiv[0].parentNode, _scopeEl, 'correct parent' );

        var _el = µ( 'div' )[1];

        buildTest(
        'µ( \'h1\', _el )', function()
        {
            return µ( 'h1', _el );
        },

        '$( \'h1\', _el )', function()
        {
            return $( 'h1', _el );
        } );
    });


    /**
     * µ init query with string scope tests
     *
     * @test    correctly formed selector
     * @test    two divs
     */
    QUnit.test( 'query with string scope', function( assert )
    {
        var µDiv = µ( 'div', '.example--class--groups' );
        assert.equal( µDiv.length, 2, 'two divs from 2 strings' );


        µDiv = µ( µDiv[0], '.example--class--groups' );
        assert.equal( µDiv.length, 1, '1 divs from a string and an element' );

        buildTest(
        'µ( \'h1\', \'div\' )', function()
        {
            return µ( 'h1', 'div' );
        },

        '$( \'h1\', \'div\' )', function()
        {
            return $( 'h1', 'div' );
        } );
    });


    /*
     * µ length test
     *
     * @test    length exists
     */
    QUnit.test( '.length', function( assert )
    {
        assert.equal( µ().length, 0, 'length initializes' );
        assert.equal( µ( 'head' ).length, 1, 'length reports correctly' );

        buildTest( 'No speed tests available for non-functions' );
    });
};

},{}],11:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
var indexOf = Array.prototype.indexOf

module.exports = function( buildTest )
{
    QUnit.module( 'cytoplasm/pseudo.js' );

    /**
     * pseudo custom connectors tests
     *
     * @test    any-link exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( 'pseudo custom connectors', function( assert )
    {
        assert.ok( µ( 'div:first ~ div' ), 'µ( \'div:first ~ div\' )' );
        assert.ok( µ( 'div:first' ).find( '~ div' ), 'µ( \'div:first\' ).find( \'~ div\' )' );
        assert.ok( µ( 'div ~ :first' ), 'µ( \'div ~ :first\' )' );
        assert.ok( µ( 'div:first' ).find( '> div' ), 'µ( \'div:first\' ).find( \'> div\' )' );
        assert.ok( µ( 'div:first' ).find( '+ div' ), 'µ( \'div:first\' ).find( \'+ div\' )' );
        assert.ok( µ( 'div! ~ :lt(3) >> div' ).filter( '.invalid--test:contains(comparison)' ).find( '> b' ), 'µ( \'div! ~ :lt(3) >> div\' ).filter( \'.invalid--test:contains(comparison)\' ).find( \'> b\' )' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ any-link tests
     *
     * @test    any-link exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':any-link', function( assert )
    {
        assert.ok( µ.pseudo[ 'any-link' ], 'exists' );
        assert.equal( µ( ':any-link' ).length, document.getElementsByTagName( 'A' ).length, 'gets links' );
        assert.equal( µ( 'div ~ *:any-link' ).length, document.querySelectorAll( 'div ~ a' ).length, 'gets scoped links' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### blank
     *
     * µ blank tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':blank', function( assert )
    {
        assert.ok( µ.pseudo.blank, 'exists' );

        assert.equal( µ( ':blank' ).length, 4, 'gets blanks' );
        assert.equal( µ( 'div *:blank' ).length, 4, 'gets scoped blanks' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### column
     *
     * µ column selector tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':column', function( assert )
    {
        assert.ok( µ.pseudo.column, 'exists' );

        var col1 = document.getElementById( 'col1' );
        assert.equal( µ( '#col1:column' )[0], col1, 'as pseudo' );
        assert.equal( µ( ':column(#col1)' )[0], col1, 'filter with variable' );

        buildTest( 'No comparison available.' );
    });



    /**
     * µ contains tests
     *
     * @test    contains exists
     * @test    searches text
     * @test    ignores case
     * @test    ignores false returns
     */
    QUnit.test( ':contains(text)', function( assert )
    {
        assert.ok( µ.pseudo.contains, 'exists' );
        assert.equal( µ( '#example--combined:contains(I am)' ).length, 1, 'searches text' );
        assert.equal( µ( '#example--combined:contains(i am)' ).length, 1, 'ignores case' );
        assert.equal( µ( '#example--combined:contains(moon)' ).length, 0, 'ignores false returns' );

        var µEx = µ( '#example--combined' );
        var $Ex = $( '#example--combined' );
        buildTest(
        'µ( \'#example--combined\' ).filter( \':contains(I am)\' )', function()
        {
            return µEx.filter( ':contains(I am)' );
        },

        '$( \'#example--combined\' ).filter( \':contains(I am)\' )', function()
        {
            return $Ex.filter( ':contains(I am)' );
        } );
    });


    /**
     * µ default tests
     *
     * @test    default exists
     * @test    selects only the default inputs
     * @test    selects only the default inputs from a scoped selector
     */
    QUnit.test( ':default', function( assert )
    {
        var µDefaults       = µ( ':default' );
        var µScopedDefaults = µ( 'div *:default' );

        assert.ok( µ.pseudo.even, 'exists' );
        assert.deepEqual( µDefaults.length, 2, 'selects the default inputs' );
        assert.deepEqual( µScopedDefaults.length, 2, 'selects the default inputs scoped' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ default tests
     *
     * @test    dir exists
     * @test    selects ltr
     * @test    selects rtl
     */
    QUnit.test( ':dir', function( assert )
    {
        var µLTR    = µ( 'div:dir(ltr)' );
        var µRTL    = µ( 'div:dir(rtl)' );

        assert.ok( µ.pseudo.dir, 'exists' );
        assert.deepEqual( µLTR.length, µ( 'div' ).length, 'selects ltr' );
        assert.equal( µRTL.length, 0, 'selects rtl' );

        buildTest( 'No comparison available.' );
    });



    /**
     * µ drop tests
     *
     * @test    default exists
     * @test    selects only the default inputs
     * @test    selects only the default inputs from a scoped selector
     */
    QUnit.test( ':drop', function( assert )
    {
        var µDrop    = µ( 'div:drop' );

        assert.ok( µ.pseudo.drop, 'exists' );
        assert.equal( µDrop.length, 1, 'selects dropzone' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ even tests
     *
     * @test    even exists
     * @test    selects only the even scripts
     * @test    selects the correct half
     */
    QUnit.test( ':even', function( assert )
    {
        var µEvenScripts   = µ( 'script:even' ).length;
        var µScripts       = µ( 'script' ).length;

        assert.ok( µ.pseudo.even, 'exists' );
        assert.equal( µEvenScripts, Math.floor( µScripts / 2 ), 'selects only the even scripts' );
        assert.deepEqual( µScripts[1], µEvenScripts[0], 'selects the correct half' );

        buildTest(
        'µ( \'div:even\' )', function()
        {
            return µ( 'div:even' );
        },

        '$( \'div:even\' )', function()
        {
            return $( 'div:even' );
        } );
    });


    /**
     * µ first tests
     *
     * @test    first exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':first', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µFirstDiv   = µ( 'div:first' );

        assert.ok( µ.pseudo.first, 'exists' );
        assert.deepEqual( µDivs[ 0 ], µFirstDiv[ 0 ], 'finds the right div' );
        assert.equal( µFirstDiv.length, 1, 'only finds one div' );

        buildTest(
        'µ( \'div:first\' )', function()
        {
            return µ( 'div:first' );
        },

        '$( \'div:first\' )', function()
        {
            return $( 'div:first' );
        } );
    });


    /**
     * µ gt tests
     *
     * @test    gt exists
     * @test    finds the right divs
     * @test    finds the correct number of elements
     */
    QUnit.test( ':gt(X)', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µGtDivs     = µ( 'div:gt(3)' );

        assert.ok( µ.pseudo.gt, 'exists' );
        assert.deepEqual( µDivs[ 6 ], µGtDivs[ 3 ], 'finds the right divs' );
        assert.equal( µGtDivs.length, µDivs.length - 3, 'finds the correct number of elements' );

        buildTest(
        'µ( \'div:gt(3)\' )', function()
        {
            return µ( 'div:gt(3)' );
        },

        '$( \'div:gt(3)\' )', function()
        {
            return $( 'div:gt(3)' );
        } );
    });


    /**
     * µ has tests
     *
     * @test    has exists
     * @test    finds the correct number of elements
     */
    QUnit.test( ':has(S)', function( assert )
    {
        var µHasDiv = µ( 'div:has(li)' );

        assert.ok( µ.pseudo.has, 'exists' );
        assert.equal( µHasDiv.length, 1, 'grabs the correct amount of elements' );

        buildTest(
        'µ( \'div:has(li)\' )', function()
        {
            return µ( 'div:has(li)' );
        },

        '$( \'div:has(li)\' )', function()
        {
            return $( 'div:has(li)' );
        } );
    });


    /**
     * µ in-range tests
     *
     * @test    in-range exists
     * @test    finds the correct number of elements
     * @test    finds the correct element
     */
    QUnit.test( ':in-range', function( assert )
    {
        var µInRangeDiv = µ( ':in-range' );
        var byElement   = µ( '#emailInput2' )[0];

        assert.ok( µ.pseudo[ 'in-range' ], 'exists' );
        assert.equal( µInRangeDiv.length, 1, 'grabs the correct amount of elements' );
        assert.deepEqual( µInRangeDiv[0], byElement, 'grabs the correct element' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ lang tests
     *
     * @test    lang exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':lang', function( assert )
    {
        var µlangDiv        = µ( 'div:lang(gb-en)' );
        var µWildcardDiv    = µ( 'div:lang(*-en)' );

        assert.ok( µ.pseudo.lang, 'exists' );
        assert.equal( µlangDiv.length, 1, 'finds a specified language' );
        assert.equal( µWildcardDiv.length, 2, 'finds a wildcard language' );

        // this is css2 spec and it works. µ is slower, but $ cant do *
        // buildTest(
        // 'µ( \':lang(gb-en)\' )', function()
        // {
        //     return µ( ':lang(gb-en)' );
        // },

        // '$( \':lang(gb-en)\' )', function()
        // {
        //     return $( ':lang(gb-en)' );
        // } );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ last tests
     *
     * @test    last exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':last', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µLastDiv    = µ( 'div:last' );

        assert.ok( µ.pseudo.last, 'exists' );
        assert.deepEqual( µDivs[ µDivs.length - 1 ], µLastDiv[ 0 ], 'finds the right div' );
        assert.equal( µLastDiv.length, 1, 'only finds one div' );

        buildTest(
        'µ( \'div:last\' )', function()
        {
            return µ( 'div:last' );
        },

        '$( \'div:last\' )', function()
        {
            return $( 'div:last' );
        } );
    });


    /**
     * µ local-link tests
     *
     * @test    local-link exists
     * @test    finds the right div
     * @test    only returns one div
     */
    QUnit.test( ':local-link', function( assert )
    {
        var µLinks      = µ( ':local-link' );
        var allLinks    = µ( 'a' );
        var depth       = window.location.pathname.slice( 1 ).split( '/' ).length - 1;
        var µDepth1     = µ( ':local-link(' + ( depth - 1 ) + ')' );
        var µDepth2     = µ( ':local-link(' + depth + ')' );

        assert.ok( µ.pseudo[ 'local-link'], 'exists' );
        assert.equal( µLinks.length, allLinks.length, 'get links' );
        assert.equal( µDepth1.length, 0, 'correctly specifies depth' );
        assert.equal( µDepth2.length, allLinks.length, 'correctly specifies depth' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ lt tests
     *
     * @test    lt exists
     * @test    finds the right divs
     * @test    finds the correct number of elements
     */
    QUnit.test( ':lt(X)', function( assert )
    {
        var µDivs       = µ( 'div' );
        var µLtDivs     = µ( 'div:lt(3)' );

        assert.ok( µ.pseudo.lt, 'exists' );
        assert.deepEqual( µDivs[ 1 ], µLtDivs[ 1 ], 'finds the right divs' );
        assert.equal( µLtDivs.length, 3, 'finds the correct number of elements' );

        buildTest(
        'µ( \'div:lt(2)\' )', function()
        {
            return µ( 'div:lt(2)' );
        },

        '$( \'div:lt(2)\' )', function()
        {
            return $( 'div:lt(2)' );
        } );
    });


    /**
     * µ matches tests
     *
     * @test    matches exists
     * @test    finds the right div
     * @test    works with pseudoselectors
     */
    QUnit.test( ':matches', function( assert )
    {
        var qunit           = document.getElementById( 'qunit' );
        var µMatchesDivs    = µ( 'div:matches(#qunit)' );

        assert.ok( µ.pseudo.matches, 'exists' );
        assert.deepEqual( µMatchesDivs[ 0 ], qunit, 'finds the right div' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### not
     *
     * µ complex not selector tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':not', function( assert )
    {
        assert.ok( µ.pseudo.not, 'exists' );

        var col2 = document.getElementById( 'col2' );
        assert.equal( indexOf.call( µ( 'col:not(#col2)'), col2 ), -1, 'filter with single selector' );
        assert.equal( indexOf.call( µ( 'col:not(#col2,#col3)' ), col2 ), -1, 'filter with multiple selectors' );

        buildTest(
        'µ( \'div:not(.fastest).\' )', function()
        {
            return µ( 'div:not(.fastest,.invalid--test)' );
        },

        '$( \'div:not(.fastest).\' )', function()
        {
            return $( 'div:not(.fastest,.invalid--test)' );
        } );
    });


    /**
     * ### nth-column
     *
     * µ column selector tests
     *
     * @test    nth-column exists
     * @test    filter with number
     * @test    filter with n-number
     */
    QUnit.test( ':nth-column', function( assert )
    {
        assert.ok( µ.pseudo[ 'nth-column' ], 'exists' );

        var col2 = document.getElementById( 'col2' );
        assert.equal( µ( ':nth-column(2)' )[0], col2, 'filter with number' );
        assert.equal( µ( ':nth-column(2n1)' )[0], col2, 'filter with n-number' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### nth-last-column
     *
     * µ column selector tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':nth-last-column', function( assert )
    {
        assert.ok( µ.pseudo[ 'nth-last-column' ], 'exists' );

        var col1 = document.getElementById( 'col1' );
        assert.equal( µ( ':nth-last-column(3)' )[0], col1, 'filter with number' );
        assert.equal( µ( ':nth-last-column(2n1)' )[0], col1, 'filter with n-number' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### nth-last-match
     *
     * µ match selector tests
     *
     * @test    blank exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( ':nth-last-match', function( assert )
    {
        assert.ok( µ.pseudo[ 'nth-last-match' ], 'exists' );

        var col1 = document.getElementById( 'col1' );
        assert.equal( µ( 'col:nth-last-match(3)' )[0], col1, 'filter with number' );
        assert.equal( µ( 'col:nth-last-match(2n1)' )[0], col1, 'filter with n-number' );

        buildTest( 'No comparison available.' );
    });


    /**
     * ### nth-match
     *
     * µ match selector tests
     *
     * @test    nth-match exists
     * @test    filter with number
     * @test    filter with n-number
     */
    QUnit.test( ':nth-match', function( assert )
    {
        assert.ok( µ.pseudo[ 'nth-match' ], 'exists' );

        var col2 = document.getElementById( 'col2' );
        assert.equal( µ( 'col:nth-match(2)' )[0], col2, 'filter with number' );
        assert.equal( µ( 'col:nth-match(2n1)' )[0], col2, 'filter with n-number' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ odd tests
     *
     * @test    odd exists
     * @test    selects only the odd scripts
     * @test    selects the correct half
     */
    QUnit.test( ':odd', function( assert )
    {
        var µOddScripts    = µ( 'script:odd' ).length;
        var µScripts       = µ( 'script' ).length;

        assert.ok( µ.pseudo.odd, 'exists' );
        assert.equal( µOddScripts, Math.ceil( µScripts / 2 ), 'selects only the odd scripts' );
        assert.deepEqual( µScripts[0], µOddScripts[0], 'selects the correct half' );

        buildTest(
        'µ( \'div:odd\' )', function()
        {
            return µ( 'div:odd' );
        },

        '$( \'div:odd\' )', function()
        {
            return $( 'div:odd' );
        } );
    });


    /**
     * µ optional selector tests
     *
     * @test    optional exists
     * @test    finds the correct number of elements
     */
    QUnit.test( ':optional', function( assert )
    {
        var µOptional   = µ( ':optional' );
        var byQuery     = µ( 'input:not([required=required]), textfield:not([required=required]), [required=optional], [optional]' );

        assert.ok( µ.pseudo.optional, 'exists' );
        assert.equal( µOptional.length, byQuery.length, 'finds the correct number of elements' );
        assert.equal( µOptional.length, 8, 'finds the correct elements' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ out-of-range tests
     *
     * @test    out-of-range exists
     * @test    finds the correct number of elements
     * @test    finds the correct element
     */
    QUnit.test( ':out-of-range', function( assert )
    {
        var µInRangeDiv = µ( ':out-of-range' );
        var byElement   = µ( '#emailInput3' )[0];

        assert.ok( µ.pseudo[ 'out-of-range' ], 'exists' );
        assert.equal( µInRangeDiv.length, 1, 'grabs the correct amount of elements' );
        assert.deepEqual( µInRangeDiv[0], byElement, 'grabs the correct element' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ parent tests
     *
     * @test    parent exists
     * @test    gets the correct parent as pseudo
     * @test    gets the correct parent as connector
     */
    QUnit.test( '! || :parent', function( assert )
    {
        var emailInput3         = µ( '#emailInput3' ).parent();
        var emailParent         = µ( '#emailInput3:parent' );
        var emailExclamation    = µ( '#emailInput3!' );

        assert.ok( µ.pseudo.parent, 'exists' );
        assert.deepEqual( emailInput3[0], emailParent[0], 'gets the correct parent as pseudo' );
        assert.deepEqual( emailInput3[0], emailExclamation[0], 'gets the correct parent as connector' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ read-only selector tests
     *
     * @test    read-only exists
     * @test    finds the correct number of elements
     */
    QUnit.test( ':read-only', function( assert )
    {
        var µReadOnly  = µ( 'div:drop :read-only' );

        assert.ok( µ.pseudo[ 'read-only' ], 'exists' );
        assert.equal( µReadOnly.length, 11, 'finds the correct elements' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ read-write selector tests
     *
     * @test    read-write exists
     * @test    finds the correct number of elements
     */
    QUnit.test( ':read-write', function( assert )
    {
        var µReadWrite  = µ( 'div:drop :read-write' );

        assert.ok( µ.pseudo[ 'read-write' ], 'exists' );
        assert.equal( µReadWrite.length, 5, 'finds the correct elements' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ required selector tests
     *
     * @test    required exists
     * @test    finds the correct number of elements
     */
    QUnit.test( ':required', function( assert )
    {
        var µRequired   = µ( ':required' );
        var byQuery     = µ( '[required=required]' );

        assert.ok( µ.pseudo.required, 'exists' );
        assert.equal( µRequired.length, byQuery.length, 'finds the correct number of elements' );
        assert.equal( µRequired.length, 1, 'finds the correct elements' );

        buildTest(
        'µ( \'input:required\' )', function()
        {
            return µ( 'input:required' );
        },

        '$( \'input:required\' )', function()
        {
            return $( 'input:required' );
        } );
    });


    /**
     * µ root tests
     *
     * @test    root exists
     * @test    selects the root
     */
    QUnit.test( ':root', function( assert )
    {
        var µRoot = µ( 'div:root' );

        assert.ok( µ.pseudo.root, 'exists' );
        assert.deepEqual( µRoot[ 0 ], µ( 'html' )[ 0 ], 'selects the root' );

        buildTest(
        'µ( \'body:root\' )', function()
        {
            return µ( 'body:root' );
        },

        '$( \':root\' )', function()
        {
            return $( ':root' );
        } );
    });
};


},{}],12:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
var indexOf = Array.prototype.indexOf;

module.exports = function( buildTest )
{
    QUnit.module( 'cytoplasm/utils.js' );

    /**
     * pseudo custom connectors tests
     *
     * @test    any-link exists
     * @test    gets links
     * @test    gets scoped links
     */
    QUnit.test( '.contains()', function( assert )
    {
        assert.ok( µ.contains, 'exists' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ matches tests
     *
     * @test    matches exists
     * @test    accepts a microbe
     * @test    accepts an element
     */
    QUnit.test( '.matches()', function( assert )
    {
        var qunit           = document.getElementById( 'qunit' );
        var µMatchesDivs    = µ.matches( µ( 'div' ), '#qunit' );

        assert.ok( µ.matches, 'exists' );
        assert.equal( µMatchesDivs[ 4 ], true, 'finds the right div' );
        assert.equal( µMatchesDivs[ 1 ], false, 'accepts a microbe' );
        assert.equal( µ.matches( qunit, '#qunit' ), true, 'accepts an element' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ children tests
     *
     * @test    children exists
     * @test    children returns an array
     * @test    full of microbes
     * @test    that are correct
     */
    QUnit.test( '.children()', function( assert )
    {
        assert.ok( µ().children, 'exists' );

        var children = µ( '.example--class' ).children();

        assert.ok( Array.isArray( children ), 'returns an array' );
        assert.ok( children[0].type === '[object Microbe]', 'full of microbes' );
        assert.deepEqual( µ( '.example--class' )[0].children[0], children[0][0], 'the correct children' );


        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.children()', function()
        {
            µDiv.children();
        },

        '$Div for loop', function()
        {
            var res = new Array( $Div.length );
            for ( var i = 0, lenI = $Div.length; i < lenI; i++ )
            {
                res[ i ] = $( $Div[ i ].children );
            }

            return res;
        } );
    });


    /**
     * µ childrenFlat tests
     *
     * @test    childrenFlat exists
     * @test    childrenFlat returns an array
     * @test    with itself removed
     * @test    that are correct
     */
    QUnit.test( '.childrenFlat()', function( assert )
    {
        assert.ok( µ().childrenFlat, 'exists' );

        var childrenFlat = µ( '.example--class' ).childrenFlat();

        assert.ok( childrenFlat.type === '[object Microbe]', 'returns an microbe' );

        var nodeChildren = Array.prototype.slice.call( µ( '.example--class' )[0].children );

        assert.equal( childrenFlat.length, nodeChildren.length, 'correct number of elements' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.childrenFlat()', function()
        {
            µDiv.childrenFlat();
        },

        '$Div.children()', function()
        {
            $Div.children();
        } );
    });


    /**
     * µ filter tests
     *
     * @test    filter exists
     * @test    selects the correct elements
     * @test    accepts pseudo selectors
     */
    QUnit.test( '.filter()', function( assert )
    {
        assert.ok( µ().filter, 'exists' );
        var µDivs   = µ( 'div' );
        var µId     = µDivs.filter( '#qunit' );

        assert.equal( µId.length, 1, 'selects the correct element' );

        µId         = µDivs.filter( ':lt(3)' );

        assert.equal( µId.length, 3, 'accepts pseudo selectors' );

        µId         = µDivs.filter( function(){ return this.id === 'qunit'; } );

        assert.equal( µId.length, 1, 'accepts functions' );

        var $Divs   = $( 'div' );

        // buildTest(
        // 'µDivs.filter( \'#qunit\' )', function()
        // {
        //     resetDivs();
        //     µDivs.filter( '#qunit' );
        // },

        // '$Divs.filter( \'#qunit\' )', function()
        // {
        //     resetDivs();
        //     $Divs.filter( '#qunit' );
        // } );

        buildTest(
        'µDivs.filter( \'#qunit\' )', function()
        {
            µDivs.filter( 'div.fastest:lt(3):first' );
        },

        '$Divs.filter( \'#qunit\' )', function()
        {
            $Divs.filter( 'div.fastest:lt(3):first' );
        } );
    });


    /**
     * µ find tests
     *
     * @test    find exists
     * @test    selects enough child elements
     * @test    accepts pseudo selectors
     */
    QUnit.test( '.find()', function( assert )
    {
        assert.ok( µ().find, 'exists' );

        var µDiv    = µ( '#qunit' );
        var µH2     = µDiv.find( 'h2' );

        assert.equal( µH2.length, 2, 'selects enough child elements' );

            µH2     = µDiv.find( ':first' );

        assert.equal( µH2.length, 1, 'accepts pseudo selectors' );

        var µADiv = $( '<div>' );
        var µAH1 = µADiv.append( '<h1>' );
        assert.equal( µADiv.find( 'h1' ).length, 1, 'finds unattached elements' );

        var µDivs   = µ( 'div' );
        var $Divs   = $( 'div' );

        buildTest(
        'µDivs.find( \'h2\' )', function()
        {
            µDivs.find( 'h2' );
        },

        '$Divs.find( \'h2\')', function()
        {
            $Divs.find( 'h2' );
        } );
    });


    /**
     * µ first tests
     *
     * @test    first exists
     * @test    returns a microbe
     * @test    of length 1
     * @test    that is the first one
     */
    QUnit.test( '.first()', function( assert )
    {
        assert.ok( µ().first, 'exists' );

        var µEverything = µ( '*' );
        var µFirst = µEverything.first();

        assert.equal( µFirst.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µFirst.length, 1, 'of length 1' );
        assert.deepEqual( µEverything[0], µFirst[0], 'that is actually the first one' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.first()', function()
        {
            µDivs.first();
        },

        '$Divs.first()', function()
        {
            $Divs.first();
        } );
    });


    /**
     * µ last tests
     *
     * @test    last exists
     * @test    returns a microbe
     * @test    of length 1
     * @test    that is the last one
     */
    QUnit.test( '.last()', function( assert )
    {
        assert.ok( µ().last, 'exists' );

        var µEverything = µ( '*' );
        var µLast = µEverything.last();

        assert.equal( µLast.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µLast.length, 1, 'of length 1' );
        assert.deepEqual( µLast[0], µEverything[ µEverything.length - 1 ], 'that is actually the last one' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.last()', function()
        {
            µDivs.last();
        },

        '$Divs.last()', function()
        {
            $Divs.last();
        } );
    });


    /**
     * µ parent tests
     *
     * @test    parent exists
     * @test    returns a microbe
     * @test    of the correct length
     * @test    that is actually the parent(s)
     */
    QUnit.test( '.parent()', function( assert )
    {
        assert.ok( µ().parent, 'exists' );

        var µBody   = µ( 'body' );
        var µParent = µBody.parent();

        assert.equal( µParent.type, '[object Microbe]', 'returns a microbe' );
        assert.equal( µParent.length, 1, 'of the correct length' );
        assert.deepEqual( µParent[0], µ( 'html' )[0], 'that is actually the parent(s)' );

        var µDivs = µ( 'div' );
        var $Divs = $( 'div' );

        buildTest(
        'µDivs.parent()', function()
        {
            µDivs.parent();
        },

        '$Divs.parent()', function()
        {
            $Divs.parent();
        } );
    });


    /**
     * µ siblings tests
     *
     * @test    siblings exists
     * @test    siblings returns an array
     * @test    full of microbes
     * @test    with itself removed
     * @test    that are correct
     */
    QUnit.test( '.siblings()', function( assert )
    {
        assert.ok( µ().siblings, 'exists' );

        var siblings = µ( '.example--class' ).siblings();

        assert.ok( Array.isArray( siblings ), 'returns an array' );
        assert.ok( siblings[0].type === '[object Microbe]', 'full of microbes' );

        var nodeChildren = Array.prototype.slice.call( µ( '.example--class' )[0].parentNode.children );

        assert.equal( indexOf.call( siblings[0], µ( '.example--class' )[0] ), -1, 'removed self' );
        assert.equal( siblings[0].length, nodeChildren.length - 1, 'correct number of elements' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.siblings()', function()
        {
            µDiv.siblings();
        },

        '$Div for loop', function()
        {
            var res = new Array( $Div.length );
            for ( var i = 0, lenI = $Div.length; i < lenI; i++ )
            {
                res[ i ] = $( $Div[ i ] ).siblings();
            }

            return res;
        } );
    });


    /**
     * µ siblingsFlat tests
     *
     * @test    siblingsFlat exists
     * @test    siblingsFlat returns an array
     * @test    with itself removed
     * @test    that are correct
     */
    QUnit.test( '.siblingsFlat()', function( assert )
    {
        assert.ok( µ().siblingsFlat, 'exists' );

        var siblingsFlat = µ( '.example--class' ).siblingsFlat();

        assert.ok( siblingsFlat.type === '[object Microbe]', 'returns an microbe' );

        var nodeChildren = Array.prototype.slice.call( µ( '.example--class' )[0].parentNode.children );

        assert.equal( indexOf.call( siblingsFlat, µ( '.example--class' )[0] ), -1, 'removed self' );
        assert.equal( siblingsFlat.length, nodeChildren.length - 1, 'correct number of elements' );

        var prev = µ( '#qunit' )[0].prevElementSibling;
        var next = µ( '#qunit' )[0].nextElementSibling;

        assert.deepEqual( prev, µ( '#qunit' ).siblingsFlat( 'prev' )[0], 'siblingsFlat( \'prev\' ) gets previous element' );
        assert.deepEqual( next, µ( '#qunit' ).siblingsFlat( 'next' )[0], 'siblingsFlat( \'next\' ) gets next element' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.siblingsFlat()', function()
        {
            µDiv.siblingsFlat();
        },

        '$Div.siblings()', function()
        {
            $Div.siblings();
        } );
    });


    /**
     * µ splice tests
     *
     * @test    splice exists
     * @test    is the correct length
     */
    QUnit.test( '.splice()', function( assert )
    {
        assert.ok( µ().splice, 'exists' );
        assert.equal( µ( 'div' ).splice( 0, 5 ).length, 5, 'is the correct length' );

        var $Div = $( 'div' ), µDiv = µ( 'div' );
        buildTest(
        'µDiv.splice( 0, 5 )', function()
        {
            µDiv.splice( 0, 5 );
        },

        '$Div.splice( 0, 5 )', function()
        {
            $Div.splice( 0, 5 );
        } );
    });
};


},{}],13:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'dom.js' );

    /**
     * µ ready tests
     *
     * @test    ready exists
     * @test    is run after the dom loads
     */
    QUnit.test( 'µ.ready()', function( assert )
    {
        assert.ok( µ.ready, 'exists' );

        var domReady    = assert.async();

        var loaded = function()
        {
            assert.equal( µ( 'h1' ).length, 1, 'is run after dom loads' );

            domReady();
        };

        µ.ready( loaded );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ append tests
     *
     * @test    append exists
     * @test    attached microbe
     * @test    attached element
     * @test    attached by creation string
     * @test    attached by selector string
     * @test    attached by html
     * @test    attached by array of elements
     */
    QUnit.test( '.append()', function( assert )
    {
        assert.ok( µ().append, 'exists' );

        var µNewDiv = µ( '<div.a--new--div>' );
        var µTarget = µ( '#example--id' );

        µTarget.append( µNewDiv );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached microbe' );
        µNewDiv.remove();

        µTarget.append( µNewDiv[0] );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached element' );
        µNewDiv.remove();

        µTarget.append( '<div.a--new--div>' );
        assert.deepEqual( µ( '.a--new--div' )[0], µTarget.childrenFlat()[0], 'attached by creation string' );

        µTarget.append( 'div.a--new--div' );
        assert.deepEqual( µ( '.a--new--div' )[0], µTarget.childrenFlat()[0], 'attached by selection string' );

        µ( '.a--new--div' ).remove();

        µTarget.append( '<div><span class="an--example--span">hello</span></div>' );
        assert.equal( µ( '.an--example--span' ).length, 1, 'attached by html' );

        µ( '.an--example--span!' ).remove();

        var µAnotherNewDiv = µ( '<div.a--new--div>' );

        µTarget.append( [ µNewDiv[0], µAnotherNewDiv[0] ] );
        assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 elements' );
        µNewDiv.remove();
        µAnotherNewDiv.remove();

        var el;
        var µDiv = µ( 'div' ).first();
        var $Div = $( 'div' ).first();

        var vanillaRemove = function( el )
        {
            el.parentNode.removeChild( el );
        };

        buildTest(
        'µDiv.append( el )', function()
        {
            el = document.createElement( 'div' );
            µDiv.append( el );

            vanillaRemove( el );
        },

        '$Div.append( el )', function()
        {
            el = document.createElement( 'div' );
            $Div.append( el );

            vanillaRemove( el );
        } );
    });


    /**
     * µ insertAfter tests
     *
     * @test    insertAfter exists
     * @test    add by creation string
     * @test    attached element
     * @test    add by microbe
     * @test    add by element
     */
    QUnit.test( '.insertAfter()', function( assert )
    {
        assert.ok( µ().insertAfter, 'exists' );

        var µTarget = µ( '#example--id' );
        var µTargetIndex = µTarget.getParentIndex()[0];

        var µTargetParent = µTarget.parent();
        var µTargetParentChildren = µTargetParent.children()[0].length;

        var _el = '<addedDivThing>';
        µTarget.insertAfter( _el );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by creation string' );
        µ( 'addedDivThing' ).remove();


        var µEl = µ( _el );
        µTarget.insertAfter( µEl );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by microbe' );
        µ( 'addedDivThing' ).remove();

        µEl = µ( '<addedDivThing>' )[0];
        µTarget.insertAfter( µEl );
        assert.equal( µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by element' );
        µ( 'addedDivThing' ).remove();


        var siblingDiv      = document.getElementById( 'qunit' );
        var µSiblingDiv     = µ( siblingDiv );
        var $SiblingDiv     = $( siblingDiv );
        var parentDiv       = siblingDiv.parentNode;

        var vanillaCreate = function( i )
        {
            var el  = document.createElement( 'div' );
            el      = [ µ( el ), $( el ) ];

            return el[ i ];
        };

        var vanillaRemove = function( el )
        {
            parentDiv.removeChild( el[ 0 ] );
        };

        buildTest(
        'µDiv.insertAfter( el )', function()
        {
            var µEl = vanillaCreate( 0 );

            µSiblingDiv.insertAfter( µEl );

            vanillaRemove( µEl );
        },

        '$Div.insertAfter( el )', function()
        {
            var $El = vanillaCreate( 1 );

            $El.insertAfter( $SiblingDiv );

            vanillaRemove( $El );
        } );
    });


    /**
     * µ prepend tests
     *
     * @test    prepend exists
     * @test    attached microbe
     * @test    attached element
     * @test    attached by creation string
     * @test    attached by selection string
     * @test    attached by html
     * @test    attached by array of elements
     */
    QUnit.test( '.prepend()', function( assert )
    {
        assert.ok( µ().prepend, 'exists' );

        var µNewDiv = µ( '<div.a--new--div>' );
        var µTarget = µ( '#example--id' );

        µTarget.prepend( µNewDiv );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached microbe' );
        µNewDiv.remove();

        µTarget.prepend( µNewDiv[0] );
        assert.deepEqual( µNewDiv[0], µTarget.children()[0][0], 'attached element' );
        µNewDiv.remove();

        µTarget.prepend( '<div.a--new--div>' );
        assert.deepEqual( µ( '.a--new--div' )[0], µTarget.childrenFlat()[0], 'attached by creation string' );

        µTarget.prepend( 'div.a--new--div' );
        assert.deepEqual( µ( '.a--new--div' )[0], µTarget.childrenFlat()[0], 'attached by selection string' );

        µ( '.a--new--div' ).remove();

        µTarget.prepend( '<div><span class="an--example--span">hello</span></div>' );
        assert.equal( µ( '.an--example--span' ).length, 1, 'attached by html' );

        µ( '.an--example--span!' ).remove();

        var µAnotherNewDiv = µ( '<div.a--new--div>' );

        µTarget.prepend( [ µNewDiv[0], µAnotherNewDiv[0] ] );
        assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 elements' );
        µNewDiv.remove();
        µAnotherNewDiv.remove();


        var el;
        var µDiv = µ( 'div' ).first();
        var $Div = $( 'div' ).first();

        var vanillaRemove = function( el )
        {
            el.parentNode.removeChild( el );
        };

        buildTest(
        'µDiv.prepend( el )', function()
        {
            el = document.createElement( 'div' );
            µDiv.prepend( el );

            vanillaRemove( el );
        },

        '$Div.prepend( el )', function()
        {
            el = document.createElement( 'div' );
            $Div.prepend( el );

            vanillaRemove( el );
        } );
    });


    /**
     * µ remove tests
     *
     * @test    remove exists
     * @test    element is removed
     */
    QUnit.test( '.remove()', function( assert )
    {
        assert.ok( µ().remove, 'exists' );

        var µFirstDiv   = µ( 'div' ).first();
        µFirstDiv.append( µ( '<divdiv.divide>' )[0] );

        µ( 'divdiv' ).remove();

        assert.equal( µ( 'divdiv' ).length, 0, 'element is removed' );

        var el, $El, µEl;
        var parentDiv   = µ( 'div' )[0];

        var vanillaAdd = function()
        {
            el = document.createElement( 'div' );
            µEl         = µ( el );
            $El         = $( el );

            parentDiv.appendChild( el );
            return el;
        };

        buildTest(
        'µDiv.remove()', function()
        {
            vanillaAdd();
            µEl.remove();
        },

        '$Div.remove()', function()
        {
            vanillaAdd();
            $El.remove();
        } );
    });
};

},{}],14:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
module.exports = function( buildTest )
{
    QUnit.module( 'events.js' );

    /**
     * µ emit tests
     *
     * @test    emit exists
     * @test    custom event emitted
     * @test    custom event bubbled
     */
    QUnit.test( '.emit()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().emit, 'exists' );
        var µExamples   = µ( '.example--class' );
        var µParent     = µExamples.parent();

        var emitTest    = assert.async();
        var bubbleTest  = µ.once( assert.async() );

        µExamples.on( 'emitTest', function( e )
        {
            µExamples.off();
            assert.equal( e.detail.doIt, '2 times', 'custom event emitted' );
            emitTest();
        });


        µParent.on( 'bubbleTest', function( e )
        {
            assert.equal( e.detail.bubbled, 'true', 'custom event bubbled' );
            µParent.off();
            bubbleTest();
        });


        µExamples.emit( 'emitTest', { doIt: '2 times' } );
        µParent.emit( 'bubbleTest', { bubbled: 'true' }, true );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        buildTest(
        'µDiv.emit( \'testClick\', { wooo: \'i\'m a ghost!\'} );', function()
        {
            µDiv.emit( 'testClick', { wooo: 'i\'m a ghost!'} );
        },

        '$Div.trigger( \'testClick\', { wooo: \'i\'m a ghost!\'} );', function()
        {
            $Div.trigger( 'testClick', { wooo: 'i\'m a ghost!'} );
        } );
    });


    /**
     * µ on tests
     *
     * @test    on exists
     * @test    sets unload data
     * @test    event correctly listened to
     */
    QUnit.test( '.on()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().on, 'exists' );

        var µExamples   = µ( '.example--class' );

        var onTest      = assert.async();

        µExamples.on( 'onTest', function( e )
        {
            var func = µExamples[0].data['_onTest-bound-function']['_onTest-bound-function'][0];

            assert.equal( typeof func, 'function', 'sets unload data' );
            µExamples.off();
            assert.equal( e.detail.doIt, '2 times', 'event correctly listened to' );
            onTest();
        });

        µExamples.emit( 'onTest', { doIt: '2 times' } );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        var vanillaRemoveListener = function( divs )
        {
            for ( var i = 0, lenI = divs.length; i < lenI; i++ )
            {
                divs[ i ].removeEventListener( 'click', _func );
            }
        };

        var keyCode;
        var _func = function( e )
        {
            keyCode = e.keyCode;
        };

        buildTest(
        'µ( \'div\' ).on( \'click\', function(){} )', function()
        {
            µDiv.on( 'click', _func );
            vanillaRemoveListener( µDiv );
        },

        '$( \'div\' ).on( \'click\', function(){} )', function()
        {
            $Div.on( 'click', _func );
            vanillaRemoveListener( $Div );
        } );
    });


    /**
     * µ off tests
     *
     * @test    off exists
     * @test    listener removed
     */
    QUnit.test( '.off()', function( assert )
    {
        assert.ok( µ().off, 'exists' );

        var µExamples   = µ( '.example--class' );

        µExamples.on( 'turningOff', function( e ){});
        µExamples.off( 'turningOff' );
        var func = µExamples[0].data[ '_turningOff-bound-function' ][ '_turningOff-bound-function' ][0];

        assert.equal( func, null, 'listener removed' );


        var µDiv = µ( 'div' );
        var $Div = $( 'div' );

        var vanillaAddListener = function( divs )
        {
            for ( var i = 0, lenI = divs.length; i < lenI; i++ )
            {
                divs[ i ].addEventListener( 'click', _func );
                var aDiv = divs[ i ].data       = divs[ i ].data || {};
                aDiv[ '_click-bound-function' ] = aDiv[ '_click-bound-function' ] || {};
                aDiv[ '_click-bound-function' ][ '_click-bound-function' ] = [ _func ];
            }
        };

        var keyCode;
        var _func = function( e )
        {
            keyCode = e.keyCode;
        };

        buildTest(
        'µ( \'div\' ).off( \'click\', _func )', function()
        {
            vanillaAddListener( µDiv );
            µDiv.off( 'click', _func );
        },

        '$( \'div\' ).off( \'click\', _func )', function()
        {
            vanillaAddListener( $Div );
            $Div.off( 'click', _func );
        } );
    });
};

},{}],15:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'http.js' );


    /**
     * µ http tests
     *
     * @test    http exists
     * @test    page correctly retrieved
     * @test    parameters are recieved correctly
     * @test    errors are handled correctly
     */
    QUnit.test( '.http', function( assert )
    {
        assert.ok( µ.http, 'exists' );

        var getTest      = assert.async();
        µ.http( { url: './httpTest.html', method: 'GET' } ).then( function( data )
        {
            assert.equal( data, 'moon', 'page correctly retrieved' );
            getTest();
        } );

        var parameterTest      = assert.async();
        µ.http( {
                    url         : './httpTest.html',
                    method      : 'GET',
                    headers     : {
                        Accept      : 'text/plain'
                    },
                    async       : true
                }
        ).then( function( data )
        {
            assert.equal( data, 'moon', 'parameters are recieved correctly' );
            parameterTest();
        } );

        var errorTest      = assert.async();
        µ.http( { url : './httpTest.hml' }
        ).catch( function( e )
        {
            assert.equal( e, 'Error: 404', 'errors are handled correctly' );
            errorTest();
        } );

        buildTest( 'Speed depends on network traffic.' );
    });


    /**
     * µ http.get tests
     *
     * @test    http.get exists
     * @test    page correctly retrieved
     */
    QUnit.test( '.http.get', function( assert )
    {
        assert.ok( µ.http.get, 'exists' );

        var getTest      = assert.async();

        µ.http.get( './httpTest.html' ).then( function( data )
        {
            assert.equal( data, 'moon', 'page correctly retrieved' );
            getTest();
        } );


        buildTest( 'Speed depends on network traffic.' );
    });


    /**
     * µ http.post tests
     *
     * @test    http.post exists
     */
    QUnit.test( '.http.post', function( assert )
    {
        assert.ok( µ.http.post, 'exists' );


        buildTest( 'Speed depends on network traffic.' );
    });
};

},{}],16:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'observe.js' );


    /**
     * µ get tests
     *
     * @test    get exists
     * @test    get gets
     */
    QUnit.test( '.get', function( assert )
    {
        assert.ok( µ().get, 'exists' );

        var µExamples   = µ( '.example--class' );

        µExamples[0].data = µExamples[0].data || {};
        µExamples[0].data.moo = µExamples[0].data.moo || {};
        µExamples[0].data.moo.moo = 'mooon!';

        assert.equal( µExamples.get( 'moo' )[0], 'mooon!', 'get gets' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ observe tests
     *
     * @test    observe exists
     * @test    observe function correctly stored
     * @test    object correctly observed
     */
    QUnit.test( '.observe()', function( assert )
    {
        assert.expect( 3 );

        assert.ok( µ().observe, 'exists' );

        var µExamples   = µ( '.example--class' );

        var observeTest = assert.async();

        µExamples.observe( 'observeTest', function( e )
        {
            assert.equal( typeof µExamples[0].data.observeTest._observeFunc, 'function', 'observe function stored' );
            µExamples.unobserve();
            assert.equal( e[0].object.observeTest, 'whoohoo', 'object correctly observed' );
            observeTest();
        });

        µExamples.set( 'observeTest', 'whoohoo' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ observeOnce tests
     *
     * @test    observeOnce exists
     * @test    object correctly observed
     */
    QUnit.test( '.observeOnce', function( assert )
    {
        assert.expect( 2 );

        assert.ok( µ().observeOnce, 'exists' );

        var µExamples   = µ( '.example--class' );

        var observeOnceTest      = assert.async();

        µExamples.observeOnce( 'observeOnceTest', function( e )
        {
            assert.equal( e[0].object.observeOnceTest, 'whoohoo', 'object correctly observed' );

            observeOnceTest();
        });

        µExamples.set( 'observeOnceTest', 'whoohoo' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ set tests
     *
     * @test    set exists
     * @test    set sets
     */
    QUnit.test( '.set', function( assert )
    {
        assert.ok( µ().set, 'exists' );

        var µExamples   = µ( '.example--class' );
        µExamples.set( 'moo', 'mooon!' );

        var setData = µExamples[0].data.moo.moo;

        assert.equal( setData, 'mooon!', 'set sets' );


        buildTest( 'No comparison available.' );
    });


    /**
     * µ unobserve tests
     *
     * @test    unobserve exists
     */
    QUnit.test( '.unobserve', function( assert )
    {
        assert.ok( µ().unobserve, 'exists' );

        buildTest( 'No comparison available.' );
    });
};

},{}],17:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'root.js' );


    /**
     * µ capitalize tests
     *
     * @test    capitalize exists
     * @test    capitalise exists
     * @test    capitalizes strings
     * @test    capitalizes string arrays
     */
    QUnit.test( '.capitalize()', function( assert )
    {
        assert.ok( µ.capitalize, 'capitalize exists' );
        assert.ok( µ.capitalise, 'capitalise exists' );
        assert.ok( µ.capitalise( 'i dont know' ) === 'I Dont Know', 'capitalizes strings' );

        var strArr = [ 'i dont know', 'for real' ];
            strArr = µ.capitalize( strArr );
        assert.ok( strArr[0] === 'I Dont Know' && strArr[1] === 'For Real', 'capitalizes string arrays' );

        var str = 'i dont know';
        // http://stackoverflow.com/questions/22576425/capitalize-first-letter-in-a-string-with-letters-and-numbers-using-jquery#22576505
        buildTest( 'µ.capitalize()', function()
        {
            return µ.capitalize( str );
        }, 'stack overflow accepted answer', function()
        {
            strArr = str.split( ' ' );
            strArr = strArr.map( function( val )
            {
                return val.replace( /([a-z])/, function ( match, value )
                {
                    return value.toUpperCase();
                } );
            } );
            return strArr.join( ' ' );
        } );
    });


    /**
     * µ debounce tests
     *
     * @test    debounce exists
     * @test    reuns on it's timer
     */
    QUnit.test( '.debounce()', function( assert )
    {
        assert.ok( µ.debounce, 'exists' );

        var i   = 1;
        var _f  = µ.debounce( function(){ i++; return i; }, 50 );
        _f();
        _f();
        _f();

        var multiplesTest      = assert.async();

        setTimeout( function( _f )
        {
            assert.equal( i, 2, 'runs on it\'s timer' );
            multiplesTest();
        }, 60 );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ identity tests
     *
     * @test    identity exists
     * @test    it equals itself
     */
    QUnit.test( '.identity()', function( assert )
    {
        assert.ok( µ.identity, 'exists' );
        var val = 'mooon';
        assert.equal( 'mooon', µ.identity( 'mooon' ), 'it equals itself' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ insertStyle tests
     *
     * @test    insertStyle exists
     */
    QUnit.test( '.insertStyle()', function( assert )
    {
        assert.ok( µ.insertStyle, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );
        var savedColor = µ.__customCSSRules[ '#qunit' ].none.obj.color;

        assert.equal( µ( '#qunit' ).css( 'color' )[0], 'rgb(255, 0, 255)', 'sets the rule' );
        assert.equal( savedColor, '#f0f', 'saves the reference' );

        µ.removeStyle( '#qunit' );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'color':'#f0f' }, media );

        assert.ok( µ.__customCSSRules[ '#qunit' ][ media ], 'inserts media queries' );
        µ.removeStyle( '#qunit' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ isArray tests
     *
     * @test    isArray exists
     * @test    true for array
     * @test    false otherwise
     */
    QUnit.test( '.isArray()', function( assert )
    {
        assert.ok( µ.isArray, 'exists' );
        assert.ok( µ.isArray( [ 1, 2, 3 ] ), 'true for array' );
        assert.ok( !µ.isArray( { 1: 'a', 2: 'b' } ), 'false otherwise' );

        buildTest(
        'µ.isArray', function()
        {
            µ.isArray( {} );
            µ.isArray( [ 1, 2, 3 ] );
        },

        '$.isArray', function()
        {
            $.isArray( {} );
            $.isArray( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isEmpty tests
     *
     * @test    isEmpty exists
     * @test    true for empty
     * @test    false otherwise
     */
    QUnit.test( '.isEmpty()', function( assert )
    {
        assert.ok( µ.isEmpty, 'exists' );
        assert.ok( µ.isEmpty( {} ), 'true on empty' );
        assert.ok( !µ.isEmpty( { a: 1 } ), 'false otherwise' );

        buildTest(
        'µ.isEmpty', function()
        {
            µ.isEmpty( {} );
            µ.isEmpty( { a: 2 } );
        },

        '$.isEmptyObject', function()
        {
            $.isEmptyObject( {} );
            $.isEmptyObject( { a: 2 } );
        } );
    });


    /**
     * µ isFunction tests
     *
     * @test    isFunction exists
     * @test    true for function
     * @test    false otherwise
     */
    QUnit.test( '.isFunction()', function( assert )
    {
        assert.ok( µ.isFunction, 'exists' );
        assert.ok( µ.isFunction( assert.ok ), 'true on function' );
        assert.ok( !µ.isFunction( {} ), 'false otherwise' );

        buildTest(
        'µ.isFunction', function()
        {
            µ.isFunction( function(){} );
            µ.isFunction( [ 1, 2, 3 ] );
        },

        '$.isFunction', function()
        {
            $.isFunction( function(){} );
            $.isFunction( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isObject tests
     *
     * @test    isObject exists
     * @test    true for objects
     * @test    false otherwise
     */
    QUnit.test( '.isObject()', function( assert )
    {
        assert.ok( µ.isObject, 'exists' );
        assert.ok( µ.isObject( {} ), 'true for objects' );
        assert.ok( !µ.isObject( 'ä' ), 'false otherwise' );

        buildTest(
        'µ.isObject', function()
        {
            µ.isObject( {} );
            µ.isObject( [ 1, 2, 3 ] );
        },

        '$.isPlainObject', function()
        {
            $.isPlainObject( {} );
            $.isPlainObject( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ isUndefined tests
     *
     * @test    isUndefined exists
     * @test    false if parent contains property
     * @test    true otherwise
     */
    QUnit.test( '.isUndefined()', function( assert )
    {
        var parent = { a: 1 };
        assert.ok( µ.isUndefined, 'exists' );
        assert.ok( !µ.isUndefined( 'a', parent ), 'false if parent contains property' );
        assert.ok( µ.isUndefined( 'b', parent ), 'true otherwise' );

        buildTest( 'No comparison available.' );
    });


    /**
     * µ isWindow tests
     *
     * @test    isWindow exists
     * @test    true for window
     * @test    false otherwise
     */
    QUnit.test( '.isWindow()', function( assert )
    {
        assert.ok( µ.isWindow, 'exists' );
        assert.ok( µ.isWindow( window ), 'true for window' );
        assert.ok( !µ.isWindow( {} ), 'false otherwise' );

        buildTest(
        'µ.isWindow', function()
        {
            µ.isWindow( window );
            µ.isWindow( [ 1, 2, 3 ] );
        },

        '$.isWindow', function()
        {
            $.isWindow( window );
            $.isWindow( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ noop tests
     *
     * @test    noop exists
     * @test    nothing happens
     */
    QUnit.test( '.noop()', function( assert )
    {
        assert.ok( µ.noop, 'noop exists' );
        assert.equal( µ.noop(), undefined, 'nothing happens' );

        buildTest(
        'µ.noop()', function()
        {
            µ.noop();
        },

        '$.noop()', function()
        {
            $.noop();
        } );
    });


    /**
     * µ once tests
     *
     * @test    once exists
     */
    QUnit.test( '.once()', function( assert )
    {
        assert.ok( µ.once, 'exists' );
        var i   = 1;
        var _f  = µ.once( function(){ i++; return i; } );
        assert.equal( _f(), 2, 'runs once' );
        assert.equal( _f(), 2, 'and only once' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ poll tests
     *
     * @test    poll exists
     */
    QUnit.test( '.poll()', function( assert )
    {
        assert.expect( 3 );

        var _fail       = function(){ return false; };
        var _succees    = function(){ return true; };

        var failTest    = assert.async();

        assert.ok( µ.poll, 'exists' );

        µ.poll( _fail, _fail, function()
        {
            assert.ok( true, 'failure handled correctly' );
            failTest();
        }, 100, 25 );

        var successTest = assert.async();

        µ.poll( _succees, function()
        {
            assert.ok( true, 'success handled correctly' );
            successTest();
        }, _succees, 100, 25 );


        buildTest( 'No speed tests available.' );
    });


    /**
     * µ removeStyle tests
     *
     * @test    removeStyle exists
     */
    QUnit.test( '.removeStyle()', function( assert )
    {
        assert.ok( µ.removeStyle, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'display':'none' }, media );
        µ.removeStyle( '#qunit', media );

        assert.equal( µ( '#qunit' ).css( 'display' )[0], 'block', 'removes individual media queries' );
        µ.removeStyle( '#qunit' );

        assert.ok( !µ.__customCSSRules[ '#qunit' ].none, 'removes base references' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ removeStyles tests
     *
     * @test    removeStyles exists
     */
    QUnit.test( '.removeStyles()', function( assert )
    {
        assert.ok( µ.removeStyles, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'display':'none' }, media );
        µ.removeStyles( '#qunit' );

        assert.equal( µ( '#qunit' ).css( 'display' )[0], 'block', 'removes all tags' );
        assert.ok( !µ.__customCSSRules[ '#qunit' ].none && !µ.__customCSSRules[ '#qunit' ][ media ], 'removes all references' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ toArray tests
     *
     * @test    µ().toArray exists
     * @test    µ.toArray exists
     * @test    makes arrays
     */
    QUnit.test( '.toArray()', function( assert )
    {
        assert.ok( µ.toArray, 'exists' );

        var µArr = µ( 'div' );
        assert.equal( µ.type( µ.toArray( µArr ) ), 'array', 'makes arrays' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ toString tests
     *
     * @test    µ().toString exists
     * @test    µ.toString exists
     * @test    microbe is [object Microbe]
     */
    QUnit.test( '.toString()', function( assert )
    {
        assert.ok( µ().toString, 'µ().toString exists' );
        assert.ok( µ.toString, 'exists on root' );
        assert.ok( µ().toString() === '[object Microbe]', 'microbe is [object Microbe]' );

        buildTest(
        'µ.toString', function()
        {
            µ.toString( µ );
            µ.toString( [ 1, 2, 3 ] );
        },

        '$.toString', function()
        {
            $.toString( $ );
            $.toString( [ 1, 2, 3 ] );
        } );
    });


    /**
     * µ type tests
     *
     * @test    µ.type exists
     * @test    checks arrays
     * @test    checks numbers
     * @test    checks objects
     * @test    checks strings
     * @test    checks dates
     * @test    checks microbes
     * @test    checks regex
     * @test    checks functions
     * @test    checks boolean primitives
     * @test    checks boolean objects
     * @test    checks error objects
     * @test    checks promises
     */
    QUnit.test( '.type()', function( assert )
    {
        window.Promise     = window.Promise || require( 'promise' );

        assert.ok( µ.type, 'exists' );
        assert.equal( µ.type( [] ), 'array', 'checks arrays' );
        assert.equal( µ.type( 2 ), 'number', 'checks numbers' );
        assert.equal( µ.type( {} ), 'object', 'checks objects' );
        assert.equal( µ.type( 'moin!' ), 'string', 'checks strings' );
        assert.equal( µ.type( new Date() ), 'date', 'checks dates' );
        assert.equal( µ.type( µ( 'div' ) ), 'microbe', 'checks microbes' );
        assert.equal( µ.type( /[0-9]/ ), 'regExp', 'checks regex' );
        assert.equal( µ.type( assert.ok ), 'function', 'checks functions' );
        assert.equal( µ.type( true ), 'boolean', 'checks boolean primitives' );
        assert.equal( µ.type( new Boolean( true ) ), 'object', 'checks boolean objects' );
        assert.equal( µ.type( new Error() ), 'error', 'checks error objects' );
        assert.equal( µ.type( new Promise(function(){}) ), 'promise', 'checks promises' );

        buildTest(
        'µ.type', function()
        {
            µ.type( [] );
            µ.type( 2 );
            µ.type( {} );
            µ.type( 'moin!' );
            µ.type( new Date() );
            µ.type( µ( 'div' ) );
            µ.type( /[0-9]/ );
            µ.type( assert.ok );
            µ.type( true );
            µ.type( new Boolean( true ) );
            µ.type( new Error() );
            µ.type( new Promise(function(){}) );
        },

        '$.type', function()
        {
            $.type( [] );
            $.type( 2 );
            $.type( {} );
            $.type( 'moin!' );
            $.type( new Date() );
            $.type( $( 'div' ) );
            $.type( /[0-9]/ );
            $.type( assert.ok );
            $.type( true );
            $.type( new Boolean( true ) );
            $.type( new Error() );
            $.type( new Promise(function(){}) );
        } );
    });


    /**
     * µ xyzzy tests
     *
     * @test    xyzzy exists
     * @test    nothing happens
     */
    QUnit.test( '.xyzzy()', function( assert )
    {
        assert.ok( µ.xyzzy, 'xyzzy exists' );
        assert.equal( µ.xyzzy(), undefined, 'nothing happens' );

        buildTest(
        'µ.xyzzy()', function()
        {
            µ.xyzzy();
        },

        '$.noop()', function()
        {
            $.noop();
        } );
    });
};

},{"promise":3}]},{},[1]);
