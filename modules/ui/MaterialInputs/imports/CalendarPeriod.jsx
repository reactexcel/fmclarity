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
		let businessHours = this.testBookableTimeSlot(this.props.item);
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
	    let businessHours = this.testBookableTimeSlot(props.item);
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

	testBookableTimeSlot(items){
		let bookableTimeSlot = null;
		let previousBookingEvents = [];
		let bookingFor = null
		if(items && items.identifier && items.identifier.data){
			if(items.identifier.data.areaDetails && items.identifier.data.areaDetails.daySelector){
				bookableTimeSlot = items.identifier.data.areaDetails.daySelector;
			}
			if(items.identifier.totalBooking){
				items.identifier.totalBooking.map((booking)=>{
					previousBookingEvents.push({
						id:1,
						title:items.identifier.name,
						start:moment(booking.startTime),
						end:moment(booking.endTime),
						allDay:false,
						editable:false,
						color:"#ef6c00",
						overlap:false,
						tooltip:"Already Booked",
					})
				})
			}
			bookingFor = items.identifier.name
		} else if(items && items.area && items.area.data) {
			if(items.area.data.areaDetails && items.area.data.areaDetails.daySelector){
				bookableTimeSlot = items.area.data.areaDetails.daySelector;
			}
			if(items.area.totalBooking){
				items.area.totalBooking.map((booking)=>{
					previousBookingEvents.push({
						id:1,
						title:items.area.name,
						start:moment(booking.startTime),
						end:moment(booking.endTime),
						allDay:false,
						editable:false,
						color:"#ef6c00",
						overlap:false,
						tooltip:"Already Booked",
					})
				})
			}
            bookingFor = items.area.name;
		} else if(items && items.level && items.level.data) {
			if(items.level.data.areaDetails && items.level.data.areaDetails.daySelector){
				bookableTimeSlot = items.level.data.areaDetails.daySelector;
			}
			if(items.level.totalBooking){
				items.level.totalBooking.map((booking)=>{
					previousBookingEvents.push({
						id:1,
						title:items.level.name,
						start:moment(booking.startTime),
						end:moment(booking.endTime),
						allDay:false,
						editable:false,
						color:"#ef6c00",
						overlap:false,
						tooltip:"Already Booked",
					})
				})
			}
			bookingFor = items.level.name;
		}

		let businessHours = [];

        let extra = moment().format('YYYY-MM-DD') + ' ';
		let showSecondEvent = true
		if(bookableTimeSlot && bookableTimeSlot.Sun && bookableTimeSlot.Sun.startTime && bookableTimeSlot.Sun.endTime && bookableTimeSlot.Sun.select == true){
			showSecondEvent = true
			if (moment(bookableTimeSlot.Sun.endTime).isBetween(moment(extra + '00:00'), moment(extra + '01:00'))){
				showSecondEvent = false
			}
			businessHours.push({
				dow: [ 0 ],
				start: moment(bookableTimeSlot.Sun.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Sun.endTime).format("HH:mm"),
				showSecondEvent:showSecondEvent
			})
		} else {
			businessHours.push({
				dow: [ 0 ],
				start: '00:01',
				end: '00:01',
				showSecondEvent:true
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Mon && bookableTimeSlot.Mon.startTime && bookableTimeSlot.Mon.endTime  && bookableTimeSlot.Mon.select == true){
			showSecondEvent = true
			if (moment(bookableTimeSlot.Mon.endTime).isBetween(moment(extra + '00:00'), moment(extra + '01:00'))){
				showSecondEvent = false
			}
			businessHours.push({
				dow: [ 1 ],
				start: moment(bookableTimeSlot.Mon.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Mon.endTime).format("HH:mm"),
				showSecondEvent:showSecondEvent
			})
		} else {
			businessHours.push({
				dow: [ 1 ],
				start: '00:01',
				end: '00:01',
				showSecondEvent:true
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Tue && bookableTimeSlot.Tue.startTime && bookableTimeSlot.Tue.endTime  && bookableTimeSlot.Tue.select == true){
		    showSecondEvent = true
			if (moment(bookableTimeSlot.Tue.endTime).isBetween(moment(extra + '00:00'), moment(extra + '01:00'))){
				showSecondEvent = false
			}
			businessHours.push({
				dow: [ 2 ],
				start: moment(bookableTimeSlot.Tue.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Tue.endTime).format("HH:mm"),
				showSecondEvent:showSecondEvent
			})
		} else {
			businessHours.push({
				dow: [ 2 ],
				start: '00:01',
				end: '00:01',
				showSecondEvent:true
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Wed && bookableTimeSlot.Wed.startTime && bookableTimeSlot.Wed.endTime  && bookableTimeSlot.Wed.select == true){
			showSecondEvent = true
			if (moment(bookableTimeSlot.Wed.endTime).isBetween(moment(extra + '00:00'), moment(extra + '01:00'))){
				showSecondEvent = false
			}
			businessHours.push({
				dow: [ 3 ],
				start: moment(bookableTimeSlot.Wed.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Wed.endTime).format("HH:mm"),
				showSecondEvent:showSecondEvent
			})
		} else {
			businessHours.push({
				dow: [ 3 ],
				start: '00:01',
				end: '00:01',
				showSecondEvent:true
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Thu && bookableTimeSlot.Thu.startTime && bookableTimeSlot.Thu.endTime  && bookableTimeSlot.Thu.select == true){
			showSecondEvent = true
			if (moment(bookableTimeSlot.Thu.endTime).isBetween(moment(extra + '00:00'), moment(extra + '01:00'))){
				showSecondEvent = false
			}
			businessHours.push({
				dow: [ 4 ],
				start: moment(bookableTimeSlot.Thu.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Thu.endTime).format("HH:mm"),
				showSecondEvent:showSecondEvent
			})
		} else {
			businessHours.push({
				dow: [ 4 ],
				start: '00:01',
				end: '00:01',
				showSecondEvent:true
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Fri && bookableTimeSlot.Fri.startTime && bookableTimeSlot.Fri.endTime  && bookableTimeSlot.Fri.select == true){
			showSecondEvent = true
			if (moment(bookableTimeSlot.Fri.endTime).isBetween(moment(extra + '00:00'), moment(extra + '01:00'))){
				showSecondEvent = false
			}
			businessHours.push({
				dow: [ 5 ],
				start: moment(bookableTimeSlot.Fri.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Fri.endTime).format("HH:mm"),
				showSecondEvent:showSecondEvent
			})
		} else {
			businessHours.push({
				dow: [ 5 ],
				start: '00:01',
				end: '00:01',
				showSecondEvent:true
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Sat && bookableTimeSlot.Sat.startTime && bookableTimeSlot.Sat.endTime  && bookableTimeSlot.Sat.select == true){
			showSecondEvent = true
			if (moment(bookableTimeSlot.Sat.endTime).isBetween(moment(extra + '00:00'), moment(extra + '01:00'))){
				showSecondEvent = false
			}
			businessHours.push({
				dow: [ 6 ],
				start: moment(bookableTimeSlot.Sat.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Sat.endTime).format("HH:mm"),
				showSecondEvent:showSecondEvent
			})
		} else {
			businessHours.push({
				dow: [ 6 ],
				start: '00:01',
				end: '00:01',
				showSecondEvent:true
			})
		}
		return {
			businessHours:businessHours,
			previousBookingEvents:previousBookingEvents,
			bookingFor:bookingFor
		};
	},

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
