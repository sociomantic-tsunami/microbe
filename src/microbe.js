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
var _version    = '0.4.5';

var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};

Microbe.type    = _type;
Microbe.core    = {};

require( './tools' )( Microbe );
require( './array' )( Microbe );
require( './dom' )( Microbe );
require( './elements' )( Microbe );
require( './http' )( Microbe );
require( './observe' )( Microbe );
require( './events' )( Microbe );


require( './selectorEngine/init' )( Microbe, _type, _version );
Microbe.version = Microbe.core.__init__.prototype.version = _version;
module.exports 	= Microbe.core.constructor = Microbe;
