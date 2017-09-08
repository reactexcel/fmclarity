import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import { AutoForm } from '/modules/core/AutoForm';
import LinearProgress from 'material-ui/LinearProgress';

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
    var facility = Session.getSelectedFacility();
    var name, info, results, message, loader;
    switch ( rule.type ) {
      case "Document exists":
        name = rule.docType + " exists";
        info = "" + rule.docName;
        break;
      case "Document is current":
        name = rule.docType + " document is current";
        info = rule.docName;
        break;
      case "PPM exists":
        name = rule.type;
        info = ( rule.service ? rule.service.name : "" );
        break;
      case "PPM event completed":
        name = rule.type;
        info = rule.event.name?rule.event.name:rule.event;
        break;
      case "Compliance level":
        name = rule.type;
        info = "" + rule.docName;
        break;
    }
    results = this.props.results || {}//ComplianceEvaluationService.evaluateRule( rule ) || {};
    message = results.message || {};
    loader = results.loader;
    return { rule, name, info, results, message, loader ,facility }
  },
  getInitialState(){
      return {
          showLoader: false,
      };
  },
  updateList(newState){
      let component = this;
      setTimeout( () => {
          if (component.props.onChange) {
              component.props.onChange();
          }
      },0);
  },
  componentWillRecivesProps(){
          this.setState({
              showLoader: false,
          })
  },
  showModal( rule ) {
    //Need a width option for modals before this can be instantiated
    if ( rule.document && rule.document.query ){
        //let query = JSON.parse(rule.document.query);
        let query = rule.document.query;
        rule.document.query = query;
    }
    if ( rule.docName && !rule.document ) {
        rule.document = {};
        rule.document.name = rule.docName;
        rule.document.type = rule.docType;
        if (rule.docSubType) {
            if ( rule.docType == "Insurance" ) rule.document.insuranceType = rule.docSubType;
            else if ( rule.docType == "Validation Report" ) rule.document.reportType = rule.docSubType;
            else if ( rule.docType == "Confirmation") rule.document.confirmationType = rule.docSubType;
            else if ( rule.docType == "Log") rule.document.logType = rule.docSubType;
            else if ( rule.docType == "Certificate") rule.document.certificateType  = rule.docSubType;
            else if ( rule.docType == "Register") rule.document.registerType  = rule.docSubType;
            else if ( rule.docType == "Registration") rule.document.registrationType  = rule.docSubType;
            else if ( rule.docType == "Procedure") rule.document.procedureType  = rule.docSubType;
        }
        if ( _.contains(serviceDocType, rule.docType) ) rule.document.serviceType = rule.service.name;
    }

    let service = facility.servicesRequired.filter((ser)=> ser!= null && ser.name === rule.service.name)
    rule.service = service[0]
    console.log("1111");
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
    // var loader = this.data.loader;
    return (
      <div className={"issue-summary"}>
        <div className="issue-summary-col" style={{width:"23%"}}>
          <span onClick={()=>{this.showModal(rule)}}>{name}</span>
        </div>
        <div className="issue-summary-col" style={{width:"27%"}}>
          {info}
        </div>
        <div className="issue-summary-col" style={{width:"43%"}}>
          {

            (results.passed?
              <div style={{color:"green", width: "100%", height: "100%"}}>
                <b><i className="fa fa-check"/> {message.summary||"passed"}</b>
                {message.detail?
                    <span>: <span
                        className="resolution-link"
                        onClick={()=>{
                            results.resolve(rule, this.updateList)
                        }}>
                        {results.message.lastCompleted_nextDueDate && !_.isEmpty(results.message.lastCompleted_nextDueDate) ? results.message.lastCompleted_nextDueDate:_.isString(message.detail)?message.detail:message.detail()}
                  </span></span>:null}
              </div>
            :
              <div style={{color:"red", width: "100%", height: "100%"}}>
                <b><i className="fa fa-exclamation-triangle"/> {message.summary||"failed"}</b>
                {
                    message.detail?
                      <span>: <span
                          className="resolution-link"
                          onClick={()=>{
                              results.resolve(rule, this.updateList)
                          }}>
                        { _.isString(message.detail)?message.detail:message.detail()}
                      </span></span>
                    :null
                }
            </div>)
          }
        </div>
      </div>
    )
  }

} );
