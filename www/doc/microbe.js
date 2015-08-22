/*!
 * Microbe JavaScript Library v0.3.9
 * http://m.icro.be
 *
 * Copyright 2014-2015 Sociomantic Labs and other contributors
 * Released under the MIT license
 * http://m.icro.be/license
 *
 * Date: Sat Aug 22 2015
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.µ=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * ## Microbe
 *
 * Builds the Microbe object
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
 /*jshint globalstrict: true*/
'use strict';

var _type       = '[object Microbe]';
var _version    = '0.3.10';

var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};

Microbe.core    = {};
Microbe.version = _version;
Microbe.type    = _type;

require( './core' )();
// require( './root' )( Microbe );
// require( './dom' )( Microbe );
// require( './http' )( Microbe );
// require( './observe' )( Microbe );
// require( './events' )( Microbe );
// require( './pseudo' )( Microbe );


require( './pristella' )( Microbe, _type );

Microbe.core.constructor = Microbe;

/**
 * ## exported
 *
 * @return _Microbe_
 */
module.exports = Microbe;

},{"./core":2,"./pristella":3}],2:[function(require,module,exports){
/**
 * core.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
 /*jshint globalstrict: true*/
 'use strict';

var Arrays      = require( './utils/array' );
var Strings     = require( './utils/string' );

var slice       = Arrays.slice;
var splice      = Arrays.splice;
var push        = Arrays.push;
var forEach     = Arrays.forEach;
var map         = Arrays.map;
var indexOf     = Arrays.indexOf;
var toString    = Strings.toString;


module.exports = function()
{
    var _type       = Microbe.type;
    
    Microbe.core    = Microbe.prototype = {

        /**
         * ## addClass
         *
         * Adds the passed class to the current element(s)
         *
         * @param {Mixed} _class    class to remove.  this accepts
         *                  strings and array of strings.
         *                  the strings can be a class or
         *                  classes seperated with spaces _{String or Array}_
         *
         * @return _Microbe_ reference to original microbe
         */
        addClass : (function()
        {
            var _addClass = function( _class, _el )
            {
                for ( var i = 0, lenI = _class.length; i < lenI; i++ )
                {
                    var _c = _class[ i ].split( ' ' );

                    for ( var j = 0, lenJ = _c.length; j < lenJ; j++ )
                    {
                        if ( _c[ j ] !== '' )
                        {
                            _el.classList.add( _c[ j ] );
                        }
                    }
                }

                _el.data                = _el.data  || {};
                _el.data.class          = _el.data.class || {};
                _el.data.class.class    = _el.className;
            };

            return function( _class )
            {
                if ( typeof _class === 'string' )
                {
                    _class = [ _class ];
                }

                var i, len;
                for ( i = 0, len = this.length; i < len; i++ )
                {
                    _addClass( _class, this[ i ] );
                }

                return this;
            };
        }()),


        /**
         * ## attr
         *
         * Changes the attribute by writing the given property and value to the
         * supplied elements.  If the value is omitted, simply returns the current
         * attribute value of the element. Attributes can be bulk added by passing
         * an object (property: value)
         *
         * @param {Mixed} _attribute          attribute name {String or Object}
         * @param {String} _value              attribute value (optional)
         *
         * @return _Microbe_ reference to original microbe (set)
         * @return _Array_  array of values (get)
         */
        attr : function ( _attribute, _value )
        {
            var attrObject = !!Microbe.isObject( _attribute );

            var _setAttr = function( _elm )
            {
                var _set = function( _a, _v )
                {
                    if ( !_elm.getAttribute )
                    {
                        _elm[ _a ] = _v;
                    }
                    else
                    {
                        _elm.setAttribute( _a, _v );
                    }

                    _elm.data                   = _elm.data || {};
                    _elm.data.attr              = _elm.data.attr || {};
                    _elm.data.attr.attr         = _elm.data.attr.attr || {};
                    _elm.data.attr.attr[ _a ]   = _v;
                };

                if ( _value === null )
                {
                    _removeAttr( _elm );
                }
                else
                {
                    var _attr;
                    if ( !attrObject )
                    {
                        _set( _attribute, _value );
                    }
                    else
                    {
                        for ( _attr in _attribute )
                        {
                            _value = _attribute[ _attr ];
                            _set( _attr, _value );
                        }
                    }
                }
            };

            var _getAttr = function( _elm )
            {
                if ( _elm.getAttribute( _attribute ) === null )
                {
                    return _elm[ _attribute ];
                }
                return _elm.getAttribute( _attribute );
            };

            var _removeAttr = function( _elm )
            {
                if ( _elm.getAttribute( _attribute ) === null )
                {
                    delete _elm[ _attribute ];
                }
                else
                {
                    _elm.removeAttribute( _attribute );
                }
                delete _elm.data.attr.attr[ _attribute ];
            };

            if ( _value !== undefined || attrObject )
            {
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

            return attributes;
        },


        /**
         * ## children
         *
         * Gets a microbe of all the given element's children
         *
         * @return _Array_  array of microbes (value)
         */
        children : function()
        {
            var i, len, childrenArray = new Array( this.length );

            for ( i = 0, len = this.length; i < len; i++ )
            {
                childrenArray[ i ] = this.constructor( this[ i ].children );
            }

            return childrenArray;
        },


        /**
         * ## childrenFlat
         *
         * Gets an microbe of all children of all element's given
         *
         * @return _Microbe_ value array of combined children
         */
        childrenFlat : function( direction )
        {
            var arr, i, len, childrenArray = [];

            for ( i = 0, len = this.length; i < len; i++ )
            {
                arr = this[ i ].children;

                for ( var j = 0, lenJ = arr.length; j < lenJ; j++ )
                {
                    if ( childrenArray.indexOf( arr[ j ] ) === -1 )
                    {
                        childrenArray.push( arr[ j ] );
                    }
                }
            }

            return this.constructor( childrenArray );
        },


        /**
         * ## css
         *
         * Changes the CSS by writing the given property and value inline to the
         * supplied elements. (properties should be supplied in javascript format).
         * If the value is omitted, simply returns the current css value of the element.
         *
         * @param {String} _attribute          css property
         * @param {String} _value              css value (optional)
         *
         * @return _Microbe_ reference to original microbe (set)
         * @return _Array_  array of values (get)
         */
        css : function ( _property, _value )
        {
            var _setCss = function( _elm )
            {
                _elm.data                   = _elm.data || {};
                _elm.data.css               = _elm.data.css || {};
                _elm.data.css[ _property ]  = _value;
                _elm.style[ _property ]     = _elm.data.css[ _property ];
            };

            var _getCss = function( _elm )
            {
                return window.getComputedStyle( _elm ).getPropertyValue( _property );
            };

            if ( _value || _value === null || _value === '' )
            {
                _value = ( _value === null ) ? '' : _value;

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

            return styles;
        },


        /**
         * ## each
         *
         * Methods iterates through all the elements an execute the function on each of
         * them
         *
         * @param {Function} _callback           function to apply to each item
         *
         * @return _Microbe_ reference to original microbe
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


        /**
         * ## extend
         *
         * Extends an object or microbe
         *
         * @return _Object_ reference to this (microbe) or the first
         *                     object passed (root)
         */
        extend : function()
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
        },


        /**
         * ## filter
         *
         * Filters the microbe by the given given selector or function.  In the case
         * of a function, the element is passed as this. The inclusion on an element
         * into the set is based on the return of the function
         *
         * @param {Mixed} selector selector or function to filter by
         *
         * @return _Microbe_ new microbe containing only the filtered values
         */
        filter : function( filter )
        {
            var pseudo, filters, self = this, _el, method;

            if ( this.length === 0 )
            {
                return this;
            }

            if ( typeof filter === 'function' )
            {
                var res = [];

                for ( var i = 0, lenI = this.length; i < lenI; i++ )
                {
                    if ( filter.call( this[ i ], i ) )
                    {
                        res.push( this[ i ] );
                    }
                }
                return this.constructor( res );
            }
            else
            {
                var _filter = function( _f, _self, i )
                {
                    if ( Microbe.pseudo[ _f[ 0 ] ] )
                    {
                        return Microbe.pseudo[ _f[ 0 ] ]( _self, _f[ 1 ] );
                    }
                    else
                    {
                        var resArray = [], _selector;
                        _selector = i === 0 ? _f[ 0 ] : ':' + _f[ 0 ];

                        if ( _selector !== '' )
                        {
                            if ( _f[ 1 ] !== '' )
                            {
                                _selector += '(' + _f[ 1 ] + ')';
                            }

                            for ( var j = 0, lenJ = _self.length; j < lenJ; j++ )
                            {
                                _el = _self[ j ];

                                if ( Microbe.matches( _el, _selector ) === true )
                                {
                                    resArray.push( _el );
                                }
                            }
                        }

                        return new Microbe( resArray );
                    }
                };

                if ( filter && filter.indexOf( ':' ) !== -1 )
                {
                    pseudo  = filter.split( ':' );
                    filters = [ [ pseudo.splice( 0, 1 ).toString(), '' ] ];

                    var _p, pseudoArray;

                    for ( var h = 0, lenH = pseudo.length; h < lenH; h++ )
                    {
                        _p = pseudo[ h ];

                        if ( _p.indexOf( '(' ) !== - 1 )
                        {
                            _p      = _p.split( '(' );
                            _p[ 1 ] = _p[ 1 ].replace( ')', '' );
                        }
                        else
                        {
                            _p      = [ _p, '' ];
                        }

                        filters.push( _p );
                    }
                }
                else if ( filter )
                {
                    filters = [ [ filter, '' ] ];
                }
                else
                {
                    return this;
                }

                for ( var k = 0, lenK = filters.length; k < lenK; k++ )
                {
                    if ( self.length !== 0 )
                    {
                        if ( filters[ k ][ 0 ] !== '' )
                        {
                            self = _filter( filters[ k ], self, k );
                        }
                    }
                    else
                    {
                        return self;
                    }
                }

                return self;
            }
        },


        /**
         * ## find
         *
         * Finds a child element with the given selector inside the scope of the current microbe
         *
         * @param {String} selector            selector to search for
         *
         * @return _Microbe_ new microbe containing only the found children values
         */
        find : function( _selector )
        {
            var _s          = _selector[ 0 ];

            if ( _s === ' ' )
            {
                _selector   = _selector.trim();
                _s          = _selector[ 0 ];
            }

            if ( _s === '>' )
            {
                _selector = _selector.slice( 1 );
                return this.childrenFlat().filter( _selector );
            }
            else if ( _s === '~' )
            {
                _selector = _selector.slice( 1 );
                return this.siblingsFlat().filter( _selector );
            }
            else if ( _s === '!' )
            {
                return this.parent();
            }
            else if ( _s === '+' )
            {
                _selector       = _selector.slice( 1 );
                var resArray    = [],
                    _el, els    = this.children();

                for ( var i = 0, lenI = els.length; i < lenI; i++ )
                {
                    _el = els[ i ][ 0 ];

                    if ( _el )
                    {
                        resArray.push( _el );
                    }
                }

                return new Microbe( resArray ).filter( _selector );
            }
            else if ( _selector.indexOf( ':' ) !== -1 )
            {
                return this.constructor( _selector, this );
            }

            var _children = new Microbe( _selector ), res = [];

            for ( var j = 0, lenJ = this.length; j < lenJ; j++ )
            {
                for ( var k = 0, lenK = _children.length; k < lenK; k++ )
                {
                    if ( Microbe.contains( _children[ k ], this[ j ] ) )
                    {
                        res.push( _children[ k ] );
                    }
                }
            }

            return this.constructor( res );
        },


        /**
         * ## first
         *
         * gets the first Element of the current microbe, and wraps it in
         * Microbe.
         *
         * @return _Microbe_ new microbe containing only the first value
         */
        first : function()
        {
            if ( this.length !== 0 )
            {
                return this.constructor( this[ 0 ] );
            }

            return this.constructor( [] );
        },


        /**
         * ## getParentIndex
         *
         * Gets the index of the item in it's parentNode's children array
         *
         * @return _Array_ array of index values
         */
        getParentIndex : function()
        {
            var _getParentIndex = function( _elm )
            {
                return indexOf.call( _elm.parentNode.children, _elm );
            };

            var i, len, indexes = new Array( this.length );

            for ( i = 0, len = this.length; i < len; i++ )
            {
                indexes[ i ] = _getParentIndex( this[ i ] );
            }

            return indexes;
        },


        /**
         * ## hasClass
         *
         * Checks if the current object or the given element has the given class
         *
         * @param {String} _class              class to check
         *
         * @return _Microbe_ Array of Boolean values
         */
        hasClass : function( _class )
        {
            var _hasClass = function( _elm )
            {
                return _elm.classList.contains( _class );
            };

            var i, len, results = new Array( this.length );
            for ( i = 0, len = this.length; i < len; i++ )
            {
                results[ i ] = _hasClass( this[ i ] );
            }

            return results;
        },


        /**
         * ## html
         *
         * Changes the innerHtml to the supplied string or microbe.  If the value is
         * omitted, simply returns the current inner html value of the element.
         *
         * @param {Mixed} _value html value (accepts Microbe String)
         *
         * @return _Microbe_ reference to original microbe (set)
         * @return _Array_  array of values (get)
         */
        html : function ( _value )
        {
            var _append;
            if ( _value && _value.type === _type )
            {
                _append = _value;
                _value = '';
            }

            var _getHtml = function( _elm )
            {
                return _elm.innerHTML;
            };

            if ( _value && _value.nodeType === 1 )
            {
               return _getHtml( _value );
            }

            if ( _value || _value === '' )
            {
                var _setHtml = function( _elm )
                {
                    _elm.data           = _elm.data || {};
                    _elm.data.html      = _elm.data.html || {};
                    _elm.data.html.html = _value;
                    _elm.innerHTML      = _value;
                };

                var i, len;
                for ( i = 0, len = this.length; i < len; i++ )
                {
                    _setHtml( this[ i ] );
                }

                if ( _append )
                {
                    return this.append( _append );
                }
                else
                {
                    return this;
                }
            }

            var j, lenj, markup = new Array( this.length );
            for ( j = 0, lenj = this.length; j < lenj; j++ )
            {
                markup[ j ] = _getHtml( this[ j ] );
            }

            return markup;
        },


        /**
         * ## indexOf
         *
         * Finds the index of an element in this microbe
         *
         * @param {Element} _el                element to check
         *
         * @return _Number_ index value of the element inside this microbe
         */
        indexOf : function( _el )
        {
            return indexOf.call( this, _el );
        },


        /**
         * ## last
         *
         * Gets the last Element of the current microbe, and wrap it in
         * Microbe.
         *
         * @return _Microbe_ new microbe containing only the last value
         */
        last : function ()
        {
            if ( this.length === 1 )
            {
                return this;
            }
            else if ( this.length !== 0 )
            {
                return this.constructor( this[ this.length - 1 ] );
            }

            return this.constructor( [] );
        },


        /**
         * ## map
         *
         * native map function
         *
         * @param {Function} callback            function to apply to all element
         *
         * @return _Array_ value array of callback returns
         */
        map : function( callback )
        {
            return map.call( this, callback );
        },


        /**
         * ## merge
         *
         * Combines microbes, arrays, and/or array-like objects.
         *
         * @param {Mixed} first               first object _{Array-like Object or Array}_
         * @param {Mixed} second              second object _{Array-like Object or Array}_
         *
         * @return _Mixed_ combined array or array-like object (based off first)
         */
        merge : function( first, second, unique )
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
        },


        /**
         * ## Parent
         *
         * gets all elements in a microbe's parent nodes
         *
         * @return _Microbe_ new microbe containing parent elements (index-preserved)
         */
        parent : function()
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
         * ## push
         *
         * Adds a new element to a microbe
         *
         * @param {Element} _el                element to add
         *
         * @return _Microbe_ reference of original microbe, with the new element added
         */
        push : function( _el )
        {
            var length = this.length;

            if ( _el && _el.nodeType === 1 )
            {
                this[ length ] = _el;
                this.length = length + 1;
            }

            return this;
        },


        /**
         * ## removeClass
         *
         * Method removes the given class from the current object or the given element.
         *
         * @param {Mixed} _class    class to remove.  this accepts
         *                          strings and array of strings.
         *                          the strings can be a class or
         *                          classes seperated with spaces {String Array}
         *
         * @return _Microbe_ reference of the original microbe
         */
        removeClass : (function()
        {
            var _removeClass = function( _class, _el )
            {
                for ( var i = 0, lenI = _class.length; i < lenI; i++ )
                {
                    var _c = _class[ i ].split( ' ' );

                    for ( var j = 0, lenJ = _c.length; j < lenJ; j++ )
                    {
                        if ( _c[ j ] !== '' )
                        {
                            _el.classList.remove( _c[ j ] );
                        }
                    }
                }

                _el.data                = _el.data || {};
                _el.data.class          = _el.data.class || {};
                _el.data.class.class    = _el.className;
            };

            return function( _class )
            {
                if ( typeof _class === 'string' )
                {
                    _class = [ _class ];
                }

                var i, len;
                for ( i = 0, len = this.length; i < len; i++ )
                {
                    _removeClass( _class, this[ i ] );
                }

                return this;
            };
        }()),


        /**
         * ## siblings
         *
         * Gets an microbe of all of each given element's siblings
         *
         * @return _Array_ array of microbes (value)
         */
        siblings : function()
        {
            var _siblings = function( _elm )
            {
                var res     = [];
                var sibling = _elm.parentNode.firstElementChild;
                for ( ; sibling; )
                {
                    if ( sibling !== _elm )
                    {
                        res.push( sibling );
                    }
                    sibling = sibling.nextElementSibling;
                    if ( !sibling )
                    {
                        return res;
                    }
                }
            };

            var i, len, siblingArray = new Array( this.length );

            for ( i = 0, len = this.length; i < len; i++ )
            {
                siblingArray[ i ] = this.constructor( _siblings( this[ i ] ) );
            }

            return siblingArray;
        },


        /**
         * ## siblingsFlat
         *
         * Gets an microbe of all siblings of all element's given. 'next' and 'prev'
         * passed as direction return only the next or previous siblings of each element
         *
         * @paran {String} direction direction modifier (optional)
         *
         * @return _Microbe_ value array of combined siblings
         */
        siblingsFlat : function( direction )
        {
            var _siblings = function( _elm )
            {
                if ( !direction )
                {
                    var res     = [];
                    var sibling = _elm.parentNode.firstElementChild;
                    for ( ; sibling; )
                    {
                        if ( sibling !== _elm )
                        {
                            res.push( sibling );
                        }
                        sibling = sibling.nextElementSibling;
                        if ( !sibling )
                        {
                            return res;
                        }
                    }
                }
                else if ( direction === 'next' )
                {
                    var next = _elm.nextElementSibling;
                    return next ? [ next ] : [];
                }
                else if ( direction === 'prev' )
                {
                    var prev = _elm.prevElementSibling;
                    return prev ? [ prev ] : [];
                }
            };

            var arr, i, len, siblingArray = [];

            for ( i = 0, len = this.length; i < len; i++ )
            {
                arr = _siblings( this[ i ] );

                for ( var j = 0, lenJ = arr.length; j < lenJ; j++ )
                {
                    if ( siblingArray.indexOf( arr[ j ] ) === -1 )
                    {
                        siblingArray.push( arr[ j ] );
                    }
                }
            }

            return this.constructor( siblingArray );
        },



        /**
         * ## splice
         *
         * Native splice wrapped in a microbe
         *
         * @return {Microbe} new microbe of the remaining elements
         */
        splice : function( _start, _end )
        {
            var arr = splice.call( this, _start, _end );

            return this.constructor( arr );
        },


        /**
         * ## text
         *
         * Changes the inner text to the supplied string. If the value is omitted,
         * simply returns the current inner text value of each element.
         *
         * @param {String} _value              Text value (optional)
         *
         * @return _Microbe_ reference to original microbe (set)
         * @return _Array_  array of values (get)
         */
        text : (function()
        {
            var _setText = function( _value, _el )
            {
                if ( document.all )
                {
                    _el.innerText = _value;
                }
                else // FF
                {
                    _el.textContent = _value;
                }

                _el.data            = _el.data || {};
                _el.data.text       = _el.data.text || {};
                _el.data.text.text  = _value;
            };

            var _getText = function( _el )
            {
                if ( document.all )
                {
                    return _el.innerText;
                }
                else // FF
                {
                    return _el.textContent;
                }
            };
            return function( _value )
            {
                if ( _value || _value === '' )
                {
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

                return arrayText;
            };
        }()),


        /**
         * ## toArray
         *
         * returns all the elements in an array.
         *
         * @return _Array_
         */
         toArray : function( _arr )
         {
             return slice.call( _arr || this );
         },


        /**
         * ## toggleClass
         *
         * adds or removes a class on the current element, depending on
         * whether it has it already.
         *
         * @param {String} _class              class to add
         *
         * @return {Microbe} reference of the original microbe
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

                _el.data                = _el.data || {};
                _el.data.class          = _el.data.class || {};
                _el.data.class.class    = _el.className;
            };
            return function( _class )
            {
                var i, len;
                for ( i = 0, len = this.length; i < len; i++ )
                {
                    _toggleClass( _class, this[ i ] );
                }

                return this;
            };
        }()),


        /**
         * ## toString
         *
         * returns the type of Microbe.
         *
         * @return _String_  type string
         */
        toString : function()
        {
            return _type;
        },


        type : _type,

        
        version : Microbe.version
    };
};

},{"./utils/array":4,"./utils/string":5}],3:[function(require,module,exports){
/**
 * MicrobeCore.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package MicrobeCore
 */
/**
 * ## exported
 *
 * @return _Function_ function that augment MicrobeCore.
 */
module.exports = function( MicrobeCore, _type )
{
    'use strict';

    var trigger, _shortSelector;

    var selectorRegex = MicrobeCore.prototype.__selectorRegex =  /(?:[\s]*\.([\w-_\.]+)|#([\w-_]+)|([^#\.:<][\w-_]*)|(<[\w-_#\.]+>)|:([^#\.<][\w-()_]*))/g;

    // TODO: Check if we hit the duck

    /**
     * ## _build
     *
     * Builds and returns the final MicrobeCore
     *
     * @param {Array} _elements array of elements
     * @param {String} _selector selector
     *
     * @return PMicrobeCore_ MicrobeCore wrapped elements
     */
    function _build( _elements, self )
    {
        var i = 0, lenI = _elements.length;

        for ( ; i < lenI; i++ )
        {
            self[ i ]           = _elements[ i ];
        }

        self.length     = i;

        return self;
    }


    /**
     * ## _create
     *
     * Method creates a MicrobeCore from an element or a new element of the passed string, and
     * returns the MicrobeCore
     *
     * @param {Element} _el element to create
     *
     * @return PMicrobeCore_
     */
    function _create( _el, self )
    {
        var resultsRegex    = _el.match( selectorRegex ),
            _id = '', _tag = '', _class = '';

        var i = 0, lenI = resultsRegex.length;
        for ( ; i < lenI; i++ )
        {
            var trigger = resultsRegex[ i ][ 0 ];
            switch ( trigger )
            {
                case '#':
                    _id     += resultsRegex[ i ];
                    break;

                case '.':
                    _class  += resultsRegex[ i ];
                    break;

                default:
                    _tag    += resultsRegex[ i ];
                    break;
            }
        }

        if ( typeof _tag === 'string' )
        {
            _el = document.createElement( _tag );

            if ( _id )
            {
                _el.id = _id.slice( 1 );
            }

            if ( _class )
            {
                _class = _class.split( '.' );

                for ( i = 1, lenI = _class.length; i < lenI; i++ )
                {
                    _el.classList.add( _class[ i ] );
                }
            }

        }

        return _build( [ _el ], self );
    }


    /**
     * ## _contains
     *
     * Checks if a given element is a child of _scope
     *
     * @param {Element} _el element to check
     * @param {Element} _scope scope
     *
     * @return _Boolean_ whether _el is contained in the scope
     */
    var _contains = MicrobeCore.contains = function( _el, _scope )
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
    };


    /**
     * ## _css4StringReplace
     *
     * translates css4 strings
     *
     * @param  {String} _string pre substitution string
     *
     * @param  {String} post substitution string
     */
    function _css4StringReplace( _string )
    {
        if ( _string.indexOf( '>>' ) !== -1 )
        {
            _string = _string.replace( />>/g, ' ' );
        }
        if ( _string.indexOf( '!' ) !== -1 )
        {
            _string = _string.replace( /!/g, ':parent' );
        }

        return _string;
    }


    /**
     * ## _noScopeSimple
     *
     * if ther is no scope and there is only a simple selector
     *
     * @param  {String} _s   selector string
     * @param  {Object} self this empty MicrobeCore
     *
     * @return PMicrobeCore_
     */
    function _noScopeSimple( _s, self )
    {
        if ( typeof _s === 'string' && _s.indexOf( ':' ) === -1 &&
                _s.indexOf( '!' ) === -1 && _s.indexOf( ' ' ) === -1 )
        {
            switch ( _s[0] )
            {
                case '#':
                    if ( _s.indexOf( '.' ) === -1 )
                    {
                        var id = document.getElementById( _s.slice( 1 ) );

                        return id === null ? _build( [] ) : _build( [ id ], self );
                    }
                    break;
                case '.':
                    if ( _s.indexOf( '#' ) === -1 )
                    {
                        var clss = _s.slice( 1 );

                        if ( clss.indexOf( '.' ) === -1 )
                        {
                            return _build( document.getElementsByClassName( clss ), self );
                        }
                    }
                    break;
                default:
                    if ( _s && _s.indexOf( '[' ) === -1 && _s.indexOf( '<' ) === -1 &&
                            _s.indexOf( '#' ) === -1 && _s.indexOf( '.' ) === -1 )
                    {
                        return _build( document.getElementsByTagName( _s ), self );
                    }
                    break;
            }
        }

        return false;
    }


    var _pseudo = MicrobeCore.constructor.pseudo;

    /**
     * ## \_\_init\_\_
     *
     * Constructor.
     *
     * Either selects or creates an HTML element and wraps it into a MicrobeCore instance.
     * Usage:   µ( 'div#test' )   ---> selection
     *          µ( '<div#test>' ) ---> creation
     *
     * @param {Mixed} _selector HTML selector (Element String Array)
     * @param {Mixed} _scope scope to look inside (Element String MicrobeCore)
     * @param {Mixed} _elements elements to fill MicrobeCore with (optional) (Element or Array)
     *
     * @return PMicrobeCore_
     */
    var Init = MicrobeCore.core.__init__ =  function( _selector, _scope, _elements )
    {
        var res;
        if ( !_scope )
        {
            res = _noScopeSimple( _selector, this );

            if ( res )
            {
                return res;
            }
        }

        if ( typeof _selector === 'string' )
        {
            _selector = _css4StringReplace( _selector );
        }

        if ( typeof _scope === 'string' )
        {
            _scope = _css4StringReplace( _scope );
        }

        _selector = _selector || '';

        if ( _scope && _scope.type === _type )
        {
            res = _build( [], this );

            for ( var n = 0, lenN = _scope.length; n < lenN; n++ )
            {
                res.merge( new Init( _selector, _scope[ n ] ), true );
            }

            return res;
        }

        /*
         * fast tracks element based queries
         */
        var isArr, isHTMLCollection;
        if ( _selector.nodeType === 1 || ( isArr = MicrobeCore.isArray( _selector ) ) ||
            _selector === window || _selector === document ||
            ( isHTMLCollection = _selector.toString() === '[object HTMLCollection]' ) )
        {
            if ( !isArr && !isHTMLCollection )
            {
                _selector = [ _selector ];
            }

            return _build( _selector, this );
        }

        _scope = _scope === undefined ?  document : _scope;

        if ( _scope !== document )
        {
            if ( typeof _scope === 'string' && typeof _selector === 'string' )
            {
                return this.constructor( _scope ).find( _selector );
            }
        }

        var scopeNodeType   = _scope.nodeType,
            nodeType        = ( _selector ) ? _selector.nodeType || typeof _selector : null;

        if ( ( !_selector || typeof _selector !== 'string' ) ||
            ( scopeNodeType !== 1 && scopeNodeType !== 9 ) )
        {
            return _build( [], this );
        }

        var resultsRegex = _selector.match( selectorRegex );

        if ( resultsRegex && resultsRegex.length === 1 && resultsRegex[ 0 ][ 0 ] !== ':'  )
        {
            trigger         = resultsRegex[0][0];

            _shortSelector  = _selector.slice( 1 );

            switch( trigger )
            {
                case '.': // non-document scoped classname search
                    var _classesCount   = ( _selector || '' ).slice( 1 ).split( '.' ).length;

                    if ( _classesCount === 1 )
                    {
                        return _build( _scope.getElementsByClassName( _shortSelector ), this );
                    }
                    break;
                case '#': // non-document scoped id search
                    var _id = document.getElementById( _shortSelector );

                    if ( _scope.ownerDocument && _contains( _id, _scope ) )
                    {
                        return _build( [ _id ], this );
                    }
                    else
                    {
                        return _build( [], this );
                    }
                    break;
                case '<': // element creation
                    return _create( _selector.substring( 1, _selector.length - 1 ), this );
                default:
                    return _build( _scope.getElementsByTagName( _selector ), this );
            }
        }

        if ( !( this instanceof Init ) )
        {
            return new Init( _selector, _scope, _elements );
        }

        if ( _selector.indexOf( ':' ) !== -1 && _pseudo )
        {
            return _pseudo( this, _selector, _scope, _build );
        }

        return _build( _scope.querySelectorAll( _selector ), this );
    };

    MicrobeCore.core.__init__.prototype = MicrobeCore.core;
};

},{}],4:[function(require,module,exports){
/**
 * array.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * ## exported
 *
 * Array methods.
 *
 * @return _Object_
 */
module.exports = {
    concat          : Array.prototype.concat,
    copyWithin      : Array.prototype.copyWithin,
    entries         : Array.prototype.entries,
    every           : Array.prototype.every,
    fill            : Array.prototype.fill,
    filter          : Array.prototype.filter,
    find            : Array.prototype.find,
    findIndex       : Array.prototype.findIndex,
    forEach         : Array.prototype.forEach,
    indexOf         : Array.prototype.indexOf,
    join            : Array.prototype.join,
    keys            : Array.prototype.keys,
    lastIndexOf     : Array.prototype.lastIndexOf,
    map             : Array.prototype.map,
    pop             : Array.prototype.pop,
    push            : Array.prototype.push,
    reduce          : Array.prototype.reduce,
    reduceRight     : Array.prototype.reduceRight,
    reverse         : Array.prototype.reverse,
    shift           : Array.prototype.shift,
    some            : Array.prototype.some,
    sort            : Array.prototype.sort,
    slice           : Array.prototype.slice,
    splice          : Array.prototype.splice,
    toLocaleString  : Array.prototype.toLocaleString,
    toSource        : Array.prototype.toSource,
    toString        : Array.prototype.toString,
    unshift         : Array.prototype.unshift
};

},{}],5:[function(require,module,exports){
/**
 * string.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * ## exported
 *
 * String methods.
 *
 * @return _Object_
 */
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

},{}]},{},[1])(1)
});