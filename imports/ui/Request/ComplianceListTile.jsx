import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


ComplianceListTile = React.createClass({

  /*
  mixins: [ReactMeteorData],

  getMeteorData() {
    var request,facility,team,selectedTeam,owner,supplier,status,timeframe;
    request = this.props.item;
    selectedTeam = Session.getSelectedTeam();
    if(request) {
      facility = request.getFacility();
      team = request.getTeam();
      owner = request.getOwner();
      supplier = request.getSupplier();
      status = request.status;
    }
    return {
      request:request,
      facility:facility,
      team:team,
      selectedTeam:selectedTeam,
      owner:owner,
      supplier:supplier,
      status:status,
    }
  },
  */
  render() {
    var rule = this.props.item;
    return (
      <div className={"issue-summary"}>
        <div className="issue-summary-col" style={{width:"10%",fontSize:"20px",lineHeight:"0px"}}>
          <i className="fa fa-check"/>
        </div>
        <div className="issue-summary-col" style={{width:"28%"}}>
          {rule.service}
        </div>
        <div className="issue-summary-col" style={{width:"28%"}}>
          {rule.name}
        </div>
        <div className="issue-summary-col" style={{width:"28%"}}>
          {rule.type}
        </div>
      </div>
    )
  }

});