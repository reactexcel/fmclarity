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
		this.state = this.makeState( this.props );
	}

	componentWillReceiveProps( nextProps )
	{
		this.setState( this.makeState( nextProps ) );
	}

	makeState( props )
	{
		let item = props.item,
			field = props.field,
			schema = props.schema,
			form = props.form,
			onSubmit = props.onSubmit,
			errors = {};

		if ( field != null )
		{
			item = item[ field ];
		}

		if ( schema == null )
		{
			schema = item.getSchema();
		}

		if ( form == null )
		{
			form = Object.keys( item );
		}

		return {
			item,
			id: item.id,
			originalItem: item,
			schema,
			form,
			onSubmit,
			errors
		}
	}

	updateFields( update )
	{
		let item = this.state.item;
		if ( _.isArray( update ) )
		{
			let [ fieldName, value ] = update;
			item[ fieldName ] = value;
		}
		else if ( _.isObject( update ) )
		{
			Object.assign( item, update );
		}
		this.setState(
		{
			item
		} );
	}

	submit( item )
	{
		if( this.props.onSubmit == null )
		{
			throw new Meteor.Error("No submit function defined");
		}
		let errors = {};
		this.props.onSubmit( item, ( err ) =>
		{
			if ( err.details )
			{
				err.details.map( ( err ) =>
				{
					errors[ err.name ] = errors[ err.name ] || [];
					errors[ err.name ].push( err.type );
				} );
				this.setState(
				{
					errors: errors
				} );
			}
		} );
	}

	/**
	 * Called by AutoForm.render to determine the field type of an input
	 *
	 * @method
	 * @memberof AutoForm
	 * @return {object} The input to be used in rendering the value.
	 */
	checkCondition( { condition } )
	{
		let item = this.state.item;
		return (
			( condition == null ) ||
			( _.isString( condition ) && item.type == condition ) ||
			( _.isArray( condition ) && _.contains( condition, item.type )) ||
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

					if(!s) {
						throw new Meteor.Error("schema-field-"+key+"-does-not-exist","Schema field "+key+" doesn't exist","You have tried to access a nonexistent schema field.")
					}
					else if(! this.checkCondition( s ) ) 
					{
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
					        		save = { this.props.save }
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
	        !this.props.hideSubmitButton?
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
	let { config, ...other } = props;

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
