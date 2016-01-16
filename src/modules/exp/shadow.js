/**
 * shadow.js
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 *
 * @package Microbe
 */

module.exports = function( Microbe )
{
    'use strict';

    Microbe.core.createShadow = function()
    {
        var templated    = this.createTemplate();

        var _createShadow = function( _elm, i )
        {
            var shadow      = _elm.createShadowRoot();
            var clone       = document.importNode( templated[ i ].content, true );
            shadow.appendChild( clone );

            return shadow;
        };

        return this.constructor( this.map( _createShadow ) );
    };


    Microbe.core.createTemplate = function()
    {
        var _createTemplate = function( _elm )
        {
            var textContent;
            var template        = document.createElement( 'template' );
            var contentDiv      = _elm.getElementsByClassName( 'content' )[0];
            var _elmChildren    = _elm.children;

            for ( var i = 0, lenI = _elmChildren.length; i < lenI; i++ )
            {
                template.content.appendChild( _elmChildren[ 0 ] );
            }

            var content     = document.createElement( 'content' );

            if ( contentDiv )
            {
                contentDiv.parentNode.insertBefore( content, contentDiv );
                textContent = contentDiv.textContent;
                content.parentNode.removeChild( contentDiv );
            }
            else
            {
                template.content.appendChild( content );
            }

            _elm.textContent = textContent;

            _elm.parentNode.insertBefore( template, _elm );
            _elm.parentNode.insertBefore( _elm, template );

            return template;
        };

        return this.constructor( this.map( _createTemplate ) );
    };


    Microbe.core.shadow = function()
    {
        var _shadow = function( _elm )
        {
            return _elm.shadowRoot;
        };

        return this.constructor( this.map( _shadow ) );
    };
};
