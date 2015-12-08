/**
 * root.js
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 *
 * @package Microbe
 */

module.exports = function( Microbe )
{
    'use strict';

    window.Promise  = window.Promise || require( 'promise' );
    var Types       = require( './types' );

    /**
     * ## capitalize
     *
     * capitalizes every word in a string or an array of strings and returns the
     * type that it was given
     *
     * @param {Mixed} text string(s) to capitalize _{String or Array}_
     *
     * @example µ.capitalize( 'moon doge' ); // "Moon Doge"
     *
     * @return _Mixed_  capitalized string(s) values _{String or Array}_
     */
    Microbe.capitalize = function( text )
    {
        var array   = Microbe.isArray( text );
        text        = !array ? [ text ] : text;

        var str, res = [];

        for ( var i = 0, lenI = text.length; i < lenI; i++ )
        {
            str = text[ i ].split( ' ' );
            for ( var j = 0, lenJ = str.length; j < lenJ; j++ )
            {
                str[ j ] = str[ j ][ 0 ].toUpperCase() + str[ j ].slice( 1 );
            }
            res.push( str.join( ' ' ) );
        }

        return ( array ) ? res : res[ 0 ];
    };


    /**
     * ## capitalise
     *
     * british people....
     *
     * @example µ.capitalise( 'moon doge' ); // "Moon Doge"
     */
    Microbe.capitalise = Microbe.capitalize;


    /**
     * ## debounce
     *
     *  Returns a function, that, as long as it continues to be invoked, will not
     *  be triggered. The function will be called after it stops being called for
     *  [[wait]] milliseconds. If `immediate` is passed, trigger the function on
     *  the leading edge, instead of the trailing.
     *
     * @param {Function} _func function to meter
     * @param {Number} wait milliseconds to wait
     * @param {Boolean} immediate run function at the start of the timeout
     *
     * @example µ.debounce( function(){ return Date.now(); }, 250 );
     * @example µ.debounce( function(){ return Date.now(); }, 250, true );
     *
     * @return _Function_
     */
    Microbe.debounce = function( _func, wait, immediate )
    {
        var timeout;

        return function()
        {
            var self = this,
                args    = arguments;

            var later   = function()
            {
                timeout = null;

                if ( !immediate )
                {
                    _func.apply( self, args );
                }
            };

            var callNow = immediate && !timeout;
            clearTimeout( timeout );
            timeout     = setTimeout( later, wait );

            if ( callNow )
            {
                _func.apply( self, args );
            }
        };
    };


    /**
     * ## extend
     *
     * Extends an object or microbe
     *
     * @example µ.extend( { a: 1, b: 2 }, { c: 3, d: 4 } );
     *
     * @return _Object_ reference to this (microbe) or the first
     *                     object passed (root)
     */
    Microbe.extend = function()
    {
        var µIsObject   = Microbe.isObject;
        var µIsArray    = Microbe.isArray;

        var res     = arguments[ 0 ] || {};
        var i       = 1;
        var length  = arguments.length;
        var deep    = false;

        if ( typeof res === 'boolean' )
        {
            deep    = res;
            res     = arguments[ i ] || {};
            i++;
        }

        if ( typeof res !== 'object' && !Microbe.isFunction( res ) )
        {
            res = {};
        }

        if ( i === length )
        {
            res = this;
            i--;
        }

        var _object, _p, src, copy, isArray, clone;
        for ( ; i < length; i++ )
        {
            _object = arguments[ i ];

            if ( _object !== null && _object !== undefined )
            {
                for ( _p in _object )
                {
                    src     = res[ _p ];
                    copy    = _object[ _p ];

                    if ( res === copy )
                    {
                        continue;
                    }

                    if ( deep && copy && ( µIsObject( copy ) ||
                            ( isArray = µIsArray( copy ) ) ) )
                    {
                        if ( isArray )
                        {
                            isArray = false;
                            clone   = src && µIsArray( src ) ? src : [];
                        }
                        else
                        {
                            clone = src && µIsObject( src ) ? src : {};
                        }

                        res[ _p ] = Microbe.extend( deep, clone, copy );
                    }
                    else if ( copy !== undefined )
                    {
                        res[ _p ] = copy;
                    }
                }
            }
        }

        return res;
    };


    /**
     * mounts extend to the core
     *
     * @example µ( '.example' ).extend( { c: 3, d: 4 } );
     */
    Microbe.core.extend     = Microbe.extend;


    /**
     * ## identity
     *
     * returns itself.  useful in functional programmnig when a function must be executed
     *
     * @param {any} value any value
     *
     * @example µ.identity( 'moon' ); // 'moon'
     *
     * @return _any_
     */
    Microbe.identity = function( value ) { return value; };


    /**
     * ## isArray
     *
     * native isArray for completeness
     *
     * @example µ.isArray( [ 1, 2, 3 ] ); // true
     *
     * @type _Function_
     */
    Microbe.isArray = Array.isArray;


    /**
     * ## isEmpty
     *
     * Checks if the passed object is empty
     *
     * @param {Object} obj object to check
     *
     * @example µ.isEmpty( {} ); // true
     *
     * @return _Boolean_ empty or not
     */
    Microbe.isEmpty = function( obj )
    {
        var name;
        for ( name in obj )
        {
            return false;
        }

        return true;
    };


    /**
     * ## isFunction
     *
     * Checks if the passed parameter is a function
     *
     * @param {Object} obj object to check
     *
     * @example µ.isFunction( function(){} ); // true
     *
     * @return _Boolean_ function or not
     */
    Microbe.isFunction = function( obj )
    {
        return Microbe.type( obj ) === "function";
    };


    /**
     * ## isObject
     *
     * Checks if the passed parameter is an object
     *
     * @param {Object} obj object to check
     *
     * @example µ.isObject( {} ); // true
     *
     * @return _Boolean_ isObject or not
     */
    Microbe.isObject = function( obj )
    {
        if ( Microbe.type( obj ) !== "object" || obj.nodeType || Microbe.isWindow( obj ) )
        {
            return false;
        }

        return true;
    };


    /**
     * ## isUndefined
     *
     * Checks if the passed parameter is undefined
     *
     * @param {String} obj property
     * @param {Object} parent object to check
     *
     * @example µ.isUndefined( {} ); // false
     *
     * @return _Boolean_ obj in parent
     */
    Microbe.isUndefined = function( obj, parent )
    {
        if ( parent && typeof parent !== 'object' )
        {
            return true;
        }

        return parent ? !( obj in parent ) : obj === void 0;
    };


    /**
     * ## isWindow
     *
     * Checks if the passed parameter equals window
     *
     * @param {Object} obj object to check
     *
     * @example µ.isWindow( window ); // true
     *
     * @return _Boolean_ isWindow or not
     */
    Microbe.isWindow = function( obj )
    {
        return obj !== null && obj === obj.window;
    };


    /**
     * ## merge
     *
     * Combines microbes, arrays, and/or array-like objects.
     *
     * @param {Mixed} first               first object _{Array-like Object or Array}_
     * @param {Mixed} second              second object _{Array-like Object or Array}_
     *
     * @example µ.merge( [ 1, 2 ], [ 2, 3, 4 ] ); // [ 1, 2, 2, 3, 4 ]
     * @example µ.merge( [ 1, 2 ], [ 2, 3, 4 ], true );// [ 1, 2, 3, 4 ]
     *
     * @return _Mixed_ combined array or array-like object (based off first)
     */
    Microbe.merge = function( first, second, unique )
    {
        if ( typeof second === 'boolean' )
        {
            unique = second;
            second = null;
        }

        if ( !second )
        {
            second  = first;
            first   = this;
        }

        var i = first.length;

        if ( typeof i === 'number' )
        {
            for ( var j = 0, len = second.length; j < len; j++ )
            {
                if ( !unique || first.indexOf( second[ j ] ) === -1 )
                {
                    first[ i++ ] = second[ j ];
                }
            }

            first.length = i;
        }

        return first;
    };


    Microbe.core.merge      = Microbe.merge;


    /**
     * ## noop
     *
     * Nothing happens
     *
     * https://en.wikipedia.org/wiki/Xyzzy_(computing)
     *
     * @example µ.noop()
     *
     * @return _void_
     */
    Microbe.noop = function() {};


    /**
     * ## once
     *
     * returns a function that can only be run once
     *
     * @param {Function} _func function to run once
     *
     * @example µ.once( function( a ){ return 1 + 1; } );
     *
     * @return _Function_
     */
    Microbe.once = function( _func, self )
    {
        var result;

        return function()
        {
            if( _func )
            {
                result  = _func.apply( self || this, arguments );
                _func   = null;
            }

            return result;
        };
    };


    /**
     * ## poll
     *
     * checks a passed function for true every [[interval]] milliseconds.  when
     * true, it will run _success, if [[timeout[[]] is reached without a success,
     * _error is excecuted
     *
     * @param {Function} _func function to check for true
     * @param {Function} _success function to run on success
     * @param {Function} _error function to run on error
     * @param {Number} timeout time (in ms) to stop polling
     * @param {Number} interval time (in ms) in between polling
     *
     * @example µ.poll( function( a ){ return a === 2; },
     *                    function( a ){ console.log( 'a === 2' ); },
     *                    function( a ){ console.log( 'a !== 2' ); } );
     * @example µ.poll( function( a ){ return a === 2; },
     *                    function( a ){ console.log( 'a === 2' ); },
     *                    function( a ){ console.log( 'a !== 2' ); },
     *                    200, 10000 );
     *
     * @return _Function_
     */
    Microbe.poll = function( _func, _success, _error, timeout, interval )
    {
        var endTime = Number( new Date() ) + ( timeout || 2000 );
        interval    = interval || 100;

        ( function p()
        {
            if ( _func() )
            {
                try
                {
                    _success();
                }
                catch( e )
                {
                    throw 'No argument given for success function';
                }
            }
            else if ( Number( new Date() ) < endTime )
            {
                setTimeout( p, interval );
            }
            else {
                try
                {
                    _error( new Error( 'timed out for ' + _func + ': ' + arguments ) );
                }
                catch( e )
                {
                    throw 'No argument given for error function.';
                }
            }
        } )();
    };


    /**
     * ## toArray
     *
     * Methods returns all the elements in an array.
     *
     * @example µ.toArray( µ( 'div' ) );
     *
     * @return _Array_
     */
    Microbe.toArray = function( _arr )
    {
        return Array.prototype.slice.call( _arr || this );
    };


    /**
     * attaches toArray to core
     *
     * @example µ( 'div' ).toArray();
     */
    Microbe.core.toArray    = Microbe.toArray;


    /**
     * ## type
     *
     * returns the type of the parameter passed to it
     *
     * @param {all} obj parameter to test
     *
     * @example µ.type( 'moon' ); // 'string'
     * @example µ.type( [ 'moon' ] ); // 'array'
     *
     * @return _String_ typeof obj
     */
    Microbe.type = function( obj )
    {
        if ( obj === null )
        {
            return obj + '';
        }

        var type = Types[ Object.prototype.toString.call( obj ) ];
            type = !type ? Types[ obj.toString() ] : type;

        type = type || typeof obj;

        if ( type === 'object' && obj instanceof Promise )
        {
            type = 'promise';
        }

        return  type;
    };


    /**
     * ## xyzzy
     *
     * nothing happens
     *
     * https://en.wikipedia.org/wiki/Xyzzy_(computing)
     *
     * @example µ.xyzzy();
     *
     * @return _void_
     */
    Microbe.xyzzy   = Microbe.noop;
};
