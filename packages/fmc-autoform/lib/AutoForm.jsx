/**
 * @author       Leo Keith <leo@fmclarity.com>
 * @copyright    2016 FM Clarity Pty Ltd
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

import React from "react";
import ReactDom from "react-dom";
import
{
	ReactMeteorData
}
from 'meteor/react-meteor-data';

AutoInput = {};

// this is a controller
// this is the role the the existing controllers should be fulfulling
// although in some, perhaps many cases, the controller will not need to provide that extra functionality
// but can just reuse this
// So autoform renders a controller???? What does that make it semantically???
///////// a view???
Controller = class Controller 
{
	constructor( model, options = {}, initialItem = {}  )
	{
		if( _.isArray( options ) )
		{
			this.keys = options;
			this.options = {};
		}
		else if( _.isObject( options )) 
		{
			this.keys = Object.keys( options );
			this.options = options;
		}
		else 
		{
			throw new Error("Options should be sent through to Controller so that the keys can be initialised")
		}

		this.model = model;
		this.options = options;

		if( this.model == null )
		{
			this.schema = Object.assign({}, this.options);
		}
		else 
		{
			this.schema = Object.assign({}, this.model.schema, this.options);			
		}

		this.item = Object.assign({}, initialItem);

		this.collection = [];

		this.schemaDefaults = {
			input: "mdtext",
			size: 12,
			type: "string"
		}
	}

	load( selector )
	{
		this.collection = model.find ( selector ).fetch();
		this.itemIndex = 0;
		this.item = this.collection[ this.itemIndex ];
	}

	save()
	{
		try 
		{
			this.model.update( this.item._id, { $set:this.item } );
		}
		catch( errors )
		{
			console.log( errors );
			return errors;
		}
	}

	delete()
	{
		try
		{
			this.model.remove( this.item._id );
		}
		catch( errors )
		{
			console.log( errors );
		}
	}

	validate()
	{
		return this.model.validate( this.item, this.keys );
	}

	checkCondition( condition, item )
	{
		return (
			( _.isString( condition ) && item.type == condition ) ||
			( _.isArray( condition ) && _.contains( condition, item.type ) ) ||
			( _.isFunction( condition ) && condition( item ) )
		)
	}

	getForm( item )
	{
		if( item==null )
		{
			item = this.item;
		}
		return this.keys.map( ( key ) =>
		{
			let props = Object.assign(
			{
				input: "mdtext",
				size: 12,
				type: "string"
			}, this.schema[ key ]);

			// Check visibility condition specified in schema
			if( props.condition != null )
			{
				if( !this.checkCondition( props.condition, item ))
				{
					return;
				}
			}

			// Create default value for this field
			if( item[ key ] == null )
			{
				if( this.model != null ) 
				{
					item[ key ] = this.model.getDefaultValue( key, item );
				}
				else {
					item[ key ] = "";
				}
			}

			// Unpack options for this field (if the field is a generator)
			if( _.isFunction( props.options ) )
			{
				props.options = props.options( item );
				//console.log (props.options);
			}

			if( props.schema != null )
			{
				let { schema, size, ...others } = props;
				return (
					<div key = { key } className = { `col-sm-${size}` }>
						<FartoForm options = { schema } item = { item[ key ] } {...others} />
					</div>
				)
			}
			else 
			{
				let { input, size=12, label, description, options } = props,
					Input = input,
					placeholder = label;

				if( _.isString( Input ) )
				{
					Input = AutoInput[ Input ];
				}

				if( Input == null )
				{
					throw new Error(`You have tried to render a input type "${props.input}" that does not exist`);
				}

				return (
					<div key = { key } className = { `col-sm-${size}` }>
						<Input value = { item[ key ] } placeholder = { placeholder } description = { description } { ...options } />
					</div>
				)
			}
		} );
	}
}


FartoForm = function FartoForm( { model, options, item } )
{
	let controller = new Controller( model, options, item );
	return (
		<div className="autoform row">
			{ controller.getForm() }
		</div>
	)
}

/**
 * Sprites are the lifeblood of your game, used for nearly everything visual.
 *
 * At its most basic a Sprite consists of a set of coordinates and a texture that is rendered to the canvas.
 * They also contain additional properties allowing for physics motion (via Sprite.body), input handling (via Sprite.input),
 * events (via Sprite.events), animation (via Sprite.animations), camera culling and more. Please see the Examples for use cases.
 *
 */


AutoForm = class AutoForm extends React.Component
{
	constructor( props )
	{
		super( props );
		let item = props.item,
			field = props.field,
			schema = props.schema,
			form = props.form,
			errors = props.errors ||
			{},
			onSubmit = props.onSubmit;

		if ( field != null )
		{
			item = item[ field ];
		}

		if ( schema == null )
		{
			schema = item.schema;
		}

		if ( form == null )
		{
			form = Object.keys( schema );
		}

		this.state = {
			item,
			id: item.id,
			originalItem: item,
			schema,
			form,
			onSubmit,
			errors
		}
	}

	componentWillReceiveProps( props )
	{
		let item = props.item,
			field = props.field,
			schema = props.schema,
			form = props.form,
			errors = props.errors ||
			{},
			onSubmit = props.onSubmit;

		if ( field != null )
		{
			item = item[ field ];
		}

		if ( schema == null )
		{
			schema = item.schema;
		}

		if ( form == null )
		{
			form = Object.keys( schema );
		}

		this.setState(
		{
			item,
			id: item.id,
			originalItem: item,
			schema,
			form,
			onSubmit,
			errors
		} )
	}

	updateFields( update )
	{
		let item = this.state.item,
			errors = this.state.errors;
		if ( _.isArray( update ) )
		{
			let [ fieldName, value ] = update;
			item[ fieldName ] = value;

			console.log(
			{
				item,
				fieldName,
				value
			} );

			delete errors[ fieldName ];
		}
		else if ( _.isObject( update ) )
		{
			let fieldNames = Object.keys( update );
			fieldNames.map( ( fieldName ) =>
			{
				item[ fieldName ] = update[ fieldName ];
				delete errors[ fieldName ];
			} );
			Object.assign( item, update );
		}


		this.setState(
		{
			item,
			errors
		} );
	}

	submit( item )
	{
		let errors =
			errorsByField = {};

		try
		{
			this.props.onSubmit( item, this.state.form );
		}
		catch ( error )
		{
			if ( error.details != null )
			{
				error.details.map( ( { name, type } ) =>
				{
					if ( errorsByField[ name ] == null )
					{
						errorsByField[ name ] = [];
					}
					errorsByField[ name ].push( type );
				} )
				this.setState(
				{
					errors: errorsByField
				} );
			}
		}
	}

	/**
	 * Called by AutoForm.render to determine the field type of an input
	 *
	 * @method
	 * @memberof AutoForm
	 * @return {object} The input to be used in rendering the value.
	 */


	checkCondition(
	{
		condition
	} )
	{
		let item = this.state.item;
		return (
			( condition == null ) ||
			( _.isString( condition ) && item.type == condition ) ||
			( _.isArray( condition ) && _.contains( condition, item.type ) ) ||
			( _.isFunction( condition ) && condition( item ) )
		)
	}

	/**
	 * Called by AutoForm.render to determine the field type of an input
	 *
	 * @method
	 * @memberof AutoForm
	 * @return {object} The input to be used in rendering the value.
	 */

	render()
	{
		let item = this.state.item,
			id = this.state.id,
			schema = this.state.schema,
			form = this.state.form,
			originalItem = this.state.originalItem;

		console.log( this.state );

		return (
			<div className="autoform row">

			{
			this.props.children?
			<div className="col-sm-12">{this.props.children}</div>
			:null
			}

			{
				form.map( (key) => 
				{
					var s = schema[key];

					if( !s ) {
						//throw new Meteor.Error("schema-field-"+key+"-does-not-exist","Schema field "+key+" doesn't exist","You have tried to access a nonexistent schema field.")
						console.log({"nope":key});
						return;
					}
					else if(! this.checkCondition( s ) ) 
					{
						console.log({"failed condition":s});
						return;
					}

					if( s.schema != null ) 
					{
						// create item object if it doesn't exist
						if( !item[ key ] || !_.isObject( item[ key ] ) ) 
						{
							console.log(`creating field: ${key}`);
							item[ key ] = {};
						}
						return (

							<span key={ `${id}-${key}` }>

					        	<AutoForm 
					        		item = { item } 
					        		field = { key } 
					        		schema = { s.schema } 
									errors = { this.state.errors[ key ] }
					        		onSubmit = { this.props.onSubmit }
					        		hideSubmitButton = { true }>
										{
										s.label?<h5>{s.label}</h5>
										:null
										}
					        	</AutoForm>

					        </span>
						)
					}
					else {
						return (

							<div key = { `${id}-${key}` } className = { `col-sm-${s.size||12}` }>
								<AutoInputWrapper 
									context = { item }
									fieldName = { key }
									value = { item[ key ] }
									errors = { this.state.errors[ key ] }
									config = { s }
									onChange = { (vals) => { this.updateFields(vals) } }
								/>
							</div>

						)
					}
				})
			}

	        {
	        this.props.onSubmit != null &&
	        !this.props.hideSubmitButton ?
			<div style={ {textAlign:"right", clear:"both"}}>
				<button 
					type="button" 
					className="btn btn-flat btn-primary" 
					onClick={ ( ) => { this.submit( item ) } }>
					Submit
				</button>
			</div>
			: null
			}

		</div>
		)
	}
}

function AutoInputWrapper( props )
{
	let
	{
		config,
		...other
	} = props;

	config = Object.assign(
	{
		input: "mdtext",
		label: props.fieldName,
		options:
		{}
	}, config );

	let label = config.label;
	if ( !config.optional )
	{
		label = label + '*';
	}

	if ( _.isString( config.input ) )
	{
		config.input = AutoInput[ config.input ];
	}

	if ( _.isFunction( config.options ) && props.context != null )
	{
		config.options = config.options( props.context );
	}

	return (
		<div>
			<config.input {...other} {...config} placeholder={ label }/>
		</div>
	)
}