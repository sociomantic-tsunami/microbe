var Microbe = require( './core/' );
    require( './core/init' )( Microbe );
require( './dom/' )( Microbe );
require( './http/' )( Microbe );

module.exports = Microbe;
