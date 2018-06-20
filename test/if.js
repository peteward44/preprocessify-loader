const chai = require( 'chai' );
const loader = require( '..' );

function test( input, expectedOutput, options ) {
	const actualOutput = loader( input, options );
	chai.assert.equal( actualOutput, expectedOutput );
}


describe( '@if statement tests', () => {
	it( 'boolean: true is removed', () => {
		test( `
// @if bool=true
let foo = 'bar';
// @endif
`, `
// 


`, {
			context: {
				bool: false
			}
		} );
	} );

	it( 'boolean: true is kept', () => {
		test( `
// @if bool=true
let foo = 'bar';
// @endif
`, `
// @if bool=true
let foo = 'bar';
// @endif
`, {
			context: {
				bool: true
			}
		} );
	} );

	it( 'boolean: false is removed', () => {
		test( `
// @if bool=false
let foo = 'bar';
// @endif
`, `
// 


`, {
			context: {
				bool: true
			}
		} );
	} );

	it( 'boolean: false is kept', () => {
		test( `
// @if bool=false
let foo = 'bar';
// @endif
`, `
// @if bool=false
let foo = 'bar';
// @endif
`, {
			context: {
				bool: false
			}
		} );
	} );

	it( 'line endings are replaced with original \\n line endings', () => {
		test( '\n// @if bool=true\nlet foo = "bar";\n// @endif\n', '\n// \n\n\n', { context: { bool: false } } );
	} );

	it( 'line endings are replaced with original \\r\\n line endings', () => {
		test( '\r\n// @if bool=true\r\nlet foo = "bar";\r\n// @endif\r\n', '\r\n// \r\n\r\n\r\n', { context: { bool: false } } );
	} );
	
	it.skip( 'multiple @if statements: 1 is removed, the other 2 kept', () => {
		
	} );
	
	it.skip( 'multiple @if statements: 2 are removed, the other 1 kept', () => {
		
	} );
	
	it.skip( 'multiple @if statements: 3 are removed, none kept', () => {
		
	} );
	
	it.skip( 'multiple @if statements: none removed, 3 kept', () => {
		
	} );
} );
