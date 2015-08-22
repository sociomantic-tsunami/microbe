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
var _version    = '0.3.10';

var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};

Microbe.core    = {};
Microbe.version = _version;
Microbe.type    = _type;

// require( './core' )( Microbe );
// require( './root' )( Microbe );
// require( './dom' )( Microbe );
// require( './http' )( Microbe );
// require( './observe' )( Microbe );
// require( './events' )( Microbe );
// require( './pseudo' )( Microbe );


require( './pristella' )( Microbe, _type );

module.exports = Microbe.core.constructor = Microbe;
