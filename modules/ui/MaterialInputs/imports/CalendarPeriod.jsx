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
		return {
			businessHours:businessHours,
			value:(businessHours.length == 0 ?'No Booking Time available':'')
		}
	},

	componentWillReceiveProps( props ){
	    let businessHours = this.testBookableTimeSlot(props.item);
		this.setState({
			businessHours:businessHours,
			value:(businessHours.length == 0 ?'No Booking Time available':'')
		})
	},

	testBookableTimeSlot(items){
		let bookableTimeSlot = null;
		if(items && items.identifier && items.identifier.data){
			if(items.identifier.data.areaDetails && items.identifier.data.areaDetails.daySelector){
				bookableTimeSlot = items.identifier.data.areaDetails.daySelector;
			}
		} else if(items && items.area && items.area.data) {
			if(items.area.data.areaDetails && items.area.data.areaDetails.daySelector){
				bookableTimeSlot = items.area.data.areaDetails.daySelector;
			}
		} else if(items && items.level && items.level.data) {
			if(items.level.data.areaDetails && items.level.data.areaDetails.daySelector){
				bookableTimeSlot = items.level.data.areaDetails.daySelector;
			}
		}

		let businessHours = [];
		if(bookableTimeSlot && bookableTimeSlot.Sun && bookableTimeSlot.Sun.startTime && bookableTimeSlot.Sun.endTime && bookableTimeSlot.Sun.select == true){
			businessHours.push({
				dow: [ 0 ],
				start: moment(bookableTimeSlot.Sun.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Sun.endTime).format("HH:mm")
			})
		} else {
			businessHours.push({
				dow: [ 0 ],
				start: '01:00',
				end: '01:00',
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Mon && bookableTimeSlot.Mon.startTime && bookableTimeSlot.Mon.endTime  && bookableTimeSlot.Mon.select == true){
			businessHours.push({
				dow: [ 1 ],
				start: moment(bookableTimeSlot.Mon.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Mon.endTime).format("HH:mm")
			})
		} else {
			businessHours.push({
				dow: [ 1 ],
				start: '01:00',
				end: '01:00',
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Tue && bookableTimeSlot.Tue.startTime && bookableTimeSlot.Tue.endTime  && bookableTimeSlot.Tue.select == true){
			businessHours.push({
				dow: [ 2 ],
				start: moment(bookableTimeSlot.Tue.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Tue.endTime).format("HH:mm")
			})
		} else {
			businessHours.push({
				dow: [ 2 ],
				start: '01:00',
				end: '01:00',
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Wed && bookableTimeSlot.Wed.startTime && bookableTimeSlot.Wed.endTime  && bookableTimeSlot.Wed.select == true){
			businessHours.push({
				dow: [ 3 ],
				start: moment(bookableTimeSlot.Wed.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Wed.endTime).format("HH:mm")
			})
		} else {
			businessHours.push({
				dow: [ 3 ],
				start: '01:00',
				end: '01:00',
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Thu && bookableTimeSlot.Thu.startTime && bookableTimeSlot.Thu.endTime  && bookableTimeSlot.Thu.select == true){
			businessHours.push({
				dow: [ 4 ],
				start: moment(bookableTimeSlot.Thu.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Thu.endTime).format("HH:mm")
			})
		} else {
			businessHours.push({
				dow: [ 4 ],
				start: '01:00',
				end: '01:00',
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Fri && bookableTimeSlot.Fri.startTime && bookableTimeSlot.Fri.endTime  && bookableTimeSlot.Fri.select == true){
			businessHours.push({
				dow: [ 5 ],
				start: moment(bookableTimeSlot.Fri.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Fri.endTime).format("HH:mm")
			})
		} else {
			businessHours.push({
				dow: [ 5 ],
				start: '01:00',
				end: '01:00',
			})
		}
		if(bookableTimeSlot && bookableTimeSlot.Sat && bookableTimeSlot.Sat.startTime && bookableTimeSlot.Sat.endTime  && bookableTimeSlot.Sat.select == true){
			businessHours.push({
				dow: [ 6 ],
				start: moment(bookableTimeSlot.Sat.startTime).format("HH:mm"),
				end: moment(bookableTimeSlot.Sat.endTime).format("HH:mm")
			})
		} else {
			businessHours.push({
				dow: [ 6 ],
				start: '01:00',
				end: '01:00',
			})
		}
		return businessHours;
	},

	handleSelect() {
		if(this.state.businessHours.length != 0){
			Modal.show( {
				content: <div style={{'padding':'20px'}}><WeeklyCalendar businessHours = {this.state.businessHours} {...this.props}/></div>
			} )
		}
	},

	handleClear() {
		this.setState( {
			value: "",
			businessHours: []
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
