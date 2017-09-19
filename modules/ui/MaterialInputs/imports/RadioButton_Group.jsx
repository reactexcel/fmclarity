/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

/**
 * @class 			Text
 * @memberOf 		module:ui/MaterialInputs
 */
const RadioButton_Group = React.createClass( {

    getInitialState() {
        return {
            selectedValue:this.props.defaultValue
        }
    },

    componentDidMount() {
        this.props.onChange(this.props.defaultValue);
    },

    componentWillReceiveProps( newProps ) {
    },

    render() {
        let RadioButtonStyle = {
            labelStyle:{
                marginTop:'-5px'
            },
            iconStyle:{
                marginRight:'7px',
                fill:'#00BFA5'
            },
            displayStyle:{
                display: 'inline-block',
                width: '170px'
            }
        }
        let { option1, option2 } = this.props;
        return (
            <div className = "md-input">
                <RadioButtonGroup name="shipSpeed" valueSelected = {this.state.selectedValue} onChange={(event,value)=>{
                    this.props.onChange(value)
                    this.setState({
                        selectedValue: value
                    })
                }}>
                    <RadioButton
                        value       =   { option1 }
                        label       =   {option1}
                        style       =   {RadioButtonStyle.displayStyle}
                        labelStyle  =   {RadioButtonStyle.labelStyle}
                        iconStyle   =   {RadioButtonStyle.iconStyle}
                    />
                    <RadioButton
                        value   =   {option2}
                        label   =   {option2}
                        style   =   {RadioButtonStyle.displayStyle}
                        labelStyle  =   {RadioButtonStyle.labelStyle}
                        iconStyle   ={  RadioButtonStyle.iconStyle}
                    />
                </RadioButtonGroup>
    	    </div>
        )
    }
} );

export default RadioButton_Group;
