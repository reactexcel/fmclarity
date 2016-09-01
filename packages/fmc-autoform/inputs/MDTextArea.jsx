import React from "react";
import ReactDom from "react-dom";
import
{
	ReactMeteorData
}
from 'meteor/react-meteor-data';

AutoInput.mdtextarea = React.createClass(
{

	componentDidMount()
	{
		this.handleChange = _.debounce(this.handleChange, 500);
		setTimeout( () =>
		{
			$( this.refs.input ).elastic();
		}, 400 );
	},

	handleChange( value )
	{
		this.props.onChange([ this.props.fieldName, value ]);
	},

	render()
	{
		let value = this.props.value || '',
			used = false,
			invalid = false,
			errors = this.props.errors,
			classes = [ "input" ];

		//console.log(value);

		if ( ( _.isString( value ) && value.length ) )
		{
			used = true;
			classes.push( "used" );
		}

		if ( errors != null && errors.length )
		{
			invalid = true;
			classes.push( "invalid" );
		}

		return (
			<div className="md-textarea">
	          	<textarea 
	          		ref="input"
	          		className = { classes.join(' ') }
	          		defaultValue = { value } 
	          		onChange={ ( event ) => { this.handleChange( event.target.value ) } }>
	          	</textarea>
      			<span className="highlight"></span>
      			<span className="bar"></span>
	      		<label>{ this.props.placeholder }</label>
	            {
				errors?
				<div className="helper-text">{ errors[0] }</div>
				:null
				}
	        </div>
		)
	}
} );
