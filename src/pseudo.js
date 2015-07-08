/**
 * pseudo.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

/**
 * ## exported
 *
 * @return _Function_ function that augment Microbe.
 */
module.exports = function( Microbe )
{
    /**
     * ## pseudo
     *
     * @return _Object_
     */
    Microbe.constructor.prototype.pseudo = {

        /**
         * ### contains
         *
         * Returns only elements that contain the given text.  The supplied text
         * is compared ignoring case
         *
         * @param {Microbe} _el microbe to be filtered
         * @param {String} _var string to search for
         *
         * @return _Microbe_
         */
        contains : function( _el, _var )
        {
            _var            = _var.toLowerCase();

            var textArray   = _el.text();
            var elements    = [];

            for ( var i = 0, lenI = _el.length; i < lenI; i++ )
            {
                if ( textArray[ i ].toLowerCase().indexOf( _var ) !== -1 )
                {
                    elements.push( _el[ i ] );
                }
            }
            return _el.constructor( elements );
        },


        /**
         * ### even
         *
         * Returns the even indexed elements of a microbe (starting at 0)
         *
         * @param {Microbe} _el microbe to be filtered
         *
         * @return _Microbe_
         */
        even : function( _el )
        {
            var elements = [];
            for ( var i = 0, lenI = _el.length; i < lenI; i++ )
            {
                if ( ( i + 1 ) % 2 === 0 )
                {
                    elements.push( _el[ i ] );
                }
            }
            return _el.constructor( elements );
        },


        /**
         * ### first
         *
         * returns the first element of a microbe
         *
         * @param {Microbe} _el microbe to be filtered
         *
         * @return _Microbe_
         */
        first : function( _el )
        {
            return _el.first();
        },


        /**
         * ### gt
         *
         * returns the last {_var} element
         *
         * @param {Microbe} _el microbe to be filtered
         * @param {String} _var number of elements to return
         *
         * @return _Microbe_
         */
        gt : function( _el, _var )
        {
            return _el.splice( _var, _el.length );
        },


        /**
         * ### has
         *
         * returns elements that have the passed selector as a child
         *
         * @param {Microbe} _el microbe to be filtered
         * @param {String} _var selector string
         *
         * @return _Microbe_
         */
        has : function( _el, _var )
        {
            var i, lenI, _obj, results = [];

            for ( i = 0, lenI = _el.length; i < lenI; i++ )
            {
                _obj = _el.constructor( _var, _el[ i ] );

                if ( _obj.length !== 0 )
                {
                    results.push( _el[ i ] );
                }
            }

            return _el.constructor( results );

        },


        /**
         * ### last
         *
         * returns the last element of a microbe
         *
         * @param {Microbe} _el microbe to be filtered
         *
         * @return _Microbe_
         */
        last : function( _el )
        {
            return _el.last();
        },


        /**
         * ### lt
         *
         * returns the first [_var] elements
         *
         * @param {Microbe} _el microbe to be filtered
         * @param {String} _var number of elements to return
         *
         * @return _Microbe_
         */
        lt : function( _el, _var )
        {
            return _el.splice( 0, _var );
        },


        matches : function( _el, _var )
        {
            _var = _var.split( ',' );
        },


        /**
         * ### not
         *
         * returns all elements that do not match the given selector. As per
         * CSS4 spec, this accepts complex selectors seperated with a comma
         *
         * @param {Microbe} _el microbe to be filtered
         * @param {String} _var number of elements to return
         * @param {String} _recursive an indicator that it is calling itself. defines output
         *
         * @return _Microbe_
         */
        not : function( _el, _var, _recursive )
        {
            if ( _var.indexOf( ',' ) !== -1 )
            {
                _var = _var.split( ',' );

                for ( var i = 0, lenI = _var.length; i < lenI; i++ )
                {
                    _el = this.not( _el, _var[ i ].trim(), true );
                }
                return new Microbe( _el );
            }
            else
            {
                var resArray = [];
                for ( var j = 0, lenJ = _el.length; j < lenJ; j++ )
                {
                    if ( ! Microbe.matches( _el[ j ], _var ) )
                    {
                        resArray.push( _el[ j ] );
                    }
                }
                if ( _recursive )
                {
                    return resArray;
                }
                return new Microbe( resArray );
            }
        },


        /**
         * ### add
         *
         * returns the odd indexed elements of a microbe
         *
         * @param {Microbe} _el microbe to be filtered
         *
         * @return _Microbe_
         */
        odd : function( _el )
        {
            var elements = [];
            for ( var i = 0, lenI = _el.length; i < lenI; i++ )
            {
                if ( ( i + 1 ) % 2 !== 0 )
                {
                    elements.push( _el[ i ] );
                }
            }
            return _el.constructor( elements );
        },


        /**
         * ### root
         *
         * returns the root elements of the document
         *
         * @param {Microbe} _el microbe to be filtered
         *
         * @return _Microbe_
         */
        root : function( _el )
        {
            return _el.root();
        },


        /**
         * ### target
         *
         * returns a microbe with elements that match both the original selector, and the id of the page hash
         *
         * @param {Microbe} _el microbe to be filtered
         *
         * @return _Microbe_
         */
        target : function( _el )
        {
            var hash = ( location.href.split( '#' )[ 1 ] );

            var elements = [];

            if ( hash )
            {
                for ( var i = 0, lenI = _el.length; i < lenI; i++ )
                {
                    if ( _el[ i ].id === hash  )
                    {
                        elements.push( _el[ i ] );
                    }
                }
            }

            return _el.constructor( elements );
        }
    };
};
