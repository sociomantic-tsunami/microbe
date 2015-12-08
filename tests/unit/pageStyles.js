/* global document, window, µ, $, QUnit, Benchmark, test  */

module.exports = function( buildTest )
{
    QUnit.module( 'pageStyles.js' );


    /**
     * µ insertStyle tests
     *
     * @test    insertStyle exists
     */
    QUnit.test( '.insertStyle()', function( assert )
    {
        assert.ok( µ.insertStyle, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );
        var savedColor = µ.__customCSSRules[ '#qunit' ].none.obj.color;

        assert.equal( $( '#qunit' ).css( 'color' ), 'rgb(255, 0, 255)', 'sets the rule' ); // ...
        assert.equal( savedColor, '#f0f', 'saves the reference' );

        µ.removeStyle( '#qunit' );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'color':'#f0f' }, media );

        assert.ok( µ.__customCSSRules[ '#qunit' ][ media ], 'inserts media queries' );
        µ.removeStyle( '#qunit' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ removeStyle tests
     *
     * @test    removeStyle exists
     */
    QUnit.test( '.removeStyle()', function( assert )
    {
        assert.ok( µ.removeStyle, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'display':'none' }, media );
        µ.removeStyle( '#qunit', media );

        assert.equal( $( '#qunit' ).css( 'display' ), 'block', 'removes individual media queries' ); // ...
        µ.removeStyle( '#qunit' );

        assert.ok( !µ.__customCSSRules[ '#qunit' ].none, 'removes base references' );

        buildTest( 'No speed tests available.' );
    });


    /**
     * µ removeStyles tests
     *
     * @test    removeStyles exists
     */
    QUnit.test( '.removeStyles()', function( assert )
    {
        assert.ok( µ.removeStyles, 'exists' );

        µ.insertStyle( '#qunit', { 'color':'#f0f' } );

        var media = 'screen and (min-width : 600px)';
        µ.insertStyle( '#qunit', { 'display':'none' }, media );
        µ.removeStyles( '#qunit' );

        assert.equal( $( '#qunit' ).css( 'display' ), 'block', 'removes all tags' );
        assert.ok( !µ.__customCSSRules[ '#qunit' ].none && !µ.__customCSSRules[ '#qunit' ][ media ], 'removes all references' );

        buildTest( 'No speed tests available.' );
    });
};
