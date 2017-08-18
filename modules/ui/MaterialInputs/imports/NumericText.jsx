/**
 * @author 			Norbert Glen <norbertglen7@gmail.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";

/**
 * @class 			NumericText
 * @memberOf 		module:ui/MaterialInputs
 */
const NumericText = React.createClass( {
	handleChange( event ) {
		let newValue = parseInt(event.target.value);
		if ( this.props.onChange ) {
			this.props.onChange( newValue );
		}
	},

	handleClear() {
		if ( this.props.onClear ) {
			this.props.onClear()
		}
		if ( this.props.onChange ) {
			this.props.onChange( null );
		}
		this.refs.input.value = "";
	},

	handleOnBlur(e){
		// format number and delimit 0's only as inpu eg 0000 etc
		var curval = e.target.value.replace(/\D+/g, "");
		if (new RegExp("^[0\s]+$").test(curval)) {
			e.target.value="0";
		}

	},

	handleKeyDown(evt){
		var charCode = (evt.which) ? evt.which : event.keyCode
		console.log(charCode,"charCode");
        if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode < 96 || charCode > 105)){
            evt.preventDefault();
        }else{
            return;
        }
	},

	handleSelect( event ) {
		if ( this.props.onSelect ) {
			this.props.onSelect( event.target.value );
		}
	},

	render() {
		let { value, errors } = this.props,
			used = false,
			invalid = false,
			classes = [ "input" ];

		if ( value != null && value.length != 0 ) {
			used = true;
			classes.push( "used" );
		}

		if ( errors != null && errors.length ) {
			invalid = true;
			classes.push( "invalid" );
		}

		return (
			<div className = "md-input">

      		<input
      			className		= { classes.join(' ') }
      			ref 			= "input"
      			type 			= "text"
      			maxLength		="5"
      			value 			= { value }
      			onChange 		= { this.handleChange }
      			onSelect		= { this.handleSelect }
      			onKeyDown		= { this.handleKeyDown }
      			onBlur			= { this.handleOnBlur }
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

export default NumericText;
