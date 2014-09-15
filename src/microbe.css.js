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
    var _addClass = function( _elm )
    {
        _elm.classList.add( _class );
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
    var _removeClass = function( _elm )
    {
        _elm.classList.remove( _class );
        // if ( _elm.classList.length === 0 )
        // {
        //     _elm.removeAttribute( 'class' );
        // }
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
    var _hasClass = function( _elm )
    {
        _elm.classList.contains( _class );
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
    var _toggleClass = function( _elm )
    {
        if ( _elm.classList.contains( _class ) )
        {
            _elm.classList.add( _class );
        }
        else
        {
            _elm.classList.remove( _class );
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
};


/******************************************************************************/
