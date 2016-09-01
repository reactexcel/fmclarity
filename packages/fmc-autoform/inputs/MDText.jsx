
import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

AutoInput.mdtext = React.createClass(
{

	handleSelect(event) 
	{
		if(this.props.onSelect) {
			this.props.onSelect(event.target.value);
		}
	},

	handleChange(event) 
	{
		if(this.props.onChange) {
			this.props.onChange([this.props.fieldName, event.target.value]);
		}
	},

	componentDidMount() 
	{
		var input = $(this.refs.input);
		if(this.props.autoFocus) {
			input.focus();
		}
		else if(this.props.autoSelect) {
			input.select();
		}
	},

	componentDidUpdate() 
	{
		var input = $(this.refs.input);
		if(this.props.autoFocus) {
			input.focus();
		}
		else if(this.props.autoSelect) {
			input.select();
		}
	},

	handleClearItem() 
	{
		if(this.props.onClear) {
			this.props.onClear()
		}
		this.handleChange([this.props.fieldName, null]);
	},

	render() 
	{
		//console.log(this.props);
		let value		= this.props.value || '',
			used		= false,
			invalid		= false,
			errors		= this.props.errors,
			classes		= ["input"];

		if( ( _.isString( value ) && value.length ) )
		{
			used = true;
			classes.push("used");
		}

		if( errors != null && errors.length )
		{
			invalid = true;
			classes.push("invalid");
		}

		return (
		<div className="md-input">      

      		<input 
      			className	= { classes.join(' ') } 
      			ref 		= "input"
      			type 		= "text" 
      			pattern 	= ".{1,80} " 
      			value 		= { value }
      			onSelect 	= { this.handleSelect }
      			onChange 	= { this.handleChange }
      		/>

	        {
        	used?
    		<div 
    			className	= "close-button" 
    			onClick		= { this.handleClearItem }>
    			&times;
    		</div>
        	:null
	        }

      		<span className = "highlight" ></span>
      		<span className = "bar" ></span>
      		<label>{this.props.placeholder}</label>

            {
			errors?
			<div className="helper-text">{ errors[0] }</div>
			:null
			}
    	</div>
    	)
	}
});
