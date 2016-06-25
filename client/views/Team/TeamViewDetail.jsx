import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

TeamViewDetail = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	var team, messages, suppliers, services, primaryContact, insuranceDocs;
        Meteor.subscribe('contractors');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        team = this.props.item;
        if(team) {
            Meteor.subscribe("messages","Teams",team._id,moment().subtract({days:7}).toDate());
            suppliers = team.getSuppliers();
            primaryContact = team.getPrimaryContact();
            messages = team.getMessages();
            services = team.getAvailableServices();
            insuranceDocs = team.getDocs({type:"Insurance"});
        }
        return {
        	team: team,
        	services: services,
        	primaryContact: primaryContact,
            suppliers: suppliers,
            messages: messages,
            insuranceDocs:insuranceDocs
        }
    },

	render() {
		var team = this.data.team;
	    if(!team) {
	    	return <div/>
	    }

	    // import fields
	    var messages = this.data.messages;
	    var suppliers = this.data.suppliers;
	    var primaryContact = this.data.primaryContact;
	    var insuranceDocs = this.data.insuranceDocs;
	    var availableServices = this.data.services;

	    // calculate contact name
	    var contactName;
	    if(primaryContact) {
	    	contactName = primaryContact.getName();
	    }

	    // calculate insurance expiry (calculations should be going in getMeteorData)
	    var insuranceExpiry;
	    if(insuranceDocs&&insuranceDocs.length) {
	    	var primaryDoc = insuranceDocs[0];
	    	if(primaryDoc.expiryDate!=null) {
		    	insuranceExpiry = moment(primaryDoc.expiryDate).format('DD/MM/YYYY');
		    }
	    }

	    var thumb = team.getThumbUrl();

	    return (
	    <div>
	    	{/*this should be in sub-component*/}
	    	<div className="business-card">{/*should perhaps be team-card?*/}
				<div className="contact-thumbnail pull-left">
					{thumb?
					    <img alt="image" src={team.getThumbUrl()} />
					    :null
					}
				 </div>
				 <div className="contact-info">

					<h2>{team.getName()}</h2>

					<i style={{color:"#999",display:"block",padding:"3px"}}>{contactName?contactName:null}<br/></i>
					<b>Email</b> {team.email}<br/>
					{team.phone?<span><b>Phone</b> {team.phone}<br/></span>:null}
					{team.phone2?<span><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {team.phone2}<br/></span>:null}
					{insuranceExpiry?<span><b>Insurance Expiry</b> {insuranceExpiry}</span>:null}
					<div style={{margin:"10px 0 10px 70px",borderBottom:"1px solid #ccc"}}>
					</div>

					{/*this should def be own component*/availableServices&&availableServices.length?

					availableServices.map(function(service,index){
						return <span key={service.name}>{index?' | ':''}{service.name}</span>
					})

					:null}
				</div>
			</div>

			<IpsoTabso tabs={[
				{
					hide: 		!team.canGetMessages(),
					tab: 		<span id="discussion-tab"><span style={{color:"black"}}>Updates</span></span>,
					content: 	<Inbox for={team} readOnly={true} truncate={true}/>
				},{
                	hide: 		!team.canAddDocument(),
                    tab: 		<span id="documents-tab"><span style={{color:"black"}}>Documents</span></span>,
                    content: 	<AutoForm item={team} form={["documents"]}/>
                },{
                	hide: 		!team.canAddMember(),
                    tab: 		<span id="personnel-tab"><span style={{color:"black"}}>Personnel</span></span>,
                    content: 	<ContactList group={team} team={team}/>
                },{
                	hide: 		!team.canSetServicesProvided(),
                    tab: 		<span id="services-tab"><span style={{color:"black"}}>Services</span></span>,
                    content: 	<ServicesProvidedEditor item={team} save={team.setServicesProvided.bind(team)}/>
            	}
            ]}/> 

		</div>
		)
	}
});