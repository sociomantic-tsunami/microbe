/**
 * data.js
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 *
 * @package Microbe
 */

module.exports = function( Microbe )
{
    'use strict';


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
                if ( _el.data && _el.data[ prop ] )
                {
                    return _el.data[ prop ];
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
            _el.data            = _el.data || {};

            if ( Microbe.isArray( value ) )
            {
                value = Microbe.extend( [], value );
            }
            else if ( Microbe.isObject( value ) )
            {
                value = Microbe.extend( {}, value );
            }

            _el.data[ prop ]    = value;
        };

        this.each( _set );

        return this;
    };
};
