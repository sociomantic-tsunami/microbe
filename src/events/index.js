module.exports = function( Microbe )
{

    /**
     * emit event
     *
     * emits a custom event to the HTMLElements of the current object
     *
     * @param   {str}               _event              HTMLEvent
     * @param   {obj}               _data               event data
     *
     * @return  Microbe
    */
    Microbe.prototype.emit = function ( _event, _data, _bubbles, _cancelable )
    {
        _bubbles    = _bubbles || false;
        _cancelable = _cancelable || false;
        var _emit = function( _elm )
        {
            var _evt = new CustomEvent( _event, {
                                                    detail      : _data,
                                                    cancelable  : _cancelable,
                                                    bubbles    : _bubbles
                                                } );
            _elm.dispatchEvent( _evt );
        };

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _emit( this[ i ] );
        }

        return this;
    };


    /**
     * Bind Events
     *
     * Binds an event to the HTMLElements of the current object or to the
     * given element.
     *
     * @param   {str}               _event              HTMLEvent
     * @param   {func}              _callback           callback function
     *
     * @return  Microbe
    */
    Microbe.prototype.on = function ( _event, _callback )
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

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _on( this[ i ] );
        }

        return this;
    };


    /**
     * Unbind Events
     *
     * unbinds an/all events.
     *
     * @param   {str}           _event                  event name
     * @param   {func}          _callback               callback function
     * @param   {obj}           _el                     HTML element to modify (optional)
     *
     * @return  Microbe
    */
    Microbe.prototype.off = function( _event, _callback )
    {
        var _off = function( _e, _elm )
        {
            _cb = _callback;
            var prop = '_' + _e + '-bound-function';

            if ( ! _cb && _elm.data && _elm.data[ prop ] &&
                    _elm.data[ prop ][ prop ] )
            {
                _cb = _elm.data[ prop ][ prop ];
            }

            if ( _cb )
            {
                if ( ! Microbe.isArray( _cb ) )
                {
                    _cb = [ _cb ];
                }

                for ( var j = 0, lenJ = _cb.length; j < lenJ; j++ )
                {
                    _elm.removeEventListener( _e, _cb[ j ] );
                    _cb[ j ] = null;
                }

                _elm.data                   = _elm.data || {};
                _elm.data[ prop ]           = _elm.data[ prop ] || {};
                _elm.data[ prop ][ prop ]   = _cb;
            }
            _cb = null;
        };

        var _cb, filterFunction = function( e ){ return e; };
        for ( var i = 0, len = this.length; i < len; i++ )
        {
            var _elm = this[ i ];

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
                _off( _event[ j ], _elm );
                _event[ j ] = null;
            }


            _elm.data.__boundEvents.__boundEvents = _event.filter( filterFunction );
        }

        return this;
    };


    /**
     * CustomEvent pollyfill for IE >= 9
     *
     * @param   {str}               _event              HTMLEvent
     * @param   {obj}               _data               event data
     *
     * @return  {void}
     */
    if ( typeof CustomEvent !== 'function' )
    {
        ( function ()
        {
            function CustomEvent ( event, data )
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
