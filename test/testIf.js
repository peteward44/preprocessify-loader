const chai = require( 'chai' );
const loader = require( '..' );

function testIf( input, expectedOutput, options ) {
	const actualOutput = loader( input, options );
	chai.assert.equal( actualOutput, expectedOutput );
}

module.exports = testIf;
