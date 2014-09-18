/* jshint esnext: true */

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
 */
class Microbe
{
    /*
    * Constructor.
    * Either selects or creates an HTML element and wraps in into an Microbe
    * instance.
    * Usage:   µ('div#test')   ---> selection
    *          µ('<div#test>') ---> creation
    *
    * @param   _selector   string or HTMLElement   HTML selector
    * @param   _scope      HTMLElement             scope to look inside
    * @param   _elements   HTMLElement(s)          elements to fill Microbe with
    *                                              (optional)
    *
    * @return  Microbe
    */
    constructor( _selector, _scope=document, _elements=null )
    {
        let elements;

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
            if ( Array.isArray( _elements ) )
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
            elements = ( _scope ).querySelectorAll( _selector );
        }

        this.length = elements.length;

        for ( let i = 0, len = elements.length; i < len; i++ )
        {
            this[ i ] = elements[ i ];
        }

        for( let prop in Microbe.prototype )
        {
            if ( Microbe.prototype.hasOwnProperty( prop ) )
            {
                elements[ prop ] = Microbe.prototype[ prop ];
            }
        }

        return elements;
    }


    /**
    * For each
    *
    * Methods iterates through all the elements an execute the function on each of
    * them
    *
    * @return  Array
    */
    each( _target, _callback )
    {
        if ( typeof _target === 'function' && !_callback )
        {
            _callback = _target;
            _target   = this;
        }

        let i = 0;
        for ( let item of this.iterator( _target ) )
        {
            _callback( item, i++ );
        }

        return _target;
    }


    /**
    * Iterator
    *
    * Generator yields next element of the iterable object given in parameter.
    *
    * @param  {iterable}      _iterable object to iterate through
    * @yield  {mixed}         what's inside the next index
    */
    * iterator( _iterable=this )
    {
        let nextIndex = 0;

        while( nextIndex < _iterable.length )
        {
            yield _iterable[nextIndex++];
        }
    }


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
    micro( _obj )
    {
        if ( _obj.type === '[object Microbe]' )
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
    }


   /**
    * To array
    *
    * Methods returns all the elements in an array.
    *
    * @return  Array
    */
    toArray()
    {
        let arr = [];
        for ( let item of this.iterator() )
        {
            arr.push( item );
        }
        return arr;
    }
}

Microbe.prototype.type = '[object Microbe]';



/******************************************************************************/

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

/* jshint esnext: true*/
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
Microbe.prototype.addClass = function( _class, _el )
{
    let _addClass = function( _elm )
    {
        _elm.className += _elm.className.length > 0 ? ' ' + _class : _class;
    };

    if ( _el )
    {
        _addClass( _el );
        return this;
    }

    for ( let i = 0, len = this.length; i < len; i++ )
    {
        _addClass( this[ i ] );
    }

    return this;
};


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
Microbe.prototype.css = function ( _property, _value, _el)
{
    let _setCss = function( _elm )
    {
        if ( _value === null )
        {
            _elm.style.removeProperty( _property );
        }
        else
        {
            _elm.style[ _property ] = _value;
        }
    };

    let _getCss = function( _elm )
    {
        return window.getComputedStyle( _elm ).getPropertyValue( _property );
    };

    if ( _value !== undefined )
    {
        if ( _el )
        {
            _setCss( _el );
            return this;
        }

        for ( let i = 0, len = this.length; i < len; i++ )
        {
            _setCss( this[ i ] );
        }

        return this;
    }

    let styles = [];
    for ( let i = 0, len = this.length; i < len; i++ )
    {
        styles.push( _getCss( this[ i ] ) );
    }
    if ( styles.length === 1 )
    {
        return styles[0];
    }

    return styles;
};


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
Microbe.prototype.hasClass = function( _class, _el )
{
    let classRegex = new RegExp( '(^|\\s)' + _class + '(\\s|$)', 'g' );

    let _hasClass = function( _elm )
    {
        return !!_elm.className.match( classRegex );
    };

    if ( _el )
    {
        return _hasClass( _el );
    }

    let i, len, results = [];
    for ( i = 0, len = this.length; i < len; i++ )
    {
        results.push( _hasClass( this[ i ] ) );
    }

    return results;
};


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
Microbe.prototype.removeClass = function( _class, _el )
{
    let classRegex = new RegExp( '(?:^| +)' + _class + ' *(?= +|$)', 'g' );

    let _removeClass = function( _elm )
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

    for ( let i = 0, len = this.length; i < len; i++ )
    {
        _removeClass( this[ i ] );
    }

    return this;
};


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
Microbe.prototype.toggleClass = function ( _class, _el )
{
    let _toggleClass = function( _elm )
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

    for ( let i = 0, len = this.length; i < len; i++ )
    {
        _toggleClass( this[ i ] );
    }

    return this;
};


/******************************************************************************/

/* jshint esnext: true*/
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
Microbe.prototype.bind = function ( _event, _callback, _el )
{
    let _bind = function( _elm )
    {
        if ( !_elm.addEventListener )
        {
            _elm.attachEvent( _event, _callback );
        }
        else
        {
            _elm.addEventListener( _event, _callback );
        }
    };

    if ( _el )
    {
        _bind( _el );
        return this;
    }

    for ( let i = 0, len = this.length; i < len; i++ )
    {
        _bind( this[ i ] );
    }

    return this;
};



 /**
 * Unbind Events
 *
 * Methods unbinds an event from the HTMLElements of the current object or to the
 * given element.
 *
 * @param   _event      string          HTMLEvent
 * @param   _callback   function        callback function
 * @param   _el         HTMLELement     element to modify (optional)
 *
 * @return  Microbe
*/
Microbe.prototype.unbind = function ( _event, _callback, _el )
{
    let _unbind = function( _elm )
    {
        _elm.removeEventListener( _event, _callback );
    };

    if ( _el )
    {
        _unbind( _el );
        return this;
    }

    for ( let i = 0, len = this.length; i < len; i++ )
    {
        _unbind( this[ i ] );
    }

    return this;
};


/*
 * Ready
 *
 * Methods detects if the DOM is ready.
 * http://stackoverflow.com/a/1207005
 *
 * @return  void
*/
Microbe.prototype.ready = function( _callback )
{
    /* Mozilla, Chrome, Opera */
    if ( document.addEventListener )
    {
        document.addEventListener( 'DOMContentLoaded', _callback, false );
    }
    /* Safari, iCab, Konqueror */
    if ( /KHTML|WebKit|iCab/i.test( navigator.userAgent ) )
    {
        let DOMLoadTimer = setInterval(function ()
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


/******************************************************************************/

/* jshint esnext: true*/
/**
 * microbe.http.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */


Microbe.prototype.http = function( _parameters )
{
    return new Promise( function( resolve, reject )
    {
        if ( !_parameters ) { reject( Error( 'No parameters given' ) ); }
        if ( typeof _parameters === 'string' )
        {
            _parameters = { url: _parameters };
        }

        let req         = new XMLHttpRequest();
        let method      = _parameters.method || 'GET';
        let url         = _parameters.url;
        let data        = JSON.stringify( _parameters.data ) || null;
        let user        = _parameters.user || '';
        let password    = _parameters.password || '';
        let headers     = _parameters.headers  || null;

        req.onreadystatechange = function()
        {
            if ( req.readyState === 4 )
            {
                return req;
            }
        };
        req.onerror = function()
        {
            reject( Error( 'Network error!' ) );
        };

        req.open( method, url, true, user, password );

        if ( headers )
        {
            if ( Array.isArray( headers ) )
            {
                for ( let i = 0, len = headers.length; i < len; i++ )
                {
                    req.setRequestHeader( headers[i].header, headers[i].value );
                }
            }
            else
            {
                req.setRequestHeader( headers.header, headers.value );
            }
        }

        req.send( data );
        req.onload = function()
        {
            if ( req.status === 200 )
            {
                resolve( req.response );
            }
            else
            {
                reject( Error( req.status ) );
            }
        };
    });
};

Microbe.prototype.http.get = function( _url )
{
    return this({
        url     : _url,
        method  : 'GET'
    });
};

Microbe.prototype.http.post = function( _url, _data )
{
    return this({
        url     : _url,
        data    : _data,
        method  : 'POST'
    });
};


/******************************************************************************/

/* jshint esnext: true*/
/**
 * microbe.main.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

 /**
 * µ constructor
 *
 * builds the µ object
 *
 * @return µ
 */
let µ = (function()
{
    let inner = function( selector, scope )
    {
        let microbeInner = new Microbe( selector, scope );

        return microbeInner;
    };

    for( let prop in Microbe.prototype )
    {
        if ( Microbe.prototype.hasOwnProperty( prop ) )
        {
            inner[ prop ] = Microbe.prototype[ prop ];
        }
    }

    return inner;
}());


/******************************************************************************/
