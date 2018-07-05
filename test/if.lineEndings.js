const testIf = require( './testIf.js' );

describe( '@if statement line ending tests', () => {
	it( 'line endings are replaced with original \\n line endings', () => {
		testIf( '\n// @if bool=true\nlet foo = "bar";\n// @endif\n', '\n// \n\n\n', { context: { bool: false } } );
	} );

	it( 'line endings are replaced with original \\r\\n line endings', () => {
		testIf( '\r\n// @if bool=true\r\nlet foo = "bar";\r\n// @endif\r\n', '\r\n// \r\n\r\n\r\n', { context: { bool: false } } );
	} );
} );
