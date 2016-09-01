import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// http://json-schema.org/
// http://guides.rubyonrails.org/association_basics.html

ORM = {
	collections:
	{},

	HasOne: 1,
	OneToOne: 1,

	BelongsTo: 2,

	HasMany: 3,
	OneToMany: 3,
	ManyToOne: 3,

	ManyToMany: 4,
	HasAndBelongsToMany: 4
};


ORM.Collection = function( name, schema )
{
	// create our local collection object
	let collection = name;
	if ( _.isObject( name ) )
	{
		collection = name;
		ORM.collections[ collection._name ] = collection;
	}
	else if ( _.isString( name ) )
	{
		collection = new Mongo.Collection( name );
		ORM.collections[ name ] = collection;
	}
	else
	{
		throw new Meteor.Error( "Collection should be string or collection" );
	}

	// and attach a schema
	if ( schema != null )
	{
		collection._schema = schema;
	}

	// all collection use DocOwners? - should this be explicit?
	if ( DocOwners )
	{
		DocOwners.register( collection );
	}

	markupCollection( collection );
	addCollectionHooks( collection );

	return collection;
}

function markupCollection( collection )
{
	//extend the collection to include a schema, schema function, and some other helpers
	Object.assign( collection,
	{
		schema: function( newSchema )
		{
			if ( newSchema )
			{
				this._schema = newSchema;
			}
			return this._schema;
		},
		validate: validate,
		join: join,
		unjoin: unjoin,

		// would like to move these to remove dependency of ORM on RBAC
		// perhaps we should be going RBAC.Collection which then calls ORM.Collection
		// ---because RBAC.Collection has dependence on ORM but not necc vv
		methods: ( functions ) =>
		{
			return RBAC.methods( functions, collection )
		},
		actions: function( functions )
		{
			return RBAC.methods( functions, collection )
		},
		mixins: function( functions )
		{
			return RBAC.mixins( functions, collection );
		},
		createNewItemUsingSchema: function( ext, schema = this._schema )
		{
			return createNewItemUsingSchema( schema, ext )
		}
	} )

	collection.helpers(
	{
		getSchema: function()
		{
			return collection._schema;
		}
	} )
}

function validate( fields, fieldNames, schema )
{
	let errors = [];

	if( fields == null ) {
		return errors;
	}
	if( fieldNames == null )
	{
		fieldNames = Object.keys( fields );
	}
	if( schema == null ) 
	{
		schema = this._schema;
	}

	fieldNames.map( ( fieldName ) =>
	{

		let rule = schema[ fieldName ],
			item = fields[ fieldName ];

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
	return errors;
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

function join( doc, selector, options )
{
	if ( doc == null )
	{
		return;
	}

	//refactor: separate schema fields for properties and relations
	// then just pull in relations here instead of iterating over all fields

	let schema = this._schema,
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
				throw new Meteor.error( "Selected a source that does not exist" );
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

function unjoin( doc )
{
	if ( doc == null )
	{
		return;
	}

	//refactor: separate schema fields for properties and relations
	// then just pull in relations here instead of iterating over all fields

	let schema = this._schema,
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

function addCollectionHooks( collection )
{
	collection.before.update( ( userId, doc, fieldNames, modifier, options ) =>
	{
		collection.unjoin( doc );
		if ( modifier.$set )
		{
			collection.validate( modifier.$set );
		}
	} )

	collection.before.upsert( ( userId, selector, modifier, options ) =>
	{
		if ( modifier.$set )
		{
			collection.unjoin( modifier.$set );
			collection.validate( modifier.$set );
		}
	} )

	collection.before.insert( ( userId, doc ) =>
	{
		collection.unjoin( doc );
		collection.validate( doc );
		if ( !doc.createdAt )
		{
			doc.createdAt = moment().toDate();
		}
	} )

	collection.after.find( ( userId, selector, options, cursors ) =>
	{
		//collection.join( doc );
	} )

	collection.after.findOne( ( userId, selector, options, doc ) =>
	{
		collection.join( doc, selector, options );
	} )
}

/*
getter: 			getTeam( item ) {
	if( item._id )
	{
		return Teams.findOne( item._id );
	}
	else if( item.name )
	{
		return Teams.findOne( item.name );
	}
},
setter: 			setTeam( item, team ) {
	return _.pick(team, ['_id', 'name']);
},
*/


function createNewItemUsingSchema( schema, ext, callback, usingSubSchema )
{
	//this should probably be in a method
	// actually it is - in the "new" method
	//set up flags and owner
	var newItem = {};
	ext = ext ||
	{};
	for ( var fieldName in schema )
	{
		var field = schema[ fieldName ];
		if ( _.isFunction( field.defaultValue ) )
		{
			newItem[ fieldName ] = field.defaultValue( ext );
		}
		else if ( field.defaultValue != null )
		{
			newItem[ fieldName ] = field.defaultValue;
		}
		else if ( field.type == String )
		{
			newItem[ fieldName ] = "";
		}
		else if ( field.type == Number || field.type == Date )
		{
			newItem[ fieldName ] = null;
		}
		else if ( field.schema != null )
		{
			newItem[ fieldName ] = createNewItemUsingSchema( field.schema, ext ? ext[ fieldName ] : null, null, true );
		}
		else if ( _.isArray( field.type ) )
		{
			newItem[ fieldName ] = [];
		}
		else if ( field.type == Object )
		{
			newItem[ fieldName ] = {};
		}
		else
		{
			newItem[ fieldName ] = "";
		}
	}
	_.extend( newItem, ext );
	if ( callback )
	{
		callback( newItem );
	}
	return newItem;
};
