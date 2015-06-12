/**
 * observe.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * ## exported
 *
 * @return {Function} function that augment Microbe.
 */
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
     * ## get
     *
     * gets the saved value from each element in the microbe in an array
     *
     * @param {String} _prop               property to get
     *
     * @return {Array} array of values
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
     * ## observe
     *
     * Applies a function to an element if it is changed from within µ
     *
     * @param {Function} function            function to apply
     * @param {String} _prop               property to observe
     * @param {Boolean} _once               bool to trigger auto unobserve
     *
     * @return _Microbe_
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

                if ( ObserveUtils )
                {
                    ObserveUtils.defineObservableProperties( _data[ prop ], prop );
                }

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
     * ## observeOnce
     *
     * Applies a function to an element if it is changed from within µ (once)
     *
     * @param {Function} func                function to apply
     * @param {String} _prop               property to observe
     *
     * @return Microbe
     */
    Microbe.prototype.observeOnce = function( func, _prop )
    {
        this.observe( func, _prop, true );
    };


    /**
     * ## set
     *
     * Sets the value to the data object in the each element in the microbe
     *
     * @param {String} prop                property to set
     * @param {String} value               value to set to
     *
     * @return _Microbe_
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
     * ## unobserve
     *
     * Stops watching the data changes of a µ onject
     *
     * @param {String} _prop               property to stop observing
     *
     * @return _Microbe_
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
