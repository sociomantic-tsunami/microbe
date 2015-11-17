/**
 * rootUtils.js
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
     * ## contains
     *
     * Checks if a given element is a child of _scope
     *
     * @param {Element} _el element to check
     * @param {Element} _scope scope
     *
     * @example µ.contains( _el, _parentEl );
     *
     * @return _Boolean_ whether _el is contained in the scope
     */
    Microbe.contains = function( _el, _scope )
    {
        var parent = _el.parentNode;

        while ( parent !== document && parent !== _scope )
        {
            parent = parent.parentNode || _scope.parentNode;
        }

        if ( parent === document )
        {
            return false;
        }

        return true;
    };


    /**
     * ## matches
     *
     * checks element an to see if they match a given css selector
     * unsure if we actually need the webkitMatchSelector and mozMatchSelector
     * http://caniuse.com/#feat=matchesselector
     *
     * @param {Mixed} el element, microbe, or array of elements to match
     *
     * @example µ.matches( _el, 'div.example' );
     *
     * @return _Booblean_ matches or not
     */
    Microbe.matches = function( el, selector )
    {
        var method  = this.matches.__matchesMethod;
        var notForm = ( typeof el !== 'string' && !!( el.length ) &&
                        el.toString() !== '[object HTMLFormElement]' );

        var isArray = Array.isArray( el ) || notForm ? true : false;

        if ( !isArray && !notForm )
        {
            el = [ el ];
        }

        if ( !method && el[ 0 ] )
        {
            if ( el[ 0 ].matches )
            {
                method = this.matches.__matchesMethod = 'matches';
            }
            else if ( el[ 0 ].msMatchesSelector )
            {
                method = this.matches.__matchesMethod = 'msMatchesSelector';
            }
            else if ( el[ 0 ].mozMatchesSelector )
            {
                method = this.matches.__matchesMethod = 'mozMatchesSelector';
            }
            else if ( el[ 0 ].webkitMatchesSelector )
            {
                method = this.matches.__matchesMethod = 'webkitMatchesSelector';
            }
        }

        var resArray = [];
        for ( var i = 0, lenI = el.length; i < lenI; i++ )
        {
            resArray.push( el[ i ][ method ]( selector ) );
        }

        return isArray ? resArray : resArray[ 0 ];
    };
};
