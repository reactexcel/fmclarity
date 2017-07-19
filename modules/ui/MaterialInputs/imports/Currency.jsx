/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";

/**
 * @class 			Text
 * @memberOf 		module:ui/MaterialInputs
 */
const Currency = React.createClass( {
	handleChange() {
		let newValue = this.refs.input.value;
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
		this.props.value = null;
		this.toggleCurrencyHolder();
	},

	handleSelect( event ) {
		if ( this.props.onSelect ) {
			this.props.onSelect( event.target.value );
		}
	},

	formatNum(obj) {
		if ( obj ) {
		    obj.value = formatToCurrency(obj.value);
		}
	},

	handleKeyUp(event){
		//allow navigation around textbox using arrow keys
    	if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
        	return;
    	}
		this.formatNum(event.target);

	},

	handleOnBlur(event){
		this.toggleCurrencyHolder();
		// format number and delimit multiple 0's eg 0000, 0000.0002, 0002 etc
		var curval = this.refs.input.value.replace(/,/g , "");
		this.refs.input.value=Number(curval);
		this.formatNum(this.refs.input);
	},

	CheckNumeric(e) {
    // Allow: backspace, delete, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A, Ctrl+V
            (e.keyCode === 65 || e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) || e.keyCode == 32) {
            e.preventDefault();
        }
	},

	toggleCurrencyHolder(){
		if(this.refs.input.value.length > 0){
			$('.currency-holder').show();
		}
		if ( this.refs.input.value.length == 0 ) {
			$('.currency-holder').hide();
		}
	},

	componentDidMount() {
		this.handleChange = _.debounce( this.handleChange, 200 );
		if(this.refs.input.value.length > 0){
			$('.currency-holder').show();
		}else{
			$('.currency-holder').hide();
		}
	},

	componentWillReceiveProps( newProps ) {
		this.refs.input.value = newProps.value;
		if(this.refs.input.value.length > 0){
			$('.currency-holder').show();
		}else{
			$('.currency-holder').hide();
		}
	},


	render() {
		let { value, errors } = this.props,
			used = false,
			invalid = false,
			classes = [ "input" ];

		if ( value != null ) {
			used = true;
			classes.push( "used" );
		}

		if ( errors != null && errors.length ) {
			invalid = true;
			classes.push( "invalid" );
		}

		return (
			<div className = "md-input">

			<span className = 'currency-holder' style = { { float: 'left', padding: '4px', display: 'none' } } >$</span>

      		<input
      			className		= { classes.join(' ') }
      			style 			= { { width: '90%' } }
      			ref 			= "input"
      			type 			= "text"
      			defaultValue	= { value }
      			onChange 		= { this.handleChange }
      			onSelect		= { this.handleSelect }
      			onKeyUp			= { this.handleKeyUp }
      			onKeyDown		= { this.CheckNumeric }
      			onFocus			= { this.toggleCurrencyHolder }
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

export default Currency;
