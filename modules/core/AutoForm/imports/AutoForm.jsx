/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { Text } from '/modules/ui/MaterialInputs';
import FormController from './FormController.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

/**
 * @memberOf 		module:core/AutoForm
 * @extends 		React.Component
 */
class AutoForm extends React.Component {

	constructor( props ) {
		super( props );
		let { model, form, item } = props;

		this.form = new FormController( model, form, item );

		this.form.addCallback( ( newState ) => {
			this.setState( newState );
		} );

		this.state = {
			item: this.form.item,
			errors: this.form.errors
		}
	}

	checkCondition( condition, item ) {
		return (
			( _.isString( condition ) && item.type == condition ) ||
			( _.isArray( condition ) && _.contains( condition, item.type ) ) ||
			( _.isFunction( condition ) && condition( item ) )
		)
	}

	getForm() {
		let { item, errors } = this.state;
		let form = this.form;
		let { keys, schema } = form;

		return keys.map( ( key ) => {

			//console.log( { schema, key } );

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
			if ( item[ key ] == null ) {
				item[ key ] = this.form.getDefaultValue( key, item );
			}

			// If this field in the schema has it's own subschema then recursively run autoform
			if ( schema[ key ].subschema != null ) {
				let { subschema, size, ...others } = schema[ key ];
				return (

					<div key = { key } className = { `col-sm-${size}` }>

						<AutoForm 
							item		= { item[ key ] }
							errors 		= { errors[ key ] }
							hideSubmit 	= { true }
							form		= { subschema } 
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

				//console.log ( key );

				return (

					<div key = { key } className = { `col-sm-${size}` }>

						<Input 
							fieldName 	= { key }
							value 		= { item[ key ] } 
							onChange	= { ( update, modifiers ) => { form.updateField( key, update, modifiers ) } }
							errors 		= { errors[ key ] }
							placeholder	= { placeholder } 
							description	= { description }
										  { ...options } 
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
						onClick={ ( ) => { this.form.save( this.item ) } }>
						Submit
					</button>
				</div>

				: null }

			</div>
		)

	}
}

export default AutoForm;
