import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


PMPListTile = React.createClass({

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
    var request = this.props.item;
    return (
      <div className={"issue-summary"}>        
        <div className="issue-summary-col" style={{width:"40%"}}>
          {request.name}
        </div>
        <div className="issue-summary-col" style={{width:"15%"}}>
          {`${request.frequency.number||''} ${request.frequency.unit||''}`}
        </div>
        <div className="issue-summary-col" style={{float:"right",width:"35%",padding:"0px"}}>
          <ContactCard item={request.supplier}/> 
        </div>          
      </div>
    )
  }

});