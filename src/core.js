/**
 * core.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
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
var _type       = '[object Microbe]';

/**
 * ## Microbe
 *
 * µ constructor
 *
 * Builds the µ object
 *
 * @return _Microbe_
 */
var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};


Microbe.core = Microbe.prototype ={

    version :       '0.3.4',

    constructor :   Microbe,

    type :          _type,

    length :        0,


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
        var _children = function( _elm )
        {
            return Microbe.toArray( _elm.children );
        };

        var i, len, childrenArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            childrenArray[ i ] = new Microbe( '', undefined, _children( this[ i ] ) );
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
        var _children = function( _elm )
        {
            return Microbe.toArray( _elm.children );
        };

        var arr, i, len, childrenArray = [];

        for ( i = 0, len = this.length; i < len; i++ )
        {
            arr = _children( this[ i ] );

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

        if ( args[ index ] === true )
        {
            deep    = true;
            index   += 1;
        }

        if ( this.type === '[object Microbe]' )
        {
            target = this;
        }
        else
        {
            if ( Microbe.isObject( args[ index ] ) )
            {
                target = args[ index ];
            }
            else
            {
                target = {};
            }
        }

        for ( ; index < length; index++ )
        {
            if ( ( options = args[ index ] ) !== null )
            {
                for ( var name in options )
                {
                    if ( options.hasOwnProperty( name ) )
                    {
                        isArray = false;
                        src     = target[ name ];
                        copy    = options[ name ];

                        if ( target === copy || typeof copy === undefined )
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

                            target[ name ] = Microbe.extend( deep, clone, copy );
                        }

                        target[ name ] = copy;
                    }
                }
            }
        }

        return target;
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

            for ( var i = 0; i < this.length; i++ )
            {
                if ( filter.call( this[ i ], i ) )
                {
                    res.push( this[ i ] );
                }
            }
            return new Microbe( res );
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
     * ## root
     *
     * Returns the root elements of the document
     *
     * @return _Microbe_ new microbe containing only the root document element
     */
    root : function()
    {
        var _root = this[ 0 ];

        if ( _root )
        {
            while ( _root.parentNode !== document )
            {
                _root = _root.parentNode;
            }

            return new Microbe( [ _root ] );
        }

        return new Microbe( [] );
    },


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
            var parentsChildren = Microbe.toArray( _elm.parentNode.children );
            var elIndex = parentsChildren.indexOf( _elm );

            parentsChildren.splice( elIndex, 1 );

            return parentsChildren;
        };

        var i, len, siblingArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            siblingArray[ i ] = new Microbe( '', undefined, _siblings( this[ i ] ) );
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
                var parentsChildren = Microbe.toArray( _elm.parentNode.children );
                var elIndex = parentsChildren.indexOf( _elm );
                parentsChildren.splice( elIndex, 1 );
                return parentsChildren;
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
    }
};

/**
 * ## exported
 *
 * @return _Microbe_
 */
module.exports = Microbe;
