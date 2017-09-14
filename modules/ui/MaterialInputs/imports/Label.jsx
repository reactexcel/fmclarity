/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";

/**
 * @class 			Text
 * @memberOf 		module:ui/MaterialInputs
 */
const Label = React.createClass( {

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
            <div className = "md-input" style={{paddingBottom: "20px"}}>
              <label className = { classes.join(' ') } style = {{padding:'0px'}} >{value}</label>
      		<label>{ this.props.placeholder }</label>
    	</div>
        )
    }
} );

export default Label;
