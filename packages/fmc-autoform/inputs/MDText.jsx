import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

AutoInput.mdtext = React.createClass(
{
	getInitialState() 
	{
		return {
			value: (this.props.value || "")
		}
	},

	componentWillReceiveProps ( {value} ) 
	{
		this.setState({ value });
	},

	componentDidMount()
	{
		this.save = _.debounce( this.save, 500 );
	},

	save()
	{
		if( this.props.onChange )
		{
			this.props.onChange( [ this.props.fieldName, this.state.value ] );
		}
	},

	handleChange( value )
	{
		this.setState( { value } );
		this.save();
	},

	handleClear()
	{
		if ( this.props.onClear )
		{
			this.props.onClear()
		}
		this.handleChange( null );
		this.refs.input.value = "";
	},

	handleSelect(event) 
	{
		if(this.props.onSelect) 
		{
			this.props.onSelect(event.target.value);
		}
	},

	render()
	{
		let value = this.state.value,
			used = false,
			invalid = false,
			errors = this.props.errors,
			classes = [ "input" ];

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
			<div className = "md-input">      

      		<input 
      			className		= { classes.join(' ') } 
      			ref 			= "input"
      			type 			= "text" 
      			value 			= { value }
      			onChange 		= { ( event ) => { this.handleChange( event.target.value ) } }
      			onSelect		= { this.handleSelect }
      		/>

	        {
        	used?
    		<div 
    			className	= "close-button" 
    			onClick		= { this.handleClear }>
    			&times;
    		</div>
        	:null
	        }

      		<span className = "highlight" ></span>
      		<span className = "bar" ></span>
      		<label>{ this.props.placeholder }</label>

            {
			errors?
			<div className="helper-text">{ errors[0] }</div>
			:this.props.description?
			<div className="helper-text">{this.props.description}</div>
			:null
			}
    	</div>
		)
	}
} );
