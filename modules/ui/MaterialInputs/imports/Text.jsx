/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";

/**
 * @class 			Text
 * @memberOf 		module:ui/MaterialInputs
 */
const Text = React.createClass( {
    handleChange(newValue) {
        //let newValue = this.refs.input.value;
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
        if ( this.props.datepicker ) {
            this.refs.input.blur();
        }
        if ( this.props.onSelect ) {
            this.props.onSelect( event.target.value );
        }
    },

    handleOnBlur( event ) {
        if ( this.props.onBlur ) {
            this.props.onBlur( event );
        }
        // format number and delimit 0's only input to single 0 eg 0000 to 0
        var fieldName = this.props.fieldName ? this.props.fieldName : "";
        var fieldType = this.props.model && this.props.model.schema[ fieldName ] && this.props.model.schema[ fieldName ].type ? this.props.model.schema[ fieldName ].type : null;
        if ( fieldType && fieldType == "number" && new RegExp( "^[0\s]+$" ).test( event.target.value.replace( /\D+/g, "" ) ) ) {

            this.refs.input.value = "0";

        }
    },

    componentDidMount() {
        this.handleChange = _.debounce( this.handleChange, 200 );
    },

    componentWillReceiveProps( newProps ) {
        this.refs.input.value = newProps.value;
    },

    render() {
        let { value, errors, item, fieldName } = this.props,
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
				style 			= {{paddingRight:'60px'}}
      			ref 			= "input"
      			type 			= "text"
      			defaultValue	= { value }
      			onChange 		= { ( event ) => { this.handleChange( event.target.value ) } }
      			onSelect		= { this.handleSelect }
      			maxLength		= { this.props.maxLength }
      			onBlur			= { this.handleOnBlur }
				readOnly		= { this.props.readOnly||this.props.readonly }
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

export default Text;
