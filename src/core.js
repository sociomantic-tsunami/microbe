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

var Arrays      = require('./utils/array');
var Strings     = require('./utils/string');

var slice       = Arrays.slice;
var map         = Arrays.map;
var indexOf     = Arrays.indexOf;

module.exports = function( Microbe )
{
    var _type       = Microbe.type;

    Microbe.core    = Microbe.prototype = {

        /**
         * ## addClass
         *
         * Adds the passed class to the current element(s)
         *
         * @param {Mixed} _class    class to remove.  this accepts
         *                          strings and array of strings.
         *                          the strings can be a class or
         *                          classes seperated with spaces _{String or Array}_
         *
         * @return _Microbe_ reference to original microbe
         */
        addClass : function( _class )
        {
            var _addClass = function( _el )
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

            if ( typeof _class === 'string' )
            {
                _class = [ _class ];
            }

            this.each( _addClass );

            return this;
        },


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
                this.each( _setAttr );

                return this;
            }

            return this.map( _getAttr );
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
                
                this.each( _setCss );

                return this;
            }

            return this.map( _getCss );
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

            return this.map( _getParentIndex );
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

            return this.map( _hasClass );
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

            if ( _value || _value === '' || _value === 0 )
            {
                var _setHtml = function( _elm )
                {
                    _elm.data           = _elm.data || {};
                    _elm.data.html      = _elm.data.html || {};
                    _elm.data.html.html = _value;

                    _elm.innerHTML      = _value;
                };

                this.each( _setHtml );

                if ( _append )
                {
                    return this.append( _append );
                }
                else
                {
                    return this;
                }
            }

            return this.map( _getHtml );
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
        removeClass : function( _class )
        {
            var _removeClass = function( _el )
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

            if ( typeof _class === 'string' )
            {
                _class = [ _class ];
            }

            this.each( _removeClass );

            return this;
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
        text : function( _value )
        {
            var _setText = function( _el )
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

            if ( _value || _value === '' || _value === 0 )
            {
                this.each( _setText );

                return this;
            }

            return this.map( _getText );
        },


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
         * @return _Microbe_ reference of the original microbe
         */
        toggleClass : function( _class )
        {
            var _toggleClass = function( _el )
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

            this.each( _toggleClass );

            return this;
        },


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
