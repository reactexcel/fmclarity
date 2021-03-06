import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {

    	Meteor.subscribe('users');

		var facility, team, suppliers;

		facility = this.state.item?Facilities.findOne(this.state.item._id):null;
		if(facility){
			team = facility.getTeam();
			suppliers = facility.getSuppliers();
		}

		return {
			facility:facility,
			team:team,
			suppliers:suppliers,
		}
    },

	getInitialState() {
		return {
			item:this.props.item
		}
	},    

	addSupplier(ext,supplier) {
		this.data.facility.addSupplier(supplier,ext);
	},

    setThumb(thumb) {
        var facility = this.data.facility;
        facility.setThumb(thumb);
        facility.thumb = thumb;
        this.setState({item:facility});
    },

	render() {
		var facility = this.data.facility;
		var team = this.data.team;
		var suppliers = this.data.suppliers;

		if(!facility&&facility.canCreate()) {
			//show facility creation information
		}
		else if(!facility.canSave()) {
			return (
				<FacilityViewDetail item={facility} />
			)			
		}
		return (
		    <div className="ibox-form user-profile-card" style={{backgroundColor:"#fff"}}>
			    <h2 style={{marginTop:"0px"}}>Edit facility</h2>
                {facility.owner?<div>
                    <b>Facility owner:</b>
                    <DocOwnerCard item={facility}/>
                </div>
                :
                null
                }
                <Stepper tabs={[
                	{
                    	tab: 		<span id="discussion-tab">Basic Details</span>,
                    	content: 	<div className="row">
										<div className="col-sm-7"><AutoForm item={facility} form={["name","address","operatingTimes"]}/></div>
					        			<div className="col-sm-5"><DocThumb.File item={facility.thumb} onChange={this.setThumb} /></div>
			        				</div>,
			        	guide: 		<div>Enter the basic facility info here including name, address, and image.</div>
                    },{
                        tab: 		<span id="areas-tab"><span>Areas</span></span>,
                        content: 	<FacilityAreasSelector item={facility}/>
                    },{
                        tab: 		<span id="services-tab">Services</span>,
                        content: 	<ServicesSelector item={facility} field={"servicesRequired"}/>,
			        	guide: 		<div>Enter the services required by this facility. If you want you can also match there services to a supplier. If you want to configure this later simply his finish.</div>
                    },{
                        tab: 		<span id="personnel-tab">Personnel</span>,
                        content: 	<ContactList group={facility} filter={{role:{$in:["staff","manager"]}}} defaultRole="staff" team={team}/>,
			        	guide: 		<div>Enter the facility personnel here by clicking on add member.</div>
                    },{
                        tab: 		<span id="tenants-tab">Tenants</span>,
                        content: 	<ContactList group={facility} filter={{role:"tenant"}} defaultRole="tenant" team={team}/>,
			        	guide: 		<div>Enter tenants to the property by clicking on add member here.</div>
                    },{
                        tab: 		<span id="documents-tab">Documents</span>,
                        content: 	<AutoForm item={facility} form={["documents"]}/>,
			        	guide: 		<div>Formal documentation related to the facility can be added here. This typically includes insurance and/or lease documents.</div>
                    },/*{
                        tab: 		<span id="suppliers-tab"><span>Suppliers</span></span>,
                        content: 	<ContactList members={suppliers} group={facility} type="team"/>,
			        	guide: 		<div>Add the suppliers employed by this facility here. If you want to configure this later simply press next.</div>
                    },*/
                ]}/>				
			</div>
		)
	}
});
