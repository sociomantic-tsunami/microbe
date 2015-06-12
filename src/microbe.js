/**
 * microbe.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

var Microbe = require( './core' );
require( './init' )( Microbe );
require( './root' )( Microbe );
require( './dom' )( Microbe );
require( './http' )( Microbe );
require( './observe' )( Microbe );
require( './events' )( Microbe );
require( './pseudo' )( Microbe );


/**
 * ## exported
 *
 * @return _Microbe_
 */
module.exports = Microbe;
