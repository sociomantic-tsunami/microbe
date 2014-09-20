!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Microbe=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Microbe = require( './core' );
require( './core/index.js' )( Microbe );

module.exports = Microbe;

},{"./core":2,"./core/index.js":3}],2:[function(require,module,exports){
/**
 * microbe.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
'use strict';

var Arrays      = require( './utils/array/' );
var Strings     = require( './utils/string/' );
var Types       = require( './utils/types' );

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
    addClass : function( _class, _el )
    {
        var _addClass = function( _elm )
        {
            _elm.classList.add( _class );
        };

        if ( _el )
        {
            _addClass( _el );
            return this;
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _addClass( this[ i ] );
        }

        return this;
    },


    /**
     * Append Element
     *
     * @param  {[type]} _ele    [description]
     * @param  {[type]} _parent [description]
     * @return {[type]}         [description]
     */
    append : function( _el, _parent )
    {
        var _append = function( _parentEl, _elm )
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

        if ( _parent )
        {
            _append( _parent );
        }

        if (!_el.length )
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
                    _append( this[ i ], _el[ j ].cloneNode(true) );
                }
                else
                {
                    _append( this[ i ], _el[ j ] );
                }
            }
        }

        return this;
    },


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
        var attributes = [];
        for ( j = 0, lenj = this.length; j < lenj; j++ )
        {
            push.call( attributes, _getAttr( this[ j ] ) );
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

        var childrenArray = [];

        var i, len;

        for ( i = 0, len = this.length; i < len; i++ )
        {
            push.call( childrenArray, _children( this[ i ] ) );
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
     * @param   _el         HTMLELement     element to create
     *
     * @return  Microbe
    */
    create : function ( _el )
    {
        var reClass     = /\.([^.$#]+)/g;
        var reId        = /#([^.$]+)/;
        var reElement   = /[#.]/;
        var _id;
        var i, len;
        var _class;
        var original;

        if ( typeof _el === 'string' )
        {
            original = _el;
            _el = _el.split( reElement )[ 0 ];
            _el = document.createElement( _el );

            _id = original.match( reId );
            if ( _id )
            {
                _el.id = _id[1].trim();
            }

            while ( ( _class = reClass.exec( original ) ) !== null )
            {
                _el.classList.add( _class[1] );
            }
        }

        return new Microbe( '', '', _el );
    },


    /**
     * Alter/Get CSS
     *
     * Changes the CSS by writing the given property and value inline to the
     * supplied elements. (properties should be supplied in javascript format).
     * If the value is omitted, simply returns the current css value of the element.
     *
     * @param   _property   string          JS formatted CSS property
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
        var j, lenj;
        var styles = [];
        for ( j = 0, lenj = this.length; j < lenj; j++ )
        {
            push.call( styles, _getCss( this[ j ] ) );
        }
        if ( styles.length === 1 )
        {
            return styles[0];
        }

        return styles;
    },


    // each : function( callback )
    // {
    //     return forEach.call( this, callback );
    // },
    //
    // /**
    //  * For each
    //  *
    //  * Methods iterates through all the elements an execute the function on each of
    //  * them
    //  *
    //  * @return  Array
    // */
    // each : function( _callback )
    // {
    //     var i, leni;
    //     for ( i = 0, leni = this.length; i < leni; i++ )
    //     {
    //         _callback( this[ i ], i );
    //     }
    //     return this;
    // },


    // first: function() {
    //     return this.getWrapped( 0 );
    // },
    //
    // /**
    //  * Get First Element
    //  *
    //  * Methods gets the first HTML Elements of the current object, and wrap it in
    //  * Microbe for chaining purpose.
    //  *
    //  * @return  Microbe
    //  */
    //
    // first : function ()
    // {
    //     if ( this.length === 1 )
    //     {
    //         return this;
    //     }

    //     return new Microbe( '', '', [ this[ 0 ] ] );
    // },


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

        var indexes = [];

        if ( _el )
        {
            indexes = _getParentIndex( _el );
            return indexes;
        }

        var i, len;

        for ( i = 0, len = this.length; i < len; i++ )
        {
            push.call( indexes, _getParentIndex( this[ i ] ) );
        }

        return indexes;
    },


    getWrapped : function( i )
    {
        var length  = this.length;
        var j = +i + ( i < 0 ? length : 0 );

        return this.wrap( j >= 0 && j < length ? [ this[j] ] : [] );
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

        var i, len, results = [];
        for ( i = 0, len = this.length; i < len; i++ )
        {
            push.call( results, _hasClass( this[ i ] ) );
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

        var j, lenj;
        var markup = [];
        for ( j = 0, lenj = this.length; j < lenj; j++ )
        {
            push.call( markup, _getHtml( this[ j ] ) );
        }

        if ( markup.length === 1 )
        {
            return markup[0];
        }
        return markup;
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
            _elAfter = _this.micro( _elAfter );
            _elm     = _this.micro( _elm );

            var nextIndex;

            for ( var i = 0, len = _elm.length; i < len; i++ )
            {
                nextIndex = _this.getParentIndex( _elm[ i ] );

                var nextEle   = _elm[ i ].parentNode.children[ nextIndex + 1 ];

                if ( nextEle )
                {
                    nextEle.parentNode.insertBefore( _elAfter[0].cloneNode( true ), nextEle );
                }
                else
                {
                    _elm[ i ].parentNode.appendChild( _elAfter[0].cloneNode( true ) );
                }
            }
        };

        if ( _el )
        {
            _insertAfter( _el );
            return this;
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _insertAfter( this[ i ] );
        }

        return this;
    },


    // last: function() {
    //     return this.getWrapped( -1 );
    // },

    // /**
    //  * Get Last Element
    //  *
    //  * Methods gets the last HTML Elements of the current object, and wrap it in
    //  * Microbe for chaining purpose.
    //  *
    //  * @return  Microbe
    //  */
    //
    // last : function ()
    // {
    //     if ( this.length === 1 )
    //     {
    //         return this;
    //     }

    //     return new Microbe( '', '', [ this[ this.length - 1 ] ] );
    // },


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

        var parentArray = [];

        for ( var i = 0, len = this.length; i < len; i++ )
        {
            push.call( parentArray, _parent( this[ i ] ) );
        }

        return new Microbe( '', '', parentArray );
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
     * @param   _class      string       class to remove
     * @param   _el         HTMLELement  element to modify (optional)
     *
     * @return  Microbe
    */
    removeClass : function( _class, _el )
    {
        var _removeClass = function( _elm )
        {
            _elm.classList.remove( _class );
        };

        if ( _el )
        {
            _removeClass( _el );
            return this;
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _removeClass( this[ i ] );
        }

        return this;
    },

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
    text : function ( _value, _el)
    {
        var _setText = function( _elm )
        {
            if( document.all )
            {
                _elm.innerText = _value;
            }
            else // stupid FF
            {
                _elm.textContent = _value;
            }
        };

        var _getText = function( _elm )
        {
            if( document.all )
            {
                return _elm.innerText;
            }
            else // stupid FF
            {
                return _elm.textContent;
            }
        };

        if ( _value )
        {
            if ( _el )
            {
                _setText( _el );
                return this;
            }

            var i, len;
            for ( i = 0, len = this.length; i < len; i++ )
            {
                _setText( this[ i ] );
            }

            return this;
        }

        var j, lenj;
        var arrayText = [];
        for ( j = 0, lenj = this.length; j < lenj; j++ )
        {
            push.call( arrayText, _getText( this[ j ] ) );
        }

        if ( arrayText.length === 1 )
        {
            return arrayText[0];
        }
        return arrayText;
    },


    // toArray : function()
    // {
    //     return slice.call( this );
    // },
    //
    // /**
    //  * To array
    //  *
    //  * Methods returns all the elements in an array.
    //  *
    //  * @return  Array
    // */
    // toArray : function( _el )
    // {
    //     _el = _el || this;

    //     return Array.prototype.slice.call( _el );
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
    toggleClass : function ( _class, _el )
    {
        var _toggleClass = function( _elm )
        {
            if ( _elm.classList.contains( _class ) )
            {
                _elm.classList.add( _class );
            }
            else
            {
                _elm.classList.remove( _class );
            }
        };

        if ( _el )
        {
            _toggleClass( _el );
            return this;
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _toggleClass( this[ i ] );
        }

        return this;
    },


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
    unbind : function ( _event, _callback, _el )
    {
        var _unbind = function( _elm )
        {
            _elm.removeEventListener( _event, _callback );
        };

        if ( _el )
        {
            _unbind( _el );
            return this;
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _unbind( this[ i ] );
        }

        return this;
    },


    wrap : function( elements )
    {
        var wrapped = Microbe.merge( this.constructor(), elements );

        wrapped.prevObject  = this;
        wrapped.context     = this.context;

        return wrapped;
    }


    // __repr__ : function( elements, results )
    // {
    //     var _this = results || [];

    //     if ( elements !== null )
    //     {
    //         if ( isIterable( Object( elements ) ) )
    //         {
    //             Microbe.merge( _this, (typeof elements === 'string' ?
    //                 [ elements ] : elements ) );
    //         }
    //         else
    //         {
    //             push.call( _this, elements );
    //         }
    //     }

    //     return _this;
    // }
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


/**
 * microbe.http.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
Microbe.http = (function()
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

    var _http = function( _parameters )
    {
        if ( !_parameters ) { return undefined; }
        if ( typeof _parameters === 'string' )
        {
            _parameters = { url: _parameters };
        }

        var req         = new XMLHttpRequest();
        var method      = _parameters.method || 'GET';
        var url         = _parameters.url;
        var data        = JSON.stringify( _parameters.data ) || null;
        var user        = _parameters.user || '';
        var password    = _parameters.password || '';
        var headers     = _parameters.headers  || null;


        req.onreadystatechange = function()
        {
            if ( req.readyState === 4 )
            {
                return req;
            }
        };

        req.open( method, url, false, user, password );

        if ( headers )
        {
            if ( Object.prototype.toString.call( headers ) === '[object Array]' )
            {
                var i, leni;
                for ( i = 0, leni = headers.length; i < leni; i++ )
                {
                    req.setRequestHeader( headers[i].header, headers[i].value );
                }
            }
            else
            {
                req.setRequestHeader( headers.header, headers.value );
            }
        }
        try
        {
            req.send( data );
            req.onloadend = function()
            {
                req.onreadystatechange();
                return _response( req );
            };
            return req.onloadend();
        }
        catch ( error )
        {
            return _response( req, false );
        }
    };

    _http.get = function( _url )
    {
        if ( !_url ) { return undefined; }
        return this({
            url     : _url,
            method  : 'GET'
        });
    };

    _http.post = function( _url, _data )
    {
        if ( !_url || !_data ) { return undefined; }
        return this({
            url     : _url,
            data    : _data,
            method  : 'POST'
        });
    };

    return _http;
}() );


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


/*
 * Ready
 *
 * Methods detects if the DOM is ready.
 * http://stackoverflow.com/a/1207005
 *
 * @return  void
*/
Microbe.ready = function( _callback )
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

module.exports = Microbe;

},{"./utils/array/":5,"./utils/string/":6,"./utils/types":7}],3:[function(require,module,exports){
module.exports = function( Microbe )
{
    require( './init' )( Microbe );
};

},{"./init":4}],4:[function(require,module,exports){
module.exports = function( Microbe )
{
    var selectorRegex   = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    var newElementRegex = /^<.+>$/;

    /**
     * Build
     *
     * builds and returns the final microbe
     *
     * @param  {[type]} microbe   [description]
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
     * @param  {[type]} _container [description]
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
        _scope = _scope === undefined ?  document : _scope;

        var scopeNodeType   = _scope.nodeType,
            nodeType        = _selector.nodeType || typeof _selector;


        if ( !( this instanceof Microbe.core.__init__ ) )
        {
            return new Microbe.core.__init__( _selector, _scope, _elements );
        }

        if ( ( !_selector || typeof _selector !== 'string' ) ||
             ( scopeNodeType !== 1 && scopeNodeType !== 9 ) )
        {
            return _build.call( this, [], _selector );
        }

        if ( _selector.nodeType === 1 )
        {
            return Microbe.core.create( _selector );
        }
        else if ( newElementRegex.test( _selector ) )
        {
            return Microbe.core.create( _selector.substring( 1, _selector.length - 1 ) );
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
            var resultsRegex = selectorRegex.exec( _selector );

            if ( resultsRegex )
            {
                var _classSelector  = resultsRegex[ 1 ],
                    _idSelector     = resultsRegex[ 2 ],
                    _tagSelector    = resultsRegex[ 3 ];

                if ( _classSelector && ! _idSelector && ! _tagSelector )
                {
// broken!
                    if ( ! selectorRegex.class.exec( _selector ) )
                    {
                        return _build.call( this, _scope.getElementsByClassName( _classSelector ), _selector );
                    }
                }

                if ( _idSelector && ! _tagSelector && ! _classSelector )
                {
                    var _id = document.getElementById( _idSelector );

                    if ( scopeNodeType === 9 )
                    {
                        if ( _id.parentNode && ( _id.id === _idSelector ) )
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

                if ( _tagSelector && ! _idSelector && ! _classSelector )
                {
                    return _build.call( this, _scope.getElementsByTagName( _tagSelector ), _selector );
                }
            }
        }
        return _build.call( this, _scope.querySelectorAll( _selector ), _selector );
    };

    Microbe.core.__init__.prototype = Microbe.core;

};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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