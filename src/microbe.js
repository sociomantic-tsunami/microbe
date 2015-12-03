/**
 * ## Microbe
 *
 * Builds the Microbe object
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 *
 * @package Microbe
 */
 /*jshint globalstrict: true*/
'use strict';

var _type       = '[object Microbe]';
var _version    = '0.4.14';

var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};


require( './selectorEngine/init' )( Microbe, _type, _version );
require( './modules/tools' )( Microbe );
require( './modules/dom' )( Microbe );
require( './modules/elements' )( Microbe );
require( './modules/http' )( Microbe );
require( './modules/observe' )( Microbe );
require( './modules/events' )( Microbe );

module.exports      = Microbe.core.constructor = Microbe;
