import { isValidABN, isValidACN, isValidABNorACN } from "abnacn-validator";
export default ValidationService = {
	validator
};

function validator( schema ) {
	return function( doc ) {
		let errors = [];
		validate( doc, schema, errors );

		if ( errors.length ) {
			let error = new ValidationError( errors );
			if ( Meteor.isClient ) {
				return error;
			} else {
				throw error;
			}
		}
	}
}

let validators = {
	string: checkString,
	number: checkNumber,
	date: checkDate,
	boolean: checkBoolean,
	function: checkFunction,
	object: checkObject,
	array: checkArray,
	abn: checkABN,
	phone: checkPhoneNumber,
	unknown: checkUnknown
}

function validate( doc, schema, errors ) {

	if ( !doc ) {
		return;
	}

	if ( errors == null ) {
		errors = [];
	}

	let keys = Object.keys( doc );
	keys.map( ( key ) => {
		let rule = schema[ key ],
			value = doc[ key ];

		if ( rule != null ) {

			// do not validate schema items that do not meet the condition for this document
			if ( !rule.condition || checkCondition( rule.condition, doc ) ) {
				if ( rule.subschema != null ) {

					// if there is a subschema recursively call validate
					validate( doc[ key ], rule.subschema, errors );

				} else {

					// otherwise look up the validation function and execute it
					let validationFunction = validators[ rule.type ];
					if ( validationFunction == null ) {
						validationFunction = checkUnknown;
						console.log( `No validator defined for (${rule.type}) ${key}` );
					}
					if ( checkExistence( rule, value, key, errors ) ) {
						validationFunction( rule, value, key, errors );
					}

				}
			}
		}
	} );

	return errors;
}

function checkCondition( condition, item ) {
	return (
		( _.isString( condition ) && item.type == condition ) ||
		( _.isArray( condition ) && _.contains( condition, item.type ) ) ||
		( _.isFunction( condition ) && condition( item ) )
	)
}


function checkExistence( rule, value, key, errors ) {
	if ( !rule.optional && ( value == null || value == undefined || value == '' ) ) {
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

function checkBoolean( rule, value, key, errors ) {
	if ( !_.isBoolean( value ) && value != "") {
		console.log( value );
		errors.push( { name: key, type: "Invalid type: expected a boolean" } );
	}
}

function checkString( rule, value, key, errors ) {
	if ( !rule.optional && value == '' ) {
		errors.push( { name: key, type: "This is a required field" } );
	}
	if ( !_.isString( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected a string" } );
	}
}

function checkNumber( rule, value, key, errors ) {
	value = parseInt( value );
	if ( !_.isNumber( value ) || isNaN( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected a number" } );
	}
}

function checkObject( rule, value, key, errors ) {
	if ( !rule.optional && _.isEmpty( value ) ) {
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
	if ( !rule.optional && _.isEmpty( value ) ) {
		errors.push( { name: key, type: "This is a required field" } );
	}
	if ( !_.isArray( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected an array" } );
	}
}

function checkABN( rule, value, key, errors ) {
	if ( !isValidABN( value ) ) {
		errors.push( { name: key, type: "Invalid type: expected an Australian Business Number" } );
	}
}

function checkPhoneNumber( rule, value, key, errors ) {
	var phonenoformat = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
	var re1 = '(\\()'; // Any Single Character 1
	var re2 = '(\\d+)'; // Integer Number 1
	var re3 = '(\\))'; // Any Single Character 2
	var re4 = '(\\s+)'; // White Space 1
	var re5 = '(\\d+)'; // Integer Number 2
	var re6 = '(\\s+)'; // White Space 2
	var re7 = '(\\d+)'; // Integer Number 3

	var p = new RegExp( re1 + re2 + re3 + re4 + re5 + re6 + re7, [ "i" ] );
	if ( !value.match( p ) ) {
		errors.push( { name: key, type: "Invalid type: expected an Australian Phone Number. Format: (xx) xxxx xxxx" } );
	}

}

function checkFunction( rule, value, key, errors ) {}

function checkUnknown( rule, value, key, errors ) {}
