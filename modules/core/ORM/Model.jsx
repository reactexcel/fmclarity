/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//import { DocOwners } from 'meteor/fmc:doc-owners';
import ORM from './ORM.jsx';
import ValidationService from './ValidationService.jsx';
import ValidatedMethod from './ValidatedMethod.jsx';

/**
 * Implements a data model wrapper with a given schema and collection.
 * The schema is an object that contains a field for each property.
 * Valid attributes for each property are:
 * {
 *     type:         used for validation, one of "string", "number", "object", "array",
 *     label:        the label to be shown on the input,
 *     description:  extra information about the field
 *     condition:    a function that takes an item and returns true if the field should be shown,
 *     input:        the input to be used in rendering the item (usually one of /modules/ui/MaterialInputs,
 *     options:      other information that get sends to the input,
 *     size:         a number from 1-12 that is used by Autoform to calculate the layout
 *     relations:    a join and unjoin function that can be used for joining the documents on find
 * }
 *
 * @memberOf 		module:core/ORM
 */
class Model {

	/**
	 * @constructor
	 * @param 			{object} config
	 * @param 			{object} config.schema
	 * @param 			{Collection} config.collection
	 * @param 			{mixins} config.mixins
	 */
	constructor( { schema, collection, mixins } ) {
		this.schema = schema;

		// either create or register the current collection
		if ( _.isString( collection ) ) {
			this.collection = new Mongo.Collection( collection );
			this._name = collection;
		} else if ( _.isObject( collection ) ) {
			this.collection = collection;
			this._name = collection._name;
		}

		ORM.collections[ this._name ] = this.collection;

		//DocOwners.register( this );
		// should be collection.addFeature( DocOwners );

		if ( collection.helpers != null ) {
			collection.helpers( {
				getSchema: function() {
					return collection._schema;
				}
			} );
		}

		/*
		Meteor.methods( {
			[ `${this._name}.validate` ]: ValidationService.validator( this.schema )
		} )
		*/

		this.validate = ValidationService.validator( this.schema );

		this.save = new ValidatedMethod( {
			name: `${this._name}.save`,
			//validate: ValidationService.validator( this.schema ),
			run: ( ...args ) => {
				return this._save( ...args )
			}
		} )

		if ( mixins ) {
			this.registerMixins( mixins );
		}
	}

	/*
	validate( ...args ) {
		return new Promise( ( fulfil, reject ) => {
			Meteor.call( `${this._name}.validate`, ...args, ( error, response ) => {

				if ( error ) {
					reject( error );
				} else {
					fulfil( response );
				}

			} );
		} )
	}
	*/

	/**
	 * Call the register function of any included mixins so that they can add their features to this model
	 * @param			{array} mixins - A list of mixins to register
	 */
	registerMixins( mixins ) {
		mixins.map( ( mixin ) => {
			//console.log( mixin );
			if ( _.isArray( mixin ) ) {
				let [ module, options ] = mixin;
				if ( module ) {
					module.register( this, options );
				}
			} else {
				mixin.register( this )
			}
		} );
	}

	/**
	 * Return the default value for the provided field
	 * @param 			{string} fieldName - The name of the field to retrieve default value for
	 * @param 			{Document} item - The document or object that we want to get the default value for
	 * @todo 			This function may be deprecated now that we are using a different autoform architecture - confirm
	 */
	getDefaultValue( fieldName, item ) {
		let field = this.schema[ fieldName ];
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
			} else if (  field.type == "array" ) {
				return [];
			} else if ( field.type == "object" ) {
				return {};
			}
		}
	}

	/**
	 * Create a new item using this model
	 * @param 			{Document} [item] - A template item whose values will be added to the newly created item
	 */
	create( item = {} ) {
		if ( this.schema == null ) {
			throw new Meteor.Error( "Can't create item with no schema" );
		}

		let newItem = {};
		for ( let fieldName in this.schema ) {
			newItem[ fieldName ] = this.getDefaultValue( fieldName, item )
		}
		Object.assign( newItem, item );
		return newItem;
	}

	/*
	 * Calls the models collection's find method
	 */
	find( ...args ) {
		return this.collection.find( ...args );
	}


	/*
	 * Calls the models collection's findOne method and called the related join function
	 */
	findOne( ...args ) {
		return this.collection.findOne( ...args );
		//return this.join( doc );
	}

	/*
	 * Calls the models collection's find method and calls the respective join function on the results
	 */
	findAll( ...args ) {
		let docs = this.collection.find( ...args ).fetch();
		docs.map( ( doc ) => {
			this.join( doc );
		} );
		return docs;
	}

	_save( doc, newValues ) {
		let selector = null;
		if ( doc._id != null ) {
			selector = doc._id;
		}
		Object.assign( doc, newValues );
		doc = this.unjoin( doc );
		if ( !doc.createdAt ) {
			doc.createdAt = new Date();
		}

		let response = this.collection.upsert( selector, { $set: _.omit( doc, '_id' ) } ),
			returnObject = {};

		//console.log( response );

		if ( response.insertedId ) {
			returnObject = this.collection.findOne( response.insertedId );
		} else if ( doc._id ) {
			returnObject = this.collection.findOne( selector );
		}
		return returnObject;
	}

	/** Added update() function to model since it doesnt exist like this **/
	update( ...args ) {
		return this.collection.update( ...args );
	}

	join( doc ) {
		if ( doc == null ) {
			//console.log( 'Tried to call "join" but no document provided' );
			return;
		}

		let fieldNames = Object.keys( this.schema );
		fieldNames.map( ( fieldName ) => {
			let rules = this.schema[ fieldName ];
			if ( rules.relation == null ) {
				//console.log( 'Tried to call join on a document with no "relation" property in the schema' );
			} else {
				if ( _.isFunction( rules.relation.join ) ) {
					doc[ fieldName ] = rules.relation.join( doc );
					return;
				}
			}
		} )

		return doc;
	}

	unjoin( doc ) {
		if ( doc == null ) {
			//console.log( 'Tried to call "join" but no document provided' );
			return;
		}

		let fieldNames = Object.keys( this.schema );
		fieldNames.map( ( fieldName ) => {
			let rules = this.schema[ fieldName ];
			if ( rules.relation == null ) {
				//console.log( 'Tried to call join on a document with no "relation" property in the schema' );
			} else if ( rules.relation ) {
				if ( _.isFunction( rules.relation.unjoin ) ) {
					doc[ fieldName ] = rules.relation.unjoin( doc );
					if ( doc[ fieldName ] == null ) {
						delete doc[ fieldName ];
					}
					return;
				}
			}
		} )

		return doc;
	}

	methods( functions ) {
		return RBAC.methods( functions, this )
	}
	actions( functions ) {
		return RBAC.methods( functions, this )
	}
	mixins( functions ) {
		return RBAC.mixins( functions, this );
	}
	helpers( ...args ) {
			return this.collection.helpers( ...args );
		}
		//Update function
	update( ...args ) {
		return this.collection.update( ...args );
	}
	remove( ...args ) {
		this.collection.remove( ...args );
	}
}

export default Model;
