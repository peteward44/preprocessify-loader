const testIf = require( './testIf.js' );


describe( '@if statement boolean tests', () => {
	it( '=true is removed', () => {
		testIf( `
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

	it( '=true is kept', () => {
		testIf( `
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

	it( '=false is removed', () => {
		testIf( `
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

	it( '=false is kept', () => {
		testIf( `
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

	it( '!=true is removed', () => {
		testIf( `
// @if bool!=true
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

	it( '!=true is kept', () => {
		testIf( `
// @if bool!=true
let foo = 'bar';
// @endif
`, `
// @if bool!=true
let foo = 'bar';
// @endif
`, {
			context: {
				bool: false
			}
		} );
	} );

	it( '!=false is removed', () => {
		testIf( `
// @if bool!=false
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

	it( '!=false is kept', () => {
		testIf( `
// @if bool!=false
let foo = 'bar';
// @endif
`, `
// @if bool!=false
let foo = 'bar';
// @endif
`, {
			context: {
				bool: true
			}
		} );
	} );
} );
