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
            elements = _scope.querySelectorAll( _selector );
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
