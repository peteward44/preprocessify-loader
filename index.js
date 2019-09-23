const _ = require( 'lodash' );
const loaderUtils = require( 'loader-utils' );

const ifRegex = 		/@if\s+(.+?)\s*(!?=)\s*(.+)[\S\s]*?@endif?/g;
const ifRegexGreedy = 	/@if\s+(.+?)\s*(!?=)\s*(.+)[\S\s]*@endif?/g;
const fragmentRegex = 	/\/\*{{\|\|@@FRAGMENT@@\|\|}}:(\d+):\*\//g;
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
	if ( operator === '=' ) {
		return value === rhs;
	} else if ( operator === '!=' ) {
		return value !== rhs;
	}
	throw new Error( `Unknown operator "${operator}" in "if" statement!` );
}


// finds the next most deeply-nested if statement for processing
function collectIfFragments( content, fragments = [], ignoreFirstIf = false ) {
	console.log( `content=${content}` );
	let found = null;
	ifRegex.lastIndex = 0;
	const m = ifRegex.exec( ignoreFirstIf ? content.substring( 1 ) : content );
	if ( !m ) {
		return content;
	}
	const matchIndex = ifRegex.lastIndex - m[0].length + ( ignoreFirstIf ? 1 : 0 );
	// if there's an @if inside the captured text, keep recursing
	ifRegexGreedy.lastIndex = 0;
	const m2 = ifRegexGreedy.exec( m[0].substring( 1 ) );
	if ( m2 ) {
		console.log( `recursing.. = ${JSON.stringify( m2 )}` );
		return collectIfFragments( content, fragments, true );
	} else {
		const id = fragments.length;
		fragments.push( {
			lhs: m[1],
			operator: m[2],
			rhs: m[3],
			id,
			content: m[0]
		} );
		console.log( `m[0]=${m[0]}` );
		const prefix = content.substring( 0, matchIndex );
		const suffix = content.substring( matchIndex + m[0].length );
		const newString = prefix + `/*{{||@@FRAGMENT@@||}}:${id}:*/` + suffix;
		console.log( `newString=${newString}` );
		return newString;
	}
}


function webpackPreprocessor( content, optionsOverride ) {
	const options = ( optionsOverride || loaderUtils.getOptions( this ) ) || {};
	if ( options.context ) {
		const regexes = getEchoRegexes( options.context );
		for ( const name of Object.keys( regexes ) ) {
			content = content.replace( regexes[name], options.context[name] );
		}

		const fragments = [];
		let parsedContent = collectIfFragments( content, fragments );
		
		while ( true ) {
			fragmentRegex.lastIndex = 0;
			const m = fragmentRegex.exec( parsedContent );
			if ( !m ) {
				break;
			}
			const id = parseInt( m[1], 10 );
			const fragment = fragments[id];
			
			const removedSectionLength = m[0].length;
			const removedSectionStartIndex = fragmentRegex.lastIndex - removedSectionLength;
			const removedSection = parsedContent.substr( removedSectionStartIndex, removedSectionLength );

			let replacementString = '';
			if ( shouldKeepIfStatement( options.context, fragment.lhs, fragment.operator, fragment.rhs ) ) {
				replacementString = fragment.content;
			} else {
				const lineEndingMatch = fragment.content.match( lineEndingRegex );
				const lineEndingCount = lineEndingMatch ? lineEndingMatch.length : 0;
				const usesCrLf = !!fragment.content.match( lineEndingRegexCarriageReturn );
				replacementString = _.repeat( usesCrLf ? '\r\n' : '\n', lineEndingCount );
			}
			const suffix = parsedContent.slice( fragmentRegex.lastIndex );
			parsedContent = parsedContent.slice( 0, removedSectionStartIndex ) + replacementString + suffix;
		}
		
		content = parsedContent;

		// ifRegex.lastIndex = 0;
		// let m;
		// do {
			// m = ifRegex.exec( content );
			// if ( m ) {
				// const lhs = m[1];
				// const operator = m[2];
				// const rhs = m[3];
				// if ( !shouldKeepIfStatement( options.context, lhs, operator, rhs ) ) {
					// const removedSectionLength = m[0].length;
					// const removedSectionStartIndex = ifRegex.lastIndex - removedSectionLength;
					// const removedSection = content.substr( removedSectionStartIndex, removedSectionLength );
					// const lineEndingCount = removedSection.match( lineEndingRegex ).length;
					// const usesCrLf = !!removedSection.match( lineEndingRegexCarriageReturn );
					// const replacementString = _.repeat( usesCrLf ? '\r\n' : '\n', lineEndingCount );
					// const suffix = content.slice( ifRegex.lastIndex );
					// content = content.slice( 0, removedSectionStartIndex ) + replacementString + suffix;
					// ifRegex.lastIndex -= removedSectionLength;
				// }
			// }
		// } while ( m );
	}
	return content;
}

module.exports = webpackPreprocessor;
