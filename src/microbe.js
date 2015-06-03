var Microbe = require( './core' );
require( './init' )( Microbe );
require( './root' )( Microbe );
require( './dom' )( Microbe );
require( './http' )( Microbe );
require( './observe' )( Microbe );
require( './events' )( Microbe );
require( './pseudo' )( Microbe );

module.exports = Microbe;
