/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { RequestActions } from '/modules/models/Requests';
import moment from 'moment'

/**
 * An ui component that renders a calendar with requests appearing as events.
 * @class           Calendar
 * @memberOf        module:ui/Calendar
 * @param           {object} props
 * @param           {string} props.example
 * @todo            Create "event source" function for events as in http://fullcalendar.io/docs/event_data/events_function/

 */
const eventt = []

class Calendar extends React.Component {
    /**
     * Takes the retrieved data and adds events to the calendar
     * @memberOf    module:ui/Calendar.Calendar
     * @private
     */
    _addEvents( { requests } ) {
        let calendarView = $('#calendar').fullCalendar('getView');
        let allDays = true;
        if( _.contains(['agendaWeek','agendaDay'],calendarView.name) ){
            allDays = false;
        }
        if ( requests == null ) {
            return;
        }
        var colors = {
            "Scheduled": "#70aaee",
            "Standard": "#0152b5",
            "Urgent": "#f5a623",
            "Critical": "#d0021b",
            "Closed": "#000000",
            "Booking": "#ef6c00",
            "PPM": "#333333",
        };

        var events = this.events.events;
        events.length = 0;

        requests.map( ( request ) => {
            if(request.type=="Booking" && request.bookingPeriod && request.bookingPeriod.startTime && request.bookingPeriod.endTime){
                let title = null;
                if(request.code){
                    title = `#${request.code} ${request.name}`
                }else{
                    title = request.name;
                }
                events.push({
                    title: title,
                    color: colors[ request.priority ],
                    start: request.bookingPeriod.startTime,
                    end: request.bookingPeriod.endTime,
                    allDay: allDays,
                    request: {
                        _id: request._id,
                        code: request.code,
                        name: request.name
                    },
                    tooltip:request.priority
                });
            } else{
                if ( request.dueDate ) {
                    let title = null;
                    if ( request.type == 'Preventative' ) {
                        title = request.name;
                    } else if ( request.code ) {
                        title = `#${request.code} ${request.name}`
                    } else {
                        title = request.name;
                    }
                    events.push( {
                        title: title,
                        color: colors[ request.priority ],
                        start: request.dueDate,
                        allDay: allDays,
                        request: {
                            _id: request._id,
                            code: request.code,
                            name: request.name
                        },
                        tooltip:request.priority
                        //url:i.getUrl()
                    } );
                }
            }

        } );
        this.eventt = events;
        $( '#calendar' ).fullCalendar( 'removeEventSource', events );
        $( '#calendar' ).fullCalendar( 'addEventSource', events );
    }

    /**
     * Add events when component mounts
     * @memberOf    module:ui/Calendar.Calendar
     */
    componentDidMount() {
        let self = this;
        this.events = {
            events: []
        };
        $( '#calendar' ).fullCalendar( {
            //height:500,
            eventClick( event ) {
                if ( event.request ) {
                    RequestActions.view.run( event.request );
                }
            },
            eventLimit: true,
            /*header: {
                left: 'prev',
                center: 'title,today',
                right: 'next'
            }*/
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            defaultView: 'month',
            eventMouseover: function(data, event, view){
                let tooltip;
                    tooltip = '<div class="tooltiptopicevent" style="color:white;width:auto;height:auto;background:black;opacity: 0.7;position:absolute;z-index:10001;padding:5px 5px 5px 5px;line-height: 200%;">' + 'PRIORITY :'+'<b>'+ data.tooltip +'</b>'+ '</div>';
                    $("body").append(tooltip);
                    $(this).mouseover(function (e) {
                        $(this).css('z-index', 10000);
                        $('.tooltiptopicevent').fadeIn('500');
                        $('.tooltiptopicevent').fadeTo('10', 1.9);
                    }).mousemove(function (e) {
                        $('.tooltiptopicevent').css('top', e.pageY + 10);
                        $('.tooltiptopicevent').css('left', e.pageX + 20);
                    });
            },
            eventMouseout: function (data, event, view) {
                $(this).css('z-index', 0);
                $('.tooltiptopicevent').remove();
            },
            viewRender: function(view) {
                //let event = $("#calendar").fullCalendar('clientEvents');
                let event = self.eventt;
                if(event && event.length > 0){
                    event.map( ( evt,id ) => {
                        if((view.name == "agendaWeek" || view.name == "agendaDay")/* && event[id].end == null*/){
                            event[id].allDay = false;
                        }else{
                            event[id].allDay = true;
                        }
                    })
                    self.eventt = event;
                    self._addEvents( self.props );
					$('#calendar').fullCalendar( 'refetchEvents' );
                }
            },
            eventRender: function(event, element) {
                setTimeout(function(){
                    $('.fc-popover').css('max-height','360px');
                    $('.fc-popover').css('overflow','auto');
                    let position = $('.fc-popover').position()
                    if(position){
                        if(position.top < 0 ){
                            $('.fc-popover').css('top','0px');
                        }
                        if(position.left > 300 ){
                            $('.fc-popover').css('left','300px');
                        }
                    }
                }, 10);
            }
        } );
        this._addEvents( this.props );
    }


    /**
     * Add events when component updates
     * @memberOf    module:ui/Calendar.Calendar
     */
    componentDidUpdate() {
        this._addEvents( this.props );
    }

    /**
     * Render the component
     * @memberOf    module:ui/Calendar.Calendar
     */
    render() {
        return (
            <div ref="calendar" id="calendar"></div>
        )
    }
}

export default Calendar;
