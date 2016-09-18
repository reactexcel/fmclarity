import React from "react";

import { FacilityFilter } from '/modules/models/Facilities';
import Calendar from './Calendar.jsx';

export default CalendarPage = React.createClass( {
    mixins: [ ReactMeteorData ],

    getMeteorData() {
        Meteor.subscribe( 'Teams' );
        Meteor.subscribe( 'Users' );
        Meteor.subscribe( 'Facilities' );
        Meteor.subscribe( 'Requests' );
        return {
            team: Session.getSelectedTeam(),
            facility: Session.getSelectedFacility()
        }
    },

    render() {
        return (
            <div className = "animated fadeIn">

                <FacilityFilter team = { this.data.team } facility = { this.data.facility } />

                <div className = "i-box" style = { {backgroundColor:"#fff", padding:"15px",marginTop:"50px"} }>
                    <Calendar/>
                </div>

            </div>
        )
    }
} )
