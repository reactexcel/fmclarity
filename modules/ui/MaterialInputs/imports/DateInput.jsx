/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Text from './Text.jsx';

/**
 * @class 			DateInput
 * @memberOf 		module:ui/MaterialInputs
 */
const DateInput = React.createClass( {

	getInitialState() {
		var valueString = this.props.value ? moment( this.props.value ).format( "D-MMM-YY" ) : "";
		var dateValue = this.props.value ? new Date( this.props.value ) : null;
		return {
			value: valueString,
			dateValue: dateValue,
		}
	},

	handleDateChange( event, date ) {
		let value = moment( date ).format( "D-MMM-YY" );
		console.log( value );
		this.setState( {
			value: value,
			dateValue: date,
		} )
		this.props.onChange( date );
	},

	handleSelect() {
		this.refs.datepicker.openDialog();
	},

	handleClear() {
		this.setState( {
			value: "",
			dateValue: null
		} )
		this.props.onChange( null );
	},

	render() {
		return (
			<div>
				<Text
					placeholder = { this.props.placeholder } 
					value 		= { this.state.value } 
					onSelect 	= { this.handleSelect }
					onClear 	= { this.handleClear }
					errors 		= { this.props.errors }
				/>
				<div style = {{display:"none"}}>

					<DatePicker 
						id 					= { "date-input" } 
						ref 				= "datepicker"
						className 			= { "date-input" }
						floatingLabelText 	= { this.props.placeholder }
						style 				= { {fontSize: "13px"} }
						mode 				= "landscape" 
						onChange 			= { this.handleDateChange }
						//defaultDate={this.state.dateValue}
						formatDate 			= { (date) => { return moment(date).format("D-MMM-YY") } }
					/>
					
				</div>
			</div>
		)
	}
} );

export default DateInput