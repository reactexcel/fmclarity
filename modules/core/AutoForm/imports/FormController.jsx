/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";

/**
 * @memberOf 		module:core/AutoForm
 */
class FormController {

	constructor( model, schema = {}, item = {}, errors = {} ) {

		if ( _.isArray( schema ) ) {
			this.keys = schema;
		} else if ( _.isObject( schema ) ) {
			this.keys = Object.keys( schema );
		} else {
			throw new Error( "Options should be sent through to Controller so that the keys can be initialised" )
		}

		this.model = model;
		this.errors = errors;
		this.callbacks = [];

		if ( this.model == null ) {
			this.schema = Object.assign( {}, schema );
		} else {
			this.schema = Object.assign( {}, this.model.schema, schema );
		}

		this.item = item || {};

		this.collection = [];
	}

	addCallback( f ) {
		this.callbacks.push( f );
	}

	triggerCallbacks() {
		this.callbacks.map( ( f ) => {
			f( { item: this.item, errors: this.errors } )
		} )
	}

	getDefaultValue( key, item ) {
		if ( this.model ) {
			return this.model.getDefaultValue( key, item );
		} else {
			// This will return the default value for the subschema components.
			// If we are not providing MODEL as a prop to the Autoform then
			// the default value property of schema is not working.
			if(this.schema){
				if( this.schema[key] ){
					let field = this.schema[ key ];
			        if ( typeof field !== 'undefined' ) {
			            if ( _.isFunction( field.defaultValue ) ) {
			                return field.defaultValue( item );
			            } else if ( field.defaultValue != null ) {
			                return field.defaultValue;
			            } else if ( field.type == "string" ) {
			                return "";
			            } else if ( field.type == "number" ) {
			                return 0;
			            } else if ( field.type == "date" ) {
			                return new Date();
			            } else if ( field.schema != null ) {
			                if ( _.isFunction( field.schema.create ) ) {
			                    return field.schema.create();
			                }
			                return {};
			            } else if ( field.type == "array" ) {
			                return [];
			            } else if ( field.type == "object" ) {
			                return {};
			            }
			        }
				}
				return "";
			}
		}
	}

	getOptions( key ) {
		let options = this.schema[ key ].options;
		if ( _.isFunction( options ) ) {
			options = options( this.item );
		}
		return options;
	}

	updateField( key, newValue, otherModifications ) {
		let options = this.getOptions( key );
		// update primary value
		this.item[ key ] = newValue;
		delete this.errors[ key ];

		if ( options != null && _.isFunction( options.afterChange ) ) {
			options.afterChange( this.item, newValue );
		}

		if ( otherModifications != null ) {
			this.updateFields( otherModifications );
		}

		this.triggerCallbacks();
		return this.item;
	}

	updateFields( modifier ) {
		if ( _.isObject( modifier ) ) {
			let keys = Object.keys( modifier );
			keys.map( ( key ) => {
				this.item[ key ] = modifier[ key ];
			} );
		}
		return this.item;
	}

	load( selector ) {
		this.collection = model.find( selector ).fetch();
		this.itemIndex = 0;
		this.item = this.collection[ this.itemIndex ];
		this.triggerCallbacks();
	}

	processValidationErrors( error ) {
		let errorsGroupedByField = {}
		if ( error != null && error.details != null ) {
			error.details.map( ( { name, type } ) => {
				if ( errorsGroupedByField[ name ] == null ) {
					errorsGroupedByField[ name ] = [];
				}
				errorsGroupedByField[ name ].push( type );
			} )
		}
		Object.assign( this.errors, errorsGroupedByField );
	}

	validate( item ) {
		// actually, we don't want to do this if validation fails
		// REFACT: think about how this could be optimised
		if ( item != null ) {
			Object.assign( this.item, item );
		}
		// remove all extraneous fields from the provided item
		// to avoid validation errors related to fields we aren't handling
		let validationFields = _.pick( this.item, this.keys );
		if( this.model ) {
			let error = this.model.validate( validationFields );
			if ( error ) {
				console.log( error );
				this.processValidationErrors( error );
				this.triggerCallbacks();
				return false;
			}
		}
		return true;
	}

	/**
	 * @param 			{Document} item
	 * @param 			{function} callback
	 */
	save( item, callback ) {

		if ( this.validate( item ) ) {
			// if validation passes we will assume update will work
			//  and trigger callbacks before saving the data
			if ( Meteor.isClient ) {
				this.triggerCallbacks();
				if ( callback ) {
					callback( this.item );
				}
			}

			// this could actually perform validation to confirm the results of the client validation
			this.model.save.call( this.item )
				.then( ( savedItem ) => {
					Object.assign( this.item, savedItem );
					/* should only happen if different from before */
					/*
					this.triggerCallbacks();
					if ( callback ) {
						callback( this.item );
					}
					*/
				} );
		}
	}

	delete() {
		try {
			this.model.remove( this.item._id );
		} catch ( errors ) {
			console.log( errors );
		}
		this.triggerCallbacks();
	}

	/*
	validate() {
		return this.model.validate( this.item, this.keys );
	}
	*/
}


export default FormController;
