/**
 * dom.js
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
    /**
     * ## ready
     *
     * Waits until the DOM is ready to execute
     *
     * @param {Function} _cb callback to run on ready
     *
     * @return _void_
     */
    Microbe.ready = function( _cb )
    {
        if ( document.readyState === 'complete' )
        {
            return _cb();
        }

        if ( window.addEventListener )
        {
            window.addEventListener( 'load', _cb, false );
        }
        else if ( window.attachEvent )
        {
            window.attachEvent( 'onload', _cb );
        }
        else
        {
            window.onload = _cb;
        }
    };


    /**
     * ## append
     *
     * Appends an element or elements to the microbe.  if there is more than
     * one target the next ones are cloned
     *
     * @param {Mixed} _ele element(s) to append _{Element, Array or Microbe}_
     *
     * @return _Microbe_
     */
    Microbe.core.append = (function()
    {
        var _append = function( _parentEl, _elm )
        {
            _parentEl.appendChild( _elm );
        };

        return function( _el )
        {
            if ( !_el.length )
            {
                _el = [ _el ];
            }

            var i, j, leni, lenj;
            for ( i = 0, leni = this.length; i < leni; i++ )
            {
                for ( j = 0, lenj = _el.length; j < lenj; j++ )
                {
                    if ( i !== 0 )
                    {
                        _append( this[ i ], _el[ j ].cloneNode( true ) );
                    }
                    else
                    {
                        _append( this[ i ], _el[ j ] );
                    }
                }
            }

            return this;
        };
    }());


    /**
     * ## insertAfter
     *
     * Inserts the given element after each of the elements given (or passed through this).
     * if it is an elemnet it is wrapped in a microbe object.  if it is a string it is created
     *
     * @example `µ( '.elementsInDom' ).insertAfter( µElementToInsert )`
     *
     * @param {Mixed} _elAfter element to insert _{Object or String}_
     *
     * @return _Microbe_
     */
    Microbe.core.insertAfter = function( _elAfter )
    {
        var _this = this;
        var elementArray = [];

        var _insertAfter = function( _elm )
        {
            var nextIndex;

            nextIndex = _this.getParentIndex( _elm )[0];

            var node, nextEle   = _elm.parentNode.children[ nextIndex + 1 ];

            for ( var i = 0, lenI = _elAfter.length; i < lenI; i++ )
            {
                node = i === 0 ? _elAfter[ i ] : _elAfter[ i ].cloneNode( true );

                elementArray.push( node );

                if ( nextEle )
                {
                    nextEle.parentNode.insertBefore( node, nextEle );
                }
                else
                {
                    _elm.parentNode.appendChild( node );
                }
            }
        };

        if ( typeof _elAfter === 'string' )
        {
            _elAfter = new Microbe( _elAfter );
        }
        else if ( ! _elAfter.length )
        {
            _elAfter = [ _elAfter ];
        }

        var i, len;
        for ( i = 0, len = this.length; i < len; i++ )
        {
            _insertAfter( this[ i ] );
        }

        return this.constructor( elementArray );
    };


    /**
     * ## prepend
     *
     * Prepends an element or elements to the microbe.  if there is more than
     * one target the next ones are cloned
     *
     * @param {Mixed} _ele element(s) to prepend _{Element, Array or Microbe}_
     *
     * @return _Microbe_
     */
    Microbe.core.prepend = (function()
    {
        var _prepend = function( _parentEl, _elm )
        {
            var firstChild = _parentEl.children[ 0 ];
            _parentEl.insertBefore( _elm, firstChild );
        };

        return function( _el )
        {
            if ( !_el.length )
            {
                _el = [ _el ];
            }

            var i, j, leni, lenj;
            for ( i = 0, leni = this.length; i < leni; i++ )
            {
                for ( j = 0, lenj = _el.length; j < lenj; j++ )
                {
                    if ( i !== 0 )
                    {
                        _prepend( this[ i ], _el[ j ].cloneNode( true ) );
                    }
                    else
                    {
                        _prepend( this[ i ], _el[ j ] );
                    }
                }
            }

            return this;
        };
    }());


    /**
     * ## remove
     *
     * Removes an element or elements from the dom
     *
     * @return _Microbe_
     */
    Microbe.core.remove = function()
    {
        var _remove = function( _elm )
        {
            return _elm.parentNode.removeChild( _elm );
        };

        var i, len;

        this.off();

        for ( i = 0, len = this.length; i < len; i++ )
        {
            _remove( this[ i ] );
        }

        return this;
    };
};
