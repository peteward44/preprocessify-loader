const _ = require( 'lodash' );
const loaderUtils = require( 'loader-utils' );

const ifRegex = /@if\s+(.+?)\s*(!?=)\s*(.+)[\S\s]*?@endif?/g;
const lineEndingRegex = /\n/g;
const lineEndingRegexCarriageReturn = /\r\n/;
const quotes = ["'", '"', '`'];


const getEchoRegexes = _.memoize( function( context ) {
	const result = {};
	for ( const name of Object.keys( context ) ) {
		result[name] = new RegExp( `/\\*\\s*@echo\\s+${name}\\s*\\*/`, 'g' );
	}
	return result;
} );


function shouldKeepIfStatement( context, lhs, operator, rhs ) {
	const value = context.hasOwnProperty( lhs ) ? context[lhs].toString() : '';
	if ( quotes.includes( rhs[0] ) && rhs[0] === rhs[rhs.length - 1] ) {
		rhs = rhs.substring( 1, rhs.length - 1 );
	}
		console.log( `operator=${operator} value=${value} rhs=${rhs}` );
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
		const regexes = getEchoRegexes( options.context );
		for ( const name of Object.keys( regexes ) ) {
			content = content.replace( regexes[name], options.context[name] );
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
					const removedSectionLength = m[0].length;
					const removedSectionStartIndex = ifRegex.lastIndex - removedSectionLength;
					const removedSection = content.substr( removedSectionStartIndex, removedSectionLength );
					const lineEndingCount = removedSection.match( lineEndingRegex ).length;
					const usesCrLf = !!removedSection.match( lineEndingRegexCarriageReturn );
					const replacementString = _.repeat( usesCrLf ? '\r\n' : '\n', lineEndingCount );
					const suffix = content.slice( ifRegex.lastIndex );
					content = content.slice( 0, removedSectionStartIndex ) + replacementString + suffix;
					ifRegex.lastIndex -= removedSectionLength;
				}
			}
		} while ( m );
	}
	return content;
}

module.exports = webpackPreprocessor;
