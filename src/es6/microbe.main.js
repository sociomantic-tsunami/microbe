/* jshint esnext: true*/
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
let µ = (function()
{
    let inner = function( selector, scope )
    {
        let microbeInner = new Microbe( selector, scope );

        return microbeInner;
    };

    for( let prop in Microbe.prototype )
    {
        if ( Microbe.prototype.hasOwnProperty( prop ) )
        {
            inner[ prop ] = Microbe.prototype[ prop ];
        }
    }

    return inner;
}());


/******************************************************************************/
