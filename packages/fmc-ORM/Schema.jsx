Schema = function (properties)
{
	this.properties = properties;
	return {
		join,
		unjoin,
		validate,
		properties,
		createNewItem
	}
}

function createNewItem( ext, callback, usingSubSchema )
{
	//this should probably be in a method
	// actually it is - in the "new" method
	//set up flags and owner
	let newItem = {}
		properties = this.properties;

	ext = ext || {};

	for ( var fieldName in properties )
	{
		var field = properties[ fieldName ];
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
			//newItem[ fieldName ] = this.createNewItem( ext ? ext[ fieldName ] : null, null, true );
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


function validate( fields )
{
	let fieldNames = Object.keys( fields ),
		properties = this.properties,
		errors = [];

	fieldNames.map( ( fieldName ) =>
	{

		let rule = properties[ fieldName ],
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
			if ( !rule.optional && _.isEmpty( item ) )
			{
				errors.push(
				{
					name: fieldName,
					type: `This is a required field`
				} )
			}

			if ( !rule.type )
			{
				rule.type == String;
			}

			if ( item && rule.type /* && !check( item, rule.type ) */ )
			{
				let itemType = typeof item,
					expectedType = typeof rule.type;

				if ( itemType != expectedType )
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

	let schema = this.properties,
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

	let schema = this.properties,
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