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

var _type       = '[object Microbe-Http]';

var Microbe     = {};
var _version    = require( './version' ) + '-http';

require( './modules/http' )( Microbe );

Object.defineProperty( Microbe, 'version', {
    get : function()
    {
        return _version;
    }
} );

Object.defineProperty( Microbe, 'type', {
    get : function()
    {
        return _type;
    }
} );

module.exports      = Microbe;
