import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


IssueSummary = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    var request,facility,team,selectedTeam,owner,supplier,status,timeframe;
    request = this.props.item;
    selectedTeam = Session.getSelectedTeam();
    if(request) {
      facility = request.facility;
      team = request.team;
      owner = request.owner;
      supplier = request.supplier;
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

  render() {
      var request = this.item = this.data.request;
      if(request) {
        var team = this.data.team;
        var facility = this.data.facility;
        var owner = this.data.owner;
        var supplier = this.data.supplier;
        var dueDate = request.dueDate?moment(request.dueDate):null;
        var issuedDate = request.issuedAt?moment(request.issuedAt):null;
        var selectedTeam = this.data.selectedTeam;
        return (
        <div className={"issue-summary issue-status-"+status}>
          
          <div className="issue-summary-col issue-summary-col-1">
            <IssuePriority issue={request} />
            {/*<ContactAvatarSmall item={owner} />*/}
          </div>
          <div className="issue-summary-col issue-summary-col-2">
            <span className={"label dropdown-label label-"+request.status}>{request.status}</span>
          </div>
          {/*
          <div className="issue-summary-col issue-summary-col-2">
            <ContactAvatarSmall item={team} />
          </div>
          */}
          <div className="issue-summary-col issue-summary-col-3">
            <span className="issue-summary-facility-name">
              {facility?facility.name:null}
            </span>
          </div>
          <div className="issue-summary-col issue-summary-col-4">
            {(selectedTeam&&selectedTeam.type=="contractor")?
            <span className="issue-summary-name">{team?team.name:''}</span>
            :<span className="issue-summary-name">{supplier?supplier.name:''}</span>
            }
          </div>
          <div className="issue-summary-col issue-summary-col-5">
            {dueDate&&request.status!=Issues.STATUS_CLOSED?
              <span className={dueDate.isBefore()?"text-overdue":""}>{dueDate.fromNow()}</span>
            :null}
          </div>          
          <div className="issue-summary-col issue-summary-col-6">
            {issuedDate?
              <span>{issuedDate.format("MMM Do, h:mm a")}</span>
            :null}
          </div>
          <div className="issue-summary-col issue-summary-col-7">
            <span className="issue-summary-name"><span style={{color:"#999"}}>#{request.code} </span>{request.name}</span>
            {/*<span className="issue-summary-description">{issue.description}</span>*/}
          </div>
        </div>
      )
    }
  }

});