import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

TeamViewDetail = React.createClass({


    mixins: [ReactMeteorData],

    getMeteorData() {
    	var team, messages, members, suppliers, services, primaryContact, insuranceDocs;
        Meteor.subscribe('contractors');
        Meteor.subscribe('teamsAndFacilitiesForUser');
        team = this.props.item;
        if(team) {
            Meteor.subscribe("messages","Teams",team._id,moment().subtract({days:7}).toDate());
            members = team.getMembers();
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
            suppliers: suppliers,
            members: members,
            messages: messages,
            insuranceDocs:insuranceDocs
//            suppliers : Teams.find({type:"contractor"},{sort:{createdAt:-1}}).fetch()
        }
    },

    addMember(ext,member) {
        this.data.team.addMember(member,ext);
    },

	render() {
		var team = this.data.team;
	    if(!team) {
	    	return <div/>
	    }

	    // import fields
	    var messages = this.data.messages;
	    var members = this.data.members;
	    var suppliers = this.data.suppliers;
	    var primaryContact = this.data.primaryContact;
	    var insuranceDocs = this.data.insuranceDocs;
	    var availableServices = this.data.services;

	    // calculate contact name
	    var contactName;
	    if(primaryContact) {
	    	contactName = primaryContact.getName();
	    }

	    // calculate insurance expiry
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

					{availableServices?

					availableServices.map(function(service,index){
						return <span key={service.name}>{index?' | ':''}{service.name}</span>
					})

					:null}
				</div>
			</div>

			<IpsoTabso tabs={[
				{
					tab:<span id="discussion-tab"><span style={{color:"black"}}>Updates</span></span>,
					content:<div style={{maxHeight:"600px",overflowY:"auto"}}>
						<Inbox for={team} truncate={true}/>
					</div>
				},
                {
                    tab:<span id="documents-tab"><span style={{color:"black"}}>Documents</span></span>,
                    content:<div>
                        <AutoForm item={team} schema={Teams.schema()} form={["documents"]}/>
                    </div>
                },
                {
                    tab:<span id="personnel-tab"><span style={{color:"black"}}>Personnel</span></span>,
                    content:<div style={{maxHeight:"600px",overflowY:"auto"}}>
                        <ContactList 
                            items={members}
                            team={team}
                            onAdd={team&&team.canInviteMember()?this.addMember.bind(null,{role:"staff"}):null}
                        />
                    </div>
                },
                {
                    tab:<span id="services-tab"><span style={{color:"black"}}>Services</span></span>,
                    content:<div style={{maxHeight:"600px",overflowY:"auto"}}>
					   <ServicesSelector item={team} save={team.set.bind(team,"services")}/>
                    </div>
                }
			]}/> 

		</div>
		)
	}
});