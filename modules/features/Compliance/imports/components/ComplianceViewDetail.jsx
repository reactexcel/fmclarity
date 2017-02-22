import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import ComplianceList from './ComplianceList.jsx';
import ComplianceActions from '../../actions.jsx';


export default ComplianceViewDetail = React.createClass( {

    mixins: [ ReactMeteorData ],
    // currentSetviceTabToShow:0,
    getMeteorData() {
        var data = {};
        data.facility = Session.getSelectedFacility();
        data.team = Session.getSelectedTeam();
        return data;
    },

    getInitialState(){
      return {
        coverImageName: ""
      }
    },
    deleteRules( serviceName ) {
        var services = this.data.facility.servicesRequired;
        var idx = -1;
        for ( var i in services ) {
            if ( services[ i ].name == serviceName ) {
                idx = i;
                break;
            }
        }
        if ( idx >= 0 ) {
            services[ idx ].data.complianceRules = null;
            this.data.facility.setServicesRequired( services );
        }
    },
    loadDefaultRules() {
		let facility = Session.getSelectedFacility();
		let servicesRequired = facility && facility.servicesRequired;
		if( facility ) {
			Meteor.call("Facilities.setupCompliance", facility, DefaultComplianceRule )
		}

	},
    setCoverImage( event, service ) {
      if ( this.state.coverImageName !== service.name ){
        this.setState({
          coverImageName: service.name || "",
        })
      }
    },
    removeComplianceRule(servicePosition, rulePosition, serviceName ) {
        let facility = this.data.facility;
        facility.removeComplianceRule(servicePosition, rulePosition, serviceName);
    },
//
    // handelCollaps(  idx ) {
    //     let currentSetviceTabToShow = this.currentSetviceTabToShow;
    //         $.("div.serviceTabHeader").each( function() {
    //             if ( $(this).attr("id") == idx )
    //                 $(this).show();
    //             else
    //                 $(this).hide();
    //         } );
    // },

    render() {
        var facility = this.data.facility;
        if ( !facility )
            return <div/>
        var thumb, services;

        services = _.filter( facility.servicesRequired, ( svc ) => {
            return svc.data && svc.data.complianceRules && svc.data.complianceRules.length } );
        thumb = "img/services/Building Works.jpg";
        if ( services.length && !this.state.coverImageName ) {
            // var i = Math.floor( Math.random() * services.length );
            // thumb = "img/services/" + services[ i ].name + ".jpg";
            thumb = "img/services/" + services[ 0 ].name + ".jpg";
        } else {
          thumb = "img/services/" + this.state.coverImageName + ".jpg";
        }

        var results = ComplianceEvaluationService.evaluateServices( services );

        return (
            <div className="facility-card" style={{background:"#fff",color:"#333"}}>

                <div className="contact-thumbnail">
                    {thumb?
                    <div className="cover-image" style={{backgroundImage:"url('"+thumb+"')"}}/>
                    :null}
                    <div className="title-padding"/>
                    <div className="title-overlay" style={{overflow:"hidden",padding:"0px"}}>
                        <div className="facility-title" style={{float:"left",padding:"20px"}}>
                            <h2 style={{margin:0}}>{facility.name}</h2>
                            <b style={{color:results.passed?'green':'red'}}>{results.percentRulesPassed}% Compliant</b><br/>
                            <span>{results.numRulesFailed} non-compliant items</span><br/>
                            <span>{results.servicesFailed} non-compliant services</span>
                        </div>
                        <div style={{textAlign:"right"}}>
                            <button onClick     = { ()=>{ ComplianceActions.createRule.run() } }
                                    className   = "btn btn-flat"
                                    style       = { { backgroundColor:"transparent",color:"#fff",padding:"10px 20px 0px 20px" } }
                            >
                                New Rule
                            </button>

                            <button
                                style       = { { backgroundColor:"transparent",color:"#fff",padding:"10px 20px 0px 20px" } }
                                className="btn btn-flat"
                                onClick={this.loadDefaultRules}>
                                {`load default rules`}
                            </button>
                        </div>
                    </div>
                </div>

                {services.map((service,idx)=>{
                    return <div key={idx+'-'+service.name} style={{position:"relative"}} onClick={() => this.handelCollaps(idx)}>
                        <ServiceListTile item={service}
                          onClick={( event) => {
                            this.setCoverImage( event, service );
                          }}/>
                      <div id={idx} className="serviceTabHeader">
                          <ComplianceGroup item={service}
                            onClick={( event) => {
                              this.setCoverImage( event, service );
                            }}
                            removeComplianceRule={( rulePosition ) => this.removeComplianceRule( idx, rulePosition, service.name )}
                            />
                      </div>
                        <i style={{fontSize:"16px",cursor:"pointer",opacity:"0.4",position:"absolute",right:"5px",top:"5px"}} className="fa fa-trash" onClick={()=>{this.deleteRules(service.name)}}/>
                    </div>
                })}

            </div>
        )
    }
} )
