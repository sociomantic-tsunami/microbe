/**
 * pseudo.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
var splice      = Array.prototype.splice;

module.exports = function( Cytoplasm )
{
    'use strict';
    /**
     * ## _contains
     *
     * Checks if a given element is a child of _scope
     *
     * @param {Element} _el element to check
     * @param {Element} _scope scope
     *
     * @return _Boolean_ whether _el is contained in the scope
     */
    Cytoplasm.contains = function( _el, _scope )
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
     * @return _Booblean_ matches or not
     */
    Cytoplasm.matches = function( el, selector )
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
            else if ( el[ 0 ].msMatchSelector )
            {
                method = this.matches.__matchesMethod = 'msMatchSelector';
            }
            else if ( el[ 0 ].mozMatchSelector )
            {
                method = this.matches.__matchesMethod = 'mozMatchSelector';
            }
            else if ( el[ 0 ].webkitMatchSelector )
            {
                method = this.matches.__matchesMethod = 'webkitMatchSelector';
            }
        }

        var resArray = [];
        for ( var i = 0, lenI = el.length; i < lenI; i++ )
        {
            resArray.push( el[ i ][ method ]( selector ) );
        }

        return isArray ? resArray : resArray[ 0 ];
    };


    /**
     * ## filter
     *
     * Filters the microbe by the given given selector or function.  In the case
     * of a function, the element is passed as this. The inclusion on an element
     * into the set is based on the return of the function
     *
     * @param {Mixed} selector selector or function to filter by
     *
     * @return _Microbe_ new microbe containing only the filtered values
     */
    Cytoplasm.core.filter = function( filter )
    {
        var pseudo, filters, self = this, _el, method;

        if ( this.length === 0 )
        {
            return this;
        }

        if ( typeof filter === 'function' )
        {
            var res = [];

            for ( var i = 0, lenI = this.length; i < lenI; i++ )
            {
                if ( filter.call( this[ i ], i ) )
                {
                    res.push( this[ i ] );
                }
            }
            return this.constructor( res );
        }
        else
        {
            var _filter = function( _f, _self, i )
            {
                if ( Cytoplasm.pseudo[ _f[ 0 ] ] )
                {
                    return Cytoplasm.pseudo[ _f[ 0 ] ]( _self, _f[ 1 ] );
                }
                else
                {
                    var resArray = [], _selector;
                    _selector = i === 0 ? _f[ 0 ] : ':' + _f[ 0 ];

                    if ( _selector !== '' )
                    {
                        if ( _f[ 1 ] !== '' )
                        {
                            _selector += '(' + _f[ 1 ] + ')';
                        }

                        for ( var j = 0, lenJ = _self.length; j < lenJ; j++ )
                        {
                            _el = _self[ j ];

                            if ( Cytoplasm.matches( _el, _selector ) === true )
                            {
                                resArray.push( _el );
                            }
                        }
                    }

                    return new Cytoplasm( resArray );
                }
            };

            if ( filter && filter.indexOf( ':' ) !== -1 )
            {
                pseudo  = filter.split( ':' );
                filters = [ [ pseudo.splice( 0, 1 ).toString(), '' ] ];

                var _p, pseudoArray;

                for ( var h = 0, lenH = pseudo.length; h < lenH; h++ )
                {
                    _p = pseudo[ h ];

                    if ( _p.indexOf( '(' ) !== - 1 )
                    {
                        _p      = _p.split( '(' );
                        _p[ 1 ] = _p[ 1 ].replace( ')', '' );
                    }
                    else
                    {
                        _p      = [ _p, '' ];
                    }

                    filters.push( _p );
                }
            }
            else if ( filter )
            {
                filters = [ [ filter, '' ] ];
            }
            else
            {
                return this;
            }

            for ( var k = 0, lenK = filters.length; k < lenK; k++ )
            {
                if ( self.length !== 0 )
                {
                    if ( filters[ k ][ 0 ] !== '' )
                    {
                        self = _filter( filters[ k ], self, k );
                    }
                }
                else
                {
                    return self;
                }
            }

            return self;
        }
    };


    /**
     * ## find
     *
     * Finds a child element with the given selector inside the scope of the current microbe
     *
     * @param {String} selector            selector to search for
     *
     * @return _Microbe_ new microbe containing only the found children values
     */
    Cytoplasm.core.find = function( _selector )
    {
        var _s          = _selector[ 0 ];

        if ( _s === ' ' )
        {
            _selector   = _selector.trim();
            _s          = _selector[ 0 ];
        }

        if ( _s === '>' )
        {
            _selector = _selector.slice( 1 ).trim();
            return this.childrenFlat().filter( _selector );
        }
        else if ( _s === '~' )
        {
            _selector = _selector.slice( 1 ).trim();
            return this.siblingsFlat().filter( _selector );
        }
        else if ( _s === '!' )
        {
            return this.parent();
        }
        else if ( _s === '+' )
        {
            _selector       = _selector.slice( 1 ).trim();
            var resArray    = [],
                _el, els    = this.children();

            for ( var i = 0, lenI = els.length; i < lenI; i++ )
            {
                _el = els[ i ][ 0 ];

                if ( _el )
                {
                    resArray.push( _el );
                }
            }

            return new Cytoplasm( resArray ).filter( _selector );
        }
        else if ( _selector.indexOf( ':' ) !== -1 )
        {
            return this.constructor( _selector, this );
        }

        var _children = new Cytoplasm( _selector ), res = [];

        for ( var j = 0, lenJ = this.length; j < lenJ; j++ )
        {
            for ( var k = 0, lenK = _children.length; k < lenK; k++ )
            {
                if ( Cytoplasm.contains( _children[ k ], this[ j ] ) )
                {
                    res.push( _children[ k ] );
                }
            }
        }

        return this.constructor( res );
    };


    /**
     * ## first
     *
     * gets the first Element of the current microbe, and wraps it in
     * Microbe.
     *
     * @return _Microbe_ new microbe containing only the first value
     */
    Cytoplasm.core.first = function()
    {
        if ( this.length !== 0 )
        {
            return this.constructor( this[ 0 ] );
        }

        return this.constructor( [] );
    };


    /**
     * ## last
     *
     * Gets the last Element of the current microbe, and wrap it in
     * Microbe.
     *
     * @return _Microbe_ new microbe containing only the last value
     */
    Cytoplasm.core.last = function()
    {
        if ( this.length === 1 )
        {
            return this;
        }
        else if ( this.length !== 0 )
        {
            return this.constructor( this[ this.length - 1 ] );
        }

        return this.constructor( [] );
    };


    /**
     * ## Parent
     *
     * gets all elements in a microbe's parent nodes
     *
     * @return _Microbe_ new microbe containing parent elements (index-preserved)
     */
    Cytoplasm.core.parent = function()
    {
        var _parent = function( _elm )
        {
            return _elm.parentNode;
        };

        var i, len, parentArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            parentArray[ i ] = _parent( this[ i ] );
        }

        return new Cytoplasm( parentArray );
    };


    /**
     * ## splice
     *
     * Native splice wrapped in a microbe
     *
     * @return _Microbe_ new microbe of the remaining elements
     */
    Cytoplasm.core.splice = function( _start, _end )
    {
        var arr = splice.call( this, _start, _end );

        return this.constructor( arr );
    };
};