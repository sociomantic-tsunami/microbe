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
var _version    = require( './version' ) + '-selectorEngine';


var Microbe = function( selector, scope, elements )
{
    return new Microbe.core.__init__( selector, scope, elements );
};

require( './selectorEngine/init' )( Microbe, _type, _version );

module.exports      = Microbe.core.constructor = Microbe;
