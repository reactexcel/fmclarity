import React from "react";
import { Text } from 'meteor/fmc:material-inputs';
import Controller from './Controller.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export default class AutoForm extends React.Component {

	constructor( props ) {
		super( props );
		let { model, options, item } = props;

		this.form = new Controller( model, options, item );

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

	componentWillReceiveProps( newProps ) {
		console.log( newProps );
	}

	getForm() {
		let { item, errors } = this.state;
		let form = this.form;
		let { keys, schema } = form;

		return keys.map( ( key ) => {
			let props = Object.assign( {
				input: Text,
				size: 12,
				type: "string"
			}, schema[ key ] );

			// Check visibility condition specified in schema
			if ( props.condition != null ) {
				if ( !this.checkCondition( props.condition, item ) ) {
					return;
				}
			}

			// Create default value for this field
			//  I feel like this should be done when initialising the form
			//  also 
			if ( item[ key ] == null ) {
				item[ key ] = this.form.getDefaultValue( key, item );
			}

			// Unpack options for this field (if the field is a generator)
			if ( _.isFunction( props.options ) ) {
				props.options = props.options( item );
			}

			// If this field in the schema has it's own 'schema' then recursively run autoform
			if ( props.schema != null ) {
				let { schema, size, ...others } = props;
				return (

					<div key = { key } className = { `col-sm-${size}` }>

						<FartoForm 
							item		= { item[ key ] }
							errors 		= { errors[ key ] }
							hideSubmit 	= { true }
							options		= { schema } 
										  {...others} 
						/>

					</div>

				)
			}
			// otherwise determine the type of input to create and make it,
			//  passing on the fields options as params
			else {
				let { input, size = 12, label, description, options } = props,
				placeholder = label,
					Input = null;

				if ( _.isObject( input ) ) {
					Input = input;
				}

				if ( Input == null ) {
					console.log( { key, props } );
					throw new Error( `You have tried to render a input type "${props.input}" that does not exist` );
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
										  { ...options } 
						/>

					</div>

				)
			}
		} );
	}

	render() {

		return (
			<div className="autoform row">
				{ 
					this.getForm() 
				}

				{ this.props.fart }

		        {

		        !this.props.hideSubmit ?

				<div style={ {textAlign:"right", clear:"both"}}>
					<button 
						type="button" 
						className="btn btn-flat btn-primary" 
						onClick={ ( ) => { this.form.save() } }>
						Submit
					</button>
				</div>

				: null

				}


			</div>
		)

	}
}
