
module.exports = function( Microbe )
{
    'use strict';

    var _type       = Microbe.type;

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
     * @example µ( '.example' ).addClass( 'moon' );
     * @example µ( '.example' ).addClass( [ 'moon', 'doge' ] );
     *
     * @return _Microbe_ reference to original microbe
     */
    Microbe.core.addClass = function( _class )
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
    };


    /**
     * ## attr
     *
     * Changes the attribute by writing the given property and value to the
     * supplied elements.  If the value is omitted, simply returns the current
     * attribute value of the element. Attributes can be bulk added by passing
     * an object (property: value)
     *
     * @param {Mixed} _attribute attribute name {String or Object}
     * @param {String} _value attribute value (optional)
     *
     * @example µ( '.example' ).attr( 'moon', 'doge' );
     * @example µ( '.example' ).attr( { 'moon' : 1,
     *                                  'doge' : 2 } );
     * @example µ( '.example' ).attr( 'moon' );
     *
     * @return _Microbe_ reference to original microbe (set)
     * @return _Array_  array of values (get)
     */
    Microbe.core.attr = function ( _attribute, _value )
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
    };


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
     * @example µ( '.example' ).css( 'background-color', '#fff' );
     * @example µ( '.example' ).css( { 'background-color' : '#fff',
     *                                  'color' : '#000' } );
     * @example µ( '.example' ).css( 'background-color' );
     *
     * @return _Microbe_ reference to original microbe (set)
     * @return _Array_  array of values (get)
     */
    Microbe.core.css = function( _property, _value )
    {
	    var isObject = Microbe.isObject( _property );

        var _setCss = function( _elm, _v )
        {
            _elm.data                   = _elm.data     || {};
            _elm.data.css               = _elm.data.css || {};
            _elm.data.css[ _property ]  = _v || _value;
            _elm.style[ _property ]     = _elm.data.css[ _property ];
        };

        var _getCss = function( _elm )
        {
            return window.getComputedStyle( _elm ).getPropertyValue( _property );
        };

        if ( _value || _value === null || _value === '' || isObject )
        {
		    if ( isObject )
            {
                for ( var prop in _property )
                {
                    this.css( prop, _property[ prop ] );
                }

                return this;
            }

            _value = ( _value === null ) ? '' : _value;

            this.each( _setCss );

            return this;
        }

        return this.map( _getCss );
    };


    /**
     * ## getParentIndex
     *
     * Gets the index of the item in it's parentNode's children array
     *
     * @example µ( '.example' ).getParentIndex();
     *
     * @return _Array_ array of index values
     */
    Microbe.core.getParentIndex = function()
    {
        var _getParentIndex = function( _elm )
        {
            return Array.prototype.indexOf.call( _elm.parentNode.children, _elm );
        };

        return this.map( _getParentIndex );
    };


    /**
     * ## hasClass
     *
     * Checks if the current object or the given element has the given class
     *
     * @param {String} _class              class to check
     *
     * @example µ( '.example' ).hasClass( 'example' );
     *
     * @return _Array_ Array of Boolean values
     */
    Microbe.core.hasClass = function( _class )
    {
        var _hasClass = function( _elm )
        {
            return _elm.classList.contains( _class );
        };

        return this.map( _hasClass );
    };


    /**
     * ## height
     *
     * syntactic sugar for css height
     *
     * @paran {String} _height (optional) parameter to set height
     * @return _Microbe_
     */
    Microbe.core.height = function( _height )
    {
        return _height ? this.css( 'height', _height ) : this.css( 'height' );
    };


    /**
     * ## html
     *
     * Changes the innerHtml to the supplied string or microbe.  If the value is
     * omitted, simply returns the current inner html value of the element.
     *
     * @param {Mixed} _value html value (accepts Microbe String)
     *
     * @example µ( '.example' ).html( '<span>things!</span>' );
     * @example µ( '.example' ).html();
     *
     * @return _Microbe_ reference to original microbe (set)
     * @return _Array_  array of values (get)
     */
    Microbe.core.html = function ( _value )
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
    };


    /**
     * ## offset
     *
     * returns an array of objects { top, left } of the position (in px) relative to an object's parent
     *
     * @example µ( '.example' ).offset();
     *
     * @return _Array_ array of objects
     */
    Microbe.core.offset = function()
    {
        var _offset = function( _elm )
        {
            return { top : _elm.offsetTop, left : _elm.offsetLeft };
        };

        return this.map( _offset );
    };


    /**
     * ## position
     *
     * returns an array of objects { top, left } of the position (in px) relative to an object's parent
     *
     * @example µ( '.example' ).position();
     *
     * @return _Array_ array of objects
     */
    Microbe.core.position = function()
    {
        var _position = function( _elm )
        {
            var top = 0, left = 0;

            while( _elm )
            {
                top     += _elm.offsetTop;
                left    += _elm.offsetLeft;
                _elm    = _elm.offsetParent;
            }

            return { top : top, left : left };
        };

        return this.map( _position );
    };


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
     * @example µ( '.example' ).removeClass( 'moon' );
     * @example µ( '.example' ).removeClass( [ 'moon', 'doge' ] );
     *
     * @return _Microbe_ reference of the original microbe
     */
    Microbe.core.removeClass = function( _class )
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
    };


    /**
     * ## text
     *
     * Changes the inner text to the supplied string. If the value is omitted,
     * simply returns the current inner text value of each element.
     *
     * @param {String} _value              Text value (optional)
     *
     * @example µ( '.example' ).text( 'things!' );
     * @example µ( '.example' ).text();
     *
     * @return _Microbe_ reference to original microbe (set)
     * @return _Array_  array of values (get)
     */
    Microbe.core.text = function( _value )
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
    };


    /**
     * ## toggleClass
     *
     * adds or removes a class on the current element, depending on
     * whether it has it already.
     *
     * @param {String} _class              class to add
     *
     * @example µ( '.example' ).toggleClass( 'moon' );
     * @example µ( '.example' ).toggleClass( [ 'moon', 'doge' ] );
     *
     * @return _Microbe_ reference of the original microbe
     */
    Microbe.core.toggleClass = function( _class )
    {
        var _cls;

        if ( !Array.isArray( _class ) )
        {
            _class = [ _class ];
        }

        var _toggleClass = function( _el )
        {
            if ( _el.classList.contains( _cls ) )
            {
                _el.classList.remove( _cls );
            }
            else
            {
                _el.classList.add( _cls );
            }

            _el.data                = _el.data || {};
            _el.data.class          = _el.data.class || {};
            _el.data.class.class    = _el.className;
        };

        for ( var i = 0, lenI = _class.length; i < lenI; i++ )
        {
            _cls = _class[ i ];
            this.each( _toggleClass );
        }

        return this;
    };


    /**
     * ## width
     *
     * syntactic sugar for css width
     *
     * @paran {String} _width (optional) parameter to set width
     * @return _Microbe_
     */
    Microbe.core.width = function( _width )
    {
        return _width ? this.css( 'width', _width ) : this.css( 'width' );
    };
};
