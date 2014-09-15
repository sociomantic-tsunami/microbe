/**
 * microbe.html.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */


/**
 * Append Element
 *
 * @param  {[type]} _ele    [description]
 * @param  {[type]} _parent [description]
 * @return {[type]}         [description]
 */
Microbe.prototype.append = function( _el, _parent )
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

};


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
Microbe.prototype.attr = function ( _attribute, _value, _el)
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
        attributes.push( _getAttr( this[ j ] ) );
    }

    if ( attributes.length === 1 )
    {
        return attributes[0];
    }

    return attributes;
};


/**
 * Get Children
 *
 * gets an array or all the given element's children
 *
 * @param  {[type]} _el [description]
 * @return {[type]}     [description]
 */
Microbe.prototype.children = function( _el )
{
    var _children = function( _elm )
    {
        return _elm.children;
    };

    var childrenArray = [];

    var i, len;

    for ( i = 0, len = this.length; i < len; i++ )
    {
        childrenArray.push( _children( this[ i ] ) );
    }

    if ( childrenArray.length === 1 )
    {
        return childrenArray[0];
    }

    return childrenArray;
};


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
Microbe.prototype.create = function ( _el )
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

    return new Microbe('', '', _el );
};


/**
 * Get First Element
 *
 * Methods gets the first HTML Elements of the current object, and wrap it in
 * Microbe for chaining purpose.
 *
 * @return  Microbe
*/
Microbe.prototype.first = function ()
{
    if ( this.length === 1 )
    {
        return this;
    }

    return new Microbe( '', '', [ this[ 0 ] ] );
};


/**
 * Get Parent Index
 *
 * gets the index of the item in it's parentNode's children array
 *
 * @param  {element object or array} _el object to find the index of (optional)
 * @return {array}                       array of indexes
 */
Microbe.prototype.getParentIndex = function( _el )
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
        indexes.push( _getParentIndex( this[ i ] ) );
    }

    return indexes;
};


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
Microbe.prototype.html = function ( _value, _el)
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
        markup.push( _getHtml( this[ j ] ) );
    }

    if ( markup.length === 1 )
    {
        return markup[0];
    }
    return markup;
};


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
Microbe.prototype.insertAfter = function( _elAfter, _el )
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
};


/**
 * Get Last Element
 *
 * Methods gets the last HTML Elements of the current object, and wrap it in
 * Microbe for chaining purpose.
 *
 * @return  Microbe
 */
Microbe.prototype.last = function ()
{
    if ( this.length === 1 )
    {
        return this;
    }

    return new Microbe( '', '', [ this[ this.length - 1 ] ] );
};


/**
 * Get Parent
 *
 * sets all elements in µ to their parent nodes
 *
 * @param  {[type]} _el [description]
 * @return {[type]}     [description]
 */
Microbe.prototype.parent = function( _el )
{
    var _parent = function( _elm )
    {
        return _elm.parentNode;
    };

    var parentArray = [];

    for ( var i = 0, len = this.length; i < len; i++ )
    {
        parentArray.push( _parent( this[ i ] ) );
    }

    return new Microbe( '', '', parentArray );
};


/**
 * Remove Element
 *
 * removes an element or elements from the dom
 *
 * @param  {[type]} _el [description]
 * @return {[type]}     [description]
 */
Microbe.prototype.remove = function( _el )
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
};


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
Microbe.prototype.text = function ( _value, _el)
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
        arrayText.push( _getText( this[ j ] ) );
    }

    if ( arrayText.length === 1 )
    {
        return arrayText[0];
    }
    return arrayText;
};


/******************************************************************************/
