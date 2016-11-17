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
	},

	handleSelect( event ) {
		if ( this.props.onSelect ) {
			this.props.onSelect( event.target.value );
		}
	},

	componentDidMount() {
		this.handleChange = _.debounce( this.handleChange, 200 );
	},

	componentWillReceiveProps( newProps ) {
		this.refs.input.value = newProps.value;
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
			
			<span style = { { float: 'left', padding: '4px' } } >$</span>

      		<input
      			className		= { classes.join(' ') }
      			style 			= { { width: '90%' } }
      			ref 			= "input"
      			type 			= "text"
      			defaultValue	= { value }
      			onChange 		= { this.handleChange }
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

export default Currency;
