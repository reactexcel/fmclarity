/**
 * @author 			Norbert Glen <norbertglen7@gmail.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";

/**
 * @class 			ABN
 * @memberOf 		module:ui/MaterialInputs
 */
const Phone = React.createClass( {
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
             // Allow: Ctrl+A, Command+A, Ctrl+V
            (e.keyCode === 65 || e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && e.keyCode !== 32) {
            e.preventDefault();
        }
			var input = this.refs.input;
		    var value = this.refs.input.value;
		    
	    // catching backspace
	    if(e.keyCode === 8) {
	        if(value.length == 2) {
	            input.value=value.substr(0, 1);
	        } else if(value.length == 9) {
	            input.value=value.substr(0, 8);
	        }
	    } 
	},
	handleKeyUp(e){
		var input_length = e.target.value.length;
		var toll_free_numbers = ['1300', '1800'];
	    var landline_numbers = ['02','03','07','08'];
	    var mobile_phone_number = '04';
	    var isTollfree = false;
	    var ismobile = false;
	    var isLandline = false;

	    // check for toll free number entries
		if(input_length >= 4 && ($.inArray(e.target.value.substr(0, 4), toll_free_numbers) !== -1)){

			isTollfree = true;
			if (input_length==4) {
				e.target.value = e.target.value + " ";
			}
			else if(input_length==8){
				e.target.value = e.target.value + " ";
			}
			else if(input_length >= 12){
				e.target.value = e.target.value.substr(0, 12);
			}
		}

		//check for landline numbers
		if (input_length >=2 && (($.inArray(e.target.value.substr(0, 2), landline_numbers) !== -1) || 
			($.inArray(e.target.value.substr(1, 2), landline_numbers) !== -1))) {
			isLandline=true;
			if (input_length==2) {
				e.target.value = "("+e.target.value + ") ";
			}
			else if(input_length==9){
				e.target.value = e.target.value + " ";
			}
			else if(input_length >= 14){
				e.target.value = e.target.value.substr(0, 14);
			}
		}

		// check for mobile number entry
		if (input_length >= 4 && e.target.value.substr(0, 2)=='04') {
			ismobile = true;
			if (input_length==4) {
				e.target.value = e.target.value + " ";
			}
			else if(input_length==8){
				e.target.value = e.target.value + " ";
			}
			else if(input_length >= 12){
				e.target.value = e.target.value.substr(0, 12);
			}
		}
		
	},
	handleSelect( event ) {
		if ( this.props.onSelect ) {
			this.props.onSelect( event.target.value );
		}
	},

	handleOnBlur( e ) {
		if(e.target.value.length == 6 && e.target.value.substr(0, 2)=='13'){
			e.target.value=e.target.value.substr(0,2)+" "+e.target.value.substr(2,2)+" "+e.target.value.substr(4,2);
		}
		var acceptted_values=['18', '13', '02', '03', '04','07', '08'];
		if (($.inArray(e.target.value.substr(0, 2), acceptted_values) === -1)) {
			e.target.value="";
		}
		var tolls=['18','13'];
		if (($.inArray(e.target.value.substr(0, 2), tolls) !== -1) && (e.target.value.substr(2, 2) != '00' || e.target.value.length != 12) ) {
			e.target.value="";
		}
		var landlines=['02', '03','07', '08'];
		if (($.inArray(e.target.value.substr(0, 2), landlines) !== -1) && e.target.value.length != 14 ) {
			e.target.value="";
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
      			value 			= { value }
      			onChange 		= { this.handleChange }
      			onSelect		= { this.handleSelect }
      			onKeyDown		= { this.handleKeyDown }
      			onKeyUp			= { this.handleKeyUp }
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

export default Phone;
