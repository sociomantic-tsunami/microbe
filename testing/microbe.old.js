( function ( root, factory )
{
   /* globals define */

   /**
    * AMD module
    */
    if ( typeof define === 'function' && define.amd )
    {
        define( 'microbe', [], factory );
    }
    else
    {
        root.xµ = factory();
    }
}( this, function ()
{
    'use strict';
/**
 * microbe.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * Class Microbe
 *
 * Constructor.
 * Either selects or creates an HTML element and wraps in into an Microbe instance.
 * Usage:   xµ('div#test')   ---> selection
 *          xµ('<div#test>') ---> creation
 *
 * @param   _selector   string or HTMLElement   HTML selector
 * @param   _scope      HTMLElement             scope to look inside
 * @param   _elements   HTMLElement(s)          elements to fill Microbe with (optional)
 *
 * @return  Microbe
*/
window.Microbe = window.Microbe || function( _selector, _scope, _elements )
{
    var elements;

    if ( _selector.nodeType === 1 )
    {
        return this.create( _selector );
    }

    if ( /^<.+>$/.test( _selector ) )
    {
        return this.create( _selector.substring( 1, _selector.length - 1 ) );
    }

    if ( _elements )
    {
        if ( Object.prototype.toString.call( _elements ) === '[object Array]' )
        {
            elements = _elements;
        }
        else
        {
            elements = [ _elements ];
        }
    }
    else
    {
        elements = ( _scope || document ).querySelectorAll( _selector );
    }

    var i, len;

    this.length = elements.length;

    for ( i = 0, len = elements.length; i < len; i++ )
    {
        this[ i ] = elements[ i ];
    }

    for( var prop in Microbe.prototype )
    {
        if ( Microbe.prototype.hasOwnProperty( prop ) )
        {
            elements[ prop ] = Microbe.prototype[ prop ];
        }
    }

    return elements;
};

Microbe.prototype = {
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
 * check micro
 *
 * this check if something is a Microbe object.  microbes are returned. elements are
 * wrapped into microbe objects. Strings are built using the create method, then wrapped
 * into microbes and returned.
 *
 * @param  {anything} _obj object to check type
 * @return {object}        microbe object
 */
micro : function( _obj )
{
    if ( _obj.type !== '[object Microbe]' )
    {
        if ( /^<.+>$/.test( _obj ) )
        {
            return this.create( _obj.substring( 1, _obj.length - 1 ) );
        }
        else
        {
            return new Microbe( _obj );
        }
    }

    return _obj;
},


/**
 * To array
 *
 * Methods returns all the elements in an array.
 *
 * @return  Array
*/
toArray : function()
{
    var arr = [];
    var i, leni;
    for ( i = 0, leni = this.length; i < leni; i++ )
    {
        arr.push( this[ i ] );
    }
    return arr;
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
    return this.type;
},


type : '[object Microbe]',

/******************************************************************************/


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
        attributes.push( _getAttr( this[ j ] ) );
    }

    if ( attributes.length === 1 )
    {
        return attributes[0];
    }

    return attributes;
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
        childrenArray.push( _children( this[ i ] ) );
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
    if ( Object.prototype.toString.call( _el ) === '[object String]' )
    {
        var _ids, _classes = '';

        if ( _el.indexOf( '#' ) !== -1 )
        {
            if ( _ids === undefined )
            {
                _ids = _el;
            }
            _ids     = _el.split( '#' )[ 1 ];
            _ids     = _ids.split( '.' )[ 0 ];
        }

        var classArray = _el.split( '.' );

        var i, len;
        for ( i = 1, len = classArray.length; i < len; i++ )
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

    return new Microbe( '', '', [ this[ 0 ] ] );
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
        indexes.push( _getParentIndex( this[ i ] ) );
    }

    return indexes;
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
        markup.push( _getHtml( this[ j ] ) );
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
 * @example xµ( '.elementsInDom' ).insertAfter( xµElementToInsert )
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


/**
 * Get Last Element
 *
 * Methods gets the last HTML Elements of the current object, and wrap it in
 * Microbe for chaining purpose.
 *
 * @return  Microbe
 */
last : function ()
{
    if ( this.length === 1 )
    {
        return this;
    }

    return new Microbe( '', '', [ this[ this.length - 1 ] ] );
},


/**
 * Get Parent
 *
 * sets all elements in xµ to their parent nodes
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
        parentArray.push( _parent( this[ i ] ) );
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
        arrayText.push( _getText( this[ j ] ) );
    }

    if ( arrayText.length === 1 )
    {
        return arrayText[0];
    }
    return arrayText;
},


/******************************************************************************/

/**
 * microbe.css.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

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
        _elm.className += _elm.className.length > 0 ? ' ' + _class : _class;
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
        styles.push( _getCss( this[ j ] ) );
    }
    if ( styles.length === 1 )
    {
        return styles[0];
    }

    return styles;
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
    var classRegex = new RegExp( '(?:^| +)' + _class + ' *(?= +|$)', 'g' );

    var _removeClass = function( _elm )
    {
        _elm.className = _elm.className.replace( classRegex , '' ).trim();
        if ( _elm.classList.length === 0 )
        {
            _elm.removeAttribute( 'class' );
        }
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
    var classRegex = new RegExp( '(^|\\s)' + _class + '(\\s|$)', 'g' );

    var _hasClass = function( _elm )
    {
        return !!_elm.className.match( classRegex );
    };

    if ( _el )
    {
        return _hasClass( _el );
    }

    var i, len, results = [];
    for ( i = 0, len = this.length; i < len; i++ )
    {
        results.push( _hasClass( this[ i ] ) );
    }

    return results;
},


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
        if ( _elm.className.indexOf( _class ) > -1 )
        {
            Microbe.removeClass( _class, _elm );
        }
        else
        {
            Microbe.addClass( _class, _elm );
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


/******************************************************************************/

/**
 * microbe.events.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

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


/*
 * Ready
 *
 * Methods detects if the DOM is ready.
 * http://stackoverflow.com/a/1207005
 *
 * @return  void
*/
ready : function( _callback )
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
},


/******************************************************************************/

/**
 * microbe.http.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */


http : (function()
{
    var _response = function( _val )
    {
        var _responses =
        {
            success: function( _cb )
            {
                delete _responses.success;
                if ( _val.status === 200 )
                {
                    _cb( _val.responseText );
                }
                return _responses;
            },
            error: function( _cb )
            {
                delete _responses.error;
                if ( _val.status !== 200 )
                {
                    _cb({
                        status      : _val.status,
                        statusText  : _val.statusText
                    });
                }
                return _responses;
            },
            always: function( _cb )
            {
                delete _responses.always;
                _cb( _val );
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
            if ( Object.prototype.toString.call( headers ) === '[object Array' )
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
}())

};


/******************************************************************************/

/* exported xµ */
/**
 * microbe.main.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

 /**
 * xµ constructor
 *
 * builds the xµ object
 *
 * @return xµ
 */
var xµ = (function()
{
    var inner = function( selector, scope )
    {
        var microbeInner = new Microbe( selector, scope );

        return microbeInner;
    };

    for( var prop in Microbe.prototype )
    {
        if ( Microbe.prototype.hasOwnProperty( prop ) )
        {
            inner[ prop ] = Microbe.prototype[ prop ];
        }
    }

    return inner;
}());

/******************************************************************************/
    return xµ;

} ) );
