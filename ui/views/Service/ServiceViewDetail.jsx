import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';
import '../../../imports/ui/Request/ComplianceList.jsx';


ServiceViewDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        var data = {};
        data.facility = Session.getSelectedFacility();
        data.team = Session.getSelectedTeam();
        data.suppliers = data.facility.getSuppliers();
        return data;
    },

    createRule(newRule) {
        console.log(newRule);
        var facility = newRule.facility;
        if(facility) {
            var services = facility.servicesRequired;
            //get index of the selected service
            var idx=-1;
            for(var i in services) {
                if(services[i].name==newRule.service.name) {
                    idx = i;
                    break;
                }
            }
            if(idx>=0) {
                var service = services[idx];
                console.log({service,idx});
                if(!service.data) {
                    service.data = {};
                }
                if(!service.data.complianceRules) {
                    service.data.complianceRules = [];
                }
                //to avoid circular search remove facility and then add with just name and _id
                var copy = _.omit(newRule,'facility','service','event');
                if(newRule.facility) {
                    copy.facility = _.pick(newRule.facility,'name','_id');
                }
                if(newRule.event) {
                    copy.event = _.pick(newRule.event,'name','_id');
                }
                if(newRule.service) {
                    copy.service = _.pick(newRule.service,'name');
                }
                //console.log(copy);
                service.data.complianceRules.push(copy);
                services[idx] = service;
            }
            facility.setServicesRequired(services);
        }
        Modal.hide();
    },

    handleCreateRuleClick() {
        Modal.show({
            content:<AutoForm 
                item={{
                    facility:this.data.facility,
                    service:this.props.item
                }}
                schema={ComplianceRuleSchema} 
                onSubmit={this.createRule}
            />
        })
    },

    render() {

        var facility = this.data.facility;
        var team = this.data.team;
        var suppliers = this.data.suppliers;
        var service = this.props.item;

        var thumb = "img/services/"+service.name+".jpg";
        var address;

        var thumb, createdAt, contact, contactName;
        if(facility) {
            createdAt = moment(facility.createdAt).format();
            contact = facility.getPrimaryContact();
            if(contact) {
                contactName = contact.getName();
                contact = contact.getProfile();
            }
        }

        //IpsoTabs content needs slimscroll applied
        //IpsoTabs should be renamed... TabPanel?
        return (
            <div className="facility-card">

                <div className="contact-thumbnail">
                    {thumb?
                    <div className="cover-image" style={{backgroundImage:"url('"+thumb+"')"}}/>
                    :null}
                    <div className="title-padding"/>
                    <div className="title-overlay" style={{overflow:"hidden",padding:"0px"}}>
                        <div className="facility-title" style={{float:"left",padding:"20px"}}>
                            <h2 style={{margin:0}}>{service.name}</h2>
                            {address?<b>{address}</b>:null}
                        </div>
                        <button onClick={this.handleCreateRuleClick} className="btn btn-flat" style={{float:"right",backgroundColor:"transparent",color:"#fff",padding:"10px 20px 0px 20px"}}>New Rule</button>
                    </div>                    
                </div>


                <IpsoTabso tabs={[
                    {
                        tab:        <span id="pmp-tab"><span style={{color:"white"}}>Compliance</span></span>,
                        content:    <ComplianceGroup item={service}/>
                    }
                ]} />                
            </div>
        )}
})
