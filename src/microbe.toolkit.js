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

var _type       = '[object MicrobeRoot]';
var _version    = '0.4.14-tool';

var Microbe = {
    get version()   { return _version; },
    get type()      { return _type; }
};

require( './modules/tools' )( Microbe );

module.exports      = Microbe;
