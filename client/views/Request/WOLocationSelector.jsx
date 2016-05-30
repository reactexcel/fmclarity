import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


WOLocationSelector = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var issue, team, facility, area, teamFacilities, facilityAreas;
        issue = this.props.item;
        if(issue) {
            team = issue.getTeam();
            if(team) {
                teamFacilities = team.getFacilities();
            }
            facility = issue.getFacility();
            if(facility) {
                area = issue.getArea();
                facilityAreas = facility.getAreas();
            }
        }
        return {
            teamFacilities:teamFacilities,
            selectedFacility:facility,
            facilityAreas:facilityAreas,
            selectedArea:area,
        }
    },

    handleChange(field,value) {
        this.props.issue[field] = value;
        this.props.issue.save();
    },

    render() {
        var request = this.props.item;
        var facility = this.data.selectedFacility;
        var facilityAreas = this.data.facilityAreas;
        var area = this.data.selectedArea;
        return (
            <div id="location-region" className="row" style={{minHeight:"37px"}}>

            
                <div className="col-md-3">
                    <div className="row">
                        <div className="col-md-12">
                            <SuperSelect 
                                readOnly={!request.canSetFacility()}
                                items={this.data.teamFacilities} 
                                itemView={ContactViewName}
                                onChange={request.setFacility.bind(request)}
                            >
                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!facility?"Select":""} facility</span>
                            </SuperSelect>
                            {facility?
                                <div style={{clear:"both"}}>{facility.getName()}</div>
                            :null}
                        </div>
                    </div>
                </div>

                {facility?
                <div className="col-md-3">
                    <div className="row">
                        <div className="col-md-12">
                            <SuperSelect 
                                readOnly={!request.canSetArea()}
                                itemView={ContactViewName}
                                items={facilityAreas} 
                                onChange={request.setArea.bind(request)}
                            >
                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!request.level||!request.level.name?"Select":""} area</span>
                            </SuperSelect>
                            {request.level?
                                <div style={{clear:"both"}}>{request.level.name}</div>
                            :null}
                        </div>
                    </div>
                </div>
                :null}

                {request.level&&request.level.children&&request.level.children.length?
                <div className="col-md-3">
                    <div className="row">
                        <div className="col-md-12">
                            <SuperSelect 
                                readOnly={!request.canSetSubarea()}
                                itemView={ContactViewName}
                                items={request.level.children}
                                onChange={request.setSubarea.bind(request)}
                            >
                                <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!request.area?"Select":""} sub-area</span>
                            </SuperSelect>
                            {request.area?
                                <div style={{clear:"both"}}>{request.area.name}</div>
                            :null}
                            </div>
                        </div>
                </div>
                :null}

                {request.area&&request.area.children&&request.area.children.length?
                <div className="col-md-3">
                    <div className="row">
                        <div className="col-md-12">
                        <SuperSelect 
                            readOnly={!request.canSetAreaIdentifier()}
                            itemView={ContactViewName}
                            items={request.area.children} 
                            onChange={request.setAreaIdentifier.bind(request)}
                        >
                            <span style={{padding:0,lineHeight:1}} className="issue-nav-btn btn btn-flat btn-sm">{!request.area.identifier?"Select":""} identifier</span>
                        </SuperSelect>
                        {request.area.identifier?
                            <div style={{clear:"both"}}>{request.area.identifier.name}</div>
                        :null}
                        </div>
                    </div>
                </div>
                :null}


            </div>
        )
    }
})
