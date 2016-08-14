import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';
import '../Compliance/ComplianceList.jsx';


ServiceViewDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var data = {};
        data.facility = Session.getSelectedFacility();
        data.team = Session.getSelectedTeam();
        return data;
    },

    deleteRules(serviceName) {
        var services = this.data.facility.servicesRequired;
        var idx=-1;
        for(var i in services) {
            if(services[i].name==serviceName) {
                idx = i;
                break;
            }
        }
        if(idx>=0) {
            services[idx].data.complianceRules = null;
            this.data.facility.setServicesRequired(services);
        }
    },

    render() {
        var facility = this.data.facility;
        if(!facility) 
            return <div/>
        var thumb, services;

        services = _.filter(facility.servicesRequired,(svc)=>{return svc.data&&svc.data.complianceRules&&svc.data.complianceRules.length});
        thumb = "img/services/Building Works.jpg";
        if(services.length) {
            var i = Math.floor(Math.random()*services.length);
            thumb = "img/services/"+services[i].name+".jpg";
        }

        var results = ComplianceEvaluationService.evaluateServices(services);

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
                            <button onClick={()=>{FABActions.createComplianceRule()}} className="btn btn-flat" style={{backgroundColor:"transparent",color:"#fff",padding:"10px 20px 0px 20px"}}>New Rule</button>
                        </div>
                    </div>                    
                </div>

                {services.map((service,idx)=>{
                    return <div key={idx+'-'+service.name} style={{position:"relative"}}>
                        <ServiceListTile item={service}/>
                        <ComplianceGroup item={service}/>
                        <i style={{fontSize:"16px",cursor:"pointer",opacity:"0.4",position:"absolute",right:"5px",top:"5px"}} className="fa fa-trash" onClick={()=>{this.deleteRules(service.name)}}/>
                    </div>
                })}

            </div>
        )}
})
