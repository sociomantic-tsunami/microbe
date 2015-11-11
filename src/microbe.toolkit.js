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

var _type       = '[object MicrobeRoot]';
var _version    = '0.4.12-tool';

var Microbe = {};
require( './modules/tools' )( Microbe );

Microbe.version     = _version;
module.exports      = Microbe;
