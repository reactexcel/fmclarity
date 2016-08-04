import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityFilter = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var user = Meteor.user();
        if(user) {
            var team = Session.getSelectedTeam();
            if(team) {
                return {
                    user : user,
                    team : team,
                    facility : Session.getSelectedFacility(),
                    facilities : team.getFacilities()
                }
            }
        }
        return {}
    },

    selectFacility(facility) {
        Session.set("selectedFacility",facility);
    },

    render() {
        var facility = this.data.facility;
        return (
            <SuperSelect 
                items={this.data.facilities} 
                itemView={NameCard}
                onChange={this.selectFacility}
                clearOption={{name:"All facilities"}}
            >
            {
                facility?
                <div style={{whiteSpace:"nowrap",fontSize:"16px",lineHeight:"48px",paddingLeft:"16px"}}>
                	{this.props.title?<span style={{color:"#333",fontWeight:"bold",fontSize:"16px"}}>{this.props.title} for </span>:null}
                    <span className="nav-label">{facility.getName()} <i className="fa fa-caret-down"></i></span>
                </div>
                :
                <div style={{whiteSpace:"nowrap",fontSize:"16px",lineHeight:"48px",paddingLeft:"16px"}}>
                	{this.props.title?<span style={{color:"#333",fontWeight:"bold",fontSize:"16px"}}>{this.props.title} for </span>:null}
                    <span className="nav-label">all facilities <i className="fa fa-caret-down"></i></span>
                </div>
            }
            </SuperSelect>
        )}
})