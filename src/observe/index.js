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
        var _observe = function( _elm )
        {
            var _setObserve = function( _target, _prop )
            {
                // shim
                if ( ObserveUtils )
                {
                    ObserveUtils.defineObservableProperties( _target, prop );
                }

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
            func = func.bind( this );

            var target = null;

            if ( prop )
            {
                _data[ prop ]  = _data[ prop ] || {};

                target = _setObserveFunc( _data[ prop ] );
                _setObserve( target, prop );
            }
            else
            {
                // all
                // console.log( this.constructor.prototype );
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
            prop   = null;
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
};
