import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import { Issues } from '/modules/models/Requests';

//todo - create "event source" function for events as in http://fullcalendar.io/docs/event_data/events_function/

export default Calendar = React.createClass( {

    mixins: [ ReactMeteorData ],

    getMeteorData() {
        let user = Meteor.user(),
            team = null,
            requests = null;

        if ( user != null ) {

            team = Session.getSelectedTeam();
            if ( team != null ) {
                let query = {
                    "team._id": team._id,
                    status: { $in: [ Issues.STATUS_NEW, Issues.STATUS_ISSUED, "PMP" ] }
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

    addEvents() {
        let { requests } = this.data;

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
        this.addEvents();
    },

    componentDidUpdate() {
        this.addEvents();
    },

    render() {
        return (
            <div ref="calendar"></div>
        )
    }

} )
