
import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Text from './Text.jsx';

import moment from 'moment';


const StartEndTimePicker = React.createClass( {

	getInitialState() {
	//	var valueString = this.props.value ? moment( this.props.value ).format( "D-MMM-YY HH:mm" ) : "";
		var valueString = this.props.value || "" ;
		var dateValue = this.props.value ? new Date( this.props.value ) : null;
		return {
			value: valueString,
			dateValue: dateValue,
		}
	},

	componentWillReceiveProps( props ){
		var valueString = props.value || ""; //? moment( props.value ).format( "D-MMM-YY HH:mm" ) : "";
		var dateValue = props.value ? new Date( props.value ) : null;
		this.setState({
			value: valueString,
			dateValue: dateValue,
		});
	},
	handleStartTimeChange( event, startTime ) {
		this.refs.endTimePicker.openDialog(); //this could be used to override material-ui's stupid text boxes!!
		this.setState( {
			value: "From" + moment( startTime ).format( " LT " ) + "to ",
			startTime
			//dateValue: date,
		} )
	},

	handleEndTimeChange( event, endTime ) {
    let component = this;
		this.setState( {
			value: this.state.value + moment(endTime).format( "LT" ),
			endTime
		}, () => {
			let {value, startTime, endTime} = this.state;
      component.props.onChange(value, startTime, endTime);
    } )
	},

	handleSelect() {
		this.refs.startTimePicker.openDialog();
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
					datepicker  = { true }
				/>

				<div style={{display:"none"}}>

					<TimePicker
						id					= { "start-time-input" }
						ref 				= "startTimePicker"
						className 			= { "time-input" }
						floatingLabelText	= { this.props.placeholder }
						style 				= { {fontSize:"13px"} }
						mode 				= "landscape"
						onChange 			= { this.handleStartTimeChange }
					/>

					<TimePicker
						id 					= { "end-time-input" }
						ref 				= "endTimePicker"
						className 			= { "time-input" }
						floatingLabelText 	= { this.props.placeholder }
						style 				= { {fontSize:"13px"} }
						mode 				= "landscape"
						onChange 			= { this.handleEndTimeChange }
					/>

				</div>
			</div>
		)
	}
} );

export default StartEndTimePicker
