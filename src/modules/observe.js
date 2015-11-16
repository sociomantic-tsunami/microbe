/**
 * observe.js
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 *
 * @package Microbe
 */

module.exports = function( Microbe )
{
    'use strict';

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
     * @param {String} _prop property to get
     *
     * @example µ( '.example' ).get( 'moon' );
     *
     * @return _Array_ array of values
     */
    Microbe.core.get = function( prop )
    {
        var _get = function( _el )
        {
            if ( ! prop )
            {
                return _el.data;
            }
            else
            {
                if ( _el.data && _el.data[ prop ] && _el.data[ prop ][ prop ] )
                {
                    return _el.data[ prop ][ prop ];
                }
                else
                {
                    return false;
                }
            }
        };

        return this.map( _get );
    };


    /**
     * ## observe
     *
     * Applies a function to an element if it is changed from within µ
     *
     * @param {Function} function function to apply
     * @param {String} _prop property to observe
     * @param {Boolean} _once bool to trigger auto unobserve
     *
     * @example µ( '.example' ).observe( 'moon', function(){ console.log( 'moon!' ); } );
     *
     * @return _Microbe_  reference to original microbe
     */
    Microbe.core.observe = function( prop, func, _once )
    {
        var _observe = function( _elm )
        {
            var _setObserve = function( _target )
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
                _setObserve( target );
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

        this.each( _observe );

        return this;
    };


    /**
     * ## observeOnce
     *
     * Applies a function to an element if it is changed from within µ (once)
     *
     * @param {Function} func function to apply
     * @param {String} _prop property to observe
     *
     * @example µ( '.example' ).observeOnce( 'moon', function(){ console.log( 'moon!' ); } );
     *
     * @return _Microbe_ reference to original microbe
     */
    Microbe.core.observeOnce = function( func, _prop )
    {
        this.observe( func, _prop, true );
    };


    /**
     * ## set
     *
     * Sets the value to the data object in the each element in the microbe
     *
     * @param {String} prop property to set
     * @param {String} value value to set to
     *
     * @example µ( '.example' ).set( 'moon', 'doge' );
     *
     * @return _Microbe_ reference to original microbe
     */
    Microbe.core.set = function( prop, value )
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

        this.each( _set );

        return this;
    };


    /**
     * ## unobserve
     *
     * Stops watching the data changes of a µ object
     *
     * @param {String} _prop property to stop observing
     *
     * @example µ( '.example' ).unobserve( 'moon' );
     *
     * @return _Microbe_ reference to original microbe
     */
    Microbe.core.unobserve = function( _prop )
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

        this.each( _unobserve );

        return this;
    };
};
