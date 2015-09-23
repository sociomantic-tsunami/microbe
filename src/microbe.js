/**
 * ## Microbe
 *
 * Builds the Microbe object
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
 /*jshint globalstrict: true*/
'use strict';

var _type       = '[object Microbe]';
var _version    = '0.4.9';

var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};


require( './selectorEngine/init' )( Microbe, _type );
require( './modules/tools' )( Microbe );
require( './modules/dom' )( Microbe );
require( './modules/elements' )( Microbe );
require( './modules/http' )( Microbe );
require( './modules/observe' )( Microbe );
require( './modules/events' )( Microbe );


Microbe.version     = Microbe.core.__init__.prototype.version = _version;
module.exports      = Microbe.core.constructor = Microbe;
