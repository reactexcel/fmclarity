/**-
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Text } from '/modules/ui/MaterialInputs';
import FormController from './FormController.jsx';
import { Modal } from '/modules/ui/Modal'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

/**
 * @memberOf 		module:core/AutoForm
 * @extends 		React.Component
 */
class AutoForm extends React.Component {

	/**
	 * @param 		{object} props
	 */
	constructor( props ) {
		super( props );
		let { model, form, item, errors } = props;

		this.form = new FormController( model, form, item, errors );

		this.form.addCallback( ( newState ) => {
			this.onChange( newState );
		} );

		this.state = {
			item: this.form.item,
			errors: this.form.errors || {}
		}
	}

	/**
	 * Takes the condition field from a schema and a document item and returns true if the item passes the condition
	 * @param 		{object} condition
	 * @param 		{Document} item
	 * @return 		{boolean}
	 */
	checkCondition( condition, item ) {
		return (
			( _.isString( condition ) && item.type == condition ) ||
			( _.isArray( condition ) && _.contains( condition, item.type ) ) ||
			( _.isFunction( condition ) && condition( item ) )
		)
	}

	onChange( newState ) {
		if ( this.props.onChange ) {
			this.props.onChange( newState );
		}
		this.setState( newState );
	}

	/**
	 * Returns the react xml that can be used to create a form with the requested properties and values
	 */
	getForm() {
		let { item, errors } = this.state;
		let form = this.form;
		let { keys, schema } = form;

		return keys.map( ( key ) => {

			if ( !schema[ key ] ) {
				throw new Meteor.Error( `No schema definition for field: ${key}` )
			}

			let { input, size = 12, label, description, options, condition } = schema[ key ],
				placeholder = label,
				Input = null;

			// Check visibility condition specified in schema
			if ( condition != null ) {
				if ( !this.checkCondition( condition, item ) ) {
					return;
				}
			}

			// Unpack options for this field (if the field is a function)
			if ( _.isFunction( options ) ) {
				options = options( item );
			}

			// Create default value for this field
			//  I feel like this should be done when initialising the form
			//  also
			if ( item[ key ] == null ) {
				item[ key ] = this.form.getDefaultValue( key, item );
			}

			// If this field in the schema has it's own subschema then recursively run autoform
			if ( schema[ key ].subschema != null ) {
				let { subschema, size = 12, ...others } = schema[ key ];
				return (

					<div key = { key } className = { `col-sm-${size}` }>

						<AutoForm
							item		= { item[ key ] }
							errors 		= { errors }
							hideSubmit 	= { true }
							form		= { subschema }

							// since we are calling this recursively we need to update the parent state with the changes from the child
							onChange 	= { ( newState ) => {
												let item = this.state.item,
													newItem = newState.item;

												Object.assign( item[ key ], newItem)
												this.setState( { item } );
											}}
										  item={this.props.item}
											model={this.props.model}
										  { ...others }
						/>

					</div>

				)
			}
			// otherwise determine the type of input to create and make it,
			//  passing on the fields options as params
			else {

				if ( _.isObject( input ) ) {
					Input = input;
				}

				if ( Input == null ) {
					console.log( { key, fields: schema[ key ] } );
					throw new Error( `Invalid schema input type for field: ${key}`, `Trying to render a input type "${schema[ key ].input}" that does not exist` );
				}

				return (

					<div key = { key } className = { `col-sm-${size}` }>
						<Input
							fieldName 	= { key }
							value 		= { item[ key ] }
							onChange	= { ( update, modifiers ) => { form.updateField( key, update, modifiers ) } }
							errors 		= { errors[ key ] }
							placeholder	= { placeholder }
							description	= { description }
							item={this.props.item}
							model={this.props.model}
										  { ...options}
						/>
					</div>

				)
			}
		} );
	}

	render() {

		console.log( 'rendering form' );

		return (
			<div className="autoform row">

				{ this.getForm() }

		        { ! this.props.hideSubmit ?

				<div style={ {textAlign:"right", clear:"both"}}>
					<button
						type="button"
						className="btn btn-flat btn-primary"
						onClick={ ( ) => {
							let { item } = this.state;
							this.form.save( item, ( newItem ) => {
								if ( this.props.onSubmit ) {
									this.props.onSubmit( newItem )
								}
							} );
						} }>
						Submit
					</button>
				</div>

				: null }

			</div>
		)
	}
}

export default AutoForm;
