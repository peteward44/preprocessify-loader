const loaderUtils = require( 'loader-utils' );

const ifRegex = /@if\s+(.+)\s*(!?=)\s*(.+)[\S\s]*?@endif?/g;
const quotes = ["'", '"', '`'];

function shouldKeepIfStatement( context, lhs, operator, rhs ) {
	const value = context.hasOwnProperty( lhs ) ? context[lhs].toString() : '';
	if ( quotes.includes( rhs[0] ) && rhs[0] === rhs[rhs.length - 1] ) {
		rhs = rhs.substring( 1, rhs.length - 1 );
	}
	if ( operator === '=' ) {
		return value === rhs;
	} else if ( operator === '!=' ) {
		return value !== rhs;
	}
	throw new Error( `Unknown operator "${operator}" in "if" statement!` );
}

function webpackPreprocessor( content, optionsOverride ) {
	const options = ( optionsOverride || loaderUtils.getOptions( this ) ) || {};
	if ( options.context ) {
		for ( const name of Object.keys( options.context ) ) {
			const regex = new RegExp( `/\\*\\s*@echo\\s+${name}\\s*\\*/`, 'g' );
			content = content.replace( regex, options.context[name] );
		}

		ifRegex.lastIndex = 0;
		let m;
		do {
			m = ifRegex.exec( content );
			if ( m ) {
				const lhs = m[1];
				const operator = m[2];
				const rhs = m[3];
				if ( !shouldKeepIfStatement( options.context, lhs, operator, rhs ) ) {
					const regexMatchLength = m[0].length;
					const suffix = content.slice( ifRegex.lastIndex );
					content = content.slice( 0, ifRegex.lastIndex - regexMatchLength ) + suffix;
					ifRegex.lastIndex -= regexMatchLength;
				}
			}
		} while ( m );
	}
	return content;
}

module.exports = webpackPreprocessor;
