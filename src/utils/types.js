/**
 * types.js
 *
 * @author  Mouse Braun         <mouse@sociomantic.com>
 * @author  Nicolas Brugneaux   <nicolas.brugneaux@sociomantic.com>
 *
 * @package Microbe
 */
 /*jshint globalstrict: true*/
'use strict';

module.exports = {
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Error]'    : 'error',
    '[object Promise]'  : 'promise',
    '[object Microbe]'  : 'microbe'
};
