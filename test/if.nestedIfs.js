const testIf = require( './testIf.js' );

const code = `
// @if bool1=true
let bar = 'This is in the first nest';
// @if bool2=true
let foo = 'This is in the second nest';
// @endif
let bar2 = 'This is in the first nest, after the second nest';
// @endif
`;

describe( '@if statement nested instances tests', () => {
	it.only( 'both nests true', () => {
		testIf( code, code, {
			context: {
				bool1: true,
				bool2: true
			}
		} );
	} );
	it( 'first nest true, second false', () => {
		testIf( code, `
// @if bool1=true
let bar = 'This is in the first nest';
let bar2 = 'This is in the first nest, after the second nest';
// @endif
`, {
			context: {
				bool1: true,
				bool2: false
			}
		} );
	} );
	it( 'first nest false, second true', () => {
		testIf( code, `
// 
`, {
			context: {
				bool1: false,
				bool2: true
			}
		} );
	} );
	it( 'both nests false', () => {
		testIf( code, `
// 
`, {
			context: {
				bool1: false,
				bool2: false
			}
		} );
	} );
} );
