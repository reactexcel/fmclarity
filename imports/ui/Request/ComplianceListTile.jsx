import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import './ComplianceEvaluationService.jsx';

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
    var name, info, results, message;
    switch(rule.type) {
      case "Document exists":
        name = rule.docType+" exists";
        info = ""+rule.docName;
      break;
      case "Document is current":
        name = rule.docType+" document is current";
        info = rule.docName;
      break;
      case "PPM schedule established":
        name = rule.type;
        info = (rule.service?rule.service.name:"");
      break;
      case "PPM event completed":
        name = rule.type;
        info = (rule.event?rule.event.name:"");
      break;
    }
    results = ComplianceEvaluationService.evaluateRule(rule)||{};
    message = results.message||{};
    console.log(results);
    return (
      <div className={"issue-summary"}>
        <div className="issue-summary-col" style={{width:"23%"}}>
          <b>{name}</b>
        </div>
        <div className="issue-summary-col" style={{width:"30%"}}>
          {info}
        </div>
        <div className="issue-summary-col" style={{width:"40%"}}>
          {
            results.passed?
              <span style={{color:"green"}}>
                <b><i className="fa fa-check"/> {message.summary||"passed"}</b>
                {message.detail?": "+message.detail:""}
              </span>
            :
              <span style={{color:"red"}}>
                <b><i className="fa fa-exclamation-triangle"/> {message.summary||"failed"}</b>
                {message.detail?": "+message.detail:""}
              </span>
          }
        </div>
      </div>
    )
  }

});