import React from "react";

// this is a controller
// this is the role the the existing controllers should be fulfulling
// although in some, perhaps many cases, the controller will not need to provide that extra functionality
// but can just reuse this
// So autoform renders a controller???? What does that make it semantically???
///////// a view???
export default class Controller {

	constructor( model, options = {}, initialItem = {} ) {
		if ( _.isArray( options ) ) {
			this.keys = options;
			this.options = {};
		} else if ( _.isObject( options ) ) {
			this.keys = Object.keys( options );
			this.options = options;
		} else {
			throw new Error( "Options should be sent through to Controller so that the keys can be initialised" )
		}

		this.model = model;
		this.options = options;
		this.errors = {};
		this.callbacks = [];

		if ( this.model == null ) {
			this.schema = Object.assign( {}, this.options );
			//this.item = Object.assign( {}, initialItem );
		} else {
			this.schema = Object.assign( {}, this.model.schema, this.options );
			//this.item = this.model.create( initialItem );
		}

		this.item = Object.assign( {}, initialItem );
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

	save( item ) {
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
			console.log( response);
			this.triggerCallbacks();
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
