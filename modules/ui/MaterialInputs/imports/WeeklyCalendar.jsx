
import React from "react";
import moment from 'moment';

const WeeklyCalendar = React.createClass( {

	getInitialState() {
		return {
			value:null
		}
	},

	_onTimeSlotAllotment(event, delta, revertFunc){
		let self = this;
		let bookedEvent = this.events.events;
		let getCurrentTime = {};
		let bookingStartTime = event.start._d
			bookingStartTime = moment(bookingStartTime).subtract({hours:5,minutes:30})
			getCurrentTime.startTime = bookingStartTime._d;
		let bookingEndTime = event.end._d
			bookingEndTime = moment(bookingEndTime).subtract({hours:5,minutes:30})
			getCurrentTime.endTime = bookingEndTime._d;
			bookingStartTime = new Date(bookingStartTime).getTime()
			bookingEndTime = new Date(bookingEndTime).getTime()

		let ableToBook = true
		for(i in bookedEvent){
			if(bookedEvent[i].id != event.id){
				let eventStartTime = new Date( bookedEvent[i].start ).getTime();
				let eventEndTime = new Date( bookedEvent[i].end).getTime();
				if(eventStartTime <= bookingStartTime && bookingStartTime < eventEndTime){
					ableToBook =  false;
				} else if(eventStartTime < bookingEndTime && bookingEndTime <= eventEndTime){
					ableToBook =  false;
				} else if(eventStartTime <= bookingStartTime && bookingEndTime <= eventEndTime){
					ableToBook =  false;
				} else if(eventStartTime > bookingStartTime && bookingEndTime > eventEndTime){
					ableToBook =  false;
				} else {
					ableToBook =  true;
					if(this.props.areaDetails.bookingAdvanceDay && this.props.areaDetails.bookingAdvanceDay != "" && !_.contains( [ 'manager', 'fmc support', 'portfolio manager', 'caretaker' ], Meteor.user().getRole() )){
						ableToBook = this.checkBookingOnThisDay(getCurrentTime,this.props.areaDetails)
					}
					if(ableToBook == false){
						Bert.alert({
			  				title: 'Oops, Operation not allowed',
			  				message: "Unable to book. You are able to book atleast "+ self.props.areaDetails.bookingAdvanceDay +" "+ self.props.areaDetails.unit+ " before.",
			  				type: 'danger',
			  				style: 'growl-top-right',
			  				icon: 'fa-ban'
						});
					}
				}
			}
			if( ableToBook == false ){
				return ableToBook;
			}
		}
		return ableToBook;
	},

	componentWillUnmount(){
		this.props.setValue(this.state.value);
	},

	getCurrentTime(start, end){
		let timedifference = new Date().getTimezoneOffset();
		let s= start._d
			s_timstamp = s.getTime()
			s_timstamp = s_timstamp + timedifference*60000
			startTime = new Date(s_timstamp)
		let e= end._d
			e_timstamp = e.getTime()
			e_timstamp = e_timstamp + timedifference*60000
			endTime = new Date(e_timstamp)
			return {
				startTime:startTime,
				endTime:endTime
			}
	},

	checkBookingOnThisDay(getCurrentTime,areaDetails){
		if(areaDetails.unit == "Hours"){
			if( moment().diff(getCurrentTime.startTime, 'hours') <= (0-areaDetails.bookingAdvanceDay) && moment().diff(getCurrentTime.endTime, 'hours') <= (0-areaDetails.bookingAdvanceDay) ){
				return true;
			}else{
				return false;
			}
		}
		if( areaDetails.unit == "Days"){
			if( moment().diff(getCurrentTime.startTime, 'days') <= (0 - areaDetails.bookingAdvanceDay) && moment().diff(getCurrentTime.endTime, 'days') <= (0 - areaDetails.bookingAdvanceDay) ){
				return true;
			}else{
				return false;
			}
		}
		if( areaDetails.unit == "Weeks"){
			if( moment().diff(getCurrentTime.startTime, 'weeks') <= (0 - areaDetails.bookingAdvanceDay) && moment().diff(getCurrentTime.endTime, 'weeks') <= (0 - areaDetails.bookingAdvanceDay) ){
				return true;
			}else{
				return false;
			}
		}
		if( areaDetails.unit == "Months"){
			if( moment().diff(getCurrentTime.startTime, 'months') <= (0 - areaDetails.bookingAdvanceDay) && moment().diff(getCurrentTime.endTime, 'months') <= (0 - areaDetails.bookingAdvanceDay) ){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	},

    componentDidMount() {
		var date = new Date();
  		var d = date.getDate();
  		var m = date.getMonth();
  		var y = date.getFullYear();
		var self = this;
        var businessHours = this.props.businessHours;
		self.events = {
            events: []
        };
        let calendarEvents = self.events.events;
		if( !_.isEmpty(this.props.calendarValue)){
			calendarEvents.push({
				id:0,
				title: 'Your Booking',
				start: moment(this.props.calendarValue.startTime),
				end: moment(this.props.calendarValue.endTime),
				allDay: false,
				editable:true,
				overlap:false,
				tooltip: 'Your Booking'
    		})
		}
        businessHours.map( ( slot ) => {
            calendarEvents.push({
      			start: '00:00',
      			end: slot.start,
                tooltip:"Time Slot not available",
      			allDay: false,
      			editable:false,
				color:"#E0E0E0",
                dow: slot.dow,
                type:'unAvailable'
    		})
			if(slot.showSecondEvent == true){
				calendarEvents.push({
	      			start: slot.end,
	      			end: '24:00',
	                tooltip:"Time Slot not available",
	      			allDay: false,
	      			editable:false,
					color:"#E0E0E0",
	                dow: slot.dow,
	                type:'unAvailable'
	    		})
			}
        })
		calendarEvents = calendarEvents.concat(this.props.previousBookingEvents)
        $("#bookingCalendar").fullCalendar( {
			height:400,
			defaultView:'agendaWeek',
			editable: true,
			droppable: true,
			selectable: true,
			selectHelper: true,
            allDaySlot:false,
			header: {
                left: 'prev',
                center: 'title,today',
                right: 'next'
            },
			selectOverlap: false,
		    events: calendarEvents,
			select: function(start, end, ev) {
				let startTime = start._d
				let endTime = end._d
				let timeDiff = new Date(endTime).getTime() - new Date(startTime).getTime()
				let getCurrentTime = self.getCurrentTime(start, end)
					startTime = moment(startTime)
					startTime._d = getCurrentTime.startTime
					endTime = moment(endTime)
					endTime._d = getCurrentTime.endTime
				if(moment(startTime._d).isBefore(moment(new Date()))) {
	 				$('#bookingCalendar').fullCalendar('unselect');
					Bert.alert({
		  				title: 'Operation not allowed',
		  				message: 'Event date is in the past.',
		  				type: 'danger',
		  				style: 'growl-top-right',
		  				icon: 'fa-ban'
					});
				}else{
					let bookable = true;
					if(self.props.areaDetails.bookingAdvanceDay && self.props.areaDetails.bookingAdvanceDay != "" && !_.contains( [ 'manager', 'fmc support', 'portfolio manager', 'caretaker' ], Meteor.user().getRole() )){
						bookable = self.checkBookingOnThisDay(getCurrentTime,self.props.areaDetails)
					}
					if( bookable == false ){
						$('.fc-time-grid-event').css('display','none');
						$('#bookingCalendar').fullCalendar( 'refetchEvents' );
						Bert.alert({
			  				title: 'Oops, Operation not allowed',
			  				message: "Unable to book. You are able to book atleast "+ self.props.areaDetails.bookingAdvanceDay +" "+ self.props.areaDetails.unit+ " before.",
			  				type: 'danger',
			  				style: 'growl-top-right',
			  				icon: 'fa-ban'
						});
					}else{
					/*if(timeDiff>1800000){
	        			$("#bookingCalendar").fullCalendar('unselect');
	      			} else {*/
						startTime = moment(startTime)
						startTime._d = getCurrentTime.startTime
						endTime = moment(endTime)
						endTime._d = getCurrentTime.endTime
						let newEvent = {
							id:0,
							title: 'Your Booking',
			      			start: startTime,
			      			end: endTime,
			      			allDay: false,
			      			editable:true,
							overlap:false,
							tooltip: 'Your Booking'
						}
						$('#bookingCalendar').fullCalendar('removeEvents',0);
						$('#bookingCalendar').fullCalendar( 'refetchEvents' );
						$( "#bookingCalendar" ).fullCalendar( 'addEventSource', [newEvent] );
						$('#bookingCalendar').fullCalendar( 'refetchEvents' );
						self.setState({
							value:{
								startTime:startTime,
								endTime:endTime,
							}
						})
					}
				}
    		},
    		eventClick: function(event) {
    		},
    		eventDrop: function (event, delta, revertFunc) {
				let getCurrentTime = self.getCurrentTime(event.start,event.end)
				let startTime = event.start._d
					startTime = moment(startTime)
					startTime._d = getCurrentTime.startTime
				let endTime = event.end._d
					endTime = moment(endTime)
					endTime._d = getCurrentTime.endTime
				if(moment(startTime._d).isBefore(moment(new Date()))) {
					revertFunc();
			        Bert.alert({
						  title: 'Operation not allowed',
						  message: 'Event date is in the past.',
						  type: 'danger',
						  style: 'growl-top-right',
						  icon: 'fa-ban'
						});
			    }else{
					let value = self._onTimeSlotAllotment(event, delta, revertFunc);
					if(value == false){
						revertFunc();
					} else {
						self.setState({
							value:{
								startTime:startTime,
								endTime:endTime,
							}
						})
					}
				}
    		},
			eventResize: function(event, delta, revertFunc) {
				if(moment(event.start._d).isBefore(moment(new Date()))) {
					revertFunc();
			        Bert.alert({
						  title: 'Operation not allowed',
						  message: 'Event date is in the past.',
						  type: 'danger',
						  style: 'growl-top-right',
						  icon: 'fa-ban'
						});
			    }else{
					let value = self._onTimeSlotAllotment(event, delta, revertFunc);
					if(value == false){
						revertFunc();
					} else {
						let getCurrentTime = self.getCurrentTime(event.start,event.end)
						let startTime = event.start._d
						    startTime = moment(startTime)
							startTime._d = getCurrentTime.startTime
						let endTime = event.end._d
							endTime = moment(endTime)
							endTime._d = getCurrentTime.endTime
						self.setState({
							value:{
								startTime:startTime,
								endTime:endTime,
							}
						})
					}
				}
    		},
            eventAfterRender: function(event, element, view) {
                    $(element).css('width','105%');
					$(element).css('left','-2px');
            },
            eventMouseover: function(data, event, view){
                let tooltip;
				if(data.tooltip != undefined){
                    tooltip = '<div class="tooltiptopicevent" style="color:white;width:auto;height:auto;background:black;opacity: 0.7;position:absolute;z-index:10001;padding:5px 5px 5px 5px;line-height: 200%;">' + data.tooltip + '</div>';
                    $("body").append(tooltip);
                    $(this).mouseover(function (e) {
                        $(this).css('z-index', 10000);
                        $('.tooltiptopicevent').fadeIn('500');
                        $('.tooltiptopicevent').fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $('.tooltiptopicevent').css('top', e.pageY + 10);
                        $('.tooltiptopicevent').css('left', e.pageX + 20);
                    });
				}
            },
            eventMouseout: function (data, event, view) {
                $(this).css('z-index', 0);
                $('.tooltiptopicevent').remove();
            }
        } );
    },

    componentWillReceiveProps( newProps ) {
    },

    render() {
        return (
            <div ref="bookingCalendar" id="bookingCalendar"></div>
        )
    }
} );

export default WeeklyCalendar;
