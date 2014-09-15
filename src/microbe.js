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
 * Usage:   µ('div#test')   ---> selection
 *          µ('<div#test>') ---> creation
 *
 * @param   _selector   string or HTMLElement   HTML selector
 * @param   _scope      HTMLElement             scope to look inside
 * @param   _elements   HTMLElement(s)          elements to fill Microbe with (optional)
 *
 * @return  Microbe
*/
function Microbe( _selector, _scope, _elements )
{
    var elements;

    if ( _selector.nodeType === 1 )
    {
        return this.create( _selector );
    }
    else if ( /^<.+>$/.test( _selector ) )
    {
        return this.create( _selector.substring( 1, _selector.length - 1 ) );
    }
    else if ( Object.prototype.toString.call( _selector ) === '[object NodeList]' )
    {
        elements = _selector;
    }
    else if ( _elements )
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

    for ( var prop in Microbe.prototype )
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
Microbe.prototype.each = function( _callback )
{
    var i, leni;
    for ( i = 0, leni = this.length; i < leni; i++ )
    {
        _callback( this[ i ], i );
    }
    return this;
};


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
Microbe.prototype.micro = function( _obj )
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
};


/**
 * To array
 *
 * Methods returns all the elements in an array.
 *
 * @return  Array
*/
Microbe.prototype.toArray = function()
{
    var arr = [];
    var i, leni;
    for ( i = 0, leni = this.length; i < leni; i++ )
    {
        arr.push( this[ i ] );
    }
    return arr;
};


/**
 * To String
 *
 * Methods returns the type of Microbe.
 *
 * @return  string
*/
Microbe.prototype.toString = function()
{
    return this.type;
};


Microbe.prototype.type = '[object Microbe]';

/******************************************************************************/
