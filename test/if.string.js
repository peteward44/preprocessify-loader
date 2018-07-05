const testIf = require( './testIf.js' );


describe( '@if statement string tests', () => {
	it( '="string" is removed', () => {
		testIf( `
// @if str="string"
let foo = 'bar';
// @endif
`, `
// 


`, {
			context: {
				str: "string2"
			}
		} );
	} );

	it( '="string" is kept', () => {
		testIf( `
// @if str="string"
let foo = 'bar';
// @endif
`, `
// @if str="string"
let foo = 'bar';
// @endif
`, {
			context: {
				str: "string"
			}
		} );
	} );

	it( '=\'string\' is removed', () => {
		testIf( `
// @if str="string"
let foo = 'bar';
// @endif
`, `
// 


`, {
			context: {
				str: "string2"
			}
		} );
	} );

	it( '=\'string\' is kept', () => {
		testIf( `
// @if str="string"
let foo = 'bar';
// @endif
`, `
// @if str="string"
let foo = 'bar';
// @endif
`, {
			context: {
				str: "string"
			}
		} );
	} );
	
	
	
	it( '!="string" is removed', () => {
		testIf( `
// @if str!="string"
let foo = 'bar';
// @endif
`, `
// 


`, {
			context: {
				str: "string"
			}
		} );
	} );

	it( '!="string" is kept', () => {
		testIf( `
// @if str!="string"
let foo = 'bar';
// @endif
`, `
// @if str!="string"
let foo = 'bar';
// @endif
`, {
			context: {
				str: "string2"
			}
		} );
	} );

	it( '!=\'string\' is removed', () => {
		testIf( `
// @if str!="string"
let foo = 'bar';
// @endif
`, `
// 


`, {
			context: {
				str: "string"
			}
		} );
	} );

	it( '!=\'string\' is kept', () => {
		testIf( `
// @if str!="string"
let foo = 'bar';
// @endif
`, `
// @if str!="string"
let foo = 'bar';
// @endif
`, {
			context: {
				str: "string2"
			}
		} );
	} );


} );
