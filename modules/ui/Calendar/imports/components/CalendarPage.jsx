/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
import React from "react";

import { FacilityFilter } from '/modules/models/Facilities';
import Calendar from './Calendar.jsx';

/**
 * @class           CalendarPage
 * @memberOf        module:ui/Calendar
 */
const CalendarPage = React.createClass( {
    mixins: [ ReactMeteorData ],

    getMeteorData() {
        Meteor.subscribe( 'Teams' );
        Meteor.subscribe( 'Users' );
        Meteor.subscribe( 'Facilities' );
        Meteor.subscribe( 'Requests' );
        Meteor.subscribe( 'Files' );
        return {
            team: Session.getSelectedTeam(),
            facility: Session.getSelectedFacility()
        }
    },

    render() {
        let { team, facility } = this.data;
        if( !team ) {
            return <div/>
        }
        return (
            <div className = "animated fadeIn">
                <FacilityFilter items = { team.facilities } selectedItem = { facility } />
                <div style = { {paddingTop:"50px 15px 15px 15px"} }>
                    <div className="card-body ibox">
                        <Calendar/>
                    </div>
                </div>
            </div>
        )
    }
} )

export default CalendarPage;