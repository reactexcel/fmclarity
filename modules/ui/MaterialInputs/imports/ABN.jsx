/**
 * @author 			Norbert Glen <norbertglen7@gmail.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";

/**
 * @class 			ABN
 * @memberOf 		module:ui/MaterialInputs
 */
const ABN = React.createClass( {
	handleChange( event ) {
		let newValue = event.target.value;
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

	handleKeyDown(e){
		// Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
			var input = this.refs.input;
		    var value = this.refs.input.value;
		    
	    // catching backspace
	    if(e.keyCode === 8) {
	        if(value.length == 2) {
	            input.value=value.substr(0, 1);
	        } else if(value.length == 6) {
	            input.value=value.substr(0, 5);
	        }
	    } else {
	        if(value.length == 2) {
	            input.value=value + " ";
	        } else if(value.length == 6) {
	            input.value=value + " ";
	        }
	        else if(value.length == 10) {
	        	input.value=value + " ";
	        }
	        else if(value.length == 14) {
	            e.preventDefault();
	        }
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
      			maxLength		="14"
      			value 			= { value }
      			onChange 		= { this.handleChange }
      			onSelect		= { this.handleSelect }
      			onKeyDown		= { this.handleKeyDown }
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

export default ABN;
