module.exports = function( Microbe )
{
    // shim needed for observe
    if ( ! Object.observe )
    {
        require( 'setimmediate' );
        require( 'observe-shim' );
        var ObserveUtils = require( 'observe-utils' );
    }


    /**
     * Get data parameter
     *
     * gets the index of the item in it's parentNode's children array
     *
     * @return {arr}                       array of values
     */
    Microbe.prototype.get = function( prop )
    {
        var _get = function( _el )
        {
            if ( ! prop )
            {
                return _el.data;
            }
            else
            {
                if ( _el.data[ prop ] && _el.data[ prop ][ prop ] )
                {
                    return _el.data[ prop ][ prop ];
                }
                else
                {
                    return false;
                }
            }
        };

        var i, len, values = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            values[ i ] = _get( this[ i ] );
        }

        return values;
    };


    /**
     * Observe
     *
     * applies a function to an element if it is changed from within µ
     *
     * @param  {func}               function            function to apply
     * @param  {str}                _prop               property to observe
     * @param  {bool}               _once               bool to trigger auto unobserve
     *
     * @return  Microbe
    */
    Microbe.prototype.observe = function( prop, func, _once )
    {
        var self = this;

        var _observe = function( _elm )
        {
            var _setObserve = function( _target, _prop )
            {
                if ( _once === true )
                {
                    var _func = function( e )
                    {
                        _target._observeFunc( e );
                        Object.unobserve( _target, _func );
                    }.bind( this );

                    Object.observe( _target, _func );
                }
                else
                {
                    Object.observe( _target, _target._observeFunc );
                }
            };

            var _setObserveFunc = function( _target )
            {
                if ( _target._observeFunc )
                {
                    Object.unobserve( _target, _target._observeFunc );
                }

                _target._observeFunc     = func;

                return _target;
            };


            _elm.data   = _elm.data || {};
            var _data   = _elm.data;
            func        = func.bind( this );

            var target = null;

            if ( prop )
            {
                _data[ prop ]  = _data[ prop ] || {};

                target = _setObserveFunc( _data[ prop ] );
                _setObserve( target, prop );
            }
            else
            {
                var _props = [ 'attr', 'text', 'css', 'html', 'class' ];

                for ( var i = 0, lenI = _props.length; i < lenI; i++ )
                {
                    _data[ _props[ i ] ] = _data[ _props[ i ] ] || {};

                    target = _setObserveFunc( _data[ _props[ i ] ] );
                    _setObserve( target, _props[ i ] );
                }

                target = _setObserveFunc( _data );
                _setObserve( target, null );

            }
        }.bind( this );

        if ( typeof prop === 'function' )
        {
            func    = prop;
            prop    = null;
        }

        var i, len, results = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            _observe( this[ i ] );
        }

        return this;
    };


    /**
     * Observe Once
     *
     * applies a function to an element if it is changed from within µ (once)
     *
     * @param  {func}               function            function to apply
     * @param  {str}                _prop               property to observe
     *
     * @return  Microbe
    */
    Microbe.prototype.observeOnce = function( func, _prop )
    {
        this.observe( func, _prop, true );
    };


    /**
     * Get data parameter
     *
     * gets the index of the item in it's parentNode's children array
     *
     * @return {arr}                       array of values
     */
    Microbe.prototype.set = function( prop, value )
    {
        var _set = function( _el )
        {
            _el.data                    = _el.data || {};

            // shim
            if ( ObserveUtils && ! _el.data[ prop ] )
            {
                ObserveUtils.defineObservableProperties( _el.data, prop );
            }

            if ( Microbe.isArray( value ) )
            {
                value = Microbe.extend( [], value );
            }
            else if ( Microbe.isObject( value ) )
            {
                value = Microbe.extend( {}, value );
            }

            _el.data[ prop ]            = _el.data[ prop ] || {};
            _el.data[ prop ][ prop ]    = value;
        };

        var i, len, values = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            values[ i ] = _set( this[ i ] );
        }

        return this;
    };


    /**
     * Stop observing
     *
     * stops watching the data changes of a µ onject
     *
     * @param   _el         HTMLELement             element to watch (optional)
     *
     * @return  Microbe
    */
    Microbe.prototype.unobserve = function( _prop )
    {
        var _unobserve = function( _elm )
        {
            var _data = _elm.data;

            if ( _data )
            {
                if ( _prop && _data[ _prop ] && _data[ _prop ]._observeFunc )
                {
                    Object.unobserve( _data[ _prop ], _data[ _prop ]._observeFunc );
                }
                else if ( ! _prop )
                {
                    if ( _data._observeFunc )
                    {
                        Object.unobserve( _data, _data._observeFunc );
                    }

                    for ( var _property in _data )
                    {
                        if ( _data[ _property ]._observeFunc )
                        {
                            Object.unobserve( _data[ _property ], _data[ _property ]._observeFunc );
                        }
                    }
                }
            }
        }.bind( this );

        var i, len, results = new Array( this.length );
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _unobserve( this[ i ] );
        }

        return this;
    };
};
