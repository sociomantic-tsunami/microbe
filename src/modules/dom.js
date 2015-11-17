/**
 * dom.js
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 *
 * @package Microbe
 */
var _events;

module.exports = function( Microbe )
{
    'use strict';

    /**
     * ## append
     *
     * Appends an element or elements to the microbe.  if there is more than
     * one target the next ones are cloned.  The strings this accepts can be
     * a selector string, an element creation string, or an html string
     *
     * @param {Mixed} _ele element(s) to append (Element, Array, string, or Microbe)
     *
     * @example µ( '.example' ).append( '&lt;div class="new-div">test&lt;/div>' );
     * @example µ( '.example' ).append( µMicrobeExample );
     * @example µ( '.example' ).append( _el );
     * @example µ( '.example' ).append( [ _el1, _el2, _el3 ] );
     * @example µ( '.example' ).append( '&lt;div.example>' );
     *
     * @return _Microbe_ new microbe filled with the inserted content
     */
    Microbe.core.append = (function()
    {
        /**
         * ## _appendHTML
         *
         * in the case of html passed in it will get appended or prepended to the
         * innerHTML
         *
         * @param {String} _html html string
         * @param {Boolean} _pre prepend or not
         *
         * @return _Microbe_
         */
        var _appendHTML = function( _html, _pre )
        {
            var _el;
            for ( var k = 0, lenK = this.length; k < lenK; k++ )
            {
                _el = this[ k ];

                if ( _pre )
                {
                    _el.innerHTML = _html + _el.innerHTML;
                }
                else
                {
                    _el.innerHTML += _html;
                }
            }
            return this;
        };


        /**
         * ## _append
         *
         * appends the child to the parent
         *
         * @param {Element} _parentEl parent element
         * @param {Element} _elm child element
         *
         * @return _Microbe_
         */
        var _append = function( _parentEl, _elm )
        {
            _parentEl.appendChild( _elm );
        };


        /**
         * ## checkElement
         *
         * reformats the element into an iterable object
         *
         * @param  {Mixed} _el element(s) to be reformatted (String, DOMElement, Array, Microbe)
         *
         * @return  _Mixed_ formatted element(s) (Microbe, Array)
         */
        var checkElement = function( _el )
        {
            if ( typeof _el === 'string' )
            {
                return new Microbe( _el );
            }
            else if ( !_el.length )
            {
                return [ _el ];
            }

            return _el;
        }


        /**
         * ## _prepend
         *
         * prepends the child to the parent
         *
         * @param {Element} _parentEl parent element
         * @param {Element} _elm child element
         *
         * @return _Microbe_
         */
        var _prepend = function( _parentEl, _elm )
        {
            var firstChild = _parentEl.firstElementChild;
            _parentEl.insertBefore( _elm, firstChild );
        };


        /**
         * ## append main function
         *
         * takes input fromappend, appendTo, prepend, and prependTo, sorts out
         * the booleans and targets, then passes them to the correct function
         *
         * @param {Mixed} _el element to attach or attach to
         * @param {Boolean} prepend prepend or append
         * @param {Boolean} to determines the parent child relationship
         *
         * @return _Microbe_
         */
        return function( _el, prepend, to )
        {
            var _cb = prepend ? _prepend : _append;

            var elementArray = [], node;

            _el = checkElement( _el );

            var self    = to ? _el : this;
                _el     = to ? this : _el;

            if ( _el.indexOf( '/' ) !== -1 )
            {
                return _appendHTML.call( self, _el, prepend );
            }

            self.forEach( function( s, i )
            {
                _el.forEach( function( e, j )
                {
                    node = i === 0 ? e : e.cloneNode( true );

                    elementArray.push( node );
                    _cb( self[ i ], node );
                } );
            } );

            return this.constructor( elementArray );
        };
    }());


    /**
     * ## appendTo
     *
     * Prepends a microbe to an element or elements.  if there is more than
     * one target the next ones are cloned. The strings this accepts can be
     * a selector string, an element creation string, or an html string
     *
     * @param {Mixed} _ele element(s) to prepend _{Element, Array, String, or Microbe}_
     *
     * @example µ( '.example' ).appendTo( '&lt;div class="new-div">test&lt;/div>' );
     * @example µ( '.example' ).appendTo( µMicrobeExample );
     * @example µ( '.example' ).appendTo( _el );
     * @example µ( '.example' ).appendTo( [ _el1, _el2, _el3 ] );
     * @example µ( '.example' ).appendTo( '&lt;div.example>' );
     *
     * @return _Microbe_ new microbe filled with the inserted content
     */
    Microbe.core.appendTo = function( _el )
    {
        return this.append( _el, false, true );
    };


    /**
     * ## insertAfter
     *
     * Inserts the given element after each of the elements given (or passed through this).
     * if it is an elemnet it is wrapped in a microbe object.  if it is a string it is created
     *
     * @param {Mixed} _elAfter element to insert {Object or String}
     *
     * @example µ( '.example' ).insertAfter( '&lt;div class="new-div">test&lt;/div>' );
     * @example µ( '.example' ).insertAfter( µMicrobeExample );
     * @example µ( '.example' ).insertAfter( _el );
     * @example µ( '.example' ).insertAfter( [ _el1, _el2, _el3 ] );
     * @example µ( '.example' ).insertAfter( '&lt;div.example>' );
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
     * one target the next ones are cloned. The strings this accepts can be
     * a selector string, an element creation string, or an html string
     *
     * @param {Mixed} _ele element(s) to prepend _{Element, Array, String, or Microbe}_
     *
     * @example µ( '.example' ).prepend( '&lt;div class="new-div">test&lt;/div>' );
     * @example µ( '.example' ).prepend( µMicrobeExample );
     * @example µ( '.example' ).prepend( _el );
     * @example µ( '.example' ).prepend( [ _el1, _el2, _el3 ] );
     * @example µ( '.example' ).prepend( '&lt;div.example>' );
     *
     * @return _Microbe_ new microbe filled with the inserted content
     */
    Microbe.core.prepend = function( _el )
    {
        return this.append( _el, true );
    };


    /**
     * ## prependTo
     *
     * Prepends a microbe to an element or elements.  if there is more than
     * one target the next ones are cloned. The strings this accepts can be
     * a selector string, an element creation string, or an html string
     *
     * @param {Mixed} _ele element(s) to prepend _{Element, Array, String, or Microbe}_
     *
     * @example µ( '.example' ).prependTo( '&lt;div class="new-div">test&lt;/div>' );
     * @example µ( '.example' ).prependTo( µMicrobeExample );
     * @example µ( '.example' ).prependTo( _el );
     * @example µ( '.example' ).prependTo( [ _el1, _el2, _el3 ] );
     * @example µ( '.example' ).prependTo( '&lt;div.example>' );
     *
     * @return _Microbe_ new microbe filled with the inserted content
     */
    Microbe.core.prependTo = function( _el )
    {
        return this.append( _el, true, true );
    };


    /**
     * ## ready
     *
     * Waits until the DOM is ready to execute
     *
     * @param {Function} _cb callback to run on ready
     * @param {Array} args parameters to pass to the callback
     *
     * @example µ.ready( function( a, b ){ return a + b; }, [ 1, 2 ] );
     * @example µ( function( a, b ){ return a + b; }, [ 1, 2 ] );
     *
     * @return _void_
     */
    Microbe.ready = function( _cb, args )
    {
        if ( document.readyState === 'complete' )
        {
            return _cb.apply( this, args );
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
     * ## remove
     *
     * Removes an element or elements from the dom and all events bound to it
     *
     * @example µ( '.example' ).remove();
     *
     * @return _Microbe_ reference to original microbe
     */
    Microbe.core.remove = function()
    {
        if ( this.off )
        {
            this.off();
        }

        this.forEach( function( _el )
        {
            _el.remove();
        } );

        return this;
    };


    /**
     * ## remove polyfill
     *
     * Polyfill for IE because IE
     *
     * @return _void_
     */
    if ( !( 'remove' in Element.prototype ) )
    {
        Element.prototype.remove = function()
        {
            this.parentElement.removeChild( this );
        };
    }

};
