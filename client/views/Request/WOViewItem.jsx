import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


IssueSummary = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    var request = this.props.item;
    if(!request) {
      return {
        ready:false
      }
    }
    else {
      // note: in order to reduce the overhead of loading the owner
      // supplier etc - we should denormalise the tables
      // that is to say - any field we want to use in this context
      // get saved directly in the issue doucment (thumbnail etc)
      return {
        ready:true,
        request:request,
        facility:request.getFacility(),
        team:request.getTeam(),
        selectedTeam:Session.getSelectedTeam(),
        owner:request.getOwner(),
        supplier:request.getSupplier(),
        status:request.status,
        timeframe:request.getTimeframe()
      }
    }
  },

  updateField(field) {
    var $this = this;
    // returns a function that modifies 'field'
    return function(event) {
      $this.item[field] = event.target.value;
      $this.saveItem();
    }
  },

  render() {
      if(this.data.ready) {
        var request = this.item = this.data.request;
        var team = this.data.team;
        var facility = this.data.facility;
        var owner = this.data.owner;
        var supplier = this.data.supplier;
        var timeframe = this.data.timeframe;
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
            <span style={{marginRight:"2px"}} className={"label dropdown-label label-"+request.status}>{request.status}</span>
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