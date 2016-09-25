/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { Requests } from '/modules/models/Requests';

/**
 * An ui component that renders a calendar with requests appearing as events.
 * @class           Calendar
 * @memberOf        module:ui/Calendar
 * @param           {object} props
 * @param           {string} props.example
 * @todo            Create "event source" function for events as in http://fullcalendar.io/docs/event_data/events_function/
 */
const Calendar = React.createClass( {

    mixins: [ ReactMeteorData ],

    /**
     * Reactively retrieves required data from Meteor/Mongo.
     * @memberOf    module:ui/Calendar.Calendar
     * @todo        Should be converted to createContainer implementation
     */
    getMeteorData() {
        let user = Meteor.user(),
            team = null,
            requests = null;

        if ( user != null ) {

            team = Session.getSelectedTeam();
            if ( team != null ) {
                let query = {
                    "team._id": team._id,
                    status: { $in: [ Requests.STATUS_NEW, Requests.STATUS_ISSUED, "PMP" ] }
                };

                /*query.dueDate = {
                    $gte:moment().startOf('month').toDate(),
                    $lte:moment().endOf('month').toDate()
                }*/
                requests = user.getRequests( query, { expandPMP: true } );
            }
        }
        console.log( { team, requests } );
        return { requests };
    },

    /**
     * Takes the retrieved data and adds events to the calendar
     * @memberOf    module:ui/Calendar.Calendar
     * @private
     */
    _addEvents( data ) {
        let { requests } = data;

        if ( requests == null ) {
            return;
        }

        var colors = {
            "Scheduled": "#70aaee",
            "Standard": "#0152b5",
            "Urgent": "#f5a623",
            "Critical": "#d0021b",
            "Closed": "#000000"
        };

        var events = this.events.events;
        events.length = 0;
        requests.map( ( request ) => {
            if ( request.dueDate ) {
                events.push( {
                    title: `#${request.code} ${request.name}`,
                    color: colors[ request.priority ],
                    start: request.dueDate,
                    allDay: true,
                    request
                    //url:i.getUrl()
                } );
            }
        } );
        $( this.refs.calendar ).fullCalendar( 'removeEventSource', events );
        $( this.refs.calendar ).fullCalendar( 'addEventSource', events );
    },

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
                    QuickActions.viewRequest( event.request );
                }
            },
            eventLimit: true,
            header: {
                left: 'prev',
                center: 'title,today',
                right: 'next'
            }
        } );
        this._addEvents( this.data );
    },


    /**
     * Add events when component updates
     * @memberOf    module:ui/Calendar.Calendar
     */
    componentDidUpdate() {
        this._addEvents( this.data );
    },

    /**
     * Render the component
     * @memberOf    module:ui/Calendar.Calendar
     */
    render() {
        return (
            <div ref="calendar"></div>
        )
    }

} )

export default Calendar;
