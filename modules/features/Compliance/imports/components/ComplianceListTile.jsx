import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { AutoForm } from '/modules/core/AutoForm';

import '../services/ComplianceEvaluationService.jsx';

const serviceDocType = [
    "Audit",
    "Contract",
    "Inspection",
    "Invoice",
    "MSDS",
    "Plan",
    "Procedure",
    "Quote",
    "Register",
    "Registration",
    "Service Report",
    "SWMS",
];
export default ComplianceListTile = React.createClass( {

  mixins: [ ReactMeteorData ],

  getMeteorData() {
    var rule = this.props.item;
    var name, info, results, message;
    switch ( rule.type ) {
      case "Document exists":
        name = rule.docType + " exists";
        info = "" + rule.docName;
        break;
      case "Document is current":
        name = rule.docType + " document is current";
        info = rule.docName;
        break;
      case "PPM schedule established":
        name = rule.type;
        info = ( rule.service ? rule.service.name : "" );
        break;
      case "PPM event completed":
        name = rule.type;
        info = rule.event.name?rule.event.name:rule.event;
        break;
    }
    results = ComplianceEvaluationService.evaluateRule( rule ) || {};
    message = results.message || {};

    return { rule, name, info, results, message }
  },

  showModal( rule ) {
    //Need a width option for modals before this can be instantiated
    if ( rule.document && rule.document.query ){
        let query = JSON.parse(rule.document.query);
        rule.document.query = query;
    }
    if ( rule.docName && !rule.document ) {
        rule.document = {};
        rule.document.name = rule.docName;
        rule.document.type = rule.docType;
        if (rule.docSubType) {
            if ( rule.docType == "Insurance" ) rule.document.insuranceType = rule.docSubType;
            else if ( rule.docType == "Validation Report" ) rule.document.reportType = rule.docSubType;
            else if ( _.contains(['Bunding', 'Manifest', 'Signage', 'Spill bins'], rule.docType) )
                rule.document.confirmationType = rule.docSubType;
            else if ( _.contains(serviceDocType, rule.docType) )
                rule.document.serviceType = rule.docSubType;
        }
    }
    Modal.show( {
      content: <AutoForm
            item = { rule }
            form = { ComplianceRuleSchema }
            onSubmit={ ( updatedRule ) => {
                Modal.hide();
                if(this.props.onUpdate) this.props.onUpdate( updatedRule );
            } }
        >
            <h2>Edit Compliance Rule</h2>
        </AutoForm>,
    } )
  },

  render() {
    var rule = this.data.rule;
    var name = this.data.name;
    var message = this.data.message
    var results = this.data.results;
    var info = this.data.info;
    return (
      <div className={"issue-summary"}>
        <div className="issue-summary-col" style={{width:"23%"}}>
          <b onClick={()=>{this.showModal(rule)}}>{name}</b>
        </div>
        <div className="issue-summary-col" style={{width:"30%"}}>
          {info}
        </div>
        <div className="issue-summary-col" style={{width:"40%"}}>
          {
            results.passed?
              <span style={{color:"green"}}>
                <b><i className="fa fa-check"/> {message.summary||"passed"}</b>
                {message.detail?
                    <span>: <span className="resolution-link" onClick={()=>{results.resolve(rule)}}>
                      {message.detail}
                  </span></span>:null}
              </span>
            :
              <span style={{color:"red"}}>
                <b><i className="fa fa-exclamation-triangle"/> {message.summary||"failed"}</b>
                {
                    message.detail?
                      <span>: <span className="resolution-link" onClick={()=>{results.resolve(rule)}}>
                        {message.detail}
                      </span></span>
                    :null
                }
              </span>
          }
        </div>
      </div>
    )
  }

} );
