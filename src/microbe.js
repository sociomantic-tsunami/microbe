var Microbe = require( './core' );
require( './init' )( Microbe );
require( './dom' )( Microbe );
require( './http' )( Microbe );
require( './observe' )( Microbe );
require( './events' )( Microbe );

module.exports = Microbe;
