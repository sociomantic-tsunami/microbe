/**
 * events.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

module.exports = function( Microbe )
{
    'use strict';

    /**
     * ## emit
     *
     * Emits a custom event to the HTMLElements of the current object
     *
     * @param {String} _event HTMLEvent
     * @param {Object} _data event data
     * @param {Boolean} _bubbles event bubbles?
     * @param {Boolean} _cancelable cancelable?
     *
     * @return _Microbe_ reference to original microbe
     */
    Microbe.core.emit = function ( _event, _data, _bubbles, _cancelable )
    {
        _bubbles    = _bubbles || false;
        _cancelable = _cancelable || false;
        var _emit = function( _elm )
        {
            var _evt = new CustomEvent( _event, {
                                                    detail      : _data,
                                                    cancelable  : _cancelable,
                                                    bubbles    : _bubbles
                                                } );
            _elm.dispatchEvent( _evt );
        };

        this.each( _emit );

        return this;
    };


    /**
     * ## off
     *
     * Unbinds an/all events.
     *
     * @param {String} _event event name
     * @param {Function} _callback callback function
     * @param {Object} _el HTML element to modify (optional)
     *
     * @return _Microbe_ reference to original microbe
     */
    Microbe.core.off = function( _event, _callback )
    {
        var filterFunction = function( e ){ return e; };

        var _off = function( _elm, _e )
        {
            var _cb = _callback;
            var prop = '_' + _e + '-bound-function';

            if ( ! _cb && _elm.data && _elm.data[ prop ] &&
                    _elm.data[ prop ][ prop ] )
            {
                _cb = _elm.data[ prop ][ prop ];
            }
            else if ( ! ( _elm.data && _elm.data[ prop ] &&
                    _elm.data[ prop ][ prop ] ) )
            {
                _elm.data                   = _elm.data || {};
                _elm.data[ prop ]           = _elm.data[ prop ] || {};
                _elm.data[ prop ][ prop ]   = _elm.data[ prop ][ prop ] || [];
                return null;
            }

            if ( _cb )
            {
                if ( ! Microbe.isArray( _cb ) )
                {
                    _cb = [ _cb ];
                }

                var _index, _d;
                for ( var k = 0, lenK = _cb.length; k < lenK; k++ )
                {
                    _d      = _elm.data[ prop ][ prop ];
                    _index  = _d.indexOf( _cb[ k ] );

                    if ( _index !== -1 )
                    {
                        _elm.removeEventListener( _e, _cb[ k ] );
                        _d[ _index ] = null;
                    }
                }
                _elm.data[ prop ][ prop ] = _elm.data[ prop ][ prop ].filter( filterFunction );
            }
        };

        var _checkBoundEvents = function ( _elm )
        {
            if ( !_event && _elm.data && _elm.data.__boundEvents && _elm.data.__boundEvents.__boundEvents )
            {
                _event = _elm.data.__boundEvents.__boundEvents;
            }
            else
            {
                _elm.data                   = _elm.data || {};
                _elm.data.__boundEvents     = _elm.data.__boundEvents || {};
            }

            if ( !Microbe.isArray( _event ) )
            {
                _event = [ _event ];
            }

            for ( var j = 0, lenJ = _event.length; j < lenJ; j++ )
            {
                _off( _elm, _event[ j ] );
            }

            _elm.data.__boundEvents.__boundEvents = _event.filter( filterFunction );
        }

        this.each( _checkBoundEvents );

        return this;
    };


    /**
     * ## on
     *
     * Binds an event to the HTMLElements of the current object or to the
     * given element.
     *
     * @param {String} _event HTMLEvent
     * @param {Function} _callback callback function
     *
     * @return _Microbe_ reference to original microbe
     */
    Microbe.core.on = function ( _event, _callback )
    {
        var _on = function( _elm )
        {
            var prop = '_' + _event + '-bound-function';

            _elm.data                   = _elm.data || {};
            _elm.data[ prop ]           = _elm.data[ prop ] || {};
            _elm.data[ prop ][ prop ]   = _elm.data[ prop ][ prop ] || [];

            _elm.data.__boundEvents     = _elm.data.__boundEvents || {};
            _elm.data.__boundEvents.__boundEvents   = _elm.data.__boundEvents.__boundEvents || [];

            _elm.addEventListener( _event, _callback );
            _elm.data[ prop ][ prop ].push( _callback );

            _elm.data.__boundEvents.__boundEvents.push( _event );
        };

        this.each( _on );

        return this;
    };


    /**
     * ## _CustomEvent polyfill
     *
     * CustomEvent polyfill for IE <= 9
     *
     * @param {String} _event HTMLEvent
     * @param {Object} _data event data
     *
     * @return _void_
     */
    if ( typeof CustomEvent !== 'function' )
    {
        ( function()
        {
            function CustomEvent( event, data )
            {
                data    = data || { bubbles: false, cancelable: false, detail: undefined };
                var evt = document.createEvent( 'CustomEvent' );
                evt.initCustomEvent( event, data.bubbles, data.cancelable, data.detail );
                return evt;
            }

            CustomEvent.prototype   = window.Event.prototype;
            window.CustomEvent      = CustomEvent;
        } )();
    }
};
