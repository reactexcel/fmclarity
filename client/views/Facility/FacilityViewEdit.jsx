import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
		var facility, schema, team, suppliers, tenants;
		facility = this.state.item?Facilities.findOne(this.state.item._id):null;
		schema = Facilities.schema();
		if(facility){
			team = facility.getTeam();
			suppliers = facility.getSuppliers();
			members = facility.getMembers();
			tenants = facility.getMembers({role:"tenant"});
			return {
				ready:true,
				facility:facility,
				tenants:tenants,
				team:team,
				schema:schema,
				members:members,
				suppliers:suppliers,
			}
		}
		return {
			ready:false
		}

    },

	getInitialState() {
		return {
			item:this.props.item
		}
	},    

	updateField(field,value) {
		this.props.item[field] = value;
		this.props.item.save();
	},

	addMember(ext,member) {
		this.data.facility.addMember(member,ext);
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
		var ready = this.data.ready;
		if(!ready) return (<div/>);

		var facility = this.data.facility;
		var members = this.data.members;
		var tenants = this.data.tenants;
		var suppliers = this.data.suppliers;
		var schema = this.data.schema;
		var team = this.data.team;

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
			    {/*
				<CollapseBox title="Property Details">
					<div className="row">
						<div className="col-sm-7">
							<AutoForm item={facility} schema={schema} form={["name","address","operatingTimes"]}/>
						</div>
			        	<div className="col-sm-5">
			        		<DocThumb.File item={facility.thumb} onChange={facility.setThumb.bind(facility)} />
			        	</div>
			        </div>
				</CollapseBox>
				<CollapseBox title="Building Documents" collapsed={true}>
					<AutoForm item={facility} schema={schema} form={["documents"]}/>
				</CollapseBox>
				<CollapseBox title="Facility personnel" collapsed={true}>
			   		<ContactList 
			   			items={members}
			   			facility={facility}
			   			onAdd={team&&team.canInviteMember()?this.addMember.bind(null,{role:"staff"}):null}
			   		/>
				</CollapseBox>
				<CollapseBox title="Facility suppliers" collapsed={true}>
			   		<ContactList 
			   			items={suppliers}
			   			facility={facility}
			   			type="team"
			   			onAdd={team&&team.canInviteSupplier()?this.addSupplier.bind(null,{role:"supplier"}):null}
			   		/>
				</CollapseBox>
				<CollapseBox title="Building areas" collapsed={true}>
					<FacilityAreas item={facility}/>
				</CollapseBox>
				<CollapseBox title="Default services & suppliers" collapsed={true}>
					<ServicesSelector item={facility} field={"servicesRequired"}/>
				</CollapseBox>
				*/}
                <Stepper tabs={[
                    {
                        tab:<span id="discussion-tab">Basic Details</span>,
                        content:
                            <div className="row">
								<div className="col-sm-7">
									<AutoForm item={facility} schema={schema} form={["name","address","operatingTimes"]}/>
								</div>
					        	<div className="col-sm-5">
					        		<DocThumb.File item={facility.thumb} onChange={this.setThumb} />
					        	</div>
			        		</div>,
			        	instructions:<div>
			        		Enter the basic facility info here including name, address, and image.
			        	</div>
                    },
                    {
                        tab:<span id="documents-tab">Documents</span>,
                        content:
                        	<AutoForm item={facility} schema={Facilities.schema()} form={["documents"]}/>,
			        	instructions:<div>
			        		Formal documentation related to the facility can be added here. This typically includes insurance and/or lease documents.
			        	</div>
                    },
                    {
                        tab:<span id="personnel-tab">Personnel</span>,
                        content:
                            <ContactList 
                                items={members}
                                facility={facility}
                                onAdd={team&&team.canInviteMember()?this.addMember.bind(null,{role:"staff"}):null}/>,
			        	instructions:<div>
			        		Enter the facility personnel here by clicking on add member.
			        	</div>
                    },
                    {
                        tab:<span id="tenants-tab">Tenants</span>,
                        content:
                            <ContactList 
                                items={tenants}
                                facility={facility}
                                onAdd={team&&team.canInviteMember()?this.addMember.bind(null,{role:"tenant"}):null}
                            />,
			        	instructions:<div>
			        		Enter tenants to the property by clicking on add member here.
			        	</div>
                    },
                    {
                        tab:<span id="suppliers-tab"><span>Suppliers</span></span>,
                        content:
                        	<ContactList 
                                items={suppliers}
                                facility={facility}
                                type="team"
                                onAdd={team&&team.canInviteSupplier()?this.addSupplier.bind(null,{role:"supplier"}):null}
                            />,
			        	instructions:<div>
			        		Add the suppliers employed by this facility here. If you want to configure this later simply press next.
			        	</div>
                    },
                    {
                        tab:
                            <span id="areas-tab"><span>Areas</span></span>,
                        content:
                            <div style={{maxHeight:"600px",overflowY:"auto"}}>
                                <FacilityAreasSelector item={facility}/>
                            </div>
                    },
                    {
                        tab:<span id="services-tab">Services</span>,
                        content:
                        	<ServicesSelector item={facility} field={"servicesRequired"}/>,
			        	instructions:<div>
			        		Enter the services required by this facility. If you want you can also match there services to a supplier. If you want to configure this later simply his finish.
			        	</div>
                    }
                ]} />				
			</div>
		)
	}
});
