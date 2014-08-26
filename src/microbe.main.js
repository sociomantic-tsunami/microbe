/* exported µ */
/**
 * microbe.main.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */

 /**
 * µ constructor
 *
 * builds the µ object
 *
 * @return µ
 */
var µ = (function()
{
    var inner = function( selector, scope )
    {
        var microbeInner = new Microbe( selector, scope );

        return microbeInner;
    };

    for( var prop in Microbe.prototype )
    {
        if ( Microbe.prototype.hasOwnProperty( prop ) )
        {
            inner[ prop ] = Microbe.prototype[ prop ];
        }
    }

    return inner;
}());

/******************************************************************************/
