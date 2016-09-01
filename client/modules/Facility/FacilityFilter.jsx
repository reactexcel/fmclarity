import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

FacilityFilter = React.createClass(
{

    mixins: [ ReactMeteorData ],

    getMeteorData()
    {
        var user = Meteor.user();
        if ( user )
        {
            var team = Session.getSelectedTeam();
            if ( team )
            {
                return {
                    user: user,
                    team: team,
                    facility: Session.getSelectedFacility(),
                    facilities: team.getFacilities()
                }
            }
        }
        return {}
    },

    selectFacility( facility )
    {
        Session.set( "selectedFacility", facility );
    },

    render()
    {
        var facility = this.data.facility;
        return (
            <div style={{position:"absolute",zIndex:1300}}>
                <NavDropDownList
                    items={this.data.facilities} 
                    selectedItem={facility}
                    tile={FacilitySummary}
                    startOpen={false}
                    onChange={this.selectFacility}
                    multiple={true}
                />
            </div>
        )
    }
} )
