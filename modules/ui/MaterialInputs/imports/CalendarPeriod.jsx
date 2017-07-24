/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import {Text} from '/modules/ui/MaterialInputs';
import WeeklyCalendar from './WeeklyCalendar.jsx';

import moment from 'moment';

const CalendarPeriod = React.createClass( {

	getInitialState() {
		let businessHours = this.props.bookingDetails;
		let bookingPeriod = this.props.item.bookingPeriod;

		return {
			businessHours:businessHours.businessHours,
			value:(businessHours.businessHours.length == 0 ?'No Booking Time available':(_.isEmpty(bookingPeriod)?'': moment(bookingPeriod.startTime).format('MMMM Do YYYY, h:mm a') + '  to  ' + moment(bookingPeriod.endTime).format('MMMM Do YYYY, h:mm a'))),
			calendarValue:bookingPeriod,
			previousBookingEvents:businessHours.previousBookingEvents,
			bookingFor:businessHours.bookingFor
		}
	},

	componentWillReceiveProps( props ){
	    let businessHours = props.bookingDetails;
		let bookingPeriod = props.item.bookingPeriod;
		let value,calendarValue;
		if(businessHours.bookingFor == this.state.bookingFor){
			value = (businessHours.businessHours.length == 0 ?'No Booking Time available':(_.isEmpty(bookingPeriod)?'': moment(bookingPeriod.startTime).format('MMMM Do YYYY, h:mm a') + '  to  ' + moment(bookingPeriod.endTime).format('MMMM Do YYYY, h:mm a')))
			calendarValue = bookingPeriod
		} else {
			value = ''
			calendarValue = {}
		}
		this.setState({
			businessHours:businessHours.businessHours,
			value:value,
			calendarValue:calendarValue,
			previousBookingEvents:businessHours.previousBookingEvents,
			bookingFor:businessHours.bookingFor
		})
	},

	/*testBookableTimeSlot(items){

	},*/

	setValue(value){
		if(value != null){
			startTime = moment(value.startTime._d).format('MMMM Do YYYY, h:mm a')
			endTime = moment(value.endTime._d).format('MMMM Do YYYY, h:mm a')
			this.props.onChangeValue({
				startTime:value.startTime._d,
				endTime:value.endTime._d,
			})
		}
	},

	handleSelect() {
		if(this.state.businessHours.length != 0){
			Modal.show( {
				content: <div style={{'padding':'20px'}}>
				            <div className="row">
							    <div className="col-sm-12">
									<WeeklyCalendar
										setValue={(value)=>{
											this.setValue(value)
										}}
										businessHours = {this.state.businessHours}
										calendarValue = {this.state.calendarValue}
										previousBookingEvents = {this.state.previousBookingEvents}
										{...this.props}
									/>
								</div>
								<div className="col-sm-12">
								<div style={ {textAlign:"right", clear:"both", paddingTop:'10px'}}>
									<button
										type 		= "button"
										className 	= "btn btn-flat btn-primary"
										onClick 	= { ( ) => { Modal.hide(); } }
									>
									    {"Submit"}
									</button>
								</div>
								</div>
							</div>
						</div>
			} )
		}
	},

	handleClear() {
		this.setState( {
			value: "",
			businessHours: [],
			previousBookingEvents:[]
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
					readOnly    = { this.state.businessHours.length == 0 ? true : false }
				/>
			</div>
		)
	}
} );

export default CalendarPeriod
