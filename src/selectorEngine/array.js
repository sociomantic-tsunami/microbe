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
 * ## fill
 *
 * Fills the array from a start-index to an end-index
 *
 * @param {Object} the value with which the array will be filled
 * @param {Integer} the start index
 * @param {Integer} the end index
 *
 * @return {Array}, mutate the array and returns it
 */
const _fill = function( value, start, end )
{
    var len = this.length;

    start = !start || start !== start ? 0 : start;
    end = !end || end !== end ? len : end;
    start = start < 0 ? Math.max(len + start, 0) : Math.min(start, (len));
    end = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);

    var index,l = this.length; 
    while( l ){
        index = len - l;
        if( index >= start && index <= end )
            this[index] = value;
        --l;
    }
    return this;
}

/**
 * ## of
 *
 * Creates a new Array instance 
 *
 * @param {Object} Array-like object
 *
 * @return {Array}
 */
const _of = function(){ 
    return Array.prototype.slice.call(arguments);
};

/**
 * ## includes 
 *
 * Determines if an element exists inside the array
 *
 * @return {boolean}
 */
const _includes = function(){
    var elemToSearch = arguments[0];
    var indexToStart = arguments[1] >> 0;
    var array= Object(this);
    var len = this.length >> 0;
    if( len === 0)
        return false;

    indexToStart = indexToStart >= 0 ? indexToStart : ( indexToStart + len );
    indexToStart = indexToStart < 0 ? 0 : indexToStart;
    
    while(indexToStart < len){
      if (elemToSearch === array[indexToStart] ||
         (array[indexToStart] !== array[indexToStart] && elemToSearch !== elemToSearch)) {
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
    Microbe.core.of             = Array.prototype.of ? Array.prototype.of : _of;
    Microbe.core.fill           = Array.prototype.fill ? Array.prototype.of : _fill;
    Microbe.core.includes       = Array.prototype.includes ? Array.prototype.includes : _includes;

    /*
     * needed to be modified slightly to output a microbe
     */
    Microbe.core.splice         = function( start, deleteCount )
    {
        return this.constructor( Array.prototype.splice.call( this, start, deleteCount ) );
    };
};
