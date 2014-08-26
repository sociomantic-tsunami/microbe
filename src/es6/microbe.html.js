/* jshint esnext: true*/
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
    let _append = function( _parentEl, _elm )
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

    for ( let i = 0, leni = this.length; i < leni; i++ )
    {
        for ( let j = 0, lenj = _el.length; j < lenj; j++ )
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
    let _setAttr;
    let _getAttr;
    let _removeAttr;

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

        for ( let i = 0, len = this.length; i < len; i++ )
        {
            _setAttr( this[ i ] );
        }

        return this;
    }

    let attributes = [];

    for ( let i = 0, len = this.length; i < len; i++ )
    {
        attributes.push( _getAttr( this[ i ] ) );
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
    let _children = function( _elm )
    {
        return _elm.children;
    };

    let childrenArray = [];

    for ( let i = 0, len = this.length; i < len; i++ )
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
    if ( Object.prototype.toString.call( _el ) === '[object String]' )
    {
        let _ids, _classes = '';

        if ( _el.indexOf( '#' ) !== -1 )
        {
            if ( _ids === undefined )
            {
                _ids = _el;
            }
            _ids     = _el.split( '#' )[ 1 ];
            _ids     = _ids.split( '.' )[ 0 ];
        }

        let classArray = _el.split( '.' );

        for ( let i = 1, len = classArray.length; i < len; i++ )
        {
            if ( classArray[ i ].indexOf( '#' ) === -1 )
            {
                _classes += ' ' + classArray[ i ];
            }
        }
        _classes = _classes.trim();

        _el = _el.split( /[#.]/ )[ 0 ];

        _el = document.createElement( _el );

        if ( _classes !== '' )
        {
            _el.className = _classes;
        }

        if ( _ids )
        {
            _el.id = _ids.trim();
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
    let _getParentIndex = function( _elm )
    {
        return Array.prototype.indexOf.call( _elm.parentNode.children, _elm );
    };

    let indexes = [];

    if ( _el )
    {
        indexes = _getParentIndex( _el );
        return indexes;
    }

    for ( let i = 0, len = this.length; i < len; i++ )
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
    let _setHtml = function( _elm )
    {
        _elm.innerHTML = _value;
    };

    let _getHtml = function( _elm )
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

        for ( let i = 0, len = this.length; i < len; i++ )
        {
            _setHtml( this[ i ] );
        }

        return this;
    }

    let markup = [];
    for ( let i = 0, len = this.length; i < len; i++ )
    {
        markup.push( _getHtml( this[ i ] ) );
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
    let _insertAfter = function( _elm )
    {
        _elAfter = this.micro.apply( this, [ _elAfter ] );
        _elm     = this.micro.apply( this, [ _elm ] );

        let nextIndex;

        for ( let i = 0, len = _elm.length; i < len; i++ )
        {
            nextIndex = this.getParentIndex( _elm[ i ] );

            let nextEle   = _elm[ i ].parentNode.children[ nextIndex + 1 ];

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
        _insertAfter.apply( this, [ _el ] );
        return this;
    }

    for ( let i = 0, len = this.length; i < len; i++ )
    {
        _insertAfter.apply( this, [ this[ i ] ] );
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
    let _parent = function( _elm )
    {
        return _elm.parentNode;
    };

    let parentArray = [];

    for ( let i = 0, len = this.length; i < len; i++ )
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
    let _remove = function( _elm )
    {
        return _elm.parentNode.removeChild( _elm );
    };

    if ( _el )
    {
        _remove( _el );
    }

    for ( let i = 0, len = this.length; i < len; i++ )
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
    let _setText = function( _elm )
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

    let _getText = function( _elm )
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

        for ( let i = 0, len = this.length; i < len; i++ )
        {
            _setText( this[ i ] );
        }

        return this;
    }

    let arrayText = [];
    for ( let i = 0, len = this.length; i < len; i++ )
    {
        arrayText.push( _getText( this[ i ] ) );
    }

    if ( arrayText.length === 1 )
    {
        return arrayText[0];
    }
    return arrayText;
};


/******************************************************************************/
