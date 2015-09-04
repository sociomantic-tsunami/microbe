/**
 * pseudo.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
var splice      = Array.prototype.splice;
var indexOf     = Array.prototype.indexOf;

module.exports = function( Cytoplasm )
{
    'use strict';

    /**
     * ## children
     *
     * Gets a microbe of all the given element's children
     *
     * @return _Array_  array of microbes (value)
     */
    Cytoplasm.core.children = function()
    {
        var i, len, childrenArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            childrenArray[ i ] = this.constructor( this[ i ].children );
        }

        return childrenArray;
    };


    /**
     * ## childrenFlat
     *
     * Gets an microbe of all children of all element's given
     *
     * @return _Microbe_ value array of combined children
     */
    Cytoplasm.core.childrenFlat = function( direction )
    {
        var arr, i, len, childrenArray = [];

        for ( i = 0, len = this.length; i < len; i++ )
        {
            arr = this[ i ].children;

            for ( var j = 0, lenJ = arr.length; j < lenJ; j++ )
            {
                if ( childrenArray.indexOf( arr[ j ] ) === -1 )
                {
                    childrenArray.push( arr[ j ] );
                }
            }
        }

        return this.constructor( childrenArray );
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
     * gets the first Element and wraps it in Cytoplasm.
     *
     * @return _Cytoplasm_ new Cytoplasm containing only the first value
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
     * Gets the last Element and wraps it in Cytoplasm.
     *
     * @return _Cytoplasm_ new microbe containing only the last value
     */
    Cytoplasm.core.last = function()
    {
        var len = this.length;

        if ( len === 1 )
        {
            return this;
        }
        else if ( len !== 0 )
        {
            return this.constructor( this[ len - 1 ] );
        }

        return this.constructor( [] );
    };


    /**
     * ## parent
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
     * ## siblings
     *
     * Gets an microbe of all of each given element's siblings
     *
     * @return _Array_ array of microbes (value)
     */
    Cytoplasm.core.siblings = function()
    {
        var _siblings = function( _elm )
        {
            var res     = [];
            var sibling = _elm.parentNode.firstElementChild;
            for ( ; sibling; )
            {
                if ( sibling !== _elm )
                {
                    res.push( sibling );
                }
                sibling = sibling.nextElementSibling;
                if ( !sibling )
                {
                    return res;
                }
            }
        };

        var i, len, siblingArray = new Array( this.length );

        for ( i = 0, len = this.length; i < len; i++ )
        {
            siblingArray[ i ] = this.constructor( _siblings( this[ i ] ) );
        }

        return siblingArray;
    };


    /**
     * ## siblingsFlat
     *
     * Gets an microbe of all siblings of all element's given. 'next' and 'prev'
     * passed as direction return only the next or previous siblings of each element
     *
     * @param {String} direction direction modifier (optional)
     *
     * @return _Microbe_ value array of combined siblings
     */
    Cytoplasm.core.siblingsFlat = function( direction )
    {
        var _siblings = function( _elm )
        {
            if ( !direction )
            {
                var res     = [];
                var sibling = _elm.parentNode.firstElementChild;
                for ( ; sibling; )
                {
                    if ( sibling !== _elm )
                    {
                        res.push( sibling );
                    }
                    sibling = sibling.nextElementSibling;
                    if ( !sibling )
                    {
                        return res;
                    }
                }
            }
            else if ( direction === 'next' )
            {
                var next = _elm.nextElementSibling;
                return next ? [ next ] : [];
            }
            else if ( direction === 'prev' )
            {
                var prev = _elm.prevElementSibling;
                return prev ? [ prev ] : [];
            }
        };

        var arr, i, len, siblingArray = [];

        for ( i = 0, len = this.length; i < len; i++ )
        {
            arr = _siblings( this[ i ] );

            for ( var j = 0, lenJ = arr.length; j < lenJ; j++ )
            {
                if ( siblingArray.indexOf( arr[ j ] ) === -1 )
                {
                    siblingArray.push( arr[ j ] );
                }
            }
        }

        return this.constructor( siblingArray );
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