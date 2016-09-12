import React from "react";

import { FacilityFilter } from '/both/modules/Facility';
import Calendar from './Calendar.jsx';

export default CalendarPage = React.createClass( {
    mixins: [ ReactMeteorData ],

    getMeteorData() {
        Meteor.subscribe('teamsAndFacilitiesForUser');
        Meteor.subscribe('users');
        Meteor.subscribe('contractors');
        return {
            team: Session.getSelectedTeam(),
            facility: Session.getSelectedFacility()
        }
    },

    render() {
        return (
            <div style={{display:"inline"}}>
            <FacilityFilter team = { this.data.team } facility = { this.data.facility } />
            <div className="i-box" style={{backgroundColor:"#fff", padding:"15px",marginTop:"50px"}}>
                <Calendar/>
            </div>
        </div>
        )
    }
} )
