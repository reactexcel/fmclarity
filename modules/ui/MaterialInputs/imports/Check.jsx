/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import Checkbox from 'material-ui/Checkbox';

/**
 * @class 			Text
 * @memberOf 		module:ui/MaterialInputs
 */
const Check = React.createClass( {

    getInitialState() {

        return {
            checked:false
        }
    },

    componentDidMount() {

    },

    componentWillReceiveProps( newProps ) {
    },

    render() {
        let styles = {
            labelStyle:{
                lineHeight:'15px',
                marginLeft:'-10px'
            },
            iconStyle:{
                fill:'black'
            }
        }
        let { value, errors, item, fieldName } = this.props;
        if(errors && errors.length){
            styles.labelStyle.color = '#dd2c00';
            styles.iconStyle.fill = '#dd2c00';
        }
        return (
            <div className = "md-input">
                <Checkbox
                    label={this.props.placeholder}
                    labelStyle = {styles.labelStyle}
                    iconStyle = {styles.iconStyle}
                    checked={this.state.checked}
                    onCheck = {()=>{
                        let checked = this.state.checked;
                        if(checked == true){
                            checked = false
                        }else{
                            checked = true
                        }
                        this.props.onChange(checked)
                        this.setState({
                            checked:checked
                        })
                    }}
                />
    	    </div>
        )
    }
} );

export default Check;
