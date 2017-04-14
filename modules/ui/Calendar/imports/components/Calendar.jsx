/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { RequestActions } from '/modules/models/Requests';

/**
 * An ui component that renders a calendar with requests appearing as events.
 * @class           Calendar
 * @memberOf        module:ui/Calendar
 * @param           {object} props
 * @param           {string} props.example
 * @todo            Create "event source" function for events as in http://fullcalendar.io/docs/event_data/events_function/
 */
class Calendar extends React.Component {

    /**
     * Takes the retrieved data and adds events to the calendar
     * @memberOf    module:ui/Calendar.Calendar
     * @private
     */
    _addEvents( { requests } ) {

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
                    allDay: true,
                    request: {
                        _id: request._id,
                        code: request.code,
                        name: request.name
                    }
                    //url:i.getUrl()
                } );
            }
        } );
        $( this.refs.calendar ).fullCalendar( 'removeEventSource', events );
        $( this.refs.calendar ).fullCalendar( 'addEventSource', events );
    }

    /**
     * Add events when component mounts
     * @memberOf    module:ui/Calendar.Calendar
     */
    componentDidMount() {
        this.events = {
            events: []
        };
        $( this.refs.calendar ).fullCalendar( {
            //height:500,
            eventClick( event ) {
                if ( event.request ) {
                    RequestActions.view.run( event.request );
                }
            },
            eventLimit: true,
            header: {
                left: 'prev',
                center: 'title,today',
                right: 'next'
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
            <div ref="calendar"></div>
        )
    }
}

export default Calendar;
