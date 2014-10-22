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
    version : '0.1.1',

    constructor : Microbe,

    selector : '',

    length : 0,


    /**
     * Add Class
     *
     * Method adds the given class from the current object or the given element.
     *
     * @param   {str}               _class              class to add
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

        return function( _class )
        {
            if ( typeof _class === 'string' )
            {
                _class = [ _class ];
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
     * @param   {element}           _ele                element to append
     *
     * @return  {microbe}           this
     */
    append : (function()
    {
        var _append = function( _parentEl, _elm )
        {
            _parentEl.appendChild( _elm );
        };

        return function( _el )
        {
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
                        _append( this[ i ], _el[ j ].cloneNode(true) );
                    }
                    else
                    {
                        _append( this[ i ], _el[ j ] );
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
     * @param   _value      string           CSS value (optional)
     *
     * @return  mixed ( Microbe or string or array of strings)
    */
    attr : function ( _attribute, _value )
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
     *
     * @return  Microbe
    */
    bind : function ( _event, _callback )
    {
        var _bind = function( _elm )
        {
            _elm.addEventListener( _event, _callback );
        };

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
     * @param   _value      string          CSS value (optional)
     *
     * @return  mixed ( Microbe or string or array of strings)
    */
    css : function ( _property, _value )
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
     * Get Parent Index
     *
     * gets the index of the item in it's parentNode's children array
     *
     * @return {array}                       array of indexes
     */
    getParentIndex : function()
    {
        var _getParentIndex = function( _elm )
        {
            return Array.prototype.indexOf.call( _elm.parentNode.children, _elm );
        };

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
     *
     * @return  Microbe
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
     * Alter/Get inner HTML
     *
     * Changes the innerHtml to the supplied string.
     * If the value is omitted, simply returns the current inner html value of the element.
     *
     * @param   _value      string          html value (optional)
     *
     * @return  mixed ( Microbe or string or array of strings)
    */
    html : function ( _value )
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
     *
     * @return Microbe
     */
    insertAfter : function( _elAfter )
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
     * @return  {microbe}
     */
    last : function ()
    {
        if ( this.length === 1 )
        {
            return this;
        }

        return new Microbe( [ this[ this.length - 1 ] ] );
    },


    /**
     * map
     *
     * @param  {Function} callback [description]
     *
     * @return {[type]}            [description]
     */
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
     * Remove Element
     *
     * removes an element or elements from the dom
     *
     * @param  {[type]} _el [description]
     * @return {[type]}     [description]
     */
    remove : function()
    {
        var _remove = function( _elm )
        {
            return _elm.parentNode.removeChild( _elm );
        };

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
     *
     * @return  Microbe
    */
    removeClass : (function()
    {
        var _removeClass = function( _class, _el )
        {
            _el.classList.remove( _class );
        };

        return function( _class )
        {
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
        return function( _value )
        {
            if ( _value )
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
    toArray : function()
    {
        return Array.prototype.slice.call( this );
    },


    /**
     * Toggle Class
     *
     * Methods calls removeClass or removeClass from the current object or given
     * element.
     *
     * @param   _class      string       class to add
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
    unbind : function( _event, _callback )
    {
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
