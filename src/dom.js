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
 * @return _Function_ function that augment Microbe.
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
     * @param {Mixed} _ele element(s) to append (Element, Array or Microbe)
     *
     * @return _Microbe_ new microbe filled with the inserted content
     */
    Microbe.core.append = (function()
    {
        var _append = function( _parentEl, _elm )
        {
            _parentEl.appendChild( _elm );
        };


        var _prepend = function( _parentEl, _elm )
        {
            var firstChild = _parentEl.children[ 0 ];
            _parentEl.insertBefore( _elm, firstChild );
        };


        return function( _el, prepend )
        {
            var elementArray = [];

            if ( !_el.length )
            {
                _el = [ _el ];
            }
            if ( typeof _el === 'string' )
            {
                _el = new Microbe( _el );
            }

            var i, j, leni, lenj, node;
            for ( i = 0, leni = this.length; i < leni; i++ )
            {
                for ( j = 0, lenj = _el.length; j < lenj; j++ )
                {
                    node = i === 0 ? _el[ j ] : _el[ j ].cloneNode( true );

                    elementArray.push( node );

                    if ( prepend === true )
                    {
                        _prepend( this[ i ], node );
                    }
                    else
                    {
                        _append( this[ i ], node );
                    }
                }
            }

            return this.constructor( elementArray );
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
     * @param {Mixed} _elAfter element to insert {Object or String}
     *
     * @return _Microbe_ new microbe filled with the inserted content
     */
    Microbe.core.insertAfter = function( _elAfter )
    {
        var elementArray = [];

        var _insertAfter = function( _elm, i )
        {
            var _arr        = Array.prototype.slice.call( _elm.parentNode.children );
            var nextIndex   = _arr.indexOf( _elm ) + 1;

            var node, nextEle   = _elm.parentNode.children[ nextIndex ];

            for ( var j = 0, lenJ = _elAfter.length; j < lenJ; j++ )
            {
                node = i === 0 ? _elAfter[ j ] : _elAfter[ j ].cloneNode( true );

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
            _insertAfter( this[ i ], i );
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
     * @return _Microbe_ new microbe filled with the inserted content
     */
    Microbe.core.prepend = function( _el )
    {
        return this.append( _el, true );
    };


    /**
     * ## remove
     *
     * Removes an element or elements from the dom
     *
     * @return _Microbe_ reference to original microbe
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
