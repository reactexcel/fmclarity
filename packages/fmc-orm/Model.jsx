import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { DocOwners } from 'meteor/fmc:doc-owners';
import ORM from './ORM.jsx';

export default class Model 
{
	constructor( schema, collection )
	{
		this.schema = schema;

		// either create or register the current collection
		if( _.isString( collection ) )
		{
			this.collection = new Mongo.Collection ( collection );
			this._name = collection;
		}
		else if( _.isObject( collection ) )
		{
			this.collection = collection;
			this._name = collection._name;
		}

		ORM.collections[ this._name ] = this.collection;

		DocOwners.register( this );
		// should be collection.addFeature( DocOwners );

		if( collection.helpers != null ) 
		{
			collection.helpers(
			{
				getSchema: function()
				{
					return collection._schema;
				}
			} );
		}

		this.before = {
			insert: null,
			upsert: null,
			update: null,
			findOne: null,
			find: null
		}

		this.after = {
			insert: null,
			upsert: null,
			update: null,
			findOne: null,
			find: null
		}		
	}

	// this function may be redundant now that we are using a different autoform architecture
	getDefaultValue( fieldName, item )
	{
		let field = this.schema[ fieldName ];
		if ( _.isFunction( field.defaultValue ) )
		{
			return field.defaultValue( item );
		}
		else if( field.defaultValue != null )
		{
			return field.defaultValue;
		}
		else if ( field.type == "string" )
		{
			return "";
		}
		else if ( field.type == "number" ) {
			return 0;
		}
		else if( field.type == "date" )
		{
			return new Date();
		}
		else if ( field.schema != null )
		{
			if( _.isFunction( field.schema.create ) )
			{
				return field.schema.create();
			}
			return {};
		}
		else if ( _.isArray( field.type ) )
		{
			return [];
		}
		else if ( field.type == "object" )
		{
			return {};
		}
	}

	create( item = {} )
	{
		if( this.schema == null )
		{
			throw new Meteor.Error("Can't create item with no schema");
		}

		let newItem = {};
		for ( let fieldName in this.schema )
		{
			newItem[ fieldName ] = getDefaultValue( fieldName, item )
		}
		_.extend( newItem, item );
		return newItem;
	};


	findOne( ...args )
	{
		try 
		{
			if( this.before.findOne != null )
			{
				this.before.findOne( ...args );
			}
			let doc = this.collection.findOne( ...args );
			//console.log(args);
			//console.log(doc);
			//this.authenticate( doc );
			if( this.after.findOne != null )
			{
				this.after.findOne( ...args );
			}
			return this.join( doc );
		}
		catch ( error ) 
		{
			console.log ( error );
		}
	}

	find( ...args ) 
	{
		try 
		{
			return this.collection.find( ...args );
			//cursor = this.authenticate( cursor );
			//return this.join( cursor );
		}
		catch ( error ) 
		{
		}
	}

	findAll( ...args )
	{
		try
		{
			let docs = this.collection.find( ...args ).fetch();
			//console.log( ...args );
			//console.log(docs);
			docs.map( ( doc ) => 
			{
				this.join( doc );
			} );
			//console.log(docs);
			return docs;
		}
		catch ( error )
		{
			console.log(error);
		}
	}

	insert( doc, options, callback )
	{
		try 
		{
			if ( this.before.insert != null ) 
			{
				this.before.insert( doc, options );
			}

			this.validate( doc );
			doc = this.unjoin( doc );
			this.collection.insert( doc, options, callback );

			if ( this.after.insert  != null )
			{
				this.after.insert( doc, options );
			}
		}
		catch ( error ) 
		{
			console.log ( error );
		}
	}

	update( selector, modifier, options, callback )
	{
		try 
		{
			let doc = modifier.$set;
			this.validate( doc, options );
			//this.authenticate( doc, options );
			doc = this.unjoin( doc );
			this.collection.update( doc, options, callback );
		}
		catch ( error ) 
		{
			console.log ( error );
		}
	}

	validate( doc, fields, schema = this.schema )
	{

		if( schema == null)
		{
			throw new Meteor.Error("Can't validate item with no schema");
		}

		let errors = [];

		if( doc == null ) 
		{
			return errors;
		}

		if( fields == null )
		{
			fields = Object.keys( doc );
		}

		fields.map( ( fieldName ) =>
		{

			let rule = schema[ fieldName ],
				item = doc[ fieldName ];

			if ( !rule )
			{
				errors.push(
				{
					name: fieldName,
					type: `${fieldName} is not in schema`
				} )
			}
			else
			{
				if ( !rule.optional && ( item == null || _.isEmpty( item ) ) )
				{
					errors.push(
					{
						name: fieldName,
						type: `This is a required field`
					} )
				}

				if ( !rule.type )
				{
					rule.type == "string";
				}

				if ( item && rule.type /* && !check( item, rule.type ) */ )
				{
					let itemType = typeof item,
						expectedType = rule.type;

					if ( expectedType == "date" )
					{
						if( !_.isDate( item ) ) {
							errors.push(
							{
								name: fieldName,
								type: `Invalid format: please enter a valid date`
							} )						
						}
					}

					else if ( itemType != expectedType )
					{
						errors.push(
						{
							name: fieldName,
							type: `Invalid format: expected ${expectedType} got ${itemType}`
						} )
					}
				}
			}
		} )
		if ( errors.length )
		{
			let error = new ValidationError( errors );
			if ( Meteor.isSimulation )
			{
				return error;
			}
			throw error;
		}
	}

	join( doc )
	{
		if ( doc == null )
		{
			//console.log( 'No doc');
			return;
		}

		//refactor: separate schema fields for properties and relations
		// then just pull in relations here instead of iterating over all fields

		let schema = this.schema,
			fieldNames = [];

		if ( schema != null )
		{
			fieldNames = Object.keys( schema );
		}

		fieldNames.map( ( fieldName ) =>
		{
			let rules = schema[ fieldName ];

			if ( rules.relation != null )
			{

				if ( _.isFunction( rules.relation.join ) ) 
				{
					doc[ fieldName ] = rules.relation.join( doc );
					return;
				}
				let Source = rules.relation.source,
					query = {};

				// this is a workaround required because of the shitty Meteor import implementation
				if ( _.isString( Source ) )
				{
					//console.log(Source);
					Source = ORM.collections[ Source ];
					//console.log(Source);
				}

				if ( Source == null )
				{
					throw new Meteor.Error( "Selected a source that does not exist" );
				}
				else if ( Source.findOne == null )
				{
					console.log( Source );
					throw new Meteor.Error( "Bad source for relation");
				}

				switch ( rules.relation.type )
				{

					case ORM.HasOne:

						query = doc[ fieldName ];

						if ( query == null )
						{
							/* shouldn't happen */
						}
						else if ( query._id )
						{

							doc[ fieldName ] = Source.findOne( query._id );
						}
						else
						{
							doc[ fieldName ] = Source.findOne( query );
						}

						break;

					case ORM.BelongsTo:

						key = rules.relation.key;
						query = doc[ key ];
						if ( query == null )
						{
							/* shouldn't happen */
						}
						else if ( query._id )
						{
							doc[ fieldName ] = Source.findOne( query._id );
						}
						else
						{
							doc[ fieldName ] = Source.findOne( query );
						}

						break;

					case ORM.HasMany:

						key = rules.relation.key;
						query[ key ] = doc._id;
						doc[ fieldName ] = Source.find( query ).fetch();

						break;

					case ORM.ManyToMany:

						let queries = doc[ fieldName ],
							ids = [],
							names = [];

						if ( queries == null || queries.length == 0 )
						{
							return;
						}

						queries.map( ( query ) =>
						{
							if ( query._id != null )
							{
								ids.push( query._id );
							}
							if ( query.name != null )
							{
								names.push( query.name );
							}
						} )

						doc[ fieldName ] = Source.find(
						{
							$or: [
							{
								_id:
								{
									$in: ids
								}
							},
							{
								name:
								{
									$in: names
								}
							} ]
						} ).fetch();

						break;

				}
			}
		} )

		return doc;
	}

	unjoin( doc )
	{
		if ( doc == null )
		{
			return;
		}

		//refactor: separate schema fields for properties and relations
		// then just pull in relations here instead of iterating over all fields

		let schema = this.schema,
			fieldNames = [];

		if ( schema != null )
		{
			fieldNames = Object.keys( doc );
		}

		fieldNames.map( ( fieldName ) =>
		{
			let rules = schema[ fieldName ];
			if ( rules == null )
			{
				console.log( "No schema specified for " + fieldName );
			}
			else if ( rules.relation )
			{

				if ( _.isFunction( rules.relation.unjoin ) ) 
				{
					doc[ fieldName ] = rules.relation.unjoin( doc );
					if( doc[ fieldName ]==null )
					{
						delete doc[ fieldName ];
					}
					return;
				}

				switch ( rules.relation.type )
				{

					case ORM.HasOne:
					case ORM.BelongsTo:

						if ( doc[ fieldName ] != null && _.isObject( doc[ fieldName ] ) )
						{
							console.log( doc[ fieldName ] );
							doc[ fieldName ] = {
								_id: doc[ fieldName ]._id,
								name: doc[ fieldName ].name
							}
						}

						break;

					case ORM.HasMany:

						delete doc[ fieldName ];

						break;

					case ORM.ManyToMany:

						let items = doc[ fieldName ];
						if ( items != null && items.length )
						{
							for ( let i in items )
							{
								items[ i ] = {
									_id: items[ i ]._id,
									name: items[ i ].name
								}
							}
							items = _.uniq( items );
						}

						break;

				}
			}
		} )

		return doc;
	}
	methods( functions )
	{
		return RBAC.methods( functions, this )
	}
	actions( functions )
	{
		return RBAC.methods( functions, this )
	}
	mixins( functions )
	{
		return RBAC.mixins( functions, this );
	}
	helpers( ...args ) 
	{
		return this.collection.helpers( ...args );
	}
}

	