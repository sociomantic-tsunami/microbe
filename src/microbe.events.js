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
};


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
Microbe.prototype.unbind = function ( _event, _callback, _el )
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
};


/******************************************************************************/
