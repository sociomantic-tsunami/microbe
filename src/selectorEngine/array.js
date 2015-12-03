/**
 * array.js
 *
 * methods based on the array prototype
 *
 * @author  Mouse Braun         <mouse@knoblau.ch>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@gmail.com>
 * @author  Avraam Mavridis     <avr.mav@gmail.com>
 *
 * @package Microbe
 */

 /*jshint globalstrict: true*/
'use strict';

/**
 * ## includes
 *
 * Determines if an element exists inside the array
 *
 * @return {boolean}
 */
const _includes = function()
{
    var elemToSearch = arguments[0];
    var indexToStart = arguments[1] >> 0;
    var array       = Object(this);
    var len         = this.length >> 0;

    if ( len === 0 )
    {
        return false;
    }

    indexToStart = indexToStart >= 0 ? indexToStart : ( indexToStart + len );
    indexToStart = indexToStart < 0 ? 0 : indexToStart;

    while ( indexToStart < len )
    {
      if ( elemToSearch === array[ indexToStart ] ||
         ( array[ indexToStart ] !== array[ indexToStart ] &&
            elemToSearch !== elemToSearch ) )
      {
        return true;
      }

      indexToStart++
    }

    return false;
}


module.exports = function( Microbe )
{
    Microbe.core.every          = Array.prototype.every;
    Microbe.core.findIndex      = Array.prototype.findIndex;
    Microbe.core.each           = Array.prototype.forEach;
    Microbe.core.forEach        = Array.prototype.forEach;
    Microbe.core.includes       = Array.prototype.includes;
    Microbe.core.indexOf        = Array.prototype.indexOf;
    Microbe.core.lastIndexOf    = Array.prototype.lastIndexOf;
    Microbe.core.map            = Array.prototype.map;
    Microbe.core.pop            = Array.prototype.pop;
    Microbe.core.push           = Array.prototype.push;
    Microbe.core.reverse        = Array.prototype.reverse;
    Microbe.core.shift          = Array.prototype.shift;
    Microbe.core.slice          = Array.prototype.slice;
    Microbe.core.some           = Array.prototype.some;
    Microbe.core.sort           = Array.prototype.sort;
    Microbe.core.unshift        = Array.prototype.unshift;
    Microbe.core.includes       = Array.prototype.includes ? Array.prototype.includes : _includes;

    /*
     * needed to be modified slightly to output a microbe
     */
    Microbe.core.splice         = function( start, deleteCount )
    {
        return this.constructor( Array.prototype.splice.call( this, start, deleteCount ) );
    };
};
