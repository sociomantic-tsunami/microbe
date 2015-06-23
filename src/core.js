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
 * @return {Microbe}
 */
var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};


Microbe.core = Microbe.prototype =
{
    version :       '0.3.2',

    constructor :   Microbe,

    type :          _type,

    length :        0,

    _selector:      '',


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
     * @return _Microbe_
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
                _addClass( _class, this[ i ] );
            }

            return this;
        };
    }()),


    /**
     * ## attr
     *
     * Alter/Get Attribute
     *
     * Changes the attribute by writing the given property and value to the
     * supplied elements.  If the value is omitted, simply returns the current
     * attribute value of the element. Attributes can be bulk added by passing
     * an object (property: value)
     *
     * @param _{Mixed} _attribute          attribute name {String or Object}_
     * @param {String} _value              attribute value (optional)
     *
     * @return _Microbe_ or _Array_
     */
    attr : function ( _attribute, _value )
    {
        var attrObject = !!Microbe.isObject( _attribute );

        var _setAttr = function( _elm )
        {
            if ( _value === null )
            {
                _removeAttr( _elm );
            }
            else
            {
                var _attr;
                if ( !attrObject )
                {
                    _attr               = _attribute;
                     _attribute         = {};
                    _attribute[ _attr ] = _value;
                }

                for ( _attr in _attribute )
                {
                    _value = _attribute[ _attr ];

                    if ( !_elm.getAttribute )
                    {
                        _elm[ _attr ] = _value;
                    }
                    else
                    {
                        _elm.setAttribute( _attr, _value );
                    }

                    _elm.data                           = _elm.data || {};
                    _elm.data.attr                      = _elm.data.attr || {};
                    _elm.data.attr.attr                 = _elm.data.attr.attr || {};
                    _elm.data.attr.attr[ _attribute ]   = _value;
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
     * @return {Array} array of microbes
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
     * @return {Microbe} combined children
     */
    childrenFlat : function()
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

        return new Microbe( '', undefined, childrenArray );
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
     * @return _Microbe_ or _Array_
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
     * @return _Array_
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
     * @return _Object_
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
     * Filters the microbe by the given given selector
     *
     * @param {String} selector            selector to filter by
     *
     * @return _Microbe_
     */
    filter : function( filter )
    {
        var originalSelector = this.selector();

        var selectorRegex   = originalSelector.match( this.__selectorRegex ),
            filterRegex     = filter.match( this.__selectorRegex );

        var _id = '', _tag = '', _psuedo = '', _class = '', _selector;

        var selectorArray = [ selectorRegex, filterRegex ];

        var i, lenI, j, lenJ;
        for ( j = 0, lenJ = selectorArray.length; j < lenJ; j++ )
        {
            if ( selectorArray[ j ] )
            {
                for ( i = 0, lenI = selectorArray[ j ].length; i < lenI; i++ )
                {
                    var trigger = selectorArray[ j ][ i ][ 0 ];

                    switch ( trigger )
                    {
                        case '#':
                            _id      += selectorArray[ j ][ i ];
                            break;

                        case '.':
                            _class   += selectorArray[ j ][ i ];
                            break;

                        case ':':
                            _psuedo   = selectorArray[ j ][ i ];
                            break;

                        default:
                            if ( _tag !== selectorArray[ j ][ i ] )
                            {
                                if ( _tag !== '' )
                                {
                                    return new Microbe();
                                }
                                else
                                {
                                    _tag     = selectorArray[ j ][ i ];
                                }
                            }
                            break;
                    }
                }
            }
        }

        _selector = _tag + _id + _class + _psuedo;

        return new Microbe( _selector );
    },


    /**
     * ## find
     *
     * Finds a child element with the given selector inside the scope of the current microbe
     *
     * @param {String} selector            selector to search for
     *
     * @return _Microbe_
     */
    find : function( selector )
    {
        var _scope = this.selector();
        return new Microbe( selector, _scope );
    },


    /**
     * ## first
     *
     * Methods gets the first HTML Elements of the current object, and wrap it in
     * Microbe.
     *
     * @return {Microbe}
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
     * ## getParentIndex
     *
     * Gets the index of the item in it's parentNode's children array
     *
     * @return {Array} array of indexes
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
     * ## hasClass
     *
     * Checks if the current object or the given element has the given class
     *
     * @param {String} _class              class to check
     *
     * @return _Microbe_
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
     * @param {Microbe String} _value              html value (optional)
     *
     * @return _Microbe_ or _Array_
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
     * Returns the index of an element in this microbe
     *
     * @param {Element} _el                 element to check
     *
     * @return _Number_
     */
    indexOf : function( _el )
    {
        return this.toArray().indexOf( _el );
    },


    /**
     * ## last
     *
     * Gets the last HTML Elements of the current object, and wrap it in
     * Microbe.
     *
     * @return _Microbe_
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
     * ## map
     *
     * native map function
     *
     * @param {Function} callback            function to apply to all element
     *
     * @return {Array} array of callback returns
     */
    map : function( callback )
    {
        return map.call( this, callback );
    },


    /**
     * ## merge
     *
     * Combines microbes or array elements.
     *
     * @param {Mixed} first               first array or array-like object _{Object or Array}_
     * @param {Mixed} second              second array or array-like object _{Object or Array}_
     *
     * @return {Mixed} _{Object or Array}_ combined arr or obj (based off first)
     */
    merge : function( first, second )
    {
        if ( !second )
        {
            second  = first;
            first   = this;
        }

        var i = first.length;

        for ( var j = 0, length = second.length; j < length; j++ )
        {
            first[ i++ ] = second[ j ];
        }

        first.length = i;

        return first;
    },


    /**
     * ## Parent
     *
     * Sets all elements in a microbe to their parent nodes
     *
     * @return _Microbe_
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
     * @param {Element} _el                 element to add
     *
     * @return _Microbe_
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
     * @return _Microbe_
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
     * @return _Microbe_
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
     * ## selector
     *
     * Returns the css selector from an element
     *
     * @return {String} combined selectors
     */
    selector : function()
    {
        var self = this;

        return this._selector || (function()
        {
            var getSelectorString = function( _elm )
            {
                if ( _elm && _elm.tagName )
                {
                    var tag = _elm.tagName.toLowerCase(),
                    id      = ( _elm.id ) ? '#' + _elm.id : '',
                    clss    = Array.prototype.join.call( _elm.classList, '.' );

                    clss = ( clss !== '' ) ? '.' + clss : clss;

                    return tag + id + clss;
                }

                // document or window
                return '';
            };

            var _selector, selectors = [];

            for ( var i = 0, lenI = self.length; i < lenI; i++ )
            {
                _selector = getSelectorString( self[ i ] );

                if ( selectors.indexOf( _selector ) === -1 )
                {
                    selectors.push( _selector );
                }
            }

            selectors       = selectors.join( ', ' );
            self._selector  = selectors;

            return selectors;
        })();
    },


    /**
     * ## siblings
     *
     * Gets an microbe of all of each given element's siblings
     *
     * @return {Array} array of microbes
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
     * Gets an microbe of all siblings of all element's given
     *
     * @return {Microbe} combined siblings
     */
    siblingsFlat : function()
    {
        var _siblings = function( _elm )
        {
            var parentsChildren = Microbe.toArray( _elm.parentNode.children );
            var elIndex = parentsChildren.indexOf( _elm );
            parentsChildren.splice( elIndex, 1 );

            return parentsChildren;
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

        return new Microbe( '', undefined, siblingArray );
    },



    /**
     * ## splice
     *
     * Native splice wrapped in a microbe
     *
     * @return {Array} array of elements
     */
    splice : function( _start, _end )
    {
        var arr = splice.call( this, _start, _end );

        return new Microbe( arr );
    },


    /**
     * ## text
     *
     * Changes the inner text to the supplied string. If the value is omitted,
     * simply returns the current inner html value of the element.
     *
     * @param {String} _value              Text value (optional)
     *
     * @return _Microbe_ or _Array_
     */
    text : (function()
    {
        var _setText = function( _value, _el )
        {
            if( document.all )
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
            if( document.all )
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
     * Methods returns all the elements in an array.
     *
     * @return _Array_
     */
    toArray : function( _arr )
    {
        _arr = _arr || this;
        return Array.prototype.slice.call( _arr );
    },


    /**
     * ## toggleClass
     *
     * Methods calls removeClass on the current object or given element.
     *
     * @param {String} _class              class to add
     *
     * @return {Microbe}
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
     * Methods returns the type of Microbe.
     *
     * @return _String_
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
