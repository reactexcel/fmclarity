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

ucfirst = function( string ) {
	return string.charAt( 0 ).toUpperCase() + string.slice( 1, -1 );
}

toTitleCase = function(str) {
  return str.replace(/\w\S*/g, function(txt){
  	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

formatToCurrency = function(val){
	val = val.replace(/,/g, "")
	val += '';
	x = val.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';

	var rgx = /(\d+)(\d{3})/;

	while (rgx.test(x1)) {
	    x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}

	return (x1 + x2);
}