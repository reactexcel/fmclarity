/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";

/**
 * @memberOf 		module:core/AutoForm
 */
 class FormController {

	constructor( model, schema = {}, item = {} ) {

		if ( _.isArray( schema ) ) {
			this.keys = schema;
		} else if ( _.isObject( schema ) ) {
			this.keys = Object.keys( schema );
		} else {
			throw new Error( "Options should be sent through to Controller so that the keys can be initialised" )
		}

		this.model = model;
		this.errors = {};
		this.callbacks = [];

		if ( this.model == null ) {
			this.schema = Object.assign( {}, schema );
		} else {
			this.schema = Object.assign( {}, this.model.schema, schema );
		}

		// remove all extraneous fields from the provided item
		// to avoid validation errors related to fields we aren't handling
		console.log({item, keys:this.keys});
		this.item = _.pick( item||{}, this.keys );
		this.item._id = item._id;

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
			return "";
		}
	}

	getOptions( key ) {
		let options = this.schema[ key ].options;
		if( _.isFunction( options )) {
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
			options.afterChange( this.item );
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
		if ( error!=null && error.details != null ) {
			error.details.map( ( { name, type } ) => {
				if ( errorsGroupedByField[ name ] == null ) {
					errorsGroupedByField[ name ] = [];
				}
				errorsGroupedByField[ name ].push( type );
			} )
		}
		Object.assign( this.errors, errorsGroupedByField );
	}

	/**
	 * @param 			{Document} item
	 * @param 			{function} callback
	 */
	save( item, callback ) {
		if( item!=null ) {
			Object.assign( this.item, item );
		}
		let itemId = this.item._id;
		this.model.save.call( this.item )
		.then( ( response ) => {
			if( response.insertedId != null ) {
				itemId = response.insertedId;
			}
			this.item = this.model.findOne( itemId );
			this.triggerCallbacks();
			if( callback ) {
				callback( this.item );
			}
		})
		.catch( ( error ) => {
			console.log( error );
			this.processValidationErrors( error );
			this.triggerCallbacks();
		});

	}

	delete() {
		try {
			this.model.remove( this.item._id );
		} catch ( errors ) {
			console.log( errors );
		}
		this.triggerCallbacks();
	}

	validate() {
		return this.model.validate( this.item, this.keys );
	}
}


export default FormController;
