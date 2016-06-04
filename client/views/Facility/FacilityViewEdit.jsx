import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FacilityViewEdit = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
    	Meteor.subscribe('users');
		var facility, schema, team, suppliers;
		facility = this.props.item;
		schema = Facilities.schema();
		if(facility){
			team = facility.getTeam();
			suppliers = facility.getSuppliers();
			members = facility.getMembers();
			return {
				ready:true,
				facility:facility,
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

	render() {
		var ready = this.data.ready;
		if(!ready) return (<div/>);

		var facility = this.data.facility;
		var members = this.data.members;
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
					        		<DocThumb.File item={facility.thumb} onChange={facility.setThumb.bind(facility)} />
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
                                onAdd={team&&team.canInviteMember()?this.addMember.bind(null,{role:"staff"}):null}
                            />,
			        	instructions:<div>
			        		Enter the facility personnel here by clicking on add member.
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
