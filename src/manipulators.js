/**
 * core.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

 /*jshint globalstrict: true*/
'use strict';

module.exports = function( Microbe )
{
    Microbe.core.extend     = Microbe.extend;
    Microbe.core.merge      = Microbe.merge;
    Microbe.core.toArray    = Microbe.toArray;
    Microbe.core.toString   = Microbe.toString;
};
