import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

//import { DocOwners } from 'meteor/fmc:doc-owners';
import ORM from './ORM.jsx';
import ValidationService from './ValidationService.jsx';
import ValidatedMethod from './ValidatedMethod.jsx';

export default class Model {
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

		this.save = new ValidatedMethod( {
			name: `${this._name}.upsert`,
			validate: ValidationService.validator( this.schema ),
			run: ( ...args ) => {
				return this._save( ...args )
			}
		} )

		if( mixins ) {
			this.registerMixins( mixins );
		}
	}

	registerMixins( mixins ) {
		mixins.map( ( mixin ) => {
			//console.log( mixin );
			if ( _.isArray( mixin ) ) {
				let [ module, options ] = mixin;
				if( module ) {
					module.register( this, options );
				}
			} else {
				mixin.register( this )
			}
		} );
	}

	// this function may be redundant now that we are using a different autoform architecture
	getDefaultValue( fieldName, item ) {
		let field = this.schema[ fieldName ];
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
		} else if ( _.isArray( field.type ) ) {
			return [];
		} else if ( field.type == "object" ) {
			return {};
		}
	}

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


	find( ...args ) {
		return this.collection.find( ...args );
	}


	findOne( ...args ) {
		let doc = this.collection.findOne( ...args );
		return this.join( doc );
	}

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

		return this.collection.upsert( selector, { $set: doc } );
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
}
