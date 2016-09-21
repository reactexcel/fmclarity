/**
 * Checks to see if a dictionary of modules are valid for export.
 * Written to compensate that the babel es6 module syntax checking is very poor
 * 
 * @memberof 			Helpers
 * @param 				{object} obj - an object containing modules that are about to be exported
 * @throws 			Will throw an error if the object contains nonexistant or invalid modules
 */
checkModules = function( moduleDict ) {
	if ( !_.isObject( moduleDict ) ) {
		throw new Meteor.Error( 'Invalid argument type - expecting object' );
	}
	//console.log( moduleDict );
	let invalidModules = [];
	for ( let name in moduleDict ) {
		if ( !moduleDict[ name ] ) {
			invalidModules.push( name );
		}
	}
	if ( invalidModules.length > 0 ) {
		let invalidModString = invalidModules.join( ',' );
		console.log( 'Cannot export the following invalid modules: ' + invalidModString );
	}
}
