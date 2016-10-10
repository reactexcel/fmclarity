export default ValidationService = {
	validator
};

function validator( schema ) {
	return function( doc ) {
		let errors = [];
		validate( doc, schema, errors );
		if ( errors.length ) {
			let error = new ValidationError( errors );
			if( Meteor.isClient ) {
				return error;
			}
			else {
				throw error;
			}
		}
	}
}

let validators = {
	string: checkString,
	number: checkNumber,
	date: checkDate,
	function: checkFunction,
	object: checkObject,
	array: checkArray,
	unknown: checkUnknown
}

function validate( doc, schema, errors ) {

	if ( errors == null ) {
		errors = [];
	}
	if( _.isObject( doc ) && Object.keys( doc ).length == 0 ){
			_.forEach( schema, ( v, k ) => {
				doc[ k ] =  "";
			});
	}
	let keys = Object.keys( doc );
	keys.map( ( key ) => {
		let rule = schema[ key ],
			value = doc[ key ];

		if ( rule != null ) {
			if( rule.subschema  != null ){
				validate( doc[key], rule.subschema, errors);
			}
			else{
				let validationFunction = validators[ rule.type ];
				if ( validationFunction == null ) {
					validationFunction = checkUnknown;
					console.log( "No validator defined for " + key );
				}
				if ( checkExistence( rule, value, key, errors ) ) {
					validationFunction( rule, value, key, errors );
				}
			}
			}
	} );
	return errors;
}

function checkExistence( rule, value, key, errors ) {
	if ( !rule.optional && ( value == null || value == undefined ) ) {
		errors.push( { name: key, type: "This is a required field" } );
		return false;
	}
	return true;
}

function checkDate( rule, value, key, errors ) {
	if ( !_.isDate( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected a date" } );
	}
}

function checkString( rule, value, key, errors ) {
	if ( !rule.optional &&  value == '' ) {
		errors.push( { name: key, type: "This is a required field" } );
	}
	if ( !_.isString( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected a string" } );
	}
}

function checkNumber( rule, value, key, errors ) {
	if ( !_.isNumber( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected a number" } );
	}
}

function checkObject( rule, value, key, errors ) {
	if ( !rule.optional &&  _.isEmpty(value) ) {
		errors.push( { name: key, type: "This is a required field" } );
	}
	if ( !_.isObject( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected an object" } );
	}
	if ( rule.schema != null ) {
		validate( doc[ key ], rule.schema, errors );
	}
}

function checkArray( rule, value, key, errors ) {
	if ( !rule.optional &&  _.isEmpty(value) ) {
		errors.push( { name: key, type: "This is a required field" } );
	}
	if ( !_.isArray( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected an array" } );
	}
}

function checkFunction( rule, value, key, errors ) {}

function checkUnknown( rule, value, key, errors ) {}
