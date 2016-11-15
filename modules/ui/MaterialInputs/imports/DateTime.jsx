/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Text from './Text.jsx';

import moment from 'moment';


/**
 * @class 			DateTime
 * @memberOf 		module:ui/MaterialInputs
 */
const DateTime = React.createClass( {

	getInitialState() {
		var valueString = this.props.value ? moment( this.props.value ).format( "D-MMM-YY HH:mm" ) : "";
		var dateValue = this.props.value ? new Date( this.props.value ) : null;
		return {
			value: valueString,
			dateValue: dateValue,
		}
	},

	componentWillReceiveProps( props ){
		var valueString = props.value ? moment( props.value ).format( "D-MMM-YY HH:mm" ) : "";
		var dateValue = props.value ? new Date( props.value ) : null;
		this.setState({
			value: valueString,
			dateValue: dateValue,
		});
	},
	handleDateChange( event, date ) {
		this.refs.timepicker.openDialog(); //this could be used to override material-ui's stupid text boxes!!
		this.setState( {
			value: moment( date ).format( "D-MMM-YY" ),
			dateValue: date,
		} )
	},

	handleTimeChange( event, time ) {
		var timeValue = moment( time );
		var hour = timeValue.hour();
		var minute = timeValue.minute();
		var dateValue = moment( this.state.dateValue );
		dateValue.hour( hour );
		dateValue.minute( minute );
		this.setState( {
			value: dateValue.format( "D-MMM-YY HH:mm" )
		} )
		this.props.onChange( dateValue.toDate() );
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
		//this.props.value[ this.props.fieldName ] = this.state.value;
		return (
			<div>
				<Text
					placeholder = { this.props.placeholder }
					value 		= { this.state.value }
					onSelect 	= { this.handleSelect }
					onClear 	= { this.handleClear }
					errors 		= { this.props.errors }
				/>

				{/* The Material-ui date pickers don't match our styling so we hide them */}
				<div style={{display:"none"}}>

					<DatePicker
						id					= { "date-input" }
						ref 				= "datepicker"
						className 			= { "date-input" }
						floatingLabelText	= { this.props.placeholder }
						style 				= { {fontSize:"13px"} }
						mode 				= "landscape"
						onChange 			= { this.handleDateChange }
						formatDate 			= { ( date ) => { return moment(date).format("D-MMM-YY HH:mm") } }
					/>

					<TimePicker
						id 					= { "time-input" }
						ref 				= "timepicker"
						className 			= { "time-input" }
						floatingLabelText 	= { this.props.placeholder }
						style 				= { {fontSize:"13px"} }
						mode 				= "landscape"
						onChange 			= { this.handleTimeChange }
						//defaultDate={this.state.dateValue}
						/*formatDate={function(date){
							return moment(date).format("D-MMM-YY HH:mm");
						}}*/
					/>

				</div>
			</div>
		)
	}
} );

export default DateTime
